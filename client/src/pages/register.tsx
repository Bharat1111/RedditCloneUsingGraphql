import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import classNames from "classnames";
import { MeDocument, MeQuery, useRegisterMutation } from "../generated/graphql";

const Register = () => {
  const [register] = useRegisterMutation()
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [agreement, setAgreement] = useState(false);
  const router = useRouter();

  let error = {};
  const submit = async (e) => {
    e.preventDefault();

    const response = await register({
      variables: { RegisterInput: input },
      update: (cache, { data }) => {
        const {username, id, email, createdAt} = data?.register
        cache.writeQuery<MeQuery>({
          query: MeDocument,
          data: {
            __typename: "Query",
            me: {username, email, createdAt,id},
          },
        });
      },
    });

    if (response.data?.register.id) {
      router.push("/");
    }
  };

  return (
    <div className="flex bg-white">
      <Head>
        <title>Register</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        className="w-36 h-screen bg-center bg-cover"
        style={{ backgroundImage: "url('/images/bricks.jpg')" }}
      ></div>
      <div className="flex flex-col justify-center pl-6">
        <div className="w-70">
          <h1 className="mb-2 text-lg font-medium">Sign Up</h1>
          <p className="mb-10 text-xs">
            By continuing, you agree to our User Agreement and Privacy Policy
          </p>
          <form onSubmit={submit}>
            <div className="mb-6">
              <input
                type="checkbox"
                className="mr-1 cursor-pointer"
                id="agreement"
                checked={agreement}
                onChange={(e) => setAgreement(e.target.checked)}
              />
              <label htmlFor="agreement" className="text-xs cursor-pointer">
                I agree to get emails about cool stuff on Readit
              </label>
            </div>
            <div className="mb-2">
              <input
                type="text"
                className={classNames(
                  "transition duration-200 w-full p-3 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:bg-white hover:bg-white",
                  { "border-red-500": error[0]?.field }
                )}
                placeholder="Username"
                onChange={(e) =>
                  setInput({ ...input, username: e.target.value })
                }
              />
              <small className="font-medium text-red-600">
                {error[0]?.message}
              </small>
            </div>
            <div className="mb-2">
              <input
                type="email"
                className={classNames(
                  "transition duration-200 w-full p-3 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:bg-white hover:bg-white",
                  { "border-red-500": error[0]?.field }
                )}
                placeholder="Email"
                onChange={(e) => setInput({ ...input, email: e.target.value })}
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
              Sign Up
            </button>
          </form>
          <small>
            Already a readitor?
            <Link href="/login">
              <a className="ml-1 text-blue-500 uppercase">Log In</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}

export default Register