import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Transform } from 'class-transformer';
import * as mongoose from 'mongoose';
import { Photo, PhotoSchema } from '../abstract/photo.schema';
import { Listing } from '../listing/listing.schema';

export type UserDocument = User & mongoose.Document;

@Schema({
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  },
})
export class User {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Prop({ default: false, type: Boolean })
  @Exclude()
  completeProfile: boolean;

  @Prop()
  @Exclude()
  lastActive: Date;

  @Prop()
  @Exclude()
  refreshToken: string[];

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  fullName: string;

  @Prop({ type: PhotoSchema })
  profilePhoto: Photo;

  @Prop()
  @Exclude()
  birthDay: string;

  @Exclude()
  age: number;

  @Prop({ unique: true, required: true })
  phoneNumber: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Listing', default: [] })
  @Exclude()
  listings: Listing[];
}

const userSchema = SchemaFactory.createForClass(User);

userSchema.virtual('fullName').get(function (this: UserDocument) {
  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  if (this.firstName && this.lastName)
    return `${capitalizeFirstLetter(this.firstName)} ${capitalizeFirstLetter(
      this.lastName,
    )}`;
});

userSchema.virtual('age').get(function (this: UserDocument) {
  let today = new Date();
  let birthDate = new Date(this.birthDay);

  let age = today.getFullYear() - birthDate.getFullYear();
  let m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

export { userSchema };
