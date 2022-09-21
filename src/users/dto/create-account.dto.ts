import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { User } from '../enities/users.entity';
import { MutationOutput } from '../../common/dto/output.dto';

@InputType()
export class CreateAccountInput extends PickType(User, [
  'email',
  'password',
  'role',
]) {}

@ObjectType()
export class CreateAccountOutput extends MutationOutput {}
