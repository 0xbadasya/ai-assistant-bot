// scripts/get-refresh-token-final.ts
import { google } from 'googleapis';
import readline from 'readline';

const CLIENT_ID = '';
const CLIENT_SECRET = '';
const REDIRECT_URI = '';

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('👉 Встав сюди code з URL: ', async (code) => {
  rl.close();
  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log('\n✅ Ось твій GOOGLE_REFRESH_TOKEN:\n');
    console.log(tokens.refresh_token);
    console.log('\n🔐 Збережи його в .env як GOOGLE_REFRESH_TOKEN=');
  } catch (error) {
    console.error('❌ Не вдалося отримати токен:', error);
  }
});
