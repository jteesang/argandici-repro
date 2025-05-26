# Active la sortie immédiate en cas d'erreur
set -e

# -----------------------
# CONFIGURATION
# -----------------------
API_URL="http://localhost:3000"
ADMIN_EMAIL="admin@argandici.com"
ADMIN_PASSWORD="adminpass"
TOKEN=""
ORDER_ID_CREATED=""

# Fonction pour les logs
log_info() {
  echo "ℹ️ $1"
}

log_success() {
  echo "✅ $1"
}

log_error() {
  echo "❌ $1" >&2
}

# -----------------------
# AUTHENTIFICATION
# -----------------------
log_info "Authentification en tant que $ADMIN_EMAIL..."
AUTH_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$ADMIN_EMAIL\", \"password\": \"$ADMIN_PASSWORD\"}")

HTTP_STATUS=$(echo "$AUTH_RESPONSE" | grep "HTTP_STATUS:" | cut -d':' -f2)
AUTH_BODY=$(echo "$AUTH_RESPONSE" | sed '$d')

log_info "Réponse brute de l'authentification: $AUTH_BODY"
log_info "Code HTTP d'authentification: $HTTP_STATUS"

if [ "$HTTP_STATUS" -eq 200 ] || [ "$HTTP_STATUS" -eq 201 ]; then
  TOKEN=$(echo "$AUTH_BODY" | jq -r .access_token)
  if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
    log_error "Authentification réussie (HTTP $HTTP_STATUS) mais token non trouvé dans la réponse."
    exit 1
  fi
  log_success "Token obtenu."
else
  log_error "Échec de l'authentification (HTTP $HTTP_STATUS)."
  exit 1
fi

# -----------------------
# RÉCUPÉRATION D'UN PRODUIT
# -----------------------
log_info "Récupération du premier produit disponible..."
PRODUCTS_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "$API_URL/products" \
  -H "Authorization: Bearer $TOKEN")

HTTP_STATUS_PRODUCTS=$(echo "$PRODUCTS_RESPONSE" | tail -n1 | cut -d':' -f2)
PRODUCTS_BODY=$(echo "$PRODUCTS_RESPONSE" | sed '$d')

if [ "$HTTP_STATUS_PRODUCTS" -ne 200 ]; then
  log_error "Erreur lors de la récupération des produits (HTTP $HTTP_STATUS_PRODUCTS)."
  log_error "Réponse: $PRODUCTS_BODY"
  exit 1
fi

PRODUCT_ID=$(echo "$PRODUCTS_BODY" | jq -r '.[0].id')

if [ "$PRODUCT_ID" = "null" ] || [ -z "$PRODUCT_ID" ]; then
  log_error "Aucun produit trouvé ou ID de produit non trouvé dans la réponse."
  log_info "Réponse des produits: $PRODUCTS_BODY"
  exit 1
fi
log_success "Produit ID récupéré : $PRODUCT_ID"

# -----------------------
# CRÉATION DE COMMANDE
# -----------------------
log_info "Création de commande..."
ORDER_PAYLOAD=$(cat <<EOF
{
  "items": [{"productId": "$PRODUCT_ID", "quantity": 1}],
  "email": "client.test@example.com",
  "shipping": {
    "fullName": "Client Test De Commande",
    "addressLine1": "123 Rue du Test",
    "addressLine2": "Appt 4B",
    "city": "Testville",
    "postalCode": "75001",
    "country": "FR"
  }
}
EOF
)

log_info "Payload de la commande : $ORDER_PAYLOAD"

CREATE_ORDER_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$API_URL/orders" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "$ORDER_PAYLOAD")

HTTP_STATUS_ORDER=$(echo "$CREATE_ORDER_RESPONSE" | tail -n1 | cut -d':' -f2)
ORDER_BODY=$(echo "$CREATE_ORDER_RESPONSE" | sed '$d')

if [ "$HTTP_STATUS_ORDER" -eq 201 ]; then
  log_success "Commande créée avec succès (HTTP $HTTP_STATUS_ORDER)."
  log_info "Réponse de création de commande : $ORDER_BODY"
  ORDER_ID_CREATED=$(echo "$ORDER_BODY" | jq -r .id)
  log_success "ID de la commande créée : $ORDER_ID_CREATED"
  CHECKOUT_URL=$(echo "$ORDER_BODY" | jq -r .checkoutUrl)
  if [[ "$CHECKOUT_URL" == http* ]]; then
    log_info "Ouvrez ce lien pour simuler un paiement test Stripe :"
    echo "$CHECKOUT_URL"
  else
    log_info "Pas d'URL de checkout Stripe trouvée dans la réponse de création de commande."
  fi
else
  log_error "Erreur lors de la création de la commande (HTTP $HTTP_STATUS_ORDER)."
  log_error "Réponse : $ORDER_BODY"
  exit 1
fi

# -----------------------
# (Optionnel) ATTENTE ET VÉRIFICATION
# -----------------------
read -p "⏳ Appuyez sur Entrée une fois le paiement effectué sur Stripe (si applicable)..."

log_info "Vérification de la commande spécifique (GET /orders/$ORDER_ID_CREATED)..."
if [ -z "$ORDER_ID_CREATED" ]; then
  log_error "Impossible de vérifier la commande, l'ID de la commande créée n'a pas été trouvé."
  exit 1
fi

SPECIFIC_ORDER_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "$API_URL/orders/$ORDER_ID_CREATED" \
  -H "Authorization: Bearer $TOKEN")

HTTP_STATUS_SPECIFIC_ORDER=$(echo "$SPECIFIC_ORDER_RESPONSE" | tail -n1 | cut -d':' -f2)
SPECIFIC_ORDER_BODY=$(echo "$SPECIFIC_ORDER_RESPONSE" | sed '$d')

if [ "$HTTP_STATUS_SPECIFIC_ORDER" -eq 200 ]; then
  log_success "Détails de la commande $ORDER_ID_CREATED récupérés :"
  echo "$SPECIFIC_ORDER_BODY" | jq .
  ORDER_STATUS=$(echo "$SPECIFIC_ORDER_BODY" | jq -r .status)
  log_info "Statut actuel de la commande $ORDER_ID_CREATED : $ORDER_STATUS"
  if [ "$ORDER_STATUS" = "PAID" ]; then
      log_success "🎉 Le statut de la commande est PAYÉ (ou le statut attendu) !"
  else
      log_info "ℹ️ Le statut de la commande n'est pas encore PAYÉ. Vérifiez le traitement de vos webhooks Stripe."
  fi
else
  log_error "Erreur lors de la récupération de la commande $ORDER_ID_CREATED (HTTP $HTTP_STATUS_SPECIFIC_ORDER)."
  log_error "Réponse : $SPECIFIC_ORDER_BODY"
fi

log_info "✨ Script de test terminé."
