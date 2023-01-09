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
import { EditProfileInput, EditProfileOutput } from './dto/edit-profile.dto';
import { VerifyEmailInput, VerifyEmailOutput } from './dto/verify-email.dto';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  // 3rd step where we check user
  @Query(() => User)
  @UseGuards(AuthGuard)
  me(@AuthUser() authUser: UserProfileOutput): User {
    if (authUser.user) {
      return authUser.user;
    }
  }

  @UseGuards(AuthGuard)
  @Query(() => UserProfileOutput)
  userProfile(
    @Args() userProfileInput: UserProfileInput,
  ): Promise<UserProfileOutput> {
    return this.userService.findById(userProfileInput.userId);
  }

  @Mutation(() => CreateAccountOutput)
  async createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    return this.userService.createAccount(createAccountInput);
  }

  @Mutation(() => LoginOutput)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.userService.login(loginInput);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => EditProfileOutput)
  editProfile(
    @AuthUser() authUser: User,
    @Args('input') editProfileInput: EditProfileInput,
  ): Promise<EditProfileOutput> {
    return this.userService.editProfile(authUser.id, editProfileInput);
  }

  @Mutation(() => VerifyEmailOutput)
  verifyEmail(
    @Args('input') verifyEmailInput: VerifyEmailInput,
  ): Promise<VerifyEmailOutput> {
    return this.userService.verifyEmail(verifyEmailInput.code);
  }
}
