import { InjectRepository } from '@nestjs/typeorm';
import { User } from './enities/users.entity';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { CreateAccountInput } from './dto/create-account.dto';
import { LoginInput } from './dto/login.dto';
import { JwtService } from '../jwt/jwt.service';
import { EditProfileInput } from './dto/edit-profile.dto';
import { Verification } from './enities/verification.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification)
    private readonly verifications: Repository<Verification>,
    // JwtService is a global module
    private readonly jwtService: JwtService,
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
      await this.verifications.save(
        this.verifications.create({ user: newUser }),
      );
      return { ok: true };
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
      const token = this.jwtService.sign({ id: user.id });
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

  async findById(id: number): Promise<User> {
    return this.users.findOneBy({ id });
  }

  async editProfile(
    userId: number,
    { email, password }: EditProfileInput,
  ): Promise<User> {
    const user = await this.users.findOneBy({ id: userId });
    if (email) {
      user.email = email;
      user.verified = false;
      await this.verifications.save(this.verifications.create({ user }));
    }
    if (password) {
      user.password = password;
    }
    // we use save instead update just to use hook @BeforeUpdate() when user edit their profile
    return this.users.save(user);
  }

  async verifyEmail(code: string): Promise<boolean> {
    const verification = await this.verifications.findOne({
      where: { code },
      relations: ['user'],
    });
    if (verification) {
      verification.user.verified = true;
      await this.users.save(verification.user);
    }
    return false;
  }
}
