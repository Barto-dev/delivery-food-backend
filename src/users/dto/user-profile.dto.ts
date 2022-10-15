import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { MutationOutput } from '../../common/dto/output.dto';
import { User } from '../enities/users.entity';

@ArgsType()
export class UserProfileInput {
  @Field(() => Number)
  userId: number;
}

@ObjectType()
export class UserProfileOutput extends MutationOutput {
  @Field(() => User, { nullable: true })
  user?: User;
}
