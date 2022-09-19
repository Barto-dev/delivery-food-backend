import { InputType, OmitType } from '@nestjs/graphql';
import { Restaurant } from '../entities/restaurant.entity';

@InputType()
export class CreateRestaurantDto extends OmitType(
  // omit type because when we create restaurant from schema we dont need set id, its do automatically
  Restaurant,
  ['id'],
  // parent class have different decorator ObjectType
  InputType,
) {}
