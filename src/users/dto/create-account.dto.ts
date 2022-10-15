import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { User } from '../enities/users.entity';
import { CoreOutput } from '../../common/dto/output.dto';

@InputType()
export class CreateAccountInput extends PickType(User, [
  'email',
  'password',
  'role',
]) {}

@ObjectType()
export class CreateAccountOutput extends CoreOutput {}
