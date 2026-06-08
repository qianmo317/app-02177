import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { logger } from '@/utils/logger'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref(null)
  const token = ref(localStorage.getItem('token') || '')

  const isLoggedIn = computed(() => !!token.value)
  const username = computed(() => userInfo.value?.username || '')

  /**
   * 模拟用户数据（Mock Data）
   * 说明：由于本项目为前端演示项目，未接入真实后端服务，
   * 用户数据存储在 localStorage 中进行模拟。
   * 生产环境应替换为真实的后端 API 调用。
   */
  function getUsers() {
    const defaultUsers = [
      { id: 1, username: 'admin', password: '123456', nickname: '管理员', phone: '13800138000', email: 'admin@example.com' },
      { id: 2, username: 'user', password: '123456', nickname: '普通用户', phone: '13900139000', email: 'user@example.com' }
    ]
    const storedUsers = localStorage.getItem('mockUsers')
    return storedUsers ? JSON.parse(storedUsers) : defaultUsers
  }

  function saveUsers(users) {
    localStorage.setItem('mockUsers', JSON.stringify(users))
  }

  /**
   * 用户登录（Mock 实现）
   */
  function login(username, password) {
    logger.info('用户登录尝试', { username })
    
    const users = getUsers()
    const user = users.find(
      u => u.username === username && u.password === password
    )
    
    if (user) {
      const mockToken = `token_${user.id}_${Date.now()}`
      token.value = mockToken
      userInfo.value = { 
        id: user.id, 
        username: user.username, 
        nickname: user.nickname,
        phone: user.phone || '',
        email: user.email || ''
      }
      localStorage.setItem('token', mockToken)
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
      
      logger.info('用户登录成功', { userId: user.id, username: user.username })
      return { success: true, message: '登录成功' }
    }
    
    logger.warn('用户登录失败', { username, reason: '用户名或密码错误' })
    return { success: false, message: '用户名或密码错误' }
  }

  /**
   * 用户注册（Mock 实现）
   */
  function register(userData) {
    logger.info('用户注册尝试', { username: userData.username })
    
    const users = getUsers()
    
    // 检查用户名是否已存在
    if (users.some(u => u.username === userData.username)) {
      logger.warn('用户注册失败', { username: userData.username, reason: '用户名已存在' })
      return { success: false, message: '用户名已存在' }
    }
    
    // 创建新用户
    const newUser = {
      id: Date.now(),
      username: userData.username,
      password: userData.password,
      nickname: userData.nickname || userData.username,
      phone: userData.phone || '',
      email: userData.email || ''
    }
    
    users.push(newUser)
    saveUsers(users)
    
    logger.info('用户注册成功', { userId: newUser.id, username: newUser.username })
    return { success: true, message: '注册成功' }
  }

  /**
   * 更新用户信息（Mock 实现）
   */
  function updateProfile(profileData) {
    logger.info('更新用户信息', { userId: userInfo.value?.id })
    
    if (!userInfo.value) {
      logger.error('更新用户信息失败', { reason: '用户未登录' })
      return { success: false, message: '请先登录' }
    }
    
    const users = getUsers()
    const userIndex = users.findIndex(u => u.id === userInfo.value.id)
    
    if (userIndex === -1) {
      logger.error('更新用户信息失败', { reason: '用户不存在' })
      return { success: false, message: '用户不存在' }
    }
    
    // 更新用户信息
    users[userIndex] = {
      ...users[userIndex],
      nickname: profileData.nickname || users[userIndex].nickname,
      phone: profileData.phone || users[userIndex].phone,
      email: profileData.email || users[userIndex].email
    }
    
    saveUsers(users)
    
    // 更新当前用户信息
    userInfo.value = {
      ...userInfo.value,
      nickname: profileData.nickname || userInfo.value.nickname,
      phone: profileData.phone || userInfo.value.phone,
      email: profileData.email || userInfo.value.email
    }
    localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
    
    logger.info('用户信息更新成功', { userId: userInfo.value.id })
    return { success: true, message: '更新成功' }
  }

  /**
   * 验证当前用户密码（Mock 实现）
   */
  function verifyPassword(password) {
    if (!userInfo.value) {
      return false
    }
    
    const users = getUsers()
    const user = users.find(u => u.id === userInfo.value.id)
    
    if (!user) {
      return false
    }
    
    return user.password === password
  }

  /**
   * 修改密码（Mock 实现）
   */
  function changePassword(oldPassword, newPassword) {
    logger.info('修改密码尝试', { userId: userInfo.value?.id })
    
    if (!userInfo.value) {
      return { success: false, message: '请先登录' }
    }
    
    const users = getUsers()
    const userIndex = users.findIndex(u => u.id === userInfo.value.id)
    
    if (userIndex === -1) {
      return { success: false, message: '用户不存在' }
    }
    
    if (users[userIndex].password !== oldPassword) {
      logger.warn('修改密码失败', { reason: '原密码错误' })
      return { success: false, message: '原密码错误' }
    }
    
    users[userIndex].password = newPassword
    saveUsers(users)
    
    logger.info('密码修改成功', { userId: userInfo.value.id })
    return { success: true, message: '密码修改成功' }
  }

  function logout() {
    logger.info('用户退出登录', { userId: userInfo.value?.id })
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }

  function initUser() {
    const savedUser = localStorage.getItem('userInfo')
    if (savedUser && token.value) {
      userInfo.value = JSON.parse(savedUser)
      logger.info('用户信息初始化', { userId: userInfo.value?.id })
    }
  }

  return {
    userInfo,
    token,
    isLoggedIn,
    username,
    login,
    register,
    updateProfile,
    verifyPassword,
    changePassword,
    logout,
    initUser
  }
})
