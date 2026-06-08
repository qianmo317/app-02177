<template>
  <div class="book-card" @click="goToDetail">
    <div class="book-cover">
      <el-image :src="book.cover" fit="cover" lazy>
        <template #error>
          <div class="image-error">
            <el-icon :size="40"><Picture /></el-icon>
          </div>
        </template>
      </el-image>
      <div class="book-tag" v-if="discount > 0">
        <span class="discount-num">{{ discount }}</span>折
      </div>
      <div class="book-overlay">
        <el-button type="primary" round :icon="View" size="small">查看详情</el-button>
      </div>
    </div>
    
    <div class="book-info">
      <h3 class="book-title" :title="book.title">{{ book.title }}</h3>
      <p class="book-author">
        <el-icon :size="14"><User /></el-icon>
        {{ book.author }}
      </p>
      <div class="book-meta">
        <div class="book-price">
          <span class="current-price">¥{{ book.price.toFixed(2) }}</span>
          <span class="original-price" v-if="book.originalPrice > book.price">
            ¥{{ book.originalPrice.toFixed(2) }}
          </span>
        </div>
        <div class="book-sales">
          <el-icon :size="12"><Sell /></el-icon>
          {{ book.sales }}
        </div>
      </div>
    </div>
    
    <div class="book-actions">
      <el-button 
        type="primary" 
        :icon="ShoppingCart" 
        :loading="loading"
        @click.stop="handleAddToCart"
      >
        加入购物车
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ShoppingCart, Picture, User, Sell, View } from '@element-plus/icons-vue'
import { useCartStore } from '@/stores/cart'
import { ElMessage } from 'element-plus'

const props = defineProps({
  book: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const cartStore = useCartStore()
const loading = ref(false)

const discount = computed(() => {
  if (props.book.originalPrice > props.book.price) {
    return Math.round((props.book.price / props.book.originalPrice) * 10)
  }
  return 0
})

function goToDetail() {
  router.push(`/book/${props.book.id}`)
}

async function handleAddToCart() {
  loading.value = true
  
  // 网络请求
  await new Promise(resolve => setTimeout(resolve, 300))
  
  cartStore.addToCart(props.book)
  ElMessage.success('已添加到购物车')
  loading.value = false
}
</script>

<style lang="scss" scoped>
.book-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
    
    .book-overlay {
      opacity: 1;
    }
    
    .book-cover .el-image {
      transform: scale(1.05);
    }
  }
}

.book-cover {
  position: relative;
  height: 220px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
  overflow: hidden;
  
  .el-image {
    width: 100%;
    height: 100%;
    transition: transform 0.5s ease;
  }
  
  .image-error {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
    color: #c0c4cc;
  }
  
  .book-tag {
    position: absolute;
    top: 12px;
    left: 0;
    background: linear-gradient(135deg, #f56c6c 0%, #e74c3c 100%);
    color: #fff;
    padding: 4px 12px 4px 8px;
    border-radius: 0 20px 20px 0;
    font-size: 12px;
    font-weight: 500;
    box-shadow: 0 2px 8px rgba(245, 108, 108, 0.4);
    
    .discount-num {
      font-weight: 700;
      font-size: 14px;
    }
  }
  
  .book-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
}

.book-info {
  padding: 16px;
  flex: 1;
}

.book-title {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.4;
}

.book-author {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.book-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.book-price {
  display: flex;
  align-items: baseline;
  gap: 8px;
  
  .current-price {
    font-size: 20px;
    font-weight: 700;
    color: #f56c6c;
  }
  
  .original-price {
    font-size: 13px;
    color: #c0c4cc;
    text-decoration: line-through;
  }
}

.book-sales {
  font-size: 12px;
  color: #9ca3af;
  display: flex;
  align-items: center;
  gap: 4px;
  background: #f4f4f5;
  padding: 4px 8px;
  border-radius: 10px;
}

.book-actions {
  padding: 0 16px 16px;
  
  .el-button {
    width: 100%;
    border-radius: 8px;
    font-weight: 500;
  }
}
</style>
