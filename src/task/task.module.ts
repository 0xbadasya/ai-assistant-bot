import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
