export const ORDER_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] as const

export const ORDER_STATUS_LABELS = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
} as const

export const ORDER_STATUS_STYLES = {
  pending: { bg: '#FFF8E1', text: '#E8A830' },
  confirmed: { bg: '#E8F5E9', text: '#2E7D32' },
  shipped: { bg: '#E0E8F0', text: '#4A6FA5' },
  delivered: { bg: '#E8F5E9', text: '#2E7D32' },
  cancelled: { bg: '#FFEBEE', text: '#C94444' },
} as const
