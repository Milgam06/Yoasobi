import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
};

export type CreateUserInputDto = {
  name: Scalars['String']['input'];
  timezone: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

export type CreateUserOutputDto = {
  __typename?: 'CreateUserOutputDto';
  user: UserEntity;
};

export type CreateYoasobiInputDto = {
  alarmTime: Scalars['DateTime']['input'];
  dayOfWeek: DayOfWeek;
  duration: Scalars['Int']['input'];
  userId: Scalars['String']['input'];
  yoasobiDate: Scalars['DateTime']['input'];
};

export type CreateYoasobiOutputDto = {
  __typename?: 'CreateYoasobiOutputDto';
  yoasobi: YoasobiEntity;
};

export enum DayOfWeek {
  Friday = 'FRIDAY',
  Monday = 'MONDAY',
  Saturday = 'SATURDAY',
  Sunday = 'SUNDAY',
  Thursday = 'THURSDAY',
  Tuesday = 'TUESDAY',
  Wednesday = 'WEDNESDAY'
}

export type GetUserInputDto = {
  userId: Scalars['String']['input'];
};

export type GetUserOutputDto = {
  __typename?: 'GetUserOutputDto';
  user?: Maybe<UserEntity>;
};

export type GetYoasobiInputDto = {
  userId: Scalars['String']['input'];
  weekStartDate: Scalars['DateTime']['input'];
};

export type GetYoasobiOutputDto = {
  __typename?: 'GetYoasobiOutputDto';
  yoasobi?: Maybe<YoasobiEntity>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createUser: CreateUserOutputDto;
  createYoasobi: CreateYoasobiOutputDto;
};


export type MutationCreateUserArgs = {
  input: CreateUserInputDto;
};


export type MutationCreateYoasobiArgs = {
  input: CreateYoasobiInputDto;
};

export type Query = {
  __typename?: 'Query';
  getUser: GetUserOutputDto;
  getYoasobi: GetYoasobiOutputDto;
};


export type QueryGetUserArgs = {
  input: GetUserInputDto;
};


export type QueryGetYoasobiArgs = {
  input: GetYoasobiInputDto;
};

export type UserEntity = {
  __typename?: 'UserEntity';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  timezone: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type YoasobiEntity = {
  __typename?: 'YoasobiEntity';
  alarmTime: Scalars['DateTime']['output'];
  createdAt: Scalars['DateTime']['output'];
  dayOfWeek: DayOfWeek;
  duration: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  userId: Scalars['String']['output'];
  weekStartDate: Scalars['DateTime']['output'];
  yoasobiDate: Scalars['DateTime']['output'];
};

export type CreateUserMutationVariables = Exact<{
  input: CreateUserInputDto;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'CreateUserOutputDto', user: { __typename?: 'UserEntity', id: string, name: string, timezone: string, createdAt: any, updatedAt: any } } };

export type GetExistingUserQueryVariables = Exact<{
  input: GetUserInputDto;
}>;


export type GetExistingUserQuery = { __typename?: 'Query', getUser: { __typename?: 'GetUserOutputDto', user?: { __typename?: 'UserEntity', id: string, name: string, timezone: string, createdAt: any, updatedAt: any } | null } };

export type CheckUserQueryVariables = Exact<{
  input: GetUserInputDto;
}>;


export type CheckUserQuery = { __typename?: 'Query', getUser: { __typename?: 'GetUserOutputDto', user?: { __typename?: 'UserEntity', id: string } | null } };

export type GetWeeklyYoasobiQueryVariables = Exact<{
  input: GetYoasobiInputDto;
}>;


export type GetWeeklyYoasobiQuery = { __typename?: 'Query', getYoasobi: { __typename?: 'GetYoasobiOutputDto', yoasobi?: { __typename?: 'YoasobiEntity', id: string, yoasobiDate: any, dayOfWeek: DayOfWeek, alarmTime: any, duration: number, createdAt: any } | null } };

export type CreateYoasobiMutationVariables = Exact<{
  input: CreateYoasobiInputDto;
}>;


export type CreateYoasobiMutation = { __typename?: 'Mutation', createYoasobi: { __typename?: 'CreateYoasobiOutputDto', yoasobi: { __typename?: 'YoasobiEntity', id: string } } };


export const CreateUserDocument = gql`
    mutation CreateUser($input: CreateUserInputDto!) {
  createUser(input: $input) {
    user {
      id
      name
      timezone
      createdAt
      updatedAt
    }
  }
}
    `;
export type CreateUserMutationFn = Apollo.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateUserMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, options);
      }
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;
export const GetExistingUserDocument = gql`
    query getExistingUser($input: GetUserInputDto!) {
  getUser(input: $input) {
    user {
      id
      name
      timezone
      createdAt
      updatedAt
    }
  }
}
    `;

/**
 * __useGetExistingUserQuery__
 *
 * To run a query within a React component, call `useGetExistingUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetExistingUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetExistingUserQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetExistingUserQuery(baseOptions: Apollo.QueryHookOptions<GetExistingUserQuery, GetExistingUserQueryVariables> & ({ variables: GetExistingUserQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetExistingUserQuery, GetExistingUserQueryVariables>(GetExistingUserDocument, options);
      }
export function useGetExistingUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetExistingUserQuery, GetExistingUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetExistingUserQuery, GetExistingUserQueryVariables>(GetExistingUserDocument, options);
        }
// @ts-ignore
export function useGetExistingUserSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetExistingUserQuery, GetExistingUserQueryVariables>): Apollo.UseSuspenseQueryResult<GetExistingUserQuery, GetExistingUserQueryVariables>;
export function useGetExistingUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetExistingUserQuery, GetExistingUserQueryVariables>): Apollo.UseSuspenseQueryResult<GetExistingUserQuery | undefined, GetExistingUserQueryVariables>;
export function useGetExistingUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetExistingUserQuery, GetExistingUserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetExistingUserQuery, GetExistingUserQueryVariables>(GetExistingUserDocument, options);
        }
export type GetExistingUserQueryHookResult = ReturnType<typeof useGetExistingUserQuery>;
export type GetExistingUserLazyQueryHookResult = ReturnType<typeof useGetExistingUserLazyQuery>;
export type GetExistingUserSuspenseQueryHookResult = ReturnType<typeof useGetExistingUserSuspenseQuery>;
export type GetExistingUserQueryResult = Apollo.QueryResult<GetExistingUserQuery, GetExistingUserQueryVariables>;
export const CheckUserDocument = gql`
    query checkUser($input: GetUserInputDto!) {
  getUser(input: $input) {
    user {
      id
    }
  }
}
    `;

/**
 * __useCheckUserQuery__
 *
 * To run a query within a React component, call `useCheckUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useCheckUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCheckUserQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCheckUserQuery(baseOptions: Apollo.QueryHookOptions<CheckUserQuery, CheckUserQueryVariables> & ({ variables: CheckUserQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CheckUserQuery, CheckUserQueryVariables>(CheckUserDocument, options);
      }
export function useCheckUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CheckUserQuery, CheckUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CheckUserQuery, CheckUserQueryVariables>(CheckUserDocument, options);
        }
// @ts-ignore
export function useCheckUserSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<CheckUserQuery, CheckUserQueryVariables>): Apollo.UseSuspenseQueryResult<CheckUserQuery, CheckUserQueryVariables>;
export function useCheckUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CheckUserQuery, CheckUserQueryVariables>): Apollo.UseSuspenseQueryResult<CheckUserQuery | undefined, CheckUserQueryVariables>;
export function useCheckUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CheckUserQuery, CheckUserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CheckUserQuery, CheckUserQueryVariables>(CheckUserDocument, options);
        }
export type CheckUserQueryHookResult = ReturnType<typeof useCheckUserQuery>;
export type CheckUserLazyQueryHookResult = ReturnType<typeof useCheckUserLazyQuery>;
export type CheckUserSuspenseQueryHookResult = ReturnType<typeof useCheckUserSuspenseQuery>;
export type CheckUserQueryResult = Apollo.QueryResult<CheckUserQuery, CheckUserQueryVariables>;
export const GetWeeklyYoasobiDocument = gql`
    query getWeeklyYoasobi($input: GetYoasobiInputDto!) {
  getYoasobi(input: $input) {
    yoasobi {
      id
      yoasobiDate
      dayOfWeek
      alarmTime
      duration
      createdAt
    }
  }
}
    `;

/**
 * __useGetWeeklyYoasobiQuery__
 *
 * To run a query within a React component, call `useGetWeeklyYoasobiQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWeeklyYoasobiQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWeeklyYoasobiQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetWeeklyYoasobiQuery(baseOptions: Apollo.QueryHookOptions<GetWeeklyYoasobiQuery, GetWeeklyYoasobiQueryVariables> & ({ variables: GetWeeklyYoasobiQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetWeeklyYoasobiQuery, GetWeeklyYoasobiQueryVariables>(GetWeeklyYoasobiDocument, options);
      }
export function useGetWeeklyYoasobiLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetWeeklyYoasobiQuery, GetWeeklyYoasobiQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetWeeklyYoasobiQuery, GetWeeklyYoasobiQueryVariables>(GetWeeklyYoasobiDocument, options);
        }
// @ts-ignore
export function useGetWeeklyYoasobiSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetWeeklyYoasobiQuery, GetWeeklyYoasobiQueryVariables>): Apollo.UseSuspenseQueryResult<GetWeeklyYoasobiQuery, GetWeeklyYoasobiQueryVariables>;
export function useGetWeeklyYoasobiSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetWeeklyYoasobiQuery, GetWeeklyYoasobiQueryVariables>): Apollo.UseSuspenseQueryResult<GetWeeklyYoasobiQuery | undefined, GetWeeklyYoasobiQueryVariables>;
export function useGetWeeklyYoasobiSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetWeeklyYoasobiQuery, GetWeeklyYoasobiQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetWeeklyYoasobiQuery, GetWeeklyYoasobiQueryVariables>(GetWeeklyYoasobiDocument, options);
        }
export type GetWeeklyYoasobiQueryHookResult = ReturnType<typeof useGetWeeklyYoasobiQuery>;
export type GetWeeklyYoasobiLazyQueryHookResult = ReturnType<typeof useGetWeeklyYoasobiLazyQuery>;
export type GetWeeklyYoasobiSuspenseQueryHookResult = ReturnType<typeof useGetWeeklyYoasobiSuspenseQuery>;
export type GetWeeklyYoasobiQueryResult = Apollo.QueryResult<GetWeeklyYoasobiQuery, GetWeeklyYoasobiQueryVariables>;
export const CreateYoasobiDocument = gql`
    mutation createYoasobi($input: CreateYoasobiInputDto!) {
  createYoasobi(input: $input) {
    yoasobi {
      id
    }
  }
}
    `;
export type CreateYoasobiMutationFn = Apollo.MutationFunction<CreateYoasobiMutation, CreateYoasobiMutationVariables>;

/**
 * __useCreateYoasobiMutation__
 *
 * To run a mutation, you first call `useCreateYoasobiMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateYoasobiMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createYoasobiMutation, { data, loading, error }] = useCreateYoasobiMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateYoasobiMutation(baseOptions?: Apollo.MutationHookOptions<CreateYoasobiMutation, CreateYoasobiMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateYoasobiMutation, CreateYoasobiMutationVariables>(CreateYoasobiDocument, options);
      }
export type CreateYoasobiMutationHookResult = ReturnType<typeof useCreateYoasobiMutation>;
export type CreateYoasobiMutationResult = Apollo.MutationResult<CreateYoasobiMutation>;
export type CreateYoasobiMutationOptions = Apollo.BaseMutationOptions<CreateYoasobiMutation, CreateYoasobiMutationVariables>;