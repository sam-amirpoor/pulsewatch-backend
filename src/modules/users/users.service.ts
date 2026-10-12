import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findOne(options: { id?: string; email?: string }): Promise<User> {
    let user: User | null = null;

    if (options.id) {
      user = await this.usersRepository.findOneBy({
        id: options.id,
      });
    } else if (options.email) {
      user = await this.usersRepository.findOneBy({
        email: options.email,
      });
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async create(email: string, passwordHash: string) {
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

  async update(id: string, email?: string, passwordHash?: string) {
    const user = await this.findOne({ id });

    if (email !== undefined) {
      user.email = email;
    }

    if (passwordHash !== undefined) {
      user.passwordHash = passwordHash;
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
    const user = await this.findOne({ id });

    await this.usersRepository.remove(user);
  }
}
