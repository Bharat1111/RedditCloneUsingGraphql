import { ObjectType, Field } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Comment } from "./Comment";

import { Post } from "./Post";
import { User } from "./User";

@ObjectType()
@Entity("votes")
export class Vote extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  value: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @Field()
  @Column()
  username: string;

  @ManyToOne(() => Post, {nullable: true})
  post: Post;

  @ManyToOne(() => Comment, {nullable: true})
  comment: Comment;
  
  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
