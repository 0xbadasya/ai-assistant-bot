import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegramModule } from './telegram/telegram.module';
import { AiModule } from './ai/ai.module';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';
import { CalendarModule } from './calendar/calendar.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TelegramModule,
    AiModule,
    TaskModule,
    UserModule,
    CalendarModule,
    PrismaModule,
  ],
})
export class AppModule {}