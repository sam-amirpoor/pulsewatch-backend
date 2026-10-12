import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(email: string, password: string) {
    try {
      await this.usersService.findOne({ email });
      throw new ConflictException('Email already exists');
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      if (!(error instanceof NotFoundException)) {
        throw error;
      }
    }

    const passwordHash = await bcrypt.hash(password, 12);
    return this.usersService.create(email, passwordHash);
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findOne({ email });
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    return {
      access_token: accessToken,
    };
  }
}
