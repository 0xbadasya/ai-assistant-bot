import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Telegraf } from 'telegraf';
import { TelegramService } from './telegram/telegram.service';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {

  const app = await NestFactory.createApplicationContext(AppModule);
  const telegramService = app.get(TelegramService);
  const token = process.env.BOT_TOKEN;
  if (!token) {
    throw new Error('BOT_TOKEN is missing in .env');
  }

  const bot = new Telegraf(token);

  bot.start(async (ctx) => {
    await ctx.reply('🤖 Привіт!\n\n Я твій AI-асистент. Напиши /add_task, /list_tasks або /analyze_day!');
  });

  bot.on('text', async (ctx) => {
    const response = await telegramService.handleMessage(ctx.message.text, ctx);
    await ctx.reply(response);
  });

  await bot.launch();
  console.log('🤖 Bot is running');
}
bootstrap();
