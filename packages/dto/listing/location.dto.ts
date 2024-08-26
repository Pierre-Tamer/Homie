import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class LocationDto {
  @IsEnum(['Point'])
  @IsNotEmpty()
  type: string;

  @IsArray()
  @IsNumber(undefined, { each: true })
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  coordinates: number[];
}
