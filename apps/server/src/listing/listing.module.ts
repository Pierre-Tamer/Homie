import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { PhotoModule } from 'src/photo/photo.module';
import { Listing, ListingSchema } from 'src/schema/listing/listing.schema';
import { User, userSchema } from 'src/schema/user/user.schema';
import { ListingController } from './listing.controller';
import { ListingService } from './listing.service';

@Module({
  imports: [
    AuthModule,
    PhotoModule,
    MongooseModule.forFeature([
      { name: User.name, schema: userSchema },
      { name: Listing.name, schema: ListingSchema },
    ]),
  ],
  controllers: [ListingController],
  providers: [ListingService],
})
export class ListingModule {}
