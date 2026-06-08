<template>
  <div class="book-detail-page" v-if="book">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{ book.category }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ book.title }}</el-breadcrumb-item>
    </el-breadcrumb>
    
    <div class="detail-card card">
      <div class="book-main">
        <div class="book-cover">
          <el-image :src="book.cover" fit="cover">
            <template #error>
              <div class="image-error">
                <el-icon :size="60"><Picture /></el-icon>
              </div>
            </template>
          </el-image>
        </div>
        
        <div class="book-info">
          <h1 class="book-title">{{ book.title }}</h1>
          <p class="book-author">作者：{{ book.author }}</p>
          <p class="book-category">分类：{{ book.category }}</p>
          
          <div class="price-section">
            <span class="current-price">¥{{ book.price.toFixed(2) }}</span>
            <span class="original-price" v-if="book.originalPrice > book.price">
              ¥{{ book.originalPrice.toFixed(2) }}
            </span>
            <el-tag type="danger" size="small" v-if="discount > 0">
              {{ discount }}折
            </el-tag>
          </div>
          
          <div class="book-stats">
            <span>库存：{{ book.stock }} 本</span>
            <el-divider direction="vertical" />
            <span>已售：{{ book.sales }} 本</span>
          </div>
          
          <div class="quantity-section">
            <span class="label">数量：</span>
            <el-input-number 
              v-model="quantity" 
              :min="1" 
              :max="book.stock"
              size="large"
            />
          </div>
          
          <div class="action-buttons">
            <el-button 
              type="primary" 
              size="large" 
              :icon="ShoppingCart"
              :loading="addLoading"
              @click="handleAddToCart"
            >
              加入购物车
            </el-button>
            <el-button 
              type="danger" 
              size="large"
              :loading="buyLoading"
              @click="handleBuyNow"
            >
              立即购买
            </el-button>
          </div>
        </div>
      </div>
      
      <el-divider />
      
      <div class="book-description">
        <h3>图书简介</h3>
        <p>{{ book.description }}</p>
      </div>
    </div>
  </div>
  
  <el-empty v-else description="图书不存在" />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ShoppingCart, Picture } from '@element-plus/icons-vue'
import { useBookStore } from '@/stores/book'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const bookStore = useBookStore()
const cartStore = useCartStore()
const userStore = useUserStore()

const book = ref(null)
const quantity = ref(1)
const addLoading = ref(false)
const buyLoading = ref(false)

const discount = computed(() => {
  if (book.value && book.value.originalPrice > book.value.price) {
    return Math.round((book.value.price / book.value.originalPrice) * 10)
  }
  return 0
})

onMounted(() => {
  const id = route.params.id
  book.value = bookStore.getBookById(id)
})

async function handleAddToCart() {
  addLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 300))
  
  for (let i = 0; i < quantity.value; i++) {
    cartStore.addToCart(book.value)
  }
  
  ElMessage.success(`已添加 ${quantity.value} 本到购物车`)
  addLoading.value = false
}

async function handleBuyNow() {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  
  buyLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 300))
  
  for (let i = 0; i < quantity.value; i++) {
    cartStore.addToCart(book.value)
  }
  
  buyLoading.value = false
  router.push('/cart')
}
</script>

<style lang="scss" scoped>
.book-detail-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.detail-card {
  padding: 32px;
}

.book-main {
  display: flex;
  gap: 48px;
}

.book-cover {
  flex-shrink: 0;
  width: 300px;
  height: 420px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  
  .el-image {
    width: 100%;
    height: 100%;
  }
  
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

.book-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.book-title {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
  line-height: 1.4;
}

.book-author,
.book-category {
  font-size: 15px;
  color: #606266;
}

.price-section {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 16px 0;
  border-top: 1px solid #e4e7ed;
  border-bottom: 1px solid #e4e7ed;
  
  .current-price {
    font-size: 32px;
    font-weight: 600;
    color: #f56c6c;
  }
  
  .original-price {
    font-size: 16px;
    color: #c0c4cc;
    text-decoration: line-through;
  }
}

.book-stats {
  font-size: 14px;
  color: #909399;
}

.quantity-section {
  display: flex;
  align-items: center;
  gap: 16px;
  
  .label {
    font-size: 15px;
    color: #606266;
  }
}

.action-buttons {
  display: flex;
  gap: 16px;
  margin-top: 16px;
  
  .el-button {
    padding: 12px 32px;
  }
}

.book-description {
  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 16px;
  }
  
  p {
    font-size: 15px;
    color: #606266;
    line-height: 1.8;
  }
}
</style>
