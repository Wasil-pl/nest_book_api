import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { Match } from 'src/utils/match.decorator';

export class RegisterDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Length(5, 40)
  @IsNotEmpty()
  @IsString()
  password: string;

  @Match('password')
  @IsNotEmpty()
  @Length(5, 40)
  @IsString()
  passwordRepeat: string;
}
