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
// import { Comment } from "./Comment";

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

  @Field()
  @Column()
  username: string;

  @Field()
  @Column()
  postId: string;

  @Field()
  @Column({ default: 0 })
  VoteStatus: number

  // @Field()
  // @Column({ nullable: true })
  // commentId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;
  
  @ManyToOne(() => Post, { nullable: true })
  @JoinColumn({ name: "postId", referencedColumnName: "id" })
  post: Post;
  
  // @ManyToOne(() => Comment, { nullable: true })
  // @JoinColumn({ name: "commentId", referencedColumnName: "id" })
  // comment: Comment;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
