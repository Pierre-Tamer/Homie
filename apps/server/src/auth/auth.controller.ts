import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthCredentialsDto } from 'dto';
import { AuthService } from './auth.service';
import { JwtResponse } from 'dto';
import { GetUser } from '../utils/decorators/getUser.decorator';
import { UserDocument } from 'src/schema/user/user.schema';
import { ProfileTypes } from './profileTypes.enum';
import ProfileTypeGuard from './profileType.guard';
import { Throttle } from '@nestjs/throttler';
import JwtRefreshGuard from './jwtRefresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  async signIn(@Body() credentials: AuthCredentialsDto): Promise<JwtResponse> {
    return this.authService.signIn(credentials);
  }

  @Get('/refresh')
  @UseGuards(JwtRefreshGuard)
  async refreshJwt(@GetUser() user: UserDocument) {
    return this.authService.RefreshAccessToken(user);
  }
}
