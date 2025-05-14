import { Injectable, Logger } from '@nestjs/common';
import PDFDocument = require('pdfkit');
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class PdfService {
  private logger = new Logger(PdfService.name);

  constructor(private readonly supabase: SupabaseService) { }

  async generateInvoicePdf(order: any): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 40 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('error', (err) => {
        this.logger.error(`❌ PDF generation error: ${err.message}`);
        reject(err);
      });
      doc.on('end', () => {
        this.logger.log(`✅ PDFKit buffer ready for order ${order.id}`);
        resolve(Buffer.concat(chunks));
      });

      // Contenu simplifié
      doc
        .fontSize(20)
        .text(`Facture - Argan d'ici`, { align: 'center' })
        .moveDown()
        .fontSize(12)
        .text(`Commande : ${order.id}`)
        .text(`Date     : ${new Date().toLocaleDateString()}`)
        .text(`Client   : ${order.fullName} (${order.email})`)
        .moveDown()
        .text('Produits :', { underline: true });

      for (const item of order.items) {
        doc.text(
          `${item.quantity} x ${item.product.name} — ${(item.product.price * item.quantity).toFixed(2)} €`
        );
      }

      doc
        .moveDown()
        .fontSize(14)
        .text(`Total : ${order.total.toFixed(2)} €`, { align: 'right' });

      doc.end();
    });
  }

  async uploadInvoiceToSupabase(orderId: string, pdfBuffer: Buffer): Promise<string> {
    const bucket = 'invoices';
    const filename = `facture-${orderId}.pdf`;

    const { error } = await this.supabase
      .getClient()
      .storage
      .from(bucket)
      .upload(filename, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (error) {
      this.logger.error(`❌ Erreur upload Supabase: ${error.message}`);
      throw error;
    }

    const url = `${process.env.SUPABASE_URL}/storage/v1/object/public/${bucket}/${filename}`;
    this.logger.log(`📤 PDF uploaded to Supabase: ${url}`);
    return url;
  }
}
