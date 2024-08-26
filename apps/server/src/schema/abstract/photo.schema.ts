import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  _id: false,
  id: false,
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  },
})
export class Photo {
  constructor(url: string, name: string) {
    this.url = url;
    this.name = name;
  }

  @Prop({ required: true })
  url: String;

  @Prop({ required: true })
  name: String;
}

export const PhotoSchema = SchemaFactory.createForClass(Photo);

PhotoSchema.virtual('fullURL').get(function () {
  return process.env.SERVER_HOSTNAME + this.url;
});
