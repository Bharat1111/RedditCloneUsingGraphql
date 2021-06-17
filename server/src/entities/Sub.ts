import {
    Column,
    ManyToOne,
    OneToMany,
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
  } from "typeorm";
  
  import { User } from "./User";
  import { Post } from "./Post";
  import { Field, ObjectType } from "type-graphql";
  
  @ObjectType()
  @Entity("subs")
  export class Sub extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;
  
    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;
  
    @Field()
    @Column({ unique: true })
    name: string;
    
    @Field()
    @Column()
    title: string;
  
    @Field()
    @Column({ type: "text", nullable: true })
    description: string;
  
    @Field()
    @Column({ nullable: true })
    imageUrn: string;
  
    @Field()
    @Column({ nullable: true })
    bannerUrn: string;

    @Field()
    @Column()
    username: string
  
    @ManyToOne(() => User)
    @JoinColumn({ name: 'username', referencedColumnName: 'username' })
    user: User;
  
    @OneToMany(() => Post, (post) => post.sub)
    posts: Post[];
  }