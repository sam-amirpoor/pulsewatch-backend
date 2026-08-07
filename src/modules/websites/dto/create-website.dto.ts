import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateWebsiteDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl({
    protocols: ['http', 'https'],
    require_protocol: true,
  })
  url!: string;
}
