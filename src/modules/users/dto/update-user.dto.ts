import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email!: string;
}
