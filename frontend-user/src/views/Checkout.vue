<template>
  <div class="checkout-page">
    <h1 class="page-title">确认订单</h1>
    
    <div class="checkout-content" v-if="checkoutItems.length > 0">
      <!-- 商品列表 -->
      <div class="order-items card">
        <h3 class="section-title">商品清单</h3>
        <div class="item-list">
          <div class="item" v-for="item in checkoutItems" :key="item.id">
            <el-image :src="item.cover" fit="cover" class="item-cover">
              <template #error>
                <div class="image-error">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
            <div class="item-info">
              <h4>{{ item.title }}</h4>
              <p>{{ item.author }}</p>
            </div>
            <div class="item-price">¥{{ item.price.toFixed(2) }}</div>
            <div class="item-quantity">x{{ item.quantity }}</div>
            <div class="item-subtotal">¥{{ (item.price * item.quantity).toFixed(2) }}</div>
          </div>
        </div>
      </div>
      
      <!-- 支付方式 -->
      <div class="payment-section card">
        <h3 class="section-title">支付方式</h3>
        <div class="payment-methods">
          <div 
            class="payment-method"
            :class="{ active: payMethod === 'wechat' }"
            @click="payMethod = 'wechat'"
          >
            <div class="method-icon wechat">
              <el-icon :size="32"><ChatDotRound /></el-icon>
            </div>
            <span>微信支付</span>
            <el-icon v-if="payMethod === 'wechat'" class="check-icon"></el-icon>
          </div>
        </div>
      </div>
      
      <!-- 订单汇总 -->
      <div class="order-summary card">
        <div class="summary-row">
          <span>商品数量</span>
          <span>{{ totalCount }} 件</span>
        </div>
        <div class="summary-row">
          <span>商品总价</span>
          <span>¥{{ totalPrice.toFixed(2) }}</span>
        </div>
        <div class="summary-row total">
          <span>应付金额</span>
          <span class="price">¥{{ totalPrice.toFixed(2) }}</span>
        </div>
        <el-button 
          type="primary" 
          size="large" 
          class="submit-btn"
          :loading="submitting"
          :disabled="!payMethod"
          @click="handleSubmit"
        >
          提交订单
        </el-button>
      </div>
    </div>
    
    <el-empty v-else description="没有待结算的商品">
      <el-button type="primary" @click="router.push('/')">去购物</el-button>
    </el-empty>
    
    <!-- 支付弹窗 -->
    <el-dialog 
      v-model="showPayDialog" 
      title="微信支付" 
      width="400px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="pay-dialog-content">
        <div class="qrcode-wrapper">
          <QrcodeVue :value="qrcodeValue" :size="200" level="H" />
        </div>
        <div class="pay-amount">
          支付金额：<span class="amount">¥{{ totalPrice.toFixed(2) }}</span>
        </div>
        <p class="pay-tip">请使用微信扫码支付</p>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCancelPay">取消支付</el-button>
          <el-button type="primary" :loading="paying" @click="handleConfirmPay">
            支付完成
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Picture, ChatDotRound } from '@element-plus/icons-vue'
import { useCartStore } from '@/stores/cart'
import { useOrderStore } from '@/stores/order'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import QrcodeVue from 'qrcode.vue'

const router = useRouter()
const cartStore = useCartStore()
const orderStore = useOrderStore()
const userStore = useUserStore()

const checkoutItems = ref([])
const payMethod = ref('wechat')
const submitting = ref(false)
const showPayDialog = ref(false)
const paying = ref(false)
const currentOrderId = ref(null)

const totalCount = computed(() => {
  return checkoutItems.value.reduce((sum, item) => sum + item.quantity, 0)
})

const totalPrice = computed(() => {
  return checkoutItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

// 生成支付二维码内容（模拟微信支付链接）
const qrcodeValue = computed(() => {
  return `weixin://wxpay/bizpayurl?order=${currentOrderId.value}&amount=${totalPrice.value.toFixed(2)}`
})

onMounted(() => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  
  // 从 sessionStorage 获取待结算商品
  const items = sessionStorage.getItem('checkoutItems')
  if (items) {
    checkoutItems.value = JSON.parse(items)
  }
})

async function handleSubmit() {
  if (!payMethod.value) {
    ElMessage.warning('请选择支付方式')
    return
  }
  
  submitting.value = true
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // 创建订单
  const order = orderStore.createOrder(checkoutItems.value, totalPrice.value)
  currentOrderId.value = order.id
  
  submitting.value = false
  showPayDialog.value = true
}

async function handleConfirmPay() {
  paying.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // 支付成功
  orderStore.payOrder(currentOrderId.value, payMethod.value)
  
  // 清除购物车中已结算的商品
  checkoutItems.value.forEach(item => {
    cartStore.removeFromCart(item.id)
  })
  
  // 清除 sessionStorage
  sessionStorage.removeItem('checkoutItems')
  
  paying.value = false
  showPayDialog.value = false
  
  ElMessage.success('支付成功！')
  router.push('/orders')
}

function handleCancelPay() {
  // 取消支付，订单状态保持 pending
  showPayDialog.value = false
  ElMessage.info('已取消支付，订单已保存')
  router.push('/orders')
}
</script>

<style lang="scss" scoped>
.checkout-page {
  margin: 0 100px;
  .page-title {
    font-size: 24px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 24px;
  }
}

.card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e4e7ed;
}

.item-list {
  .item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 8px 0;
    border-bottom: 1px solid #f0f0f0;
    
    &:last-child {
      border-bottom: none;
    }
  }
}

.item-cover {
  width: 60px;
  height: 80px;
  border-radius: 4px;
  flex-shrink: 0;
  
  .image-error {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f7fa;
    color: #c0c4cc;
  }
}

.item-info {
  flex: 1;
  
  h4 {
    font-size: 15px;
    color: #303133;
    margin-bottom: 4px;
  }
  
  p {
    font-size: 13px;
    color: #909399;
  }
}

.item-price,
.item-quantity {
  width: 80px;
  text-align: center;
  color: #606266;
}

.item-subtotal {
  width: 100px;
  text-align: right;
  font-weight: 600;
  color: #f56c6c;
}

.payment-methods {
  display: flex;
  gap: 16px;
}

.payment-method {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  
  &:hover {
    border-color: #c0c4cc;
  }
  
  &.active {
    border-color: #409eff;
    background: #ecf5ff;
  }
  
  .method-icon {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &.wechat {
      background: #07c160;
      color: #fff;
    }
  }
  
  span {
    font-size: 15px;
    color: #303133;
  }
  
  .check-icon {
    position: absolute;
    top: 8px;
    right: 8px;
    color: #409eff;
  }
}

.order-summary {
  .summary-row {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    font-size: 14px;
    color: #606266;
    border-bottom: 1px solid #f0f0f0;
    
    &.total {
      border-bottom: none;
      padding-top: 16px;
      font-size: 16px;
      
      .price {
        font-size: 24px;
        font-weight: 600;
        color: #f56c6c;
      }
    }
  }
  
  .submit-btn {
    width: 100%;
    margin-top: 24px;
  }
}

.pay-dialog-content {
  text-align: center;
  padding: 24px 0;
}

.qrcode-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
}

.pay-amount {
  font-size: 16px;
  color: #606266;
  margin-bottom: 12px;
  
  .amount {
    font-size: 24px;
    font-weight: 600;
    color: #f56c6c;
  }
}

.pay-tip {
  font-size: 14px;
  color: #909399;
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 16px;
}
</style>
