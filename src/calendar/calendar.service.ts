import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';

@Injectable()
export class CalendarService {
  private calendar;

  constructor() {
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    auth.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    this.calendar = google.calendar({ version: 'v3', auth });
  }

  async addEvent(summary: string, start: Date, end: Date) {
    return this.calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary,
        start: { dateTime: start.toISOString() },
        end: { dateTime: end.toISOString() },
      },
    });
  }
}
