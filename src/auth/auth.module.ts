import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { AccesstokenStrategy } from './strategies/jwt.strategy';
import { RtStategy } from './strategies/refreshkToken.strategy';

@Module({
  imports: [JwtModule],
  providers: [
    AuthResolver,
    AuthService,
    PrismaService,
    AccesstokenStrategy,
    RtStategy,
  ],
})
export class AuthModule {}
