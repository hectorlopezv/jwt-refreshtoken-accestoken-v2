import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LogoutResponse } from './dto/logout-response';
import { SignResponse } from './dto/sign-response';
import { SignInInput } from './dto/signin-input';
import { SignUpInput } from './dto/signup-input';
import { Auth } from './entities/auth.entity';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => SignResponse)
  signup(@Args('signupInput') signupInput: SignUpInput) {
    return this.authService.signup(signupInput);
  }

  @Mutation(() => SignResponse)
  signin(@Args('signinInput') signinInput: SignInInput) {
    return this.authService.signin(signinInput);
  }

  @Mutation(() => LogoutResponse)
  logout(@Args('id') id: number) {
    return this.authService.logout(id);
  }

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }
}
