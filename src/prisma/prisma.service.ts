import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      if (error instanceof Prisma.PrismaClientInitializationError) {
        console.error('Prisma Client Initialization Error:', error.message);
      } else {
        throw error;
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
