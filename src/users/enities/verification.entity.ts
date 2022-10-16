import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToOne, JoinColumn } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import { User } from './users.entity';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Verification extends CoreEntity {
  @Column()
  @Field(() => String)
  code: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
