import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import * as mongoose from 'mongoose';
import { Location, LocationSchema } from '../abstract/location.schema';
import { Photo, PhotoSchema } from '../abstract/photo.schema';
import { User } from '../user/user.schema';

export type ListingDocument = Listing & mongoose.Document;

export enum ListingTypesEnum {
  rent = 'RENT',
  sell = 'SELL',
}

export const ListingTypes = ['RENT', 'SELL'];

@Schema({ timestamps: true })
export class Listing {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  @Type(() => User)
  user: User;

  @Prop({ type: LocationSchema, index: '2dsphere' })
  location: Location;

  @Prop({ enum: ListingTypes })
  listingType: ListingTypesEnum;

  @Prop({ type: [PhotoSchema] })
  photos: Photo[];

  @Prop({ type: 'Number' })
  rooms: number;

  @Prop({ type: 'Number' })
  bathrooms: number;

  @Prop({ type: 'Number' })
  area: number;

  @Prop({ type: 'Number' })
  price: number;

  @Prop({ type: 'Number' })
  floor: number;

  @Prop()
  title: string;

  @Prop()
  description: string;
}

const ListingSchema = SchemaFactory.createForClass(Listing);

export { ListingSchema };
