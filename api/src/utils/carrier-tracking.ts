export function getTrackingUrl(
  provider: string,
  trackingNumber: string,
): string | null {
  switch (provider) {
    case 'COLISSIMO':
      return `https://www.laposte.fr/outils/suivre-vos-envois?code=${trackingNumber}`;
    case 'MONDIAL_RELAY':
      return `https://www.mondialrelay.fr/suivi-de-colis?exp=${trackingNumber}`;
    case 'CHRONOPOST':
      return `https://www.chronopost.fr/fr/suivi-colis?listeNumerosLT=${trackingNumber}`;
    case 'LA_POSTE':
      return `https://www.laposte.fr/outils/suivre-vos-envois?code=${trackingNumber}`;
    default:
      return null;
  }
}
