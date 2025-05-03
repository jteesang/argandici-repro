import { getTrackingUrl } from '../../utils/carrier-tracking';

export function generateOrderEmailHtml(order: any): string {
  const logoUrl = './Argan Logo.png';
  const date = new Date(order.date).toLocaleDateString('fr-FR');

  const trackingUrl =
    order.trackingNumber && order.shippingProvider
      ? getTrackingUrl(order.shippingProvider, order.trackingNumber)
      : null;

  const productRows = order.items
    .map(
      (item: any) => `
    <tr style="border-bottom:1px solid #ddd;">
      <td style="padding:10px;">
        <img src="https://argandici.com/assets/${item.product.image}" alt="${item.product.name}" width="80" style="border-radius:8px;" />
      </td>
      <td style="padding:10px;">
        <strong>${item.product.name}</strong><br/>
        ${item.quantity} x ${item.product.price.toFixed(2)} €
      </td>
      <td style="padding:10px; text-align:right;">
        ${(item.product.price * item.quantity).toFixed(2)} €
      </td>
    </tr>
  `,
    )
    .join('');

  return `
  <div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:0 auto;border:1px solid #eee;border-radius:8px;overflow:hidden;">
    <div style="background:#f5f5f5;padding:20px;text-align:center;">
      <img src="${logoUrl}" alt="Argan d'ici" width="120" />
      <h2 style="margin:10px 0;color:#8b5e3c;">Merci pour votre commande !</h2>
      <p style="margin:0;color:#444;">Commande #${order.id} – ${date}</p>
    </div>
    <div style="padding:20px;">
      <h3 style="margin-top:0;color:#444;">Détail de la commande :</h3>
      <table width="100%" style="border-collapse:collapse;">
        ${productRows}
        <tr>
          <td colspan="2" style="padding:15px 10px;text-align:right;font-weight:bold;border-top:1px solid #ccc;">Total</td>
          <td style="padding:15px 10px;text-align:right;font-weight:bold;border-top:1px solid #ccc;">${order.total.toFixed(2)} €</td>
        </tr>
      </table>
    </div>
    <div style="padding:20px;text-align:center;">
      <a href="https://argandici.com/commande/${order.id}"
         style="background:#8b5e3c;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;margin:5px;display:inline-block;">
        Voir ma commande
      </a>
      ${
        trackingUrl
          ? `<a href="${trackingUrl}"
         style="background:#ccc;color:#333;padding:12px 24px;border-radius:6px;text-decoration:none;margin:5px;display:inline-block;">
        Suivre la livraison
      </a>`
          : ''
      }
    </div>
    <div style="background:#f9f9f9;padding:15px;text-align:center;font-size:12px;color:#999;">
      Argan d'ici - contact@argandici.com<br/>
      01 rue des champarts, Limay, France
    </div>
  </div>`;
}
