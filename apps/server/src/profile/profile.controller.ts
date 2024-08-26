import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GetUser } from 'src/utils/decorators/getUser.decorator';
import { createProfileDto, EditProfileDto } from 'dto';
import { ProfileService } from './profile.service';
import { User, UserDocument } from 'src/schema/user/user.schema';
import ProfileTypeGuard from 'src/auth/profileType.guard';
import { ProfileTypes } from 'src/auth/profileTypes.enum';
import { ObjectIdQueryDto } from 'dto';
import JwtAccessGuard from 'src/auth/jwtAccess.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import MongooseClassSerializerInterceptor from 'src/mongooseClassSerializer.interceptor';

@Controller('profile')
@UseInterceptors(MongooseClassSerializerInterceptor(User))
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get('/my')
  @UseGuards(JwtAccessGuard)
  async getMyProfile(@GetUser() user: UserDocument) {
    return user;
  }

  @Get('/:id')
  @UseGuards(ProfileTypeGuard([ProfileTypes.Complete]))
  async getProfileById(
    @Param() { id }: ObjectIdQueryDto,
    @GetUser() user: UserDocument,
  ) {
    return this.profileService.getProfileById(id, user);
  }

  @Post('/create')
  @UseGuards(ProfileTypeGuard([ProfileTypes.Incomplete]))
  @UseInterceptors(FileInterceptor('photo'))
  async createMyProfile(
    @Body() profileInfo: createProfileDto,
    @GetUser() user: UserDocument,
    @UploadedFile() profilePic: Express.MulterS3.File,
  ): Promise<void> {
    return this.profileService.createProfile(profileInfo, profilePic, user);
  }

  @Post('/edit')
  @UseGuards(ProfileTypeGuard([ProfileTypes.Complete]))
  @UseInterceptors(FileInterceptor('photo'))
  async editMyProfile(
    @Body() editProfileDto: EditProfileDto,
    @GetUser() user: UserDocument,
    @UploadedFile() profilePic: Express.MulterS3.File,
  ): Promise<void> {
    return this.profileService.editProfile(editProfileDto, profilePic, user);
  }
}
