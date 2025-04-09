import { google } from 'googleapis';


const CLIENT_ID = '';
const CLIENT_SECRET = '';
const REDIRECT_URI = 'http://localhost:3000/oauth2callback';

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);


const scopes = ['https://www.googleapis.com/auth/calendar'];


const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
  prompt: 'consent',
});

console.log('🔗 Перейди за цим посиланням, щоб авторизуватися:');
console.log(authUrl);

console.log('\n👉 Після цього встав отриманий "code" нижче, і запусти другу частину скрипту:');
console.log(`ts-node scripts/get-refresh-token-final.ts`);
