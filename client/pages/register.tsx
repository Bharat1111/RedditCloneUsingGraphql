import Head from "next/head";
import Link from 'next/link'
import { useState } from "react";
import { useRegisterMutation } from "../src/generated/graphql";
import { useRouter } from "next/router";

export default function Register() {
  const [input, setInput] = useState({
    username: '',
    email: '',
    password: '',
  })
  const [agreement, setAgreement] = useState(false)
  const router = useRouter();

  const [register] = useRegisterMutation()

  const submit = async (e) => {
    e.preventDefault()

    const response = await register({
      variables: { UserInput: input }
    })

    if (response.data?.register.errors) {
      
    } else if (response.data?.register.user) {
      router.push("/");
    }
    console.log(response?.data?.register.errors)
  }

  return (
    <div className="flex">
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
                onChange={e => setAgreement(e.target.checked)}
              />
              <label htmlFor="agreement" className="text-xs cursor-pointer">
                I agree to get emails about cool stuff on Readit
              </label>
            </div>
            <div className="mb-2">
              <input
                type="email"
                className="transition duration-200 w-full p-3 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:bg-white hover:bg-white"
                placeholder="Email"
                onChange={e => setInput({...input, email: e.target.value})}
              />
            </div>
            <div className="mb-2">
              <input
                type="text"
                className="transition duration-200 w-full p-3 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:bg-white hover:bg-white"
                placeholder="Username"
                onChange={e => setInput({...input, username: e.target.value})}
              />
            </div>
            <div className="mb-2">
              <input
                type="password"
                className="transition duration-200 w-full p-3 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:bg-white hover:bg-white"
                placeholder="Password"
                onChange={e => setInput({...input, password: e.target.value})}
              />
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
