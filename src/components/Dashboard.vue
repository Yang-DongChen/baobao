<script setup>
import { ref } from 'vue'

// 使用网络图片作为默认头像和封面，保证不报错且美观
// 等你需要换成自己的图时，把这里的 URL 改成 '/avatar.jpg' 即可
const avatarUrl = ref('https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=200&auto=format&fit=crop')
const heroImage = 'https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=800&auto=format&fit=crop'

const fileInput = ref(null)

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleAvatarChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    avatarUrl.value = URL.createObjectURL(file)
  }
}
</script>

<template>
  <div class="px-5 pb-32 pt-12 animate-fade-in max-w-md mx-auto">
    <header class="flex justify-between items-end mb-8">
      <div>
        <h1 class="text-4xl font-extrabold tracking-tight text-white drop-shadow-md">Baba</h1>
        <p class="text-gray-400 text-sm mt-1 font-medium">雪纳瑞 · 2岁</p>
      </div>
      
      <div class="relative group" @click="triggerFileInput">
        <div class="w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-blue-500 to-purple-600">
          <img 
            :src="avatarUrl" 
            class="w-full h-full rounded-full border-2 border-black object-cover cursor-pointer" 
          />
        </div>
        <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleAvatarChange"/>
      </div>
    </header>

    <div class="relative w-full h-[400px] rounded-[36px] overflow-hidden shadow-2xl mb-8 group border border-white/10">
      <img :src="heroImage" class="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105" />
      
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
      
      <div class="absolute bottom-8 left-8">
        <div class="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-xs font-semibold mb-3 shadow-lg">
          📍 山西 · 晋中
        </div>
        <h2 class="text-3xl font-bold text-white leading-tight">阳光下的<br>午后时光</h2>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      
      <div class="bg-[#1C1C1E] rounded-3xl p-5 border border-white/5 active:scale-95 transition-transform duration-200">
        <div class="flex items-center justify-between mb-4">
          <div class="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400">🍖</div>
          <span class="text-xs text-gray-400">今日摄入</span>
        </div>
        <div class="flex items-baseline gap-1">
          <span class="text-3xl font-bold text-white">120</span>
          <span class="text-sm text-gray-500">g</span>
        </div>
        <div class="w-full bg-gray-800 h-1.5 rounded-full mt-3 overflow-hidden">
          <div class="bg-orange-500 w-[60%] h-full rounded-full"></div>
        </div>
      </div>

      <div class="bg-[#1C1C1E] rounded-3xl p-5 border border-white/5 active:scale-95 transition-transform duration-200 flex flex-col justify-between">
        <div class="flex items-center justify-between">
           <div class="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">⚡️</div>
           <span class="text-xs text-green-500 font-medium">Excellent</span>
        </div>
        <div>
          <div class="text-lg font-bold text-white mt-2">精力充沛</div>
          <p class="text-xs text-gray-500 mt-1">刚刚跑了 2km</p>
        </div>
      </div>

    </div>
  </div>
</template>