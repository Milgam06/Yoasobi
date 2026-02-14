import { gql } from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any };
};

export type CreateYoasobiInputDto = {
  alarmTime: Scalars['String']['input'];
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
  Wednesday = 'WEDNESDAY',
}

export type GetYoasobiInputDto = {
  userId: Scalars['String']['input'];
  weekStartDate: Scalars['DateTime']['input'];
};

export type GetYoasobiOutputDto = {
  __typename?: 'GetYoasobiOutputDto';
  yoasobi: YoasobiEntity;
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
