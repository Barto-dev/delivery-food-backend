import { Query, Resolver } from '@nestjs/graphql';
import { User } from './enities/users.entity';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Query(() => Boolean)
  hi(): boolean {
    return true;
  }
}
