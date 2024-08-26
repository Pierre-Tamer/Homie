import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateListingDto, RegionDto } from 'dto';
import { User, UserDocument } from 'src/schema/user/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Listing, ListingDocument } from 'src/schema/listing/listing.schema';
import { Photo } from '../schema/abstract/photo.schema';

@Injectable()
export class ListingService {
  constructor(
    @InjectModel(User.name)
    private UserModel: Model<UserDocument>,
    @InjectModel(Listing.name)
    private listingModel: Model<ListingDocument>,
  ) {}

  regionToCordinates(region: RegionDto) {
    const { lat, latDelta: latd, lng, lngDelta: lngd } = region;
    const latDelta = latd + 0.05;
    const lngDelta = lngd + 0.05;

    const coordinates = [
      [lng - lngDelta / 2, lat + latDelta / 2],
      [lng + lngDelta / 2, lat + latDelta / 2],
      [lng + lngDelta / 2, lat - latDelta / 2],
      [lng - lngDelta / 2, lat - latDelta / 2],
      [lng - lngDelta / 2, lat + latDelta / 2],
    ];
    return coordinates;
  }

  async createListing(
    listingInfo: CreateListingDto,
    user: UserDocument,
    photos: Array<Express.MulterS3.File>,
  ) {
    if (photos.length === 0)
      return new BadRequestException('new listings require images');

    const newListing = new this.listingModel({ ...listingInfo, user });
    for (const photo of photos) {
      newListing.photos.push(new Photo(`/photo/${photo.key}`, photo.key));
    }

    try {
      await newListing.save();
      user.listings.push(newListing._id);
      await user.save();
    } catch (err) {
      console.log(err);
    }
  }

  async getListings(region: RegionDto, user: UserDocument) {
    const polygon = this.regionToCordinates(region);

    const listings = await this.listingModel
      .find({
        location: {
          $geoWithin: {
            $geometry: {
              type: 'Polygon',
              coordinates: [polygon],
            },
          },
        },
      })
      .populate('user', 'phoneNumber firstName lastName');

    return { listings: listings, polygon: polygon };
  }

  async getListing(id: string) {
    const listing = await this.UserModel.findOne({ id });

    return { listing };
  }
}
