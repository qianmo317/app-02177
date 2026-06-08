<template>
  <footer class="app-footer">
    <div class="footer-content">
      <div class="footer-main">
        <div class="footer-brand">
          <div class="brand-logo">
            <el-icon :size="20" color="#fff"><Reading /></el-icon>
          </div>
          <span class="brand-name">图书购物商城</span>
        </div>
        <div class="footer-slogan">发现好书 · 享受阅读 · 品味生活</div>
      </div>
      <div class="footer-divider"></div>
      <div class="copyright">
        © 2024 图书商城 版权所有 | 用心为您提供优质阅读体验
      </div>
    </div>
  </footer>
</template>

<script setup>
import { Reading } from '@element-plus/icons-vue'
</script>

<style lang="scss" scoped>
.app-footer {
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  border-top: 1px solid #e4e7ed;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px 24px;
  text-align: center;
}

.footer-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  
  .brand-logo {
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, #409eff 0%, #2563eb 100%);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  }
  
  .brand-name {
    font-size: 18px;
    font-weight: 700;
    background: linear-gradient(135deg, #409eff 0%, #2563eb 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}

.footer-slogan {
  font-size: 13px;
  color: #6b7280;
  letter-spacing: 2px;
}

.footer-divider {
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #409eff, transparent);
  margin: 0 auto 20px;
}

.copyright {
  color: #9ca3af;
  font-size: 12px;
}
</style>
