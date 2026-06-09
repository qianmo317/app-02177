<template>
  <div class="profile-page">
    <h1 class="page-title">个人中心</h1>
    
    <div class="profile-content">
      <div class="profile-card card">
        <div class="profile-header">
          <div class="profile-info">
            <h3>你好，{{ userStore.userInfo?.username }}</h3>
          </div>
        </div>
        
        <el-tabs v-model="activeTab">
          <el-tab-pane label="基本信息" name="info">
            <el-form 
              ref="infoFormRef"
              :model="infoForm" 
              :rules="infoRules"
              label-width="80px"
              class="profile-form"
            >
              <el-form-item label="用户名">
                <el-input :value="userStore.userInfo?.username" disabled />
              </el-form-item>
              <el-form-item label="手机号" prop="phone">
                <el-input v-model="infoForm.phone" placeholder="请输入手机号" />
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="infoForm.email" placeholder="请输入邮箱" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :loading="infoLoading" @click="handleUpdateInfo">
                  保存修改
                </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          
          <el-tab-pane label="修改密码" name="password">
            <el-form 
              ref="pwdFormRef"
              :model="pwdForm" 
              :rules="pwdRules"
              label-width="100px"
              class="profile-form"
            >
              <el-form-item label="原密码" prop="oldPassword">
                <el-input 
                  v-model="pwdForm.oldPassword" 
                  type="password" 
                  placeholder="请输入原密码"
                  show-password
                />
              </el-form-item>
              <el-form-item label="新密码" prop="newPassword">
                <el-input 
                  v-model="pwdForm.newPassword" 
                  type="password" 
                  placeholder="请输入新密码"
                  show-password
                />
              </el-form-item>
              <el-form-item label="确认新密码" prop="confirmPassword">
                <el-input 
                  v-model="pwdForm.confirmPassword" 
                  type="password" 
                  placeholder="请再次输入新密码"
                  show-password
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :loading="pwdLoading" @click="handleChangePassword">
                  修改密码
                </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { UserFilled } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

const activeTab = ref('info')
const infoFormRef = ref(null)
const pwdFormRef = ref(null)
const infoLoading = ref(false)
const pwdLoading = ref(false)

const infoForm = reactive({
  phone: '',
  email: ''
})

const pwdForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const infoRules = {
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ]
}

const validateOldPassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入原密码'))
    return
  }
  // 调用 store 方法验证旧密码
  const result = userStore.verifyPassword(value)
  if (!result) {
    callback(new Error('原密码错误'))
  } else {
    callback()
  }
}

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== pwdForm.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const validateNewPassword = (rule, value, callback) => {
  if (value === pwdForm.oldPassword) {
    callback(new Error('新密码不能与旧密码相同'))
  } else {
    callback()
  }
}

const pwdRules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
    { validator: validateOldPassword, trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' },
    { validator: validateNewPassword, trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

onMounted(() => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  
  // 初始化表单数据
  infoForm.phone = userStore.userInfo?.phone || ''
  infoForm.email = userStore.userInfo?.email || ''
})

async function handleUpdateInfo() {
  if (!infoFormRef.value) return
  
  await infoFormRef.value.validate(async (valid) => {
    if (!valid) return
    
    infoLoading.value = true
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const result = userStore.updateProfile({
      phone: infoForm.phone,
      email: infoForm.email
    })
    
    infoLoading.value = false
    
    if (result.success) {
      ElMessage.success(result.message)
    } else {
      ElMessage.error(result.message)
    }
  })
}

async function handleChangePassword() {
  if (!pwdFormRef.value) return
  
  await pwdFormRef.value.validate(async (valid) => {
    if (!valid) return
    
    pwdLoading.value = true
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const result = userStore.changePassword(pwdForm.oldPassword, pwdForm.newPassword)
    
    pwdLoading.value = false
    
    if (result.success) {
      ElMessage.success(result.message + '，请重新登录')
      // 清空表单
      pwdForm.oldPassword = ''
      pwdForm.newPassword = ''
      pwdForm.confirmPassword = ''
      // 退出登录并跳转到登录页
      userStore.logout()
      router.push('/login')
    } else {
      ElMessage.error(result.message)
    }
  })
}
</script>

<style lang="scss" scoped>
.profile-page {
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
}

.profile-card {
  max-width: 600px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 24px;
  
  .profile-info {
    h3 {
      font-size: 20px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 4px;
    }
    
    p {
      font-size: 14px;
      color: #909399;
    }
  }
}

.profile-form {
  padding-top: 16px;
  max-width: 400px;
}
</style>
