import { Injectable, Logger } from '@nestjs/common';
import FormData = require('form-data');
import Mailgun from 'mailgun.js';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private mgClient: any;
  private readonly domain: string;
  private readonly fromEmail: string;

  constructor() {
    const apiKey = process.env.MAILGUN_API_KEY;
    this.domain = process.env.MAILGUN_DOMAIN!;
    this.fromEmail = process.env.MAILGUN_FROM ?? `postmaster@${this.domain}`;

    this.logger.log(`💡 Mailgun API key (prefix): ${apiKey?.slice(0, 10)}`);
    this.logger.log(`📤 Sending from: ${this.fromEmail}`);

    if (!apiKey || !this.domain) {
      throw new Error('MAILGUN_API_KEY or MAILGUN_DOMAIN is missing in env');
    }

    const mailgun = new Mailgun(FormData);
    this.mgClient = mailgun.client({
      username: 'api',
      key: apiKey,
      url: 'https://api.eu.mailgun.net',
    });
  }

  async sendOrderConfirmation(to: string, html: string) {
    try {
      await this.mgClient.messages.create(this.domain, {
        from: `Argan d'ici <${this.fromEmail}>`,
        to: [to],
        subject: "Confirmation de votre commande - Argan d'ici",
        html,
      });
      this.logger.log(`📧 Order confirmation sent to ${to}`);
    } catch (error: any) {
      this.logger.error(`❌ Error sending order confirmation to ${to}: ${error.message}`);
    }
  }

  async sendPdfInvoice(to: string, pdfUrl: string, orderId: string) {
    try {
      const html = `
        <p>Merci pour votre commande !</p>
        <p>Vous pouvez télécharger votre facture ici :
          <a href="${pdfUrl}" target="_blank">${pdfUrl}</a>
        </p>
      `.trim();

      await this.mgClient.messages.create(this.domain, {
        from: `Argan d'ici <${this.fromEmail}>`,
        to: [to],
        subject: `Votre facture - Commande ${orderId}`,
        html,
      });

      this.logger.log(`📎 Invoice email sent to ${to} with link ${pdfUrl}`);
    } catch (error: any) {
      this.logger.error(`❌ Error sending invoice to ${to}: ${error.message}`);
    }
  }
}
