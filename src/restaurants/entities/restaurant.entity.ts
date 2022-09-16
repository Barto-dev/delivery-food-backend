import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// cumulate our types
@ObjectType() // for nestjs/graphql
@Entity() // for typeorm
export class Restaurant {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => String) // for nestjs/graphql
  @Column() // for typeorm
  name: string;

  @Field(() => Boolean) // for nestjs/graphql
  @Column() // for typeorm
  isVegan: boolean;

  @Field(() => String) // for nestjs/graphql
  @Column() // for typeorm
  address: string;

  @Field(() => String) // for nestjs/graphql
  @Column() // for typeorm
  ownerName: string;

  @Field(() => String) // for nestjs/graphql
  @Column() // for typeorm
  categoryName: string;
}
