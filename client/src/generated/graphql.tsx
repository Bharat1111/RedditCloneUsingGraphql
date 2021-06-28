import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type Comment = {
  __typename?: 'Comment';
  id: Scalars['String'];
  identifier: Scalars['String'];
  body: Scalars['String'];
  username: Scalars['String'];
  postId: Scalars['String'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type CountsResponse = {
  __typename?: 'CountsResponse';
  comments: Scalars['Float'];
  voteScore: Scalars['Float'];
};

export type Mutation = {
  __typename?: 'Mutation';
  register?: Maybe<User>;
  login?: Maybe<User>;
  logout: Scalars['Boolean'];
  createPost: Post;
  createComment?: Maybe<Comment>;
  createSub?: Maybe<Scalars['Boolean']>;
  addProfilePicture: Scalars['Boolean'];
  vote: Scalars['Boolean'];
};


export type MutationRegisterArgs = {
  RegisterInput: RegisterInput;
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  usernameOrEmail: Scalars['String'];
};


export type MutationCreatePostArgs = {
  sub: Scalars['String'];
  body: Scalars['String'];
  title: Scalars['String'];
};


export type MutationCreateCommentArgs = {
  slug: Scalars['String'];
  identifier: Scalars['String'];
  body: Scalars['String'];
};


export type MutationCreateSubArgs = {
  subInput: SubInput;
};


export type MutationAddProfilePictureArgs = {
  picture: Scalars['Upload'];
};


export type MutationVoteArgs = {
  voteInput: VoteInput;
};

export type Post = {
  __typename?: 'Post';
  id: Scalars['String'];
  identifier: Scalars['String'];
  title: Scalars['String'];
  slug: Scalars['String'];
  body: Scalars['String'];
  subName: Scalars['String'];
  username: Scalars['String'];
  comments?: Maybe<Array<Comment>>;
  votes?: Maybe<Array<Vote>>;
  commentCount?: Maybe<Scalars['Float']>;
  voteScore?: Maybe<Scalars['Float']>;
  userVote?: Maybe<Scalars['Float']>;
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  me?: Maybe<User>;
  getUsetPosts: UserResponse;
  getPosts: Array<Post>;
  getPost?: Maybe<Post>;
  getCounts: CountsResponse;
  getSub: Sub;
  topSubs: Array<Sub>;
  searchSubs: Array<Sub>;
};


export type QueryGetUsetPostsArgs = {
  username: Scalars['String'];
};


export type QueryGetPostArgs = {
  slug: Scalars['String'];
  identifier: Scalars['String'];
};


export type QueryGetCountsArgs = {
  slug: Scalars['String'];
  identifier: Scalars['String'];
};


export type QueryGetSubArgs = {
  name: Scalars['String'];
};


export type QuerySearchSubsArgs = {
  name: Scalars['String'];
};

export type RegisterInput = {
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Sub = {
  __typename?: 'Sub';
  id: Scalars['String'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  name: Scalars['String'];
  title: Scalars['String'];
  description: Scalars['String'];
  imageUrn?: Maybe<Scalars['String']>;
  bannerUrn?: Maybe<Scalars['String']>;
  username: Scalars['String'];
  posts: Array<Post>;
};

export type SubInput = {
  name: Scalars['String'];
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
};


export type User = {
  __typename?: 'User';
  id: Scalars['String'];
  username: Scalars['String'];
  email: Scalars['String'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  user: User;
  posts: Array<Post>;
  comments: Array<Comment>;
};

export type Vote = {
  __typename?: 'Vote';
  id: Scalars['Float'];
  value: Scalars['Float'];
  username: Scalars['String'];
  postId: Scalars['String'];
  VoteStatus: Scalars['Float'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type VoteInput = {
  identifier: Scalars['String'];
  slug: Scalars['String'];
  value: Scalars['Float'];
};

export type CreateCommentMutationVariables = Exact<{
  slug: Scalars['String'];
  identifier: Scalars['String'];
  body: Scalars['String'];
}>;


export type CreateCommentMutation = (
  { __typename?: 'Mutation' }
  & { createComment?: Maybe<(
    { __typename: 'Comment' }
    & Pick<Comment, 'id' | 'body' | 'username' | 'postId' | 'createdAt' | 'identifier'>
  )> }
);

export type CreatePostMutationVariables = Exact<{
  sub: Scalars['String'];
  title: Scalars['String'];
  body: Scalars['String'];
}>;


export type CreatePostMutation = (
  { __typename?: 'Mutation' }
  & { createPost: (
    { __typename?: 'Post' }
    & Pick<Post, 'id' | 'identifier' | 'slug' | 'subName' | 'username' | 'commentCount' | 'voteScore' | 'createdAt'>
  ) }
);

export type CreateSubMutationVariables = Exact<{
  subInput: SubInput;
}>;


export type CreateSubMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'createSub'>
);

export type LoginMutationVariables = Exact<{
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username' | 'createdAt' | 'email'>
  )> }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type RegisterMutationVariables = Exact<{
  RegisterInput: RegisterInput;
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'username' | 'id' | 'email' | 'createdAt'>
  )> }
);

export type VoteMutationVariables = Exact<{
  identifier: Scalars['String'];
  slug: Scalars['String'];
  value: Scalars['Float'];
}>;


export type VoteMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'vote'>
);

export type GetUserPostQueryVariables = Exact<{
  username: Scalars['String'];
}>;


export type GetUserPostQuery = (
  { __typename?: 'Query' }
  & { getUsetPosts: (
    { __typename?: 'UserResponse' }
    & { user: (
      { __typename?: 'User' }
      & Pick<User, 'username' | 'createdAt'>
    ), posts: Array<(
      { __typename?: 'Post' }
      & Pick<Post, 'id' | 'identifier' | 'body' | 'slug' | 'subName' | 'username' | 'userVote' | 'commentCount' | 'voteScore' | 'title' | 'createdAt'>
    )>, comments: Array<(
      { __typename?: 'Comment' }
      & Pick<Comment, 'id' | 'body' | 'username' | 'postId' | 'identifier' | 'createdAt'>
    )> }
  ) }
);

export type GetSubQueryVariables = Exact<{
  name: Scalars['String'];
}>;


export type GetSubQuery = (
  { __typename?: 'Query' }
  & { getSub: (
    { __typename?: 'Sub' }
    & Pick<Sub, 'id' | 'createdAt' | 'name' | 'title' | 'username' | 'description' | 'bannerUrn' | 'imageUrn'>
    & { posts: Array<(
      { __typename?: 'Post' }
      & Pick<Post, 'id' | 'identifier' | 'title' | 'slug' | 'body' | 'username' | 'commentCount' | 'voteScore' | 'userVote' | 'createdAt' | 'subName'>
      & { votes?: Maybe<Array<(
        { __typename?: 'Vote' }
        & Pick<Vote, 'id' | 'value' | 'username' | 'postId' | 'VoteStatus' | 'createdAt'>
      )>>, comments?: Maybe<Array<(
        { __typename?: 'Comment' }
        & Pick<Comment, 'body' | 'id' | 'identifier' | 'username' | 'postId' | 'createdAt'>
      )>> }
    )> }
  ) }
);

export type PostQueryVariables = Exact<{
  identifier: Scalars['String'];
  slug: Scalars['String'];
}>;


export type PostQuery = (
  { __typename?: 'Query' }
  & { getPost?: Maybe<(
    { __typename?: 'Post' }
    & Pick<Post, 'id' | 'createdAt' | 'username' | 'title' | 'slug' | 'identifier' | 'body' | 'subName' | 'commentCount' | 'voteScore' | 'userVote'>
    & { votes?: Maybe<Array<(
      { __typename?: 'Vote' }
      & Pick<Vote, 'id' | 'value' | 'username' | 'postId' | 'VoteStatus'>
    )>>, comments?: Maybe<Array<(
      { __typename?: 'Comment' }
      & Pick<Comment, 'id' | 'body' | 'username' | 'identifier' | 'postId' | 'createdAt'>
    )>> }
  )> }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username' | 'email' | 'createdAt'>
  )> }
);

export type PostsQueryVariables = Exact<{ [key: string]: never; }>;


export type PostsQuery = (
  { __typename?: 'Query' }
  & { getPosts: Array<(
    { __typename?: 'Post' }
    & Pick<Post, 'id' | 'identifier' | 'slug' | 'username' | 'commentCount' | 'voteScore' | 'title' | 'body' | 'createdAt' | 'subName' | 'userVote'>
    & { comments?: Maybe<Array<(
      { __typename?: 'Comment' }
      & Pick<Comment, 'id' | 'body' | 'username' | 'postId' | 'createdAt'>
    )>>, votes?: Maybe<Array<(
      { __typename?: 'Vote' }
      & Pick<Vote, 'id' | 'username' | 'postId' | 'value' | 'VoteStatus'>
    )>> }
  )> }
);

export type SearchSubsQueryVariables = Exact<{
  name: Scalars['String'];
}>;


export type SearchSubsQuery = (
  { __typename?: 'Query' }
  & { searchSubs: Array<(
    { __typename?: 'Sub' }
    & Pick<Sub, 'name' | 'username' | 'title' | 'createdAt'>
  )> }
);

export type TopSubsQueryVariables = Exact<{ [key: string]: never; }>;


export type TopSubsQuery = (
  { __typename?: 'Query' }
  & { topSubs: Array<(
    { __typename?: 'Sub' }
    & Pick<Sub, 'name' | 'title' | 'imageUrn'>
  )> }
);


export const CreateCommentDocument = gql`
    mutation CreateComment($slug: String!, $identifier: String!, $body: String!) {
  createComment(slug: $slug, identifier: $identifier, body: $body) {
    id
    __typename
    body
    username
    postId
    createdAt
    identifier
  }
}
    `;
export type CreateCommentMutationFn = Apollo.MutationFunction<CreateCommentMutation, CreateCommentMutationVariables>;

/**
 * __useCreateCommentMutation__
 *
 * To run a mutation, you first call `useCreateCommentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCommentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCommentMutation, { data, loading, error }] = useCreateCommentMutation({
 *   variables: {
 *      slug: // value for 'slug'
 *      identifier: // value for 'identifier'
 *      body: // value for 'body'
 *   },
 * });
 */
export function useCreateCommentMutation(baseOptions?: Apollo.MutationHookOptions<CreateCommentMutation, CreateCommentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCommentMutation, CreateCommentMutationVariables>(CreateCommentDocument, options);
      }
export type CreateCommentMutationHookResult = ReturnType<typeof useCreateCommentMutation>;
export type CreateCommentMutationResult = Apollo.MutationResult<CreateCommentMutation>;
export type CreateCommentMutationOptions = Apollo.BaseMutationOptions<CreateCommentMutation, CreateCommentMutationVariables>;
export const CreatePostDocument = gql`
    mutation CreatePost($sub: String!, $title: String!, $body: String!) {
  createPost(sub: $sub, title: $title, body: $body) {
    id
    identifier
    slug
    subName
    username
    commentCount
    voteScore
    createdAt
  }
}
    `;
export type CreatePostMutationFn = Apollo.MutationFunction<CreatePostMutation, CreatePostMutationVariables>;

/**
 * __useCreatePostMutation__
 *
 * To run a mutation, you first call `useCreatePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPostMutation, { data, loading, error }] = useCreatePostMutation({
 *   variables: {
 *      sub: // value for 'sub'
 *      title: // value for 'title'
 *      body: // value for 'body'
 *   },
 * });
 */
export function useCreatePostMutation(baseOptions?: Apollo.MutationHookOptions<CreatePostMutation, CreatePostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument, options);
      }
export type CreatePostMutationHookResult = ReturnType<typeof useCreatePostMutation>;
export type CreatePostMutationResult = Apollo.MutationResult<CreatePostMutation>;
export type CreatePostMutationOptions = Apollo.BaseMutationOptions<CreatePostMutation, CreatePostMutationVariables>;
export const CreateSubDocument = gql`
    mutation CreateSub($subInput: SubInput!) {
  createSub(subInput: $subInput)
}
    `;
export type CreateSubMutationFn = Apollo.MutationFunction<CreateSubMutation, CreateSubMutationVariables>;

/**
 * __useCreateSubMutation__
 *
 * To run a mutation, you first call `useCreateSubMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSubMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSubMutation, { data, loading, error }] = useCreateSubMutation({
 *   variables: {
 *      subInput: // value for 'subInput'
 *   },
 * });
 */
export function useCreateSubMutation(baseOptions?: Apollo.MutationHookOptions<CreateSubMutation, CreateSubMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSubMutation, CreateSubMutationVariables>(CreateSubDocument, options);
      }
export type CreateSubMutationHookResult = ReturnType<typeof useCreateSubMutation>;
export type CreateSubMutationResult = Apollo.MutationResult<CreateSubMutation>;
export type CreateSubMutationOptions = Apollo.BaseMutationOptions<CreateSubMutation, CreateSubMutationVariables>;
export const LoginDocument = gql`
    mutation Login($usernameOrEmail: String!, $password: String!) {
  login(usernameOrEmail: $usernameOrEmail, password: $password) {
    id
    username
    createdAt
    email
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      usernameOrEmail: // value for 'usernameOrEmail'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($RegisterInput: RegisterInput!) {
  register(RegisterInput: $RegisterInput) {
    username
    id
    email
    createdAt
  }
}
    `;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      RegisterInput: // value for 'RegisterInput'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const VoteDocument = gql`
    mutation Vote($identifier: String!, $slug: String!, $value: Float!) {
  vote(voteInput: {identifier: $identifier, slug: $slug, value: $value})
}
    `;
export type VoteMutationFn = Apollo.MutationFunction<VoteMutation, VoteMutationVariables>;

/**
 * __useVoteMutation__
 *
 * To run a mutation, you first call `useVoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [voteMutation, { data, loading, error }] = useVoteMutation({
 *   variables: {
 *      identifier: // value for 'identifier'
 *      slug: // value for 'slug'
 *      value: // value for 'value'
 *   },
 * });
 */
export function useVoteMutation(baseOptions?: Apollo.MutationHookOptions<VoteMutation, VoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<VoteMutation, VoteMutationVariables>(VoteDocument, options);
      }
export type VoteMutationHookResult = ReturnType<typeof useVoteMutation>;
export type VoteMutationResult = Apollo.MutationResult<VoteMutation>;
export type VoteMutationOptions = Apollo.BaseMutationOptions<VoteMutation, VoteMutationVariables>;
export const GetUserPostDocument = gql`
    query GetUserPost($username: String!) {
  getUsetPosts(username: $username) {
    user {
      username
      createdAt
    }
    posts {
      id
      identifier
      body
      slug
      subName
      username
      userVote
      commentCount
      voteScore
      title
      createdAt
    }
    comments {
      id
      body
      username
      postId
      identifier
      createdAt
    }
  }
}
    `;

/**
 * __useGetUserPostQuery__
 *
 * To run a query within a React component, call `useGetUserPostQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserPostQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserPostQuery({
 *   variables: {
 *      username: // value for 'username'
 *   },
 * });
 */
export function useGetUserPostQuery(baseOptions: Apollo.QueryHookOptions<GetUserPostQuery, GetUserPostQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserPostQuery, GetUserPostQueryVariables>(GetUserPostDocument, options);
      }
export function useGetUserPostLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserPostQuery, GetUserPostQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserPostQuery, GetUserPostQueryVariables>(GetUserPostDocument, options);
        }
export type GetUserPostQueryHookResult = ReturnType<typeof useGetUserPostQuery>;
export type GetUserPostLazyQueryHookResult = ReturnType<typeof useGetUserPostLazyQuery>;
export type GetUserPostQueryResult = Apollo.QueryResult<GetUserPostQuery, GetUserPostQueryVariables>;
export const GetSubDocument = gql`
    query GetSub($name: String!) {
  getSub(name: $name) {
    id
    createdAt
    name
    title
    username
    description
    posts {
      id
      identifier
      title
      slug
      body
      username
      commentCount
      voteScore
      userVote
      createdAt
      subName
      votes {
        id
        value
        username
        postId
        VoteStatus
        createdAt
      }
      comments {
        body
        id
        identifier
        body
        username
        postId
        createdAt
      }
    }
    bannerUrn
    imageUrn
  }
}
    `;

/**
 * __useGetSubQuery__
 *
 * To run a query within a React component, call `useGetSubQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSubQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSubQuery({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useGetSubQuery(baseOptions: Apollo.QueryHookOptions<GetSubQuery, GetSubQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSubQuery, GetSubQueryVariables>(GetSubDocument, options);
      }
export function useGetSubLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSubQuery, GetSubQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSubQuery, GetSubQueryVariables>(GetSubDocument, options);
        }
export type GetSubQueryHookResult = ReturnType<typeof useGetSubQuery>;
export type GetSubLazyQueryHookResult = ReturnType<typeof useGetSubLazyQuery>;
export type GetSubQueryResult = Apollo.QueryResult<GetSubQuery, GetSubQueryVariables>;
export const PostDocument = gql`
    query Post($identifier: String!, $slug: String!) {
  getPost(identifier: $identifier, slug: $slug) {
    id
    createdAt
    username
    title
    slug
    identifier
    body
    subName
    commentCount
    voteScore
    userVote
    votes {
      id
      value
      username
      postId
      VoteStatus
    }
    comments {
      id
      body
      username
      identifier
      postId
      createdAt
    }
  }
}
    `;

/**
 * __usePostQuery__
 *
 * To run a query within a React component, call `usePostQuery` and pass it any options that fit your needs.
 * When your component renders, `usePostQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePostQuery({
 *   variables: {
 *      identifier: // value for 'identifier'
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function usePostQuery(baseOptions: Apollo.QueryHookOptions<PostQuery, PostQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PostQuery, PostQueryVariables>(PostDocument, options);
      }
export function usePostLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PostQuery, PostQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PostQuery, PostQueryVariables>(PostDocument, options);
        }
export type PostQueryHookResult = ReturnType<typeof usePostQuery>;
export type PostLazyQueryHookResult = ReturnType<typeof usePostLazyQuery>;
export type PostQueryResult = Apollo.QueryResult<PostQuery, PostQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    id
    username
    email
    createdAt
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const PostsDocument = gql`
    query Posts {
  getPosts {
    id
    identifier
    slug
    username
    commentCount
    voteScore
    title
    body
    createdAt
    subName
    userVote
    comments {
      id
      body
      username
      postId
      createdAt
    }
    votes {
      id
      username
      postId
      value
      VoteStatus
    }
  }
}
    `;

/**
 * __usePostsQuery__
 *
 * To run a query within a React component, call `usePostsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePostsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePostsQuery({
 *   variables: {
 *   },
 * });
 */
export function usePostsQuery(baseOptions?: Apollo.QueryHookOptions<PostsQuery, PostsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PostsQuery, PostsQueryVariables>(PostsDocument, options);
      }
export function usePostsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PostsQuery, PostsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PostsQuery, PostsQueryVariables>(PostsDocument, options);
        }
export type PostsQueryHookResult = ReturnType<typeof usePostsQuery>;
export type PostsLazyQueryHookResult = ReturnType<typeof usePostsLazyQuery>;
export type PostsQueryResult = Apollo.QueryResult<PostsQuery, PostsQueryVariables>;
export const SearchSubsDocument = gql`
    query SearchSubs($name: String!) {
  searchSubs(name: $name) {
    name
    username
    title
    createdAt
  }
}
    `;

/**
 * __useSearchSubsQuery__
 *
 * To run a query within a React component, call `useSearchSubsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchSubsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchSubsQuery({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useSearchSubsQuery(baseOptions: Apollo.QueryHookOptions<SearchSubsQuery, SearchSubsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchSubsQuery, SearchSubsQueryVariables>(SearchSubsDocument, options);
      }
export function useSearchSubsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchSubsQuery, SearchSubsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchSubsQuery, SearchSubsQueryVariables>(SearchSubsDocument, options);
        }
export type SearchSubsQueryHookResult = ReturnType<typeof useSearchSubsQuery>;
export type SearchSubsLazyQueryHookResult = ReturnType<typeof useSearchSubsLazyQuery>;
export type SearchSubsQueryResult = Apollo.QueryResult<SearchSubsQuery, SearchSubsQueryVariables>;
export const TopSubsDocument = gql`
    query TopSubs {
  topSubs {
    name
    title
    imageUrn
  }
}
    `;

/**
 * __useTopSubsQuery__
 *
 * To run a query within a React component, call `useTopSubsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTopSubsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTopSubsQuery({
 *   variables: {
 *   },
 * });
 */
export function useTopSubsQuery(baseOptions?: Apollo.QueryHookOptions<TopSubsQuery, TopSubsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TopSubsQuery, TopSubsQueryVariables>(TopSubsDocument, options);
      }
export function useTopSubsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TopSubsQuery, TopSubsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TopSubsQuery, TopSubsQueryVariables>(TopSubsDocument, options);
        }
export type TopSubsQueryHookResult = ReturnType<typeof useTopSubsQuery>;
export type TopSubsLazyQueryHookResult = ReturnType<typeof useTopSubsLazyQuery>;
export type TopSubsQueryResult = Apollo.QueryResult<TopSubsQuery, TopSubsQueryVariables>;