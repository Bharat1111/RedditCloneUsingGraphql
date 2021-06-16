import { ObjectType, Field } from "type-graphql";
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  Entity,
  Column,
  JoinColumn,
  ManyToOne,
  BeforeInsert,
  OneToMany,
} from "typeorm";

import { Post } from "./Post";
import { User } from "./User";
import { makeId } from "../utils/helper";
import { Vote } from "./Vote";

@ObjectType()
@Entity("comments")
export class Comment extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  identifier: string

  @Field()
  @Column()
  body: string;

  @Field()
  @Column()
  username: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @ManyToOne(() => Post, (post) => post.comments, { nullable: false })
  post: Post

  @OneToMany(() => Vote, (vote) => vote.comment)
  votes: Vote[]

  protected userVote: number
  setUserVote(user: User) {
    const index = this.votes?.findIndex(v => v.username === user.username)
    this.userVote = index > -1 ? this.votes[index].value : 0
  }

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  makeIdAndSlug() {
    this.identifier = makeId(8)
  }
}
