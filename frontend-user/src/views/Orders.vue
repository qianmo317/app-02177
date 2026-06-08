<template>
  <div class="orders-page">
    <h1 class="page-title">我的订单</h1>
    
    <!-- 订单筛选 -->
    <div class="order-tabs">
      <el-radio-group v-model="activeTab" size="large">
        <el-radio-button value="all">全部 ({{ orderStore.orders.length }})</el-radio-button>
        <el-radio-button value="pending">待支付 ({{ orderStore.pendingOrders.length }})</el-radio-button>
        <el-radio-button value="paid">已支付 ({{ orderStore.paidOrders.length }})</el-radio-button>
        <el-radio-button value="cancelled">已取消 ({{ orderStore.cancelledOrders.length }})</el-radio-button>
      </el-radio-group>
    </div>
    
    <!-- 订单列表 -->
    <div class="order-list" v-if="filteredOrders.length > 0">
      <div class="order-card card" v-for="order in filteredOrders" :key="order.id">
        <div class="order-header">
          <div class="order-info">
            <span class="order-id">订单号：{{ order.id }}</span>
            <span class="order-time">{{ formatTime(order.createTime) }}</span>
          </div>
          <el-tag :type="getStatusType(order.status)">
            {{ getStatusText(order.status) }}
          </el-tag>
        </div>
        
        <div class="order-items">
          <div class="item" v-for="item in order.items" :key="item.id">
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
            <div class="item-price">¥{{ item.price.toFixed(2) }} x {{ item.quantity }}</div>
          </div>
        </div>
        
        <div class="order-footer">
          <div class="order-total">
            共 {{ getTotalCount(order) }} 件商品，合计：
            <span class="price">¥{{ order.totalPrice.toFixed(2) }}</span>
          </div>
          <div class="order-actions">
            <template v-if="order.status === 'pending'">
              <el-button type="primary" @click="handlePay(order)">去支付</el-button>
              <el-button @click="handleCancel(order.id)">取消订单</el-button>
            </template>
            <template v-else-if="order.status === 'paid'">
              <span class="pay-info">
                <el-icon><ChatDotRound /></el-icon>
                微信支付 · {{ formatTime(order.payTime) }}
              </span>
            </template>
          </div>
        </div>
      </div>
    </div>
    
    <el-empty v-else description="暂无订单">
      <el-button type="primary" @click="router.push('/')">去购物</el-button>
    </el-empty>
    
    <!-- 支付弹窗 -->
    <el-dialog 
      v-model="showPayDialog" 
      title="微信支付" 
      width="400px"
      :close-on-click-modal="false"
    >
      <div class="pay-dialog-content">
        <div class="qrcode-wrapper">
          <QrcodeVue :value="qrcodeValue" :size="200" level="H" />
        </div>
        <div class="pay-amount">
          支付金额：<span class="amount">¥{{ currentOrder?.totalPrice.toFixed(2) }}</span>
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
import { useOrderStore } from '@/stores/order'
import { useUserStore } from '@/stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import QrcodeVue from 'qrcode.vue'

const router = useRouter()
const orderStore = useOrderStore()
const userStore = useUserStore()

const activeTab = ref('all')
const showPayDialog = ref(false)
const paying = ref(false)
const currentOrder = ref(null)

// 生成支付二维码内容（模拟微信支付链接）
const qrcodeValue = computed(() => {
  if (!currentOrder.value) return ''
  return `weixin://wxpay/bizpayurl?order=${currentOrder.value.id}&amount=${currentOrder.value.totalPrice.toFixed(2)}`
})

const filteredOrders = computed(() => {
  switch (activeTab.value) {
    case 'pending':
      return orderStore.pendingOrders
    case 'paid':
      return orderStore.paidOrders
    case 'cancelled':
      return orderStore.cancelledOrders
    default:
      return orderStore.orders
  }
})

onMounted(() => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push('/login')
  }
})

function getStatusType(status) {
  const types = {
    pending: 'warning',
    paid: 'success',
    cancelled: 'info'
  }
  return types[status] || 'info'
}

function getStatusText(status) {
  const texts = {
    pending: '待支付',
    paid: '已支付',
    cancelled: '已取消'
  }
  return texts[status] || status
}

function getTotalCount(order) {
  return order.items.reduce((sum, item) => sum + item.quantity, 0)
}

function formatTime(timeStr) {
  if (!timeStr) return ''
  const date = new Date(timeStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function handlePay(order) {
  currentOrder.value = order
  showPayDialog.value = true
}

async function handleConfirmPay() {
  paying.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  orderStore.payOrder(currentOrder.value.id, 'wechat')
  
  paying.value = false
  showPayDialog.value = false
  currentOrder.value = null
  
  ElMessage.success('支付成功！')
}

function handleCancelPay() {
  showPayDialog.value = false
  currentOrder.value = null
  ElMessage.info('已取消支付')
}

function handleCancel(orderId) {
  ElMessageBox.confirm('确定要取消该订单吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    orderStore.cancelOrder(orderId)
    ElMessage.success('订单已取消')
  }).catch(() => {})
}
</script>

<style lang="scss" scoped>
.orders-page {
  margin: 0 100px;
    .page-title {
    font-size: 24px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 24px;
  }
}

.order-tabs {
  margin-bottom: 24px;
}

.card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-card {
  padding: 20px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid #e4e7ed;
}

.order-info {
  display: flex;
  gap: 24px;
  
  .order-id {
    font-size: 14px;
    color: #303133;
    font-weight: 500;
  }
  
  .order-time {
    font-size: 13px;
    color: #909399;
  }
}

.order-items {
  .item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 8px 0;
    
    &:not(:last-child) {
      border-bottom: 1px solid #f0f0f0;
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

.item-price {
  font-size: 14px;
  color: #606266;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #e4e7ed;
}

.order-total {
  font-size: 14px;
  color: #606266;
  
  .price {
    font-size: 20px;
    font-weight: 600;
    color: #f56c6c;
  }
}

.order-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pay-info {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #07c160;
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
