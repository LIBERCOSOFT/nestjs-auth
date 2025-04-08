import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findByBiometricKey(biometricKey: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { biometricKey } });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async create(email: string, password: string): Promise<User> {
    // Check if user exists
    const existingUser = await this.findOne(email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
  }

  async updateBiometricKey(
    userId: string,
    biometricKey: string,
  ): Promise<User> {
    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data: { biometricKey },
      });
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Biometric key already in use');
      }
      throw error;
    }
  }
}
