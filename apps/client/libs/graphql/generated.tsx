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
  createYoasobi: CreateYoasobiOutputDto;
};


export type MutationCreateYoasobiArgs = {
  input: CreateYoasobiInputDto;
};

export type Query = {
  __typename?: 'Query';
  getYoasobi: GetYoasobiOutputDto;
};


export type QueryGetYoasobiArgs = {
  input: GetYoasobiInputDto;
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

export type GetWeeklyYoasobiQueryVariables = Exact<{
  input: GetYoasobiInputDto;
}>;


export type GetWeeklyYoasobiQuery = { __typename?: 'Query', getYoasobi: { __typename?: 'GetYoasobiOutputDto', yoasobi?: { __typename?: 'YoasobiEntity', id: string, yoasobiDate: any, dayOfWeek: DayOfWeek, alarmTime: any, duration: number, createdAt: any } | null } };

export type CreateYoasobiMutationVariables = Exact<{
  input: CreateYoasobiInputDto;
}>;


export type CreateYoasobiMutation = { __typename?: 'Mutation', createYoasobi: { __typename?: 'CreateYoasobiOutputDto', yoasobi: { __typename?: 'YoasobiEntity', id: string } } };


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