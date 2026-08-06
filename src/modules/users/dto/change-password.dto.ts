import { IsString, MaxLength, MinLength } from 'class-validator';

export class changePasswordDto {
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  readonly password!: string;
}
