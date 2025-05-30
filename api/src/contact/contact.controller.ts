import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from '../mail/mail.service';

@Controller('contact')
export class ContactController {
  constructor(private readonly mailService: MailService) { }

  @Post()
  async handleContactForm(@Body() contactData: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) {
    try {
      // Envoyer l'email de notification
      await this.mailService.sendContactNotification(
        contactData.name,
        contactData.email,
        contactData.subject,
        contactData.message
      );

      // Envoyer l'email de confirmation au client
      await this.mailService.sendContactConfirmation(
        contactData.name,
        contactData.email,
        contactData.subject,
        contactData.message
      );

      return { success: true };
    } catch (error) {
      console.error('Error processing contact form:', error);
      throw new Error('Failed to process contact form');
    }
  }
}
