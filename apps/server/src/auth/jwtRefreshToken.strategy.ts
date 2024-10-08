import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'dto';
import { User, UserDocument } from '../schema/user/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  public get configService(): ConfigService {
    return this._configService;
  }
  constructor(
    @InjectModel(User.name)
    private UserModel: Model<UserDocument>,
    private _configService: ConfigService,
  ) {
    super({
      secretOrKey: _configService.get('JWT_REFRESH_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: JwtPayload) {
    const { _id } = payload;

    const user = await this.UserModel.findOne({ _id: _id });

    if (!user || !user.refreshToken || user.refreshToken.length === 0)
      throw new UnauthorizedException();

    const refreshToken = request.headers?.authorization
      .split(' ')[1]
      .split('.')[2];

    let valid = false;
    for (const [index, token] of user.refreshToken.entries()) {
      if (await bcrypt.compare(refreshToken, token)) {
        valid = true;
        user.refreshToken.splice(index, 1);
      }
    }

    if (!valid) throw new UnauthorizedException();

    return user;
  }
}
