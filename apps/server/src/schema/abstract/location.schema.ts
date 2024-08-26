import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false, id: false })
export class Location {
  @Prop({ default: 'Point', required: true, enum: ['Point'] })
  type: string;

  @Prop({ type: [Number], required: true, maxlength: 2, minlength: 2 })
  coordinates: number[];
}

export const LocationSchema = SchemaFactory.createForClass(Location);
