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

  async sendContactNotification(
    name: string,
    email: string,
    subject: string,
    message: string
  ) {
    try {
      const html = `
        <h2>Nouveau message de contact</h2>
        <p><strong>De:</strong> ${name} (${email})</p>
        <p><strong>Sujet:</strong> ${subject}</p>
        <h3>Message:</h3>
        <p>${message}</p>
        <p><em>Message reçu le ${new Date().toLocaleString('fr-FR')}</em></p>
      `;

      await this.mgClient.messages.create(this.domain, {
        from: `Site Web Argan d'ici <${this.fromEmail}>`,
        to: [process.env.CONTACT_RECIPIENT || 'contact@argandici.com'],
        subject: `[CONTACT] ${subject}`,
        html,
      });

      this.logger.log(`📧 Contact notification sent for ${email}`);
    } catch (error: any) {
      this.logger.error(`❌ Error sending contact notification: ${error.message}`);
    }
  }

  async sendContactConfirmation(
    name: string,
    email: string,
    subject: string,
    message: string
  ) {
    try {
      const html = `
        <h2>Confirmation de réception de votre message</h2>
        <p>Bonjour ${name},</p>
        <p>Nous avons bien reçu votre message et vous remercions de nous avoir contactés.</p>

        <h3>Récapitulatif de votre message :</h3>
        <p><strong>Sujet :</strong> ${subject}</p>
        <p><strong>Message :</strong></p>
        <blockquote>${message}</blockquote>

        <p>Notre équipe traitera votre demande dans les plus brefs délais et vous répondra très rapidement.</p>

        <p>Cordialement,</p>
        <p><strong>L'équipe Argan d'ici</strong></p>
        <p><em>"Pur comme là-bas, authentique comme ici"</em></p>
      `;

      await this.mgClient.messages.create(this.domain, {
        from: `Argan d'ici <${this.fromEmail}>`,
        to: [email],
        subject: `Confirmation de réception : ${subject}`,
        html,
      });

      this.logger.log(`📧 Contact confirmation sent to ${email}`);
    } catch (error: any) {
      this.logger.error(`❌ Error sending contact confirmation: ${error.message}`);
    }
  }
}
