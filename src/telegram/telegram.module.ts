// src/telegram/telegram.module.ts
import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { AiModule } from '../ai/ai.module';
import { UserModule } from '../user/user.module';
import { PrismaModule } from '../prisma/prisma.module';
import { TaskModule } from '../task/task.module'; 
import { CalendarModule } from '../calendar/calendar.module';

@Module({
  imports: [AiModule, UserModule, PrismaModule, TaskModule, CalendarModule,],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {}
