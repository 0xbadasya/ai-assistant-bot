import { Injectable } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { TaskService } from '../task/task.service';
import { CalendarService } from '../calendar/calendar.service';

@Injectable()
export class TelegramService {
  constructor(
    private aiService: AiService,
    private userService: UserService,
    private prisma: PrismaService,
    private taskService: TaskService,
    private calendarService: CalendarService
  ) {}

  async handleMessage(text: string, ctx: any): Promise<string> {
    const telegramId = ctx.from.id;
    const username = ctx.from.username;

    const user = await this.userService.findOrCreateUser(telegramId, username);
    const userId = user.id; // правильний userId

    const canUse = await this.userService.canUseBot(userId);
    if (!canUse) return '🚫 Вичерпано ліміт або закінчився пробний період.';

    if (text.startsWith('/add_task')) {
      const taskText = text.replace('/add_task', '').trim();
      const parsed = await this.aiService.parseTask(taskText);
      if (!parsed?.title || !parsed?.date) return '❌ Не вдалося розпізнати задачу.';
      await this.taskService.addTask(userId, parsed.title, new Date(parsed.date), parsed.description);
      await this.userService.incrementUsage(userId);
      return `✅ Завдання "${parsed.title}" додано на ${parsed.date}`;
    }

    if (text.startsWith('/list_tasks')) {
      const tasks = await this.taskService.listTasks(userId);
      if (!tasks.length) return '📭 У тебе ще немає задач.';
      return tasks.map(t => `📌 ${t.title} — ${t.date.toISOString().slice(0, 10)}${t.done ? ' ✅' : ''}`).join('\n');
    }

    if (text.startsWith('/analyze_day')) {
      const logs = await this.prisma.sessionLog.findMany({
        where: {
          userId: userId, // використовуємо userId
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
        orderBy: { createdAt: 'asc' },
      });

      const history = logs.map(log => `🧠 ${log.prompt}\n🤖 ${log.response}`).join('\n\n');
      const result = await this.aiService.generateReply(`Проаналізуй мій день:
${history}`, userId); // використовуємо userId
      await this.userService.incrementUsage(userId);
      return result;
    }

    if (text.startsWith('/add_event')) {
      const eventText = text.replace('/add_event', '').trim();
      const parsed = await this.aiService.parseCalendarEvent(eventText);
      if (!parsed?.summary || !parsed?.start || !parsed?.end) return '❌ Не вдалося розпізнати подію.';

      await this.calendarService.addEvent(parsed.summary, new Date(parsed.start), new Date(parsed.end));
      await this.userService.incrementUsage(userId);
      return `📅 Подію "${parsed.summary}" додано в Google Calendar.`;
    }

    const reply = await this.aiService.generateReply(text, userId); // використовуємо userId
    await this.prisma.sessionLog.create({ data: { userId: userId, prompt: text, response: reply } }); // використовуємо userId
    await this.userService.incrementUsage(userId);
    return reply;
  }
}

