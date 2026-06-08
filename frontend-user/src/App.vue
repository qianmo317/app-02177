<template>
  <div class="app-container">
    <AppHeader v-if="!isAuthPage" />
    <main class="main-content" :class="{ 'auth-page': isAuthPage }">
      <router-view />
    </main>
    <AppFooter v-if="!isAuthPage" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

const route = useRoute()

const isAuthPage = computed(() => {
  return route.path === '/login' || route.path === '/register'
})
</script>

<style lang="scss">
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

.main-content {
  flex: 1;
  padding: 24px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
  
  &.auth-page {
    max-width: 100%;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
