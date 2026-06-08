<template>
  <div class="home-page">
    <!-- 顶部横幅 -->
    <div class="hero-banner">
      <div class="hero-content">
        <h1>发现你的下一本好书</h1>
        <p>精选万千图书，开启阅读之旅</p>
      </div>
      <div class="hero-decoration">
        <div class="circle circle-1"></div>
        <div class="circle circle-2"></div>
        <div class="circle circle-3"></div>
      </div>
    </div>
    
    <!-- 分类筛选 -->
    <div class="category-section">
      <div class="category-header">
        <el-icon :size="20" color="#409eff"><Grid /></el-icon>
        <span class="category-title">图书分类</span>
      </div>
      <div class="category-list">
        <div
          v-for="cat in bookStore.categories"
          :key="cat"
          :class="['category-item', { active: activeCategory === cat }]"
          @click="handleCategoryChange(cat)"
        >
          {{ cat }}
        </div>
      </div>
    </div>
    
    <!-- 图书列表 -->
    <div class="books-section">
      <div class="section-header">
        <div class="section-title-wrapper">
          <div class="title-icon"></div>
          <h2 class="section-title">
            {{ activeCategory === '全部' ? '全部图书' : activeCategory }}
          </h2>
          <span class="book-count">共 {{ filteredBooks.length }} 本</span>
        </div>
        <el-select v-model="sortBy" placeholder="排序方式" class="sort-select">
          <el-option label="默认排序" value="default" />
          <el-option label="价格从低到高" value="price-asc" />
          <el-option label="价格从高到低" value="price-desc" />
          <el-option label="销量优先" value="sales" />
        </el-select>
      </div>
      
      <div class="books-grid" v-if="filteredBooks.length > 0">
        <BookCard 
          v-for="book in sortedBooks" 
          :key="book.id" 
          :book="book" 
        />
      </div>
      
      <el-empty v-else description="暂无相关图书" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Grid } from '@element-plus/icons-vue'
import { useBookStore } from '@/stores/book'
import BookCard from '@/components/BookCard.vue'

const route = useRoute()
const bookStore = useBookStore()

const activeCategory = ref('全部')
const sortBy = ref('default')

const filteredBooks = computed(() => {
  let books = bookStore.getBooksByCategory(activeCategory.value)
  
  // 搜索过滤
  const keyword = route.query.keyword
  if (keyword) {
    const lowerKeyword = keyword.toLowerCase()
    books = books.filter(
      book =>
        book.title.toLowerCase().includes(lowerKeyword) ||
        book.author.toLowerCase().includes(lowerKeyword)
    )
  }
  
  return books
})

const sortedBooks = computed(() => {
  const books = [...filteredBooks.value]
  
  switch (sortBy.value) {
    case 'price-asc':
      return books.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return books.sort((a, b) => b.price - a.price)
    case 'sales':
      return books.sort((a, b) => b.sales - a.sales)
    default:
      return books
  }
})

function handleCategoryChange(category) {
  activeCategory.value = category
}

watch(() => route.query.keyword, () => {
  activeCategory.value = '全部'
})
</script>

<style lang="scss" scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.hero-banner {
  background: linear-gradient(135deg, #409eff 0%, #2563eb 50%, #1d4ed8 100%);
  border-radius: 16px;
  padding: 48px;
  color: #fff;
  position: relative;
  overflow: hidden;
  
  .hero-content {
    position: relative;
    z-index: 1;
    
    h1 {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 12px;
      letter-spacing: 2px;
    }
    
    p {
      font-size: 16px;
      opacity: 0.9;
    }
  }
  
  .hero-decoration {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 50%;
    
    .circle {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
    }
    
    .circle-1 {
      width: 200px;
      height: 200px;
      right: -50px;
      top: -50px;
    }
    
    .circle-2 {
      width: 150px;
      height: 150px;
      right: 100px;
      bottom: -30px;
    }
    
    .circle-3 {
      width: 80px;
      height: 80px;
      right: 200px;
      top: 30px;
    }
  }
}

.category-section {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 24px;
  
  .category-header {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    
    .category-title {
      font-size: 15px;
      font-weight: 600;
      color: #303133;
    }
  }
  
  .category-list {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
  
  .category-item {
    padding: 8px 20px;
    border-radius: 20px;
    font-size: 14px;
    color: #606266;
    background: #f4f4f5;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      color: #409eff;
      background: #ecf5ff;
    }
    
    &.active {
      color: #fff;
      background: linear-gradient(135deg, #409eff 0%, #2563eb 100%);
      box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
    }
  }
}

.books-section {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.section-title-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  
  .title-icon {
    width: 4px;
    height: 24px;
    background: linear-gradient(180deg, #409eff 0%, #2563eb 100%);
    border-radius: 2px;
  }
  
  .section-title {
    font-size: 20px;
    font-weight: 600;
    color: #1f2937;
  }
  
  .book-count {
    font-size: 14px;
    color: #909399;
    background: #f4f4f5;
    padding: 4px 12px;
    border-radius: 12px;
  }
}

.sort-select {
  width: 150px;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 24px;
}
</style>
