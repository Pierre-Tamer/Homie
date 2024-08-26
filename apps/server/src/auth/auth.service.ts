import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AuthCredentialsDto } from 'dto';
import { JwtPayload, JwtResponse, SignInJWT } from 'dto';
import { User, UserDocument } from '../schema/user/user.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private UserModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signJWT(user: User): Promise<JwtResponse> {
    const payload: JwtPayload = {
      _id: user._id.toString(),
    };

    const accessToken: string = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: '2 days',
    });

    const refreshToken: string = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: '90 days',
    });

    const rToken = this.jwtService.decode(refreshToken) as JwtPayload;
    const aToken = this.jwtService.decode(accessToken) as JwtPayload;

    return {
      iscompleteProfile: user.completeProfile,
      accessToken,
      refreshToken,
      expAccessToken: aToken.exp,
      expRefreshToken: rToken.exp,
    };
  }

  async SignLogInJWT(user: UserDocument): Promise<SignInJWT> {
    const payload: JwtPayload = {
      _id: user._id.toString(),
    };

    const signInToken: string = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SIGNIN_SECRET'),
      expiresIn: '30m',
    });

    return { signInToken };
  }

  async RefreshAccessToken(user: UserDocument) {
    const jwtPayload = await this.signJWT(user);

    const salt = await bcrypt.genSalt();
    const jwtSign = jwtPayload.refreshToken.split('.')[2];
    const hashedToken = await bcrypt.hash(jwtSign, salt);

    user.refreshToken.push(hashedToken);
    await user.save();

    return jwtPayload;
  }

  async createUser(phoneNumber: string): Promise<JwtResponse> {
    const newUser = new this.UserModel({
      phoneNumber,
    });

    const jwtPayload = await this.signJWT(newUser);

    const salt2 = await bcrypt.genSalt();
    const jwtSign = jwtPayload.refreshToken.split('.')[2];
    const hashedToken = await bcrypt.hash(jwtSign, salt2);

    newUser.refreshToken = [hashedToken];

    try {
      await newUser.save();
      return jwtPayload;
    } catch (error: any) {
      switch (error.code) {
        case 11000:
          throw new ConflictException('Phone number already exists');
        default:
          throw new InternalServerErrorException();
      }
    }
  }

  async signIn(credentials: AuthCredentialsDto): Promise<JwtResponse> {
    const { phoneNumber } = credentials;

    const user = await this.UserModel.findOne({ phoneNumber });

    if (!user) return await this.createUser(phoneNumber);

    const jwtPayload = await this.signJWT(user);

    const salt = await bcrypt.genSalt();
    const jwtSign = jwtPayload.refreshToken.split('.')[2];
    const hashedToken = await bcrypt.hash(jwtSign, salt);

    user.refreshToken.push(hashedToken);
    await user.save();

    return jwtPayload;
  }
}
