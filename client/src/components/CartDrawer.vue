<script setup lang="ts">
import { useCart } from '@/composables/useCart'
import { useAuth } from '@/composables/useAuth'
import { useApi } from '@/composables/useApi'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const { cartItems, cartOpen, totalItems, subtotal, updateQuantity, removeFromCart, clearCart, closeCart } = useCart()
const { isAuthenticated, getUserFromToken } = useAuth()
const api = useApi()
const router = useRouter()

const promoCode = ref('')
const checkoutLoading = ref(false)
const checkoutSuccess = ref(false)

async function handleCheckout() {
  if (!isAuthenticated()) {
    closeCart()
    router.push('/login')
    return
  }

  checkoutLoading.value = true
  try {
    const user = getUserFromToken()
    await api.post('/orders', {
      userId: user!.userId,
      items: cartItems.value.map(i => ({
        productId: i.productId,
        productName: i.productName,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
      })),
      totalAmount: subtotal.value,
      currency: 'EUR',
      shippingAddress: 'Default shipping address',
    })
    clearCart()
    checkoutSuccess.value = true
    setTimeout(() => {
      checkoutSuccess.value = false
      closeCart()
    }, 2500)
  } catch (e) {
    console.error('Checkout failed', e)
  } finally {
    checkoutLoading.value = false
  }
}
</script>

<template>
  <!-- Overlay -->
  <Transition
    enter-active-class="transition-opacity duration-300 ease-in-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-300 ease-in-out"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="cartOpen"
      class="fixed inset-0 bg-black/40 z-40"
      @click="closeCart"
    />
  </Transition>

  <!-- Drawer -->
  <Transition
    enter-active-class="transition-transform duration-300 ease-in-out"
    enter-from-class="translate-x-full"
    enter-to-class="translate-x-0"
    leave-active-class="transition-transform duration-300 ease-in-out"
    leave-from-class="translate-x-0"
    leave-to-class="translate-x-full"
  >
    <aside
      v-if="cartOpen"
      class="fixed top-0 right-0 h-full w-full max-w-[420px] bg-white z-50 flex flex-col shadow-2xl border-l border-border-light"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-lg py-5 border-b border-border-light">
        <div class="flex items-center gap-2">
          <h2 class="font-heading text-[22px] text-font-primary">Your Cart</h2>
          <span
            v-if="totalItems > 0"
            class="w-6 h-6 rounded-full bg-bg-dark text-font-light font-body text-xs font-semibold flex items-center justify-center"
          >{{ totalItems }}</span>
        </div>
        <button
          class="w-9 h-9 rounded-full border border-border-light flex items-center justify-center text-font-secondary hover:text-font-primary transition-colors"
          @click="closeCart"
        >✕</button>
      </div>

      <!-- Success message -->
      <div v-if="checkoutSuccess" class="flex-1 flex flex-col items-center justify-center gap-md px-lg">
        <span class="text-4xl">✓</span>
        <p class="font-heading text-[22px] text-font-primary">Order placed!</p>
        <p class="font-body text-sm text-font-tertiary text-center">Thank you for your purchase. Your order has been confirmed.</p>
      </div>

      <!-- Empty cart -->
      <div v-else-if="cartItems.length === 0" class="flex-1 flex flex-col items-center justify-center gap-md px-lg">
        <span class="text-4xl">🛒</span>
        <p class="font-heading text-[22px] text-font-primary">Your cart is empty</p>
        <p class="font-body text-sm text-font-tertiary">Add some products to get started</p>
        <button class="btn-primary !py-sm !px-lg mt-md" @click="closeCart">Continue Shopping</button>
      </div>

      <!-- Cart items -->
      <template v-else>
        <div class="flex-1 overflow-y-auto px-lg">
          <div
            v-for="item in cartItems"
            :key="item.productId"
            class="flex items-center gap-md py-5 border-b border-border-light"
          >
            <!-- Image -->
            <router-link
              :to="`/product/${item.productSlug}`"
              class="w-[80px] h-[80px] rounded-md overflow-hidden flex-shrink-0 bg-bg-primary"
              @click="closeCart"
            >
              <img
                v-if="item.productImage"
                :src="item.productImage"
                :alt="item.productName"
                class="w-full h-full object-cover"
              />
            </router-link>

            <!-- Info -->
            <div class="flex-1 flex flex-col gap-1.5">
              <!-- Top: name + delete -->
              <div class="flex items-start justify-between">
                <div class="flex flex-col gap-0.5">
                  <span class="font-body text-sm font-semibold text-font-primary leading-tight">{{ item.productName }}</span>
                  <span class="font-body text-xs text-font-tertiary">100ml</span>
                </div>
                <button
                  class="w-7 h-7 flex items-center justify-center text-font-tertiary hover:text-red-500 transition-colors"
                  @click="removeFromCart(item.productId)"
                >🗑</button>
              </div>

              <!-- Bottom: qty + price -->
              <div class="flex items-center justify-between">
                <div class="flex items-center border border-border-light rounded-md overflow-hidden">
                  <button
                    class="w-8 h-8 flex items-center justify-center font-body text-sm text-font-primary hover:bg-bg-primary transition-colors"
                    @click="updateQuantity(item.productId, item.quantity - 1)"
                  >-</button>
                  <span class="w-8 h-8 flex items-center justify-center font-body text-sm font-semibold text-font-primary bg-white">
                    {{ item.quantity }}
                  </span>
                  <button
                    class="w-8 h-8 flex items-center justify-center font-body text-sm text-font-primary hover:bg-bg-primary transition-colors"
                    @click="updateQuantity(item.productId, item.quantity + 1)"
                  >+</button>
                </div>
                <span class="font-body text-[15px] font-semibold text-font-primary">
                  €{{ (item.unitPrice * item.quantity).toFixed(2) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="border-t border-border-light px-lg py-5 flex flex-col gap-md">
          <!-- Promo -->
          <div class="flex gap-2">
            <input
              v-model="promoCode"
              type="text"
              placeholder="Promo code"
              class="flex-1 h-10 px-3 bg-bg-primary rounded-md font-body text-[13px] text-font-primary placeholder:text-font-tertiary focus:outline-none"
            />
            <button class="h-10 px-md bg-bg-dark text-font-light font-body text-[13px] font-medium rounded-md hover:opacity-90 transition-opacity">
              Apply
            </button>
          </div>

          <div class="h-px bg-border-light"></div>

          <!-- Subtotal -->
          <div class="flex items-center justify-between">
            <span class="font-body text-sm text-font-secondary">Subtotal</span>
            <span class="font-body text-sm font-semibold text-font-primary">€{{ subtotal.toFixed(2) }}</span>
          </div>

          <!-- Shipping -->
          <div class="flex items-center justify-between">
            <span class="font-body text-sm text-font-secondary">Shipping</span>
            <span class="font-body text-sm font-medium text-accent-green">Free</span>
          </div>

          <div class="h-px bg-border-light"></div>

          <!-- Total -->
          <div class="flex items-center justify-between">
            <span class="font-body text-body font-bold text-font-primary">Total</span>
            <span class="font-body text-body-lg font-bold text-font-primary">€{{ subtotal.toFixed(2) }}</span>
          </div>

          <!-- Checkout -->
          <button
            class="w-full h-12 bg-bg-dark text-font-light font-body text-[15px] font-semibold rounded-full flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
            :disabled="checkoutLoading"
            @click="handleCheckout"
          >
            {{ checkoutLoading ? 'Processing...' : 'Proceed to Checkout' }}
            <span v-if="!checkoutLoading">→</span>
          </button>

          <!-- Continue shopping -->
          <button
            class="w-full text-center font-body text-[13px] text-font-tertiary hover:text-font-primary transition-colors"
            @click="closeCart"
          >Continue Shopping</button>
        </div>
      </template>
    </aside>
  </Transition>
</template>
