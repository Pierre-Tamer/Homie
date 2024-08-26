import { IsDateString, IsOptional, Length } from 'class-validator';

export class EditProfileDto {
  @IsOptional()
  @Length(2, 26)
  firstName?: string;

  @IsOptional()
  @Length(2, 26)
  lastName?: string;

  @IsOptional()
  @IsDateString()
  birthDay?: string;
}
