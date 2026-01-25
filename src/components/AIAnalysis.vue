<script setup>
import { ref } from 'vue'

const isAnalyzing = ref(false)
const showResult = ref(false)
const selectedImage = ref(null)

const startAnalysis = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  selectedImage.value = URL.createObjectURL(file)
  isAnalyzing.value = true
  showResult.value = false

  // 模拟3秒的分析过程
  setTimeout(() => {
    isAnalyzing.value = false
    showResult.value = true
  }, 3000)
}
</script>

<template>
  <div class="px-5 pb-32 pt-12 animate-fade-in">
    <h1 class="text-3xl font-bold mb-2 text-white">AI 智能分析</h1>
    <p class="text-ios-gray text-sm mb-8">上传照片，分析 Baobao 的健康与品种特征</p>

    <div v-if="!isAnalyzing && !showResult" class="bg-ios-card border-2 border-dashed border-white/20 rounded-3xl h-80 flex flex-col items-center justify-center relative overflow-hidden group">
      <input type="file" class="absolute inset-0 opacity-0 cursor-pointer z-10" accept="image/*" @change="startAnalysis">
      <div class="w-20 h-20 bg-ios-blue/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-ios-blue"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
      </div>
      <p class="text-white font-medium">点击上传照片</p>
      <p class="text-ios-gray text-xs mt-2">支持 JPG, PNG 格式</p>
    </div>

    <div v-if="isAnalyzing" class="h-80 flex flex-col items-center justify-center">
      <div class="relative w-32 h-32 mb-6">
        <img :src="selectedImage" class="w-full h-full rounded-full object-cover opacity-50 blur-sm">
        <div class="absolute inset-0 border-4 border-ios-blue/30 border-t-ios-blue rounded-full animate-spin"></div>
        <div class="absolute inset-0 bg-gradient-to-b from-ios-blue/50 to-transparent animate-scan h-1/2 w-full"></div>
      </div>
      <p class="text-white text-lg animate-pulse">AI 正在分析中...</p>
      <p class="text-ios-gray text-sm mt-2">正在比对品种特征库</p>
    </div>

    <div v-if="showResult" class="animate-slide-up">
       <div class="relative h-48 rounded-3xl overflow-hidden mb-6">
         <img :src="selectedImage" class="w-full h-full object-cover">
         <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
            <div class="text-white font-bold text-xl">分析完成</div>
         </div>
       </div>

       <div class="space-y-4">
          <div class="bg-ios-card p-5 rounded-2xl border border-white/5 flex justify-between items-center">
            <div>
              <div class="text-ios-gray text-xs mb-1">识别品种</div>
              <div class="text-white font-bold text-lg">标准雪纳瑞 (Schnauzer)</div>
            </div>
            <div class="text-ios-blue font-bold">98% 符合</div>
          </div>
           <div class="bg-ios-card p-5 rounded-2xl border border-white/5 flex justify-between items-center">
            <div>
              <div class="text-ios-gray text-xs mb-1">毛发健康度</div>
              <div class="text-white font-bold text-lg">光泽度极佳</div>
            </div>
            <div class="text-ios-green font-bold">A+ 级</div>
          </div>
       </div>
       <button @click="isAnalyzing=false; showResult=false; selectedImage=null" class="w-full py-4 bg-white/10 rounded-2xl text-white mt-8 hover:bg-white/20 transition">重新分析</button>
    </div>

  </div>
</template>

<style>
/* 定义扫描动画 */
@keyframes scan {
  0% { top: 0; }
  100% { top: 100%; }
}
.animate-scan {
  animation: scan 2s linear infinite;
}
</style>