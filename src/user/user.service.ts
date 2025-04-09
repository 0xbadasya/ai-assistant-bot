import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import dayjs from 'dayjs'; 

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOrCreateUser(telegramId: number, username?: string) {
    const user = await this.prisma.user.findUnique({
      where: { telegramId: BigInt(telegramId) },
    });

    if (user) return user;

    return this.prisma.user.create({
      data: {
        telegramId: BigInt(telegramId),
        username,
        trialEndsAt: dayjs().add(7, 'days').toDate(),
      },
    });
  }

  async canUseBot(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.isBlocked) return false;

    const isTrial = dayjs().isBefore(user.trialEndsAt);
    return isTrial && user.usedToday < user.dailyLimit;
  }

  async incrementUsage(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        usedToday: { increment: 1 },
        lastActiveAt: new Date(),
      },
    });
  }
}
