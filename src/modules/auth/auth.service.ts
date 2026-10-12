import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

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
}
