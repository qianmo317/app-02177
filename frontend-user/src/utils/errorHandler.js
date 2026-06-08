/**
 * 全局错误处理工具
 * 提供统一的错误捕获和处理机制
 */

import { ElMessage } from 'element-plus'
import { logger } from './logger'

/**
 * 初始化全局错误处理
 */
export function setupErrorHandler(app) {
  // Vue 错误处理
  app.config.errorHandler = (err, instance, info) => {
    logger.error('Vue Error', {
      message: err.message,
      stack: err.stack,
      info,
      component: instance?.$options?.name || 'Unknown'
    })
    
    ElMessage.error('操作失败，请稍后重试')
  }

  // Vue 警告处理（仅开发环境）
  if (import.meta.env.DEV) {
    app.config.warnHandler = (msg, instance, trace) => {
      logger.warn('Vue Warning', {
        message: msg,
        component: instance?.$options?.name || 'Unknown',
        trace
      })
    }
  }

  // 全局未捕获的 Promise 错误
  window.addEventListener('unhandledrejection', (event) => {
    logger.error('Unhandled Promise Rejection', {
      reason: event.reason?.message || event.reason,
      stack: event.reason?.stack
    })
    
    event.preventDefault()
  })

  // 全局 JavaScript 错误
  window.addEventListener('error', (event) => {
    logger.error('Global Error', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    })
  })
}

/**
 * 包装异步函数，统一处理错误
 */
export function withErrorHandler(fn, errorMessage = '操作失败') {
  return async (...args) => {
    try {
      return await fn(...args)
    } catch (error) {
      logger.error('Async Error', {
        message: error.message,
        stack: error.stack
      })
      
      ElMessage.error(errorMessage)
      throw error
    }
  }
}

export default {
  setupErrorHandler,
  withErrorHandler
}
