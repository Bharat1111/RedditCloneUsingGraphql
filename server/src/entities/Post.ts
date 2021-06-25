import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { makeId, slugify } from "../utils/helper";
import { User } from "./User";
import { Sub } from "./Sub";
import { Comment } from "./Comment";
import { Vote } from "./Vote";

@ObjectType()
@Entity("posts")
export class Post extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field()
  @Column()
  identifier: string; // 7 Character Id

  @Field()
  @Column()
  title: string;

  @Field()
  @Column({ nullable: true })
  slug: string;

  @Field()
  @Column({ nullable: true, type: "text" })
  body: string;

  @Field()
  @Column()
  subName: string;

  @Field()
  @Column()
  username: string;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User;

  @Field({ nullable: true })
  voteStatus: number

  @ManyToOne(() => Sub, (sub) => sub.posts)
  @JoinColumn({ name: 'subName', referencedColumnName: 'name' })
  sub: Sub

  @Field(() => [Comment], { nullable: true })
  @OneToMany(() => Comment, (comment) => comment.post, { eager: true })
  comments: Comment[]
  
  @Field(() => [Vote], { nullable: true })
  @OneToMany(() => Vote, (vote) => vote.post, { eager: true })
  votes: Vote[]

  @Field({ defaultValue: 0 })
  get commentCount(): number {
    return this.comments?.length
  }
  
  @Field({ defaultValue: 0 })
  get voteScore(): number {
    return this.votes?.reduce((prev, curr) => prev + (curr.value || 0), 0)
  }

  @Field({ nullable: true })
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
    this.identifier = makeId(7);
    this.slug = slugify(this.title);
  }
}
