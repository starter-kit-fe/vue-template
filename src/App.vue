<script setup lang="ts">
import { ref } from 'vue'

import { RouterView } from 'vue-router'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import pkg from '../package.json'
import Header from '@/components/header.vue'
import { useBuildInfo } from '@/hooks/build-info'
const zIndex = ref(3000)
const size = ref<"" | "default" | "small" | "large">("small")
const locale = ref(zhCn)
const { logBuildInfo } = useBuildInfo();


logBuildInfo()
</script>

<template>
  <el-config-provider :size="size" :z-index="zIndex" :locale="locale">
    <Header />
    <RouterView />
  </el-config-provider>
</template>

<style scoped></style>
