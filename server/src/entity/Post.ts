import {
  Entity as TOEntity,
  Column,
  BeforeInsert,
  ManyToOne,
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm'
import { Field, ObjectType } from 'type-graphql'

import { User } from './User'
import { makeId, slugify } from '../utils/helper'
import { Sub } from './Sub'
import { Comment } from './Comment'
import { Vote } from './Vote'

@ObjectType()
@TOEntity('posts')
export class Post extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column()
  identifier: string // 7 Character Id

  @Field()
  @Column()
  title: string

  @Field()
  @Column({ nullable: true })
  slug: string

  @Field()
  @Column({ nullable: true, type: 'text' })
  body: string

  @Field()
  @Column()
  subName: string

  @Field()
  @Column()
  username: string

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User

  @ManyToOne(() => Sub, (sub) => sub.posts)
  @JoinColumn({ name: 'subName', referencedColumnName: 'name' })
  sub: Sub

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[]
  
  @OneToMany(() => Vote, (vote) => vote.post)
  votes: Vote[]

  @Field()
  get commentCount(): number {
    return this.comments?.length
  }
  
  @Field()
  get voteScore(): number {
    return this.votes?.reduce((prev, curr) => prev + (curr.value || 0), 0)
  }

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
    this.identifier = makeId(7)
    this.slug = slugify(this.title)
  }
}