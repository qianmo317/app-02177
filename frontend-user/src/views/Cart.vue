<template>
  <div class="cart-page">
    <h1 class="page-title">购物车</h1>
    
    <template v-if="cartStore.items.length > 0">
      <div class="cart-content">
        <div class="cart-list card">
          <div class="cart-header">
            <el-checkbox 
              v-model="selectAll" 
              @change="handleSelectAll"
            >
              全选
            </el-checkbox>
            <span class="header-item">商品信息</span>
            <span class="header-item">单价</span>
            <span class="header-item">数量</span>
            <span class="header-item">小计</span>
            <span class="header-item">操作</span>
          </div>
          
          <div 
            class="cart-item" 
            v-for="item in cartStore.items" 
            :key="item.id"
          >
            <el-checkbox 
              v-model="selectedItems" 
              :value="item.id"
            />
            
            <div class="item-info" @click="goToDetail(item.id)">
              <el-image :src="item.cover" fit="cover" class="item-cover">
                <template #error>
                  <div class="image-error">
                    <el-icon><Picture /></el-icon>
                  </div>
                </template>
              </el-image>
              <div class="item-detail">
                <h4 class="item-title">{{ item.title }}</h4>
                <p class="item-author">{{ item.author }}</p>
              </div>
            </div>
            
            <div class="item-price">¥{{ item.price.toFixed(2) }}</div>
            
            <div class="item-quantity">
              <el-input-number 
                :model-value="item.quantity"
                :min="1"
                :max="99"
                size="small"
                @change="(val) => handleQuantityChange(item.id, val)"
              />
            </div>
            
            <div class="item-subtotal">
              ¥{{ (item.price * item.quantity).toFixed(2) }}
            </div>
            
            <div class="item-actions">
              <el-button 
                type="danger" 
                text 
                :icon="Delete"
                @click="handleRemove(item.id)"
              >
                删除
              </el-button>
            </div>
          </div>
        </div>
        
        <div class="cart-summary card">
          <div class="summary-row">
            <span>已选商品</span>
            <span>{{ selectedCount }} 件</span>
          </div>
          <div class="summary-row">
            <span>商品总价</span>
            <span class="total-price">¥{{ selectedTotal.toFixed(2) }}</span>
          </div>
          <el-button 
            type="primary" 
            size="large" 
            class="checkout-btn"
            :disabled="selectedItems.length === 0"
            @click="handleCheckout"
          >
            结算 ({{ selectedCount }})
          </el-button>
          <el-button 
            type="danger" 
            text 
            class="clear-btn"
            @click="handleClearCart"
          >
            清空购物车
          </el-button>
        </div>
      </div>
    </template>
    
    <el-empty v-else description="购物车是空的">
      <el-button type="primary" @click="router.push('/')">去购物</el-button>
    </el-empty>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Delete, Picture } from '@element-plus/icons-vue'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()

const selectedItems = ref([...cartStore.items.map(item => item.id)])

const selectAll = computed({
  get: () => selectedItems.value.length === cartStore.items.length && cartStore.items.length > 0,
  set: () => {}
})

const selectedCount = computed(() => {
  return cartStore.items
    .filter(item => selectedItems.value.includes(item.id))
    .reduce((sum, item) => sum + item.quantity, 0)
})

const selectedTotal = computed(() => {
  return cartStore.items
    .filter(item => selectedItems.value.includes(item.id))
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
})

watch(() => cartStore.items.length, () => {
  selectedItems.value = selectedItems.value.filter(
    id => cartStore.items.some(item => item.id === id)
  )
})

function handleSelectAll(val) {
  if (val) {
    selectedItems.value = cartStore.items.map(item => item.id)
  } else {
    selectedItems.value = []
  }
}

function handleQuantityChange(id, val) {
  cartStore.updateQuantity(id, val)
}

function handleRemove(id) {
  ElMessageBox.confirm('确定要删除这本书吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    cartStore.removeFromCart(id)
    ElMessage.success('已删除')
  }).catch(() => {})
}

function handleClearCart() {
  ElMessageBox.confirm('确定要清空购物车吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    cartStore.clearCart()
    ElMessage.success('购物车已清空')
  }).catch(() => {})
}

async function handleCheckout() {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  
  if (selectedItems.value.length === 0) {
    ElMessage.warning('请选择要结算的商品')
    return
  }
  
  // 获取选中的商品
  const checkoutItems = cartStore.items.filter(item => selectedItems.value.includes(item.id))
  
  // 存储到 sessionStorage
  sessionStorage.setItem('checkoutItems', JSON.stringify(checkoutItems))
  
  // 跳转到结算页
  router.push('/checkout')
}

function goToDetail(id) {
  router.push(`/book/${id}`)
}
</script>

<style lang="scss" scoped>
.cart-page {
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
}

.cart-content {
  display: flex;
  gap: 24px;
}

.cart-list {
  flex: 1;
  max-height: 550px;
  overflow: auto;
  padding: 0;
}

.cart-header {
  display: grid;
  grid-template-columns: 40px 2fr 1fr 1fr 1fr 1fr;
  gap: 16px;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #e4e7ed;
  font-size: 14px;
  color: #909399;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 10;
  border-radius: 8px 8px 0 0;
  
  .header-item {
    text-align: center;
  }
}

.cart-item {
  display: grid;
  grid-template-columns: 40px 2fr 1fr 1fr 1fr 1fr;
  gap: 16px;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
}

.item-info {
  display: flex;
  gap: 16px;
  cursor: pointer;
  
  &:hover .item-title {
    color: #409eff;
  }
}

.item-cover {
  width: 80px;
  height: 100px;
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

.item-detail {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.item-title {
  font-size: 15px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 8px;
  transition: color 0.3s;
}

.item-author {
  font-size: 13px;
  color: #909399;
}

.item-price,
.item-subtotal {
  text-align: center;
  font-size: 15px;
  color: #303133;
}

.item-subtotal {
  font-weight: 600;
  color: #f56c6c;
}

.item-quantity {
  display: flex;
  justify-content: center;
}

.item-actions {
  text-align: center;
}

.cart-summary {
  width: 300px;
  flex-shrink: 0;
  height: fit-content;
  position: sticky;
  top: 100px;
  padding: 24px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
  color: #606266;
  
  &:last-of-type {
    border-bottom: none;
    padding-bottom: 24px;
  }
}

.total-price {
  font-size: 24px;
  font-weight: 600;
  color: #f56c6c;
}

.checkout-btn {
  width: 100%;
  margin-bottom: 16px;
}

.clear-btn {
  width: 100%;
}
</style>
