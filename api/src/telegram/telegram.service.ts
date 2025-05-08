import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class TelegramService {
  private readonly token: string;
  private readonly chatId: string;
  private readonly logger = new Logger(TelegramService.name);

  constructor(private config: ConfigService) {
    const token = this.config.get<string>('TELEGRAM_BOT_TOKEN');
    const chatId = this.config.get<string>('TELEGRAM_CHAT_ID');

    if (!token || !chatId) {
      throw new Error(
        'TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set in .env',
      );
    }

    this.token = token;
    this.chatId = chatId;
  }

  async sendPhotoWithCaption(caption: string, imageUrl?: string) {
    const photo =
      'https://www.lasavonneriebourbonnaise.fr/815-large_default/huile-argan-flacon-verre-100ml.jpg';
    const url = `https://api.telegram.org/bot${this.token}/sendPhoto`;

    try {
      await axios.post(url, {
        chat_id: this.chatId,
        photo,
        caption,
        parse_mode: 'HTML',
      });
    } catch (error: any) {
      this.logger.error('❌ Erreur envoi Telegram : ' + error.message);
    }
  }
}
