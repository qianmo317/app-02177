<template>
  <div class="register-page">
    <div class="register-container">
      <!-- 左侧品牌区 -->
      <div class="brand-section">
        <div class="brand-content">
          <div class="logo-wrapper">
            <el-icon :size="72" color="#fff"><Reading /></el-icon>
          </div>
          <h1>图书购物商城</h1>
          <p class="slogan">加入我们 · 开启阅读之旅</p>
        </div>
        <div class="brand-footer">
          <p>© 2024 图书商城 版权所有</p>
        </div>
      </div>
      
      <!-- 右侧注册区 -->
      <div class="form-section">
        <div class="form-container">
          <div class="form-header">
            <h2>创建账号</h2>
            <p>填写信息完成注册</p>
          </div>
          
          <el-form 
            ref="formRef"
            :model="form" 
            :rules="rules" 
            label-position="top"
            class="register-form"
            @submit.prevent="handleRegister"
          >
            <el-form-item prop="username">
              <el-input 
                v-model="form.username" 
                placeholder="请输入用户名"
                size="large"
                class="custom-input"
              >
                <template #prefix>
                  <el-icon><User /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            
            <el-form-item prop="password">
              <el-input 
                v-model="form.password" 
                type="password" 
                placeholder="请输入密码"
                size="large"
                show-password
                class="custom-input"
              >
                <template #prefix>
                  <el-icon><Lock /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            
            <el-form-item prop="confirmPassword">
              <el-input 
                v-model="form.confirmPassword" 
                type="password" 
                placeholder="请再次输入密码"
                size="large"
                show-password
                class="custom-input"
                @keyup.enter="handleRegister"
              >
                <template #prefix>
                  <el-icon><Lock /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            
            <el-form-item>
              <el-button 
                type="primary" 
                size="large" 
                class="register-btn"
                :loading="loading"
                @click="handleRegister"
              >
                <span v-if="!loading">注 册</span>
                <span v-else>注册中...</span>
              </el-button>
            </el-form-item>
          </el-form>
          
          <div class="form-footer">
            <span>已有账号？</span>
            <el-button type="primary" link @click="router.push('/login')">
              立即登录
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock, Reading } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

const formRef = ref(null)
const loading = ref(false)

const form = reactive({
  username: '',
  password: '',
  confirmPassword: ''
})

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== form.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度为3-20个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

async function handleRegister() {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    
    loading.value = true
    
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const result = userStore.register({
      username: form.username,
      password: form.password
    })
    
    loading.value = false
    
    if (result.success) {
      ElMessage.success(result.message)
      router.push('/login')
    } else {
      ElMessage.error(result.message)
    }
  })
}
</script>

<style lang="scss" scoped>
.register-page {
  min-height: 100vh;
  background: #f0f2f5;
}

.register-container {
  display: flex;
  min-height: 100vh;
}

.brand-section {
  flex: 1;
  min-width: 500px;
  background: linear-gradient(135deg, #409eff 0%, #2563eb 50%, #1d4ed8 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  color: #fff;
  text-align: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    opacity: 0.5;
  }
}

.brand-content {
  position: relative;
  z-index: 1;
}

.logo-wrapper {
  width: 120px;
  height: 120px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 40px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.brand-section h1 {
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 16px;
  letter-spacing: 4px;
}

.slogan {
  font-size: 18px;
  opacity: 0.9;
  letter-spacing: 6px;
}

.brand-footer {
  position: absolute;
  bottom: 40px;
  
  p {
    font-size: 13px;
    opacity: 0.6;
  }
}

.form-section {
  width: 520px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
}

.form-container {
  width: 100%;
  max-width: 380px;
}

.form-header {
  margin-bottom: 40px;
  
  h2 {
    font-size: 28px;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 8px;
  }
  
  p {
    font-size: 15px;
    color: #6b7280;
  }
}

.register-form {
  :deep(.el-form-item) {
    margin-bottom: 20px;
  }
  
  :deep(.el-form-item__label) {
    display: none;
  }
}

.custom-input {
  :deep(.el-input__wrapper) {
    padding: 4px 16px;
    border-radius: 12px;
    box-shadow: 0 0 0 1px #e5e7eb;
    transition: all 0.3s ease;
    
    &:hover {
      box-shadow: 0 0 0 1px #409eff;
    }
    
    &.is-focus {
      box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.3);
    }
  }
  
  :deep(.el-input__inner) {
    height: 48px;
    font-size: 15px;
  }
  
  :deep(.el-input__prefix) {
    font-size: 18px;
    color: #9ca3af;
  }
}

.register-btn {
  width: 100%;
  height: 52px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  letter-spacing: 4px;
  background: linear-gradient(135deg, #409eff 0%, #2563eb 100%);
  border: none;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(64, 158, 255, 0.35);
  }
  
  &:active {
    transform: translateY(0);
  }
}

.form-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-top: 24px;
  font-size: 14px;
  color: #6b7280;
}

@media (max-width: 1024px) {
  .brand-section {
    display: none;
  }
  
  .form-section {
    width: 100%;
  }
}
</style>
