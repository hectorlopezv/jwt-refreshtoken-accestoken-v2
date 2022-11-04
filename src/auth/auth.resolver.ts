import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
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

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }
}
