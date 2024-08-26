export class JwtPayload {
  _id: string;
  iat?: number;
  exp?: number;
}

export class JwtResponse {
  accessToken: string;
  refreshToken: string;
  iscompleteProfile: boolean;
  expAccessToken: number;
  expRefreshToken: number;
}

export class SignInJWT {
  signInToken: string;
}
