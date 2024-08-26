import { IsPhoneNumber } from 'class-validator';

export class AuthCredentialsDto {
  @IsPhoneNumber()
  phoneNumber: string;
}
