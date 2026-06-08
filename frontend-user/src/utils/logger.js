/**
 * 日志工具类
 * 提供统一的日志记录功能，支持不同级别的日志输出
 * 生产环境可配置为发送到后端日志服务
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
}

// 当前日志级别，可通过环境变量配置
const currentLevel = import.meta.env.PROD ? LOG_LEVELS.WARN : LOG_LEVELS.DEBUG

// 日志存储（用于调试和问题排查）
const logHistory = []
const MAX_LOG_HISTORY = 100

function formatTime() {
  return new Date().toISOString()
}

function addToHistory(level, message, data) {
  const logEntry = {
    timestamp: formatTime(),
    level,
    message,
    data
  }
  
  logHistory.push(logEntry)
  
  // 保持日志历史在限制范围内
  if (logHistory.length > MAX_LOG_HISTORY) {
    logHistory.shift()
  }
  
  return logEntry
}

export const logger = {
  /**
   * 调试日志
   */
  debug(message, data = null) {
    if (currentLevel <= LOG_LEVELS.DEBUG) {
      const entry = addToHistory('DEBUG', message, data)
      console.log(`[${entry.timestamp}] [DEBUG] ${message}`, data || '')
    }
  },

  /**
   * 信息日志
   */
  info(message, data = null) {
    if (currentLevel <= LOG_LEVELS.INFO) {
      const entry = addToHistory('INFO', message, data)
      console.info(`[${entry.timestamp}] [INFO] ${message}`, data || '')
    }
  },

  /**
   * 警告日志
   */
  warn(message, data = null) {
    if (currentLevel <= LOG_LEVELS.WARN) {
      const entry = addToHistory('WARN', message, data)
      console.warn(`[${entry.timestamp}] [WARN] ${message}`, data || '')
    }
  },

  /**
   * 错误日志
   */
  error(message, data = null) {
    if (currentLevel <= LOG_LEVELS.ERROR) {
      const entry = addToHistory('ERROR', message, data)
      console.error(`[${entry.timestamp}] [ERROR] ${message}`, data || '')
    }
  },

  /**
   * 获取日志历史
   */
  getHistory() {
    return [...logHistory]
  },

  /**
   * 清空日志历史
   */
  clearHistory() {
    logHistory.length = 0
  }
}

export default logger
