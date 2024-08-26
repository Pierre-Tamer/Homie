import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export default class JwtSignInGuard extends AuthGuard('jwt-signin-token') {}
