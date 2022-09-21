import { InjectRepository } from '@nestjs/typeorm';
import { User } from './enities/users.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateAccountInput } from './dto/create-account.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
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
}
