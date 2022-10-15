import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './enities/users.entity';
import { UsersService } from './users.service';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dto/create-account.dto';
import { LoginInput, LoginOutput } from './dto/login.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { AuthUser } from '../auth/auth-user.decorator';
import { UserProfileInput, UserProfileOutput } from './dto/user-profile.dto';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}
  // 3rd step where we check user
  @Query(() => User)
  @UseGuards(AuthGuard)
  me(@AuthUser() authUser: User) {
    return authUser;
  }

  @UseGuards(AuthGuard)
  @Query(() => UserProfileOutput)
  async userProfile(
    @Args() userProfileInput: UserProfileInput,
  ): Promise<UserProfileOutput> {
    try {
      const user = await this.userService.findById(userProfileInput.userId);
      if (!user) {
        return {
          ok: false,
          user: null,
          error: 'User not found',
        };
      }
      return {
        ok: true,
        user,
      };
    } catch (err) {
      return {
        error: err.message,
        ok: false,
      };
    }
  }

  @Mutation(() => CreateAccountOutput)
  async createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    try {
      // error optional
      const { ok, error } = await this.userService.createAccount(
        createAccountInput,
      );
      return { ok, error };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  @Mutation(() => LoginOutput)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    try {
      const { ok, error, token } = await this.userService.login(loginInput);
      return { ok, error, token };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}
