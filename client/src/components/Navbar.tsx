import { useApolloClient } from "@apollo/client";
import Link from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";

const Navbar = () => {
  const { data, loading } = useMeQuery();
  const [logout] = useLogoutMutation();
  const apolloClient = useApolloClient();

  let body = null;
  if (loading) {
    body = null;
  } else if (!data?.me) {
    body = (
      <div className="flex">
        <Link href="/login">
          <a className="leading-5 w-32 py-1 mr-4 button hollow blue">log in</a>
        </Link>
        <Link href="/register">
          <a className="leading-5 w-32 py-1 button  blue">sign up</a>
        </Link>
      </div>
    );
  } else {
    body = (
      <div className="flex">
        <Link href="/">
          <a className="leading-5 w-32 py-1 mr-4 button hollow blue">
            {data.me.username}
          </a>
        </Link>
        <Link href="/">
          <a
            className="leading-5 w-32 py-1 button  blue"
            onClick={async () => {
              await logout();
              await apolloClient.resetStore();
            }}
          >
            logout
          </a>
        </Link>
      </div>
    );
  }
  return (
    <div className="bg-white fixed inset-x-0 top-0 z-10 flex px-5 items-center justify-center h-12">
      {/* title */}
      {/* <Image src='http://svgshare.com/i/2SL.svg' width='100' height='100' /> */}
      <div className="flex items-center">
        <Link href="/">
          <p>reddit</p>
        </Link>
      </div>
      {/* Search */}
      <div className="flex bg-gray-100 items-center mx-auto border rounded hover:border-blue-500 hover:bg-white">
        <i className="fas fa-search pl-4 pr-3 text-gray-500"></i>
        <input
          type="text"
          className="w-160 py-1 pr-3 rounded focus:outline-none"
          placeholder="Search"
        />
      </div>
      {/* Auth */}
      {body}
    </div>
  );
};

export default Navbar;
