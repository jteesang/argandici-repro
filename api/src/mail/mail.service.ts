import { Injectable, Logger } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly dryRun: boolean;

  constructor() {
    const apiKey = process.env.SENDGRID_API_KEY;
    this.dryRun = process.env.SENDGRID_DRY_RUN === 'true';

    if (!this.dryRun) {
      if (!apiKey) {
        throw new Error('SENDGRID_API_KEY not set');
      }
      sgMail.setApiKey(apiKey);
    }
  }

  async sendOrderConfirmation(to: string, html: string) {
    const msg = {
      to,
      from: 'contact@argandici.com',
      subject: "Confirmation de votre commande - Argan d'ici",
      html,
    };

    if (this.dryRun) {
      this.logger.log(`[DRY RUN] Email → ${to}:\n${html}`);
      return;
    }

    try {
      await sgMail.send(msg);
      this.logger.log(`Confirmation envoyée à ${to}`);
    } catch (error) {
      this.logger.error(`Erreur envoi email: ${error.message}`);
    }
  }
}
