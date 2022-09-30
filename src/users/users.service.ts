import { InjectRepository } from '@nestjs/typeorm';
import { User } from './enities/users.entity';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { CreateAccountInput } from './dto/create-account.dto';
import { LoginInput } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly config: ConfigService,
  ) {}

  async createAccount(
    createAccountInput: CreateAccountInput,
  ): Promise<{ ok: boolean; error?: string }> {
    const { email, password, role } = createAccountInput;
    // check new user exist
    try {
      const userExist = await this.users.findOneBy({ email });
      if (userExist) {
        // make error
        return {
          ok: false,
          error: 'There is a user with that email already',
        };
      }
      const newUser = await this.users.create({ email, password, role });
      await this.users.save(newUser);
      return {
        ok: true,
      };
    } catch (e) {
      // make error
      return {
        ok: false,
        error: "Couldn't create account",
      };
    }
    // create user & hash the password
  }

  async login(
    loginInput: LoginInput,
  ): Promise<{ ok: boolean; error?: string; token?: string }> {
    const { email, password } = loginInput;
    // find the user with email
    try {
      const user = await this.users.findOneBy({ email });
      if (!user) {
        return {
          ok: false,
          error: 'User not found',
        };
      }
      // check if the password is correct
      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return {
          ok: false,
          error: 'Wrong password',
        };
      }
      // added secret key to avoid token forger
      const token = jwt.sign({ id: user.id }, this.config.get('TOKEN_SECRET'));
      return {
        ok: true,
        token,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
    // make a JWT and give it to the user
  }
}
