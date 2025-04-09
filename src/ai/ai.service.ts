import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { PrismaService } from '../prisma/prisma.service';

function extractJson(text: string): string {
  const jsonStart = text.indexOf('{');
  const jsonEnd = text.lastIndexOf('}');
  if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
    return text.slice(jsonStart, jsonEnd + 1);
  }
  return '{}';
}

@Injectable()
export class AiService {
  private readonly openai: OpenAI;

  constructor(private readonly prisma: PrismaService) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateReply(prompt: string, userId: string): Promise<string> {
    try {
      const chatCompletion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Ти персональний асистент користувача. Завжди відповідай тепло, стисло, з емодзі, ніби ти друг.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        user: userId, 
      });

      const reply = chatCompletion.choices[0]?.message?.content ?? '🤖 GPT не відповів.';

      await this.prisma.sessionLog.create({
        data: {
          userId: userId, 
          prompt,
          response: reply,
          type: 'message',
        },
      });

      return reply;
    } catch (error: any) {
      const fallback = error.status === 429
        ? '🚫 Вичерпано ліміт OpenAI.'
        : '❌ Сталася помилка при генерації відповіді.';

      await this.prisma.sessionLog.create({
        data: {
          userId: userId, 
          prompt,
          response: fallback,
          type: 'error',
          meta: {
            message: error.message,
            code: error.code || null,
            status: error.status || null,
          },
        },
      });

      return fallback;
    }
  }

  // Парсинг задачі з тексту
  async parseTask(text: string): Promise<{ title: string; description?: string; date: string } | null> {
    try {
      const result = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'Твоя задача — розібрати текст користувача і витягнути задачу. Поверни JSON у форматі: { "title": "...", "description": "...", "date": "ISO string" }.',
          },
          { role: 'user', content: text },
        ],
        temperature: 0.2,
      });

      const raw = result.choices[0]?.message?.content || '{}';
      const cleaned = extractJson(raw);
      return JSON.parse(cleaned);
    } catch (error: any) {
      if (error.status === 429 || error.code === 'insufficient_quota') {
        console.warn('❗ Вичерпано ліміт OpenAI в parseTask');
      } else {
        console.error('❌ parseTask GPT error:', error);
      }
      return null;
    }
  }

  // Парсинг події для календаря
  async parseCalendarEvent(text: string): Promise<{ summary: string; start: string; end: string } | null> {
    const result = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'Ти парсиш текст події для календаря. Поверни JSON у форматі: { "summary": "...", "start": "ISO", "end": "ISO" }. Дати мають бути чіткими!',
        },
        { role: 'user', content: text },
      ],
      temperature: 0.2,
    });

    try {
      const raw = result.choices[0]?.message?.content || '{}';
      const cleaned = extractJson(raw);
      return JSON.parse(cleaned);
    } catch (error) {
      console.warn('❌ GPT parseCalendarEvent error:', error);
      return null;
    }
  }
}
