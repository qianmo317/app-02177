import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { logger } from '@/utils/logger'

export const useOrderStore = defineStore('order', () => {
  /**
   * 订单数据（Mock 实现）
   * 说明：订单数据存储在 localStorage 中进行持久化。
   * 生产环境应替换为真实的后端 API 调用。
   */
  const orders = ref(JSON.parse(localStorage.getItem('orders') || '[]'))

  const pendingOrders = computed(() => orders.value.filter(o => o.status === 'pending'))
  const paidOrders = computed(() => orders.value.filter(o => o.status === 'paid'))
  const cancelledOrders = computed(() => orders.value.filter(o => o.status === 'cancelled'))

  function saveToStorage() {
    localStorage.setItem('orders', JSON.stringify(orders.value))
  }

  function createOrder(items, totalPrice) {
    const order = {
      id: `ORD${Date.now()}`,
      items: [...items],
      totalPrice,
      status: 'pending', // pending, paid, cancelled
      createTime: new Date().toISOString(),
      payTime: null,
      payMethod: null
    }
    orders.value.unshift(order)
    saveToStorage()
    
    logger.info('创建订单', { orderId: order.id, totalPrice, itemCount: items.length })
    return order
  }

  function payOrder(orderId, payMethod) {
    logger.info('支付订单', { orderId, payMethod })
    
    const order = orders.value.find(o => o.id === orderId)
    if (order) {
      order.status = 'paid'
      order.payTime = new Date().toISOString()
      order.payMethod = payMethod
      saveToStorage()
      
      logger.info('订单支付成功', { orderId })
      return true
    }
    
    logger.error('订单支付失败', { orderId, reason: '订单不存在' })
    return false
  }

  function cancelOrder(orderId) {
    logger.info('取消订单', { orderId })
    
    const order = orders.value.find(o => o.id === orderId)
    if (order && order.status === 'pending') {
      order.status = 'cancelled'
      saveToStorage()
      
      logger.info('订单取消成功', { orderId })
      return true
    }
    
    logger.warn('订单取消失败', { orderId, reason: '订单不存在或状态不允许取消' })
    return false
  }

  function getOrderById(orderId) {
    return orders.value.find(o => o.id === orderId)
  }

  return {
    orders,
    pendingOrders,
    paidOrders,
    cancelledOrders,
    createOrder,
    payOrder,
    cancelOrder,
    getOrderById
  }
})
