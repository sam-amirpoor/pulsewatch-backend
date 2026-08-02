import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @MaxLength(255)
  email!: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(72)
  password!: string;
}
