<template>
  <header class="app-header">
    <div class="header-content">
      <div class="header-left">
        <div class="logo" @click="router.push('/')">
          <div class="logo-icon">
            <el-icon :size="24" color="#fff"><Reading /></el-icon>
          </div>
          <span class="logo-text">图书商城</span>
        </div>
        
        <el-menu
          :default-active="activeMenu"
          mode="horizontal"
          :ellipsis="false"
          class="nav-menu"
          @select="handleMenuSelect"
        >
          <el-menu-item index="/">首页</el-menu-item>
          <el-sub-menu index="books">
            <template #title>图书管理</template>
            <el-menu-item index="/books">图书列表</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="orders">
            <template #title>订单管理</template>
            <el-menu-item index="/orders">订单列表</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </div>
      
      <div class="header-right">
        <div class="search-box">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索图书..."
            :prefix-icon="Search"
            clearable
            @keyup.enter="handleSearch"
            @clear="handleSearch"
          />
        </div>
        
        <div class="header-actions">
          <el-badge :value="cartStore.totalCount" :hidden="cartStore.totalCount === 0" class="cart-badge">
            <el-button class="cart-btn" @click="router.push('/cart')">
              <el-icon :size="18"><ShoppingCart /></el-icon>
              <span>购物车</span>
            </el-button>
          </el-badge>
          
          <template v-if="userStore.isLoggedIn">
            <el-dropdown @command="handleCommand">
              <div class="user-info">
                <span class="user-name">{{ userStore.userInfo?.username }}</span>
                <el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">
                    <el-icon><User /></el-icon>
                    个人中心
                  </el-dropdown-item>
                  <el-dropdown-item command="orders">
                    <el-icon><List /></el-icon>
                    我的订单
                  </el-dropdown-item>
                  <el-dropdown-item divided command="logout">
                    <el-icon><SwitchButton /></el-icon>
                    退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Search, ShoppingCart, User, ArrowDown, Reading, List, SwitchButton } from '@element-plus/icons-vue'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const cartStore = useCartStore()
const userStore = useUserStore()

const searchKeyword = ref('')

const activeMenu = computed(() => {
  return route.path
})

function handleMenuSelect(index) {
  router.push(index)
}

function handleSearch() {
  router.push({
    path: '/',
    query: searchKeyword.value ? { keyword: searchKeyword.value } : {}
  })
}

function handleCommand(command) {
  if (command === 'profile') {
    router.push('/profile')
  } else if (command === 'orders') {
    router.push('/orders')
  } else if (command === 'logout') {
    userStore.logout()
    ElMessage.success('已退出登录')
    router.push('/login')
  }
}
</script>

<style lang="scss" scoped>
.app-header {
  background: #fff;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 32px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  flex-shrink: 0;
  
  .logo-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #409eff 0%, #2563eb 100%);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  }
  
  .logo-text {
    font-size: 20px;
    font-weight: 700;
    background: linear-gradient(135deg, #409eff 0%, #2563eb 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}

.nav-menu {
  border-bottom: none;
  
  :deep(.el-menu-item),
  :deep(.el-sub-menu__title) {
    height: 64px;
    line-height: 64px;
    font-size: 15px;
    
    &:hover {
      color: #409eff;
      background: transparent;
    }
  }
  
  :deep(.el-menu-item.is-active) {
    font-weight: 600;
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.search-box {
  width: 260px;
  
  :deep(.el-input__wrapper) {
    border-radius: 20px;
    background: #f4f4f5;
    box-shadow: none;
    
    &:hover, &.is-focus {
      background: #fff;
      box-shadow: 0 0 0 1px #409eff;
    }
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.cart-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  border-radius: 20px;
  padding: 8px 16px;
  border: 1px solid #e4e7ed;
  background: #fff;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #409eff;
    color: #409eff;
    background: #ecf5ff;
  }
}

.cart-badge {
  :deep(.el-badge__content) {
    top: 6px;
    right: 10px;
  }
}

.user-info {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 20px;
  transition: all 0.3s ease;
  
  &:hover {
    background: #f4f4f5;
  }
  
  .user-name {
    font-size: 14px;
    font-weight: 500;
    color: #303133;
  }
}
</style>
