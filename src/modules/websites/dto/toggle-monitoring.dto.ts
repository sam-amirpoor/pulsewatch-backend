import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ToggleMonitoringDto {
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean = true;
}
