import { InjectRepository } from '@nestjs/typeorm';
import { User } from './enities/users.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dto/create-account.dto';
import { LoginInput, LoginOutput } from './dto/login.dto';
import { JwtService } from '../jwt/jwt.service';
import { EditProfileInput, EditProfileOutput } from './dto/edit-profile.dto';
import { Verification } from './enities/verification.entity';
import { VerifyEmailOutput } from './dto/verify-email.dto';
import { UserProfileOutput } from './dto/user-profile.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification)
    private readonly verifications: Repository<Verification>,
    // JwtService is a global module
    private readonly jwtService: JwtService,
    // MailService is a global module
    private readonly mailService: MailService,
  ) {}

  async createAccount(
    createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    const { email, password, role } = createAccountInput;
    // check new user exist
    try {
      const userExist = await this.users.findOneBy({ email });
      if (userExist) {
        return {
          ok: false,
          error: 'There is a user with that email already',
        };
      }
      const newUser = await this.users.create({ email, password, role });
      await this.users.save(newUser);
      const verification = await this.verifications.save(
        this.verifications.create({ user: newUser }),
      );
      this.mailService.sendVerificationEmail(newUser.email, verification.code);
      return { ok: true };
    } catch (e) {
      return {
        ok: false,
        error: "Couldn't create account",
      };
    }
  }

  async login(loginInput: LoginInput): Promise<LoginOutput> {
    const { email, password } = loginInput;
    // find the user with email
    try {
      const user = await this.users.findOne({
        where: { email },
        select: ['password', 'id'],
      });
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
      // make a JWT and give it to the user
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
  }

  async findById(id: number): Promise<UserProfileOutput> {
    try {
      const user = await this.users.findOneBy({ id });
      if (user) {
        return { ok: true, user };
      }
      return { ok: false, error: 'User not found' };
    } catch (e) {
      return { ok: false, error: 'User not found' };
    }
  }

  async editProfile(
    userId: number,
    { email, password }: EditProfileInput,
  ): Promise<EditProfileOutput> {
    try {
      const user = await this.users.findOneBy({ id: userId });
      if (email) {
        user.email = email;
        user.verified = false;
        const verification = await this.verifications.save(
          this.verifications.create({ user }),
        );
        this.mailService.sendVerificationEmail(user.email, verification.code);
      }
      if (password) {
        user.password = password;
      }
      // we use save instead update just to use hook @BeforeUpdate() when user edit their profile
      await this.users.save(user);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: 'Could not update profile' };
    }
  }

  async verifyEmail(code: string): Promise<VerifyEmailOutput> {
    try {
      const verification = await this.verifications.findOne({
        where: { code },
        relations: ['user'],
      });
      if (verification) {
        verification.user.verified = true;
        await this.users.save(verification.user);
        await this.verifications.delete(verification.id);
        return { ok: true };
      }
      return { ok: false, error: 'Verification not found' };
    } catch (error) {
      return { ok: false, error };
    }
  }
}
