import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import classNames from "classnames";

const Login: React.FC<{}> = ({}) => {
  const [input, setInput] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const router = useRouter();

  let error = {};
  const submit = async (e) => {
    e.preventDefault();

    // const response = await login({
    //   variables: {
    //     usernameOrEmail: input.usernameOrEmail,
    //     password: input.password,
    //   },
      // update: (cache, { data }) => {
      //   cache.writeQuery<MeQuery>({
      //     query: MeDocument,
      //     data: {
      //       __typename: "Query",
      //       me: data?.login.user,
      //     },
      //   });
      // },
    // });

    // if (response.data?.login.errors) {
    //   return;
    // } else if (response.data?.login.user) {
    //   // console.log('login', response.data)
    //   router.push("/");
    // }
  };

  return (
    <div className="flex bg-white">
      <Head>
        <title>Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        className="w-36 h-screen bg-center bg-cover"
        style={{ backgroundImage: "url('/images/bricks.jpg')" }}
      ></div>
      <div className="flex flex-col justify-center pl-6">
        <div className="w-70">
          <h1 className="mb-2 text-lg font-medium">LogIn</h1>
          <form onSubmit={submit}>
            <div className="mb-2">
              <input
                type="text"
                className={classNames(
                  "transition duration-200 w-full p-3 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:bg-white hover:bg-white",
                  { "border-red-500": error[0]?.field }
                )}
                placeholder="Username Or Email"
                onChange={(e) =>
                  setInput({ ...input, usernameOrEmail: e.target.value })
                }
              />
              <small className="font-medium text-red-600">
                {error[0]?.message}
              </small>
            </div>
            <div className="mb-2">
              <input
                type="password"
                className={classNames(
                  "transition duration-200 w-full p-3 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:bg-white hover:bg-white",
                  { "border-red-500": error[0]?.field }
                )}
                placeholder="Password"
                onChange={(e) =>
                  setInput({ ...input, password: e.target.value })
                }
              />
              <small className="font-medium text-red-600">
                {error[0]?.message}
              </small>
            </div>
            <button className="w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border border-blue-400 rounded hover:bg-blue-400">
              LogIn
            </button>
          </form>
          <small>
            Don't have an account?
            <Link href="/register">
              <a className="ml-1 text-blue-500 uppercase">Sign Up</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login
