import { CoreOutput } from '../../common/dto/output.dto';
import { InputType, ObjectType, PartialType, PickType } from '@nestjs/graphql';
import { User } from '../enities/users.entity';

@InputType()
export class EditProfileInput extends PartialType(
  PickType(User, ['email', 'password']),
) {}

@ObjectType()
export class EditProfileOutput extends CoreOutput {}
