import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { CurrentUserId } from './decorators/current-user-id';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { LogoutResponse } from './dto/logout-response';
import { NewTokensReponse } from './dto/newTokensReponse';
import { SignResponse } from './dto/sign-response';
import { SignInInput } from './dto/signin-input';
import { SignUpInput } from './dto/signup-input';
import { Auth } from './entities/auth.entity';
import { RefreshTokenGuard } from './guards/refreshToken.guard';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Mutation(() => SignResponse)
  signup(@Args('signupInput') signupInput: SignUpInput) {
    return this.authService.signup(signupInput);
  }

  @Public()
  @Mutation(() => SignResponse)
  signin(@Args('signinInput') signinInput: SignInInput) {
    return this.authService.signin(signinInput);
  }

  @Public()
  @Mutation(() => LogoutResponse)
  logout(@Args('id') id: number) {
    return this.authService.logout(id);
  }

  @Query(() => String)
  @Public()
  sayHello(): string {
    return 'Hello World!';
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Mutation(() => NewTokensReponse)
  getNewToken(
    @CurrentUserId() userId: number,
    @CurrentUser('refreshToken') refreshToken: string,
  ) {
    console.log('userid, refresh', userId, refreshToken);
    return this.authService.getNewTokens(userId, refreshToken);
  }
}
