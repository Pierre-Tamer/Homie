import { IsNotEmpty, Length, IsDateString } from 'class-validator';

export class createProfileDto {
  @IsNotEmpty({ message: 'first name can not be empty' })
  @Length(2, 26, { message: 'first name is too long or too short' })
  firstName: string;

  @IsNotEmpty({ message: 'last name can not be empty' })
  @Length(2, 26, { message: 'last name is too long or too short' })
  lastName: string;

  @IsNotEmpty()
  @IsDateString()
  birthDay: string;

  photo: any;
}
