<template>
  <div class="books-page">
    <div class="page-header">
      <h1 class="page-title">图书列表</h1>
      <div class="header-actions">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索图书名称/作者"
          :prefix-icon="Search"
          clearable
          style="width: 240px"
          @input="handleSearch"
        />
        <el-select v-model="filterCategory" placeholder="分类筛选" clearable style="width: 140px">
          <el-option 
            v-for="cat in bookStore.categories.filter(c => c !== '全部')" 
            :key="cat" 
            :label="cat" 
            :value="cat" 
          />
        </el-select>
      </div>
    </div>
    
    <div class="books-table card">
      <el-table :data="filteredBooks" stripe style="width: 100%">
        <el-table-column label="封面" width="100" align="center">
          <template #default="{ row }">
            <el-image :src="row.cover" fit="cover" class="book-cover">
              <template #error>
                <div class="image-error">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="书名" min-width="180" align="center">
          <template #default="{ row }">
            <span class="book-title" @click="goToDetail(row.id)">{{ row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="author" label="作者" width="140" align="center" />
        <el-table-column prop="category" label="分类" width="100" align="center">
          <template #default="{ row }">
            <el-tag size="small">{{ row.category }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格" width="100" align="center">
          <template #default="{ row }">
            <span class="price">¥{{ row.price.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="80" align="center" />
        <el-table-column prop="sales" label="销量" width="80" align="center" sortable />
        <el-table-column label="操作" width="160" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" text @click="goToDetail(row.id)">
              查看
            </el-button>
            <el-button 
              type="success" 
              text 
              :loading="addingId === row.id"
              @click="handleAddToCart(row)"
            >
              加购
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Picture } from '@element-plus/icons-vue'
import { useBookStore } from '@/stores/book'
import { useCartStore } from '@/stores/cart'
import { ElMessage } from 'element-plus'

const router = useRouter()
const bookStore = useBookStore()
const cartStore = useCartStore()

const searchKeyword = ref('')
const filterCategory = ref('')
const addingId = ref(null)

const filteredBooks = computed(() => {
  let books = bookStore.books
  
  if (filterCategory.value) {
    books = books.filter(book => book.category === filterCategory.value)
  }
  
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    books = books.filter(
      book =>
        book.title.toLowerCase().includes(keyword) ||
        book.author.toLowerCase().includes(keyword)
    )
  }
  
  return books
})

function handleSearch() {
  // 搜索由 computed 自动处理
}

function goToDetail(id) {
  router.push(`/book/${id}`)
}

async function handleAddToCart(book) {
  addingId.value = book.id
  await new Promise(resolve => setTimeout(resolve, 300))
  cartStore.addToCart(book)
  ElMessage.success('已添加到购物车')
  addingId.value = null
}
</script>

<style lang="scss" scoped>
.books-page {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }
  
  .page-title {
    font-size: 24px;
    font-weight: 600;
    color: #303133;
  }
  
  .header-actions {
    display: flex;
    gap: 12px;
  }
}

.card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.book-cover {
  width: 50px;
  height: 70px;
  border-radius: 4px;
  
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

.book-title {
  color: #409eff;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
}

.price {
  color: #f56c6c;
  font-weight: 600;
}
</style>
