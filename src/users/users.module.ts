import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './enities/users.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  // ConfigService and JwtService is global module
  // providers: [UsersResolver, UsersService, ConfigService, JwtService],
  providers: [UsersResolver, UsersService],
})
export class UserModule {}
