export type ICurrentUser = {
  id: string;
};

export type IAuthRequest = {
  headers: { authorization?: string };
  user?: ICurrentUser;
};
