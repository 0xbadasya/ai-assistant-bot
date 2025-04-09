import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async addTask(userId: string, title: string, date: Date, description?: string) {
    return this.prisma.task.create({
      data: {
        userId,
        title,
        date,
        description,
        source: 'gpt',
      },
    });
  }

  async listTasks(userId: string) {
    return this.prisma.task.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
    });
  }
}
