import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { getConnection, getRepository } from "typeorm";
const { GraphQLUpload } = require("graphql-upload");
import { createWriteStream } from "fs";

import { User } from "../entities/User";
import { Sub } from "../entities/Sub";
import { isAuth } from "../utils/isAuth";
import { Upload, MyContext } from "../types";
import { Post } from "../entities/Post";
import { user } from "../utils/user";

@InputType()
class SubInput {
  @Field()
  name: string;
  @Field()
  title: string;
  @Field({ nullable: true })
  description: string;
}

@Resolver()
export class SubPageResolver {
  @Mutation(() => Sub, { nullable: true })
  @UseMiddleware(isAuth)
  async createSub(
    @Arg("subInput") { name, title, description }: SubInput,
    @Ctx() { req }: MyContext
  ) {
    const user = await User.findOne(req.session.userId);

    const oldsub = await getRepository(Sub)
      .createQueryBuilder("sub")
      .where("lower(sub.name) = :name", { name: name.toLowerCase() })
      .getOne();

    if (oldsub) {
      throw new Error("That sub already exists");
    }
    const sub = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Sub)
      .values([{ name, description, title, user }])
      .returning("*")
      .execute();
    return sub.raw[0];
  }

  @Query(() => Sub)
  @UseMiddleware(user)
  async getSub(@Arg("name") name: string, @Ctx() { req }: MyContext) {
    let sub: Sub;
    try {
      sub = await Sub.findOneOrFail({ name });
      const posts = await Post.find({
        where: { subName: sub },
        order: { createdAt: "DESC" },
        relations: ["comments", "votes"],
      });

      sub.posts = posts;

      if (req.session.userId) {
        const user = await User.findOneOrFail(req.session.userId);
        sub.posts.forEach((p) => p.setUserVote(user));
      }
    } catch (error) {
      throw new Error("Sub not exists");
    }
    return sub;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async addProfilePicture(
    @Arg("picture", () => GraphQLUpload) { createReadStream, filename }: Upload
  ) {
    const writableStream = createWriteStream(
      `${__dirname}/../../images/${filename}`,
      { autoClose: true }
    );
    return new Promise((res, rej) => {
      createReadStream()
        .pipe(writableStream)
        .on("finish", () => res(true))
        .on("error", () => rej(false));
    });
  }

  @Query(() => [Sub])
  async topSubs() {
    const imageUrlExp = `COALESCE('http://localhost:3001/images/' || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y', s."imageUrn")`
    const subs = await getConnection()
      .createQueryBuilder()
      .select(`s.title, s.name, ${imageUrlExp} as "imageUrl", count(p.id) as "postCount"`)
      .from(Sub, 's')
      .leftJoin(Post, 'p', `s.name = p."subName"`)
      .groupBy('s.title, s.name, "imageUrl"')
      .orderBy('"postCount"', 'DESC')
      .limit(5)
      .execute()

      // console.log(subs)
      return subs
  }

  @Query(() => [Sub])
  async searchSubs(
    @Arg('name') name: string
  ) {
    try {
      if(name === '') {
        throw new Error('name must not be empty')
      }

      const subs = await getRepository(Sub)
        .createQueryBuilder()
        .where('LOWER(name) LIKE :name', { name: `%${name.toLowerCase().trim()}%` })
        .getMany()

      return subs
    } catch (error) {
      throw new Error('Something went wrong')
    }
  }
}

// const upload = multer({
//   storage: multer.diskStorage({
//     destination: 'public/images',
//     filename: (_, file, callback) => {
//       const name = makeId(15)
//       callback(null, name + path.extname(file.originalname)) // e.g. jh34gh2v4y + .png
//     },
//   }),
//   fileFilter: (_, file: any, callback: FileFilterCallback) => {
//     if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
//       callback(null, true)
//     } else {
//       callback(new Error('Not an image'))
//     }
//   },
// })

// const uploadSubImage = async (req: Request, res: Response) => {
// const sub: Sub = res.locals.sub
// try {
//   const type = req.body?.type
// console.log(req.file)

// if (type !== 'image' && type !== 'banner') {
//   fs.unlinkSync(req.file.path)
//   return res.status(400).json({ error: 'Invalid type' })
// }

// let oldImageUrn: string = ''
// if (type === 'image') {
//   oldImageUrn = sub.imageUrn ?? ''
//   sub.imageUrn = req.file.filename
// } else if (type === 'banner') {
//   oldImageUrn = sub.bannerUrn ?? ''
//   sub.bannerUrn = req.file.filename
// }
//     await sub.save()

//     if (oldImageUrn !== '') {
//       fs.unlinkSync(`public\\images\\${oldImageUrn}`)
//     }

//     return res.json(sub)
//   } catch (err) {
//     console.log(err)
//     return res.status(500).json({ error: 'Something went wrong' })
//   }
// }
