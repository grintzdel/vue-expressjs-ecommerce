import { ref, computed } from 'vue'

export interface CartItem {
  productId: string
  productName: string
  productSlug: string
  productImage: string
  unitPrice: number
  currency: string
  quantity: number
}

const cartItems = ref<CartItem[]>(loadCart())
const cartOpen = ref(false)

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem('cart')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cartItems.value))
}

export function useCart() {
  const totalItems = computed(() => cartItems.value.reduce((sum, i) => sum + i.quantity, 0))
  const subtotal = computed(() => cartItems.value.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0))

  function addToCart(item: Omit<CartItem, 'quantity'>, qty = 1) {
    const existing = cartItems.value.find(i => i.productId === item.productId)
    if (existing) {
      existing.quantity += qty
    } else {
      cartItems.value.push({ ...item, quantity: qty })
    }
    saveCart()
    cartOpen.value = true
  }

  function updateQuantity(productId: string, quantity: number) {
    const item = cartItems.value.find(i => i.productId === productId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId)
      } else {
        item.quantity = quantity
        saveCart()
      }
    }
  }

  function removeFromCart(productId: string) {
    cartItems.value = cartItems.value.filter(i => i.productId !== productId)
    saveCart()
  }

  function clearCart() {
    cartItems.value = []
    saveCart()
  }

  function openCart() {
    cartOpen.value = true
  }

  function closeCart() {
    cartOpen.value = false
  }

  return {
    cartItems,
    cartOpen,
    totalItems,
    subtotal,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    openCart,
    closeCart,
  }
}
