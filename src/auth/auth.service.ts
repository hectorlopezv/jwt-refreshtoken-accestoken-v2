import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInInput } from './dto/signin-input';
import { SignUpInput } from './dto/signup-input';
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async logout(userId: number) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRefreshToken: { not: null },
      },
      data: {
        hashedRefreshToken: null,
      },
    });

    return { loggedOut: true };
  }
  async signup(signupInput: SignUpInput) {
    const hashedPassword = await argon2.hash(signupInput.password);
    const user = await this.prisma.user.create({
      data: {
        email: signupInput.email,
        username: signupInput.username,
        hashedPassword,
      },
    });
    const { accessToken, refreshToken } = await this.createToken(
      user.id,
      user.email,
    );
    await this.updateRefreshToken(user.id, refreshToken);
    return { accessToken, refreshToken, user };
  }

  async createToken(userId: number, email: string) {
    const accessToken = this.jwtService.sign(
      {
        userId,
        email,
      },
      {
        expiresIn: '10s',
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      },
    );
    const refreshToken = this.jwtService.sign(
      {
        userId,
        email,
        accessToken,
      },
      {
        expiresIn: '7d',
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      },
    );

    return { accessToken, refreshToken };
  }
  async signin(signinInput: SignInInput) {
    const user = await this.prisma.user.findUnique({
      where: { email: signinInput.email },
    });

    if (!user) {
      throw new ForbiddenException('Access Denied');
    }
    const isPasswordValid = await argon2.verify(
      await user.hashedPassword,
      signinInput.password,
    );
    if (!isPasswordValid) {
      throw new ForbiddenException('Access Denied');
    }
    const { accessToken, refreshToken } = await this.createToken(
      user.id,
      user.email,
    );
    await this.updateRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken, user };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: hashedRefreshToken },
    });
  }
}
