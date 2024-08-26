import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateListingDto, RegionDto } from 'dto';
import ProfileTypeGuard from '../auth/profileType.guard';
import { ProfileTypes } from '../auth/profileTypes.enum';
import MongooseClassSerializerInterceptor from 'src/mongooseClassSerializer.interceptor';
import { Listing } from '../schema/listing/listing.schema';
import { UserDocument } from 'src/schema/user/user.schema';
import { GetUser } from '../utils/decorators/getUser.decorator';
import { ListingService } from './listing.service';

@Controller('listing')
@UseGuards(ProfileTypeGuard([ProfileTypes.Complete]))
// @UseInterceptors(MongooseClassSerializerInterceptor(Listing))
export class ListingController {
  constructor(private listingService: ListingService) {}

  @Post('/create')
  @UseInterceptors(FilesInterceptor('photos', 10))
  async CreateListing(
    @Body() listingInfo: CreateListingDto,
    @GetUser() user: UserDocument,
    @UploadedFiles() photos: Array<Express.MulterS3.File>,
  ) {
    this.listingService.createListing(listingInfo, user, photos);
  }

  @Post('/get')
  async GetListings(@Body() region: RegionDto, @GetUser() user: UserDocument) {
    return this.listingService.getListings(region, user);
  }
}
