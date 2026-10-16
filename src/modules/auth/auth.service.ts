import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'node:crypto';
import { StringValue } from 'ms';
import { User } from '../users/entities/user.entity';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokensRepository: Repository<RefreshToken>,
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

    return this.issueTokens(user.id, user.email);
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private async issueTokens(userId: string, email: string) {
    const accessSecret = this.configService.getOrThrow<string>('jwt.secret');
    const accessExpiresIn =
      this.configService.getOrThrow<StringValue>('jwt.expiresIn');

    const refreshSecret =
      this.configService.getOrThrow<string>('jwt.refreshSecret');
    const refreshExpiresIn = this.configService.getOrThrow<StringValue>(
      'jwt.refreshExpiresIn',
    );

    const access_token = await this.jwtService.signAsync(
      { sub: userId, email },
      { secret: accessSecret, expiresIn: accessExpiresIn },
    );

    const refresh_token = await this.jwtService.signAsync(
      { sub: userId },
      { secret: refreshSecret, expiresIn: refreshExpiresIn },
    );

    const verified = await this.jwtService.verifyAsync<{
      sub: string;
      exp: number;
    }>(refresh_token, { secret: refreshSecret });

    await this.refreshTokensRepository.save(
      this.refreshTokensRepository.create({
        tokenHash: this.hashToken(refresh_token),
        user: { id: userId } as User,
        expiresAt: new Date(verified.exp * 1000),
        revokedAt: null,
      }),
    );

    return { access_token, refresh_token };
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const refreshSecret =
      this.configService.getOrThrow<string>('jwt.refreshSecret');

    let payload: { sub: string; exp: number };

    try {
      payload = await this.jwtService.verifyAsync<{
        sub: string;
        exp: number;
      }>(refreshToken, { secret: refreshSecret });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const session = await this.refreshTokensRepository.findOne({
      where: { tokenHash: this.hashToken(refreshToken) },
      relations: { user: true },
    });

    if (
      !session ||
      session.revokedAt !== null ||
      session.expiresAt.getTime() <= Date.now() ||
      session.user.id !== payload.sub
    ) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // توکن قبلی را باطل می‌کنیم.
    session.revokedAt = new Date();
    await this.refreshTokensRepository.save(session);

    // و یک جفت توکن جدید می‌سازیم.
    return this.issueTokens(session.user.id, session.user.email);
  }

  async logout(refreshToken: string) {
    if (refreshToken) {
      const session = await this.refreshTokensRepository.findOne({
        where: { tokenHash: this.hashToken(refreshToken) },
      });

      if (session && session.revokedAt === null) {
        session.revokedAt = new Date();
        await this.refreshTokensRepository.save(session);
      }
    }

    return { success: true };
  }
}
