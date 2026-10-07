import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  findOne(options: { id?: string; email?: string }) {
    if (options.id) {
      return this.usersRepository.findOneBy({ id: options.id });
    }

    if (options.email) {
      return this.usersRepository.findOneBy({ email: options.email });
    }

    return null;
  }

  async create(email: string, password: string) {
    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = this.usersRepository.create({
      email,
      passwordHash,
    });

    await this.usersRepository.save(newUser);

    return {
      id: newUser.id,
      email: newUser.email,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };
  }

  async update(id: string, email?: string, password?: string) {
    const user = await this.findOne({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (email !== undefined) {
      user.email = email;
    }

    if (password !== undefined) {
      user.passwordHash = await bcrypt.hash(password, 12);
    }

    const updatedUser = await this.usersRepository.save(user);

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  }

  async remove(id: string) {
    await this.usersRepository.delete({ id });
  }
}
