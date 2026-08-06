import { IsJWT, IsNotEmpty, IsString } from 'class-validator';

export class RefreshAccessTokenDto {
  @IsString()
  @IsNotEmpty()
  @IsJWT()
  refreshToken!: string;
}
