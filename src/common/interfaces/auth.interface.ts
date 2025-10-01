export interface IAuthPayload {
  sub: string;
  email: string;
  role: string;
}

export interface IAuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}
