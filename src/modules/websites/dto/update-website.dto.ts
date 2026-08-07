import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateWebsiteDto {
  @IsString()
  @IsOptional()
  name!: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @IsUrl({
    protocols: ['http', 'https'],
    require_protocol: true,
  })
  url!: string;
}
