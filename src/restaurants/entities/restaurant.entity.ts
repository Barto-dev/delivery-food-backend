import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

// cumulate our types
@ObjectType() // for nestjs/graphql
@Entity() // for typeorm(database)
export class Restaurant {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => String) // for nestjs/graphql
  @Column() // for typeorm(database)
  @IsString() // for validation
  @Length(5) // for validation
  name: string;

  @Field(() => Boolean, { defaultValue: true }) // for nestjs/graphql
  @Column({ default: true }) // for typeorm(database)
  @IsOptional() // for validation
  @IsBoolean() // for validation
  isVegan: boolean;

  @Field(() => String) // for nestjs/graphql
  @Column() // for typeorm(database)
  @IsString() // for validation
  address: string;

  @Field(() => String, { nullable: true }) // for nestjs/graphql
  @Column({ default: null }) // for typeorm(database)
  @IsOptional() // for validation
  @IsString() // for validation
  ownerName: string;

  @Field(() => String) // for nestjs/graphql
  @Column() // for typeorm(database)
  @IsString() // for validation
  categoryName: string;
}
