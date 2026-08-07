import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsEmail()
  @MaxLength(255)
  @IsNotEmpty()
  email!: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(72)
  @IsString()
  password!: string;
}
