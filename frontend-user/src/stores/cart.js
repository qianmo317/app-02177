import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { logger } from '@/utils/logger'

export const useCartStore = defineStore('cart', () => {
  /**
   * 购物车数据（Mock 实现）
   * 说明：购物车数据存储在 localStorage 中进行持久化。
   * 生产环境应替换为真实的后端 API 调用。
   */
  const items = ref(JSON.parse(localStorage.getItem('cartItems') || '[]'))

  const totalCount = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  const totalPrice = computed(() => {
    return items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  })

  function saveToStorage() {
    localStorage.setItem('cartItems', JSON.stringify(items.value))
  }

  function addToCart(book) {
    logger.info('添加商品到购物车', { bookId: book.id, title: book.title })
    
    const existingItem = items.value.find(item => item.id === book.id)
    
    if (existingItem) {
      existingItem.quantity += 1
      logger.debug('商品数量增加', { bookId: book.id, quantity: existingItem.quantity })
    } else {
      items.value.push({
        id: book.id,
        title: book.title,
        author: book.author,
        price: book.price,
        cover: book.cover,
        quantity: 1
      })
      logger.debug('新商品添加到购物车', { bookId: book.id })
    }
    
    saveToStorage()
  }

  function removeFromCart(bookId) {
    logger.info('从购物车移除商品', { bookId })
    
    const index = items.value.findIndex(item => item.id === bookId)
    if (index > -1) {
      items.value.splice(index, 1)
      saveToStorage()
    }
  }

  function updateQuantity(bookId, quantity) {
    logger.debug('更新商品数量', { bookId, quantity })
    
    const item = items.value.find(item => item.id === bookId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(bookId)
      } else {
        item.quantity = quantity
        saveToStorage()
      }
    }
  }

  function clearCart() {
    logger.info('清空购物车')
    items.value = []
    saveToStorage()
  }

  return {
    items,
    totalCount,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  }
})
