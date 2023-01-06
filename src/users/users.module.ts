import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './enities/users.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { Verification } from './enities/verification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Verification])],
  // ConfigService and JwtService is global module
  // providers: [UsersResolver, UsersService, ConfigService, JwtService],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UserModule {}
