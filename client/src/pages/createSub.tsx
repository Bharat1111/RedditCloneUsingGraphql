import React, { useState } from "react";
import Head from "next/head";
import classNames from "classnames";
import { useCreateSubMutation } from "../generated/graphql";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";

const CreateSub = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [createSub, { error }] = useCreateSubMutation();

  return (
    <div className="flex bg-white">
      <Head>
        <title>Create a Community</title>
      </Head>
      <div
        className="h-screen bg-center bg-cover w-36"
        style={{ backgroundImage: "url('/images/bricks.jpg')" }}
      ></div>
      <div className="mt-12 flex flex-cols justify-center pl-6">
        <div className="w-98">
          <h1 className="mb-2 text-lg font-medium">Create a Community</h1>
          {error && <small className="text-red-500">{error?.message}</small>}
          <hr />
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                const { errors } = await createSub({
                  variables: {
                    subInput: {
                      name,
                      title,
                      description,
                    },
                  },
                });
                if (!errors) router.push(`/r/${name}`);
              } catch{}
            }}
          >
            <div className="my-6">
              <p className="font-medium">Name</p>
              <p className="mb-2 text-xs text-gray-500">
                Community names including capitalization cannot be changed.
              </p>
              <input
                type="text"
                className={classNames(
                  "w-full p-3 border border-gray-200 rounded hover:border-gray-500"
                )}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="my-6">
              <p className="font-medium">Title</p>
              <p className="mb-2 text-xs text-gray-500">
                Community title represent the topic an you change it at any
                time.
              </p>
              <input
                type="text"
                className={classNames(
                  "w-full p-3 border border-gray-200 rounded hover:border-gray-500"
                )}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="my-6">
              <p className="font-medium">Description</p>
              <p className="mb-2 text-xs text-gray-500">
                This is how new members come to understand your community.
              </p>
              <textarea
                className={classNames(
                  "w-full p-3 border border-gray-200 rounded hover:border-gray-500"
                )}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <button className="px-4 py-1 text-sm font-semibold capitalize blue button">
                Create Community
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateSub;
