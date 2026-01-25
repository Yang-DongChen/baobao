<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, EffectCards } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-cards';

const modules = [Autoplay, EffectCards];

// 使用网络图片，保证你一打开就有东西看
const photos = [
  'https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=600&fit=crop', // 图1
  'https://images.unsplash.com/photo-1554693190-383dd5302125?q=80&w=600&fit=crop', // 图2
  'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=600&fit=crop', // 图3
  'https://images.unsplash.com/photo-1591946614720-90a587da4a36?q=80&w=600&fit=crop', // 图4
];
</script>

<template>
  <div class="h-screen flex flex-col justify-center items-center bg-black animate-fade-in relative overflow-hidden">
    
    <div class="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-black pointer-events-none"></div>

    <div class="text-center mb-8 z-10">
      <h1 class="text-3xl font-bold text-white">成长瞬间</h1>
      <p class="text-gray-500 text-sm mt-2">左右滑动查看更多</p>
    </div>
    
    <div class="w-full max-w-xs z-10">
      <swiper
        :effect="'cards'"
        :grabCursor="true"
        :modules="modules"
        :autoplay="{ delay: 2500, disableOnInteraction: false }"
        :loop="true"
        class="w-[280px] h-[420px]"
      >
        <swiper-slide v-for="(photo, index) in photos" :key="index" class="rounded-3xl overflow-hidden shadow-2xl border-4 border-[#1C1C1E]">
          <img :src="photo" class="w-full h-full object-cover" />
        </swiper-slide>
      </swiper>
    </div>

  </div>
</template>

<style>
/* 强制覆盖 Swiper 的背景色，避免白色闪烁 */
.swiper-slide {
  background-color: #1C1C1E;
}
</style>