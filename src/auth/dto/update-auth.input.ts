import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { SignUpInput } from './signup-input';

@InputType()
export class UpdateAuthInput extends PartialType(SignUpInput) {
  @Field(() => Int)
  id: number;
}
