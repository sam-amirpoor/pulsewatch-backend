import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshAccessTokenDto } from './dto/refresh-access-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  register(@Body() { email, password }: RegisterDto) {
    return this.authService.register(email, password);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() { email, password }: LoginDto) {
    return this.authService.login(email, password);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshAccessToken(@Body() { refreshToken }: RefreshAccessTokenDto) {
    return this.authService.refresh(refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Headers('authorization') authorization?: string) {
    const [type, refreshToken] = authorization?.split(' ') ?? [];

    if (type !== 'Bearer' || !refreshToken) {
      throw new UnauthorizedException('Invalid authorization header');
    }

    return this.authService.logout(refreshToken);
  }
}
