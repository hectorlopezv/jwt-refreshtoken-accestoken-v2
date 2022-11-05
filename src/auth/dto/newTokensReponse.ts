import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class NewTokensReponse {
  @Field()
  accessToken: string;
  @Field()
  refreshToken: string;
}
