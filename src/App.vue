<script setup>
import { ref, computed, onUnmounted, reactive } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, EffectCards } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-cards';

// ---------------- 1. 全局状态与配置 ----------------
const currentTab = ref('home')
const swiperModules = [Autoplay, EffectCards];

// 本地图片资源
const heroImageLocal = ref('/baba-hero.jpg')
const avatar = ref('/avatar.jpg') 

// 🔥 相册数据修改 🔥
// 1. 删除了网络占位图。
// 2. 仅保留本地路径作为示例。请确保你的 public 文件夹里有这些照片，或者使用下方的“添加照片”按钮上传。
const photos = ref([
  '/photo1.jpg',
  '/photo2.jpg',
  '/photo3.jpg',
]);

// ---------------- 2. 核心数据：抱抱的档案 ----------------
const profile = reactive({
  name: '抱抱',
  birthday: '2024-07-10', 
  weight: '7.5',
  gender: 'male', 
  breed: '雪纳瑞'
})

// 核心数据：健康记录列表
const healthRecords = ref([]) 

// ---------------- 3. 智能计算逻辑 ----------------
// 计算年龄
const ageDisplay = computed(() => {
  if (!profile.birthday) return '未知年龄'
  const birth = new Date(profile.birthday)
  const now = new Date()
  let years = now.getFullYear() - birth.getFullYear()
  let months = now.getMonth() - birth.getMonth()
  if (months < 0) { years--; months += 12 }
  if (years > 0) return `${years}岁 ${months}个月`
  return `${months}个月`
})

// 洗澡数据计算
const lastShowerRecord = computed(() => {
  const showers = healthRecords.value.filter(r => r.type === 'shower')
  if (showers.length === 0) return null
  return showers.sort((a, b) => new Date(b.date) - new Date(a.date))[0]
})
const showerStatus = computed(() => {
  if (!lastShowerRecord.value) return { days: '-', text: '暂无记录', date: '去添加' }
  const diffDays = Math.floor((new Date() - new Date(lastShowerRecord.value.date)) / (1000 * 60 * 60 * 24))
  return { days: diffDays >= 0 ? diffDays : 0, text: '距离上次', date: lastShowerRecord.value.date }
})

// 驱虫数据计算
const lastDewormRecord = computed(() => {
  const deworms = healthRecords.value.filter(r => r.type === 'deworm')
  if (deworms.length === 0) return null
  return deworms.sort((a, b) => new Date(b.date) - new Date(a.date))[0]
})
const dewormStatus = computed(() => {
  if (!lastDewormRecord.value) return { days: '-', text: '暂无记录', date: '去添加' }
  const diffDays = Math.floor((new Date() - new Date(lastDewormRecord.value.date)) / (1000 * 60 * 60 * 24))
  return { days: diffDays >= 0 ? diffDays : 0, text: '距离上次', date: lastDewormRecord.value.date }
})

// ---------------- 4. 功能逻辑 ----------------
// 头像更换
const fileInput = ref(null)
const triggerFileInput = () => fileInput.value.click()
const handleAvatarChange = (event) => {
  const file = event.target.files[0]
  if (file) avatar.value = URL.createObjectURL(file)
}
const handleDashboardAvatarClick = () => { currentTab.value = 'health' }

// 相册上传功能
const galleryInput = ref(null)
const triggerGalleryUpload = () => galleryInput.value.click()
const handleGalleryUpload = (event) => {
  const files = event.target.files
  if (files && files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      photos.value.unshift(URL.createObjectURL(file))
    }
  }
}

// 计时器逻辑
const isAway = ref(false)
const startTime = ref(0)
const waitDuration = ref('00:00')
let timerInterval = null          
const toggleStatus = () => {
  if (isAway.value) { isAway.value = false; clearInterval(timerInterval); waitDuration.value = '00:00' } 
  else { isAway.value = true; startTime.value = Date.now(); updateTimer(); timerInterval = setInterval(updateTimer, 1000) }
}
const updateTimer = () => {
  const diff = Date.now() - startTime.value
  const hours = Math.floor(diff / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)
  if (hours > 0) waitDuration.value = `${hours}小时 ${minutes}分`
  else waitDuration.value = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}
onUnmounted(() => { if (timerInterval) clearInterval(timerInterval) })

// 图片备忘录
const showMemoEditor = ref(false)
const memoText = ref('')
const savedMemo = ref('')
const openMemoEditor = () => { memoText.value = savedMemo.value; showMemoEditor.value = true }
const saveMemo = () => { savedMemo.value = memoText.value; showMemoEditor.value = false }

// 喂食提醒
const isFed = ref(false)
const feedingStatus = computed(() => isFed.value ? "今日已喂饱" : (new Date().getHours() < 8 ? "等待早餐" : "记得喂食!"))
const toggleFeed = () => isFed.value = !isFed.value

// 添加健康记录
const showAddRecordModal = ref(false)
const newRecord = reactive({ type: 'deworm', date: '', title: '', note: '' })
const openAddRecord = () => {
  const today = new Date().toISOString().split('T')[0]
  newRecord.date = today; newRecord.title = ''; newRecord.note = ''; showAddRecordModal.value = true
}
const saveNewRecord = () => {
  if (!newRecord.title) { alert('请输入标题'); return }
  healthRecords.value.unshift({ id: Date.now(), ...newRecord })
  showAddRecordModal.value = false
}
const deleteRecord = (id) => {
  if(confirm('确定要删除这条记录吗？')) healthRecords.value = healthRecords.value.filter(r => r.id !== id)
}
</script>

<template>
  <div class="min-h-screen bg-[#F5F5F7] text-gray-900 font-sans select-none relative overflow-hidden">
    
    <div v-if="currentTab === 'home'" class="animate-fade-in px-5 pt-12 pb-28 min-h-screen overflow-y-auto">
      <header class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-3xl font-extrabold tracking-tight text-black">下午好</h1>
          <p class="text-gray-500 text-sm mt-1">今天也要好好照顾{{ profile.name }}哦</p>
        </div>
        <div class="relative group cursor-pointer" @click="handleDashboardAvatarClick">
          <div class="w-12 h-12 rounded-full border-2 border-white shadow-md overflow-hidden ring-2 ring-transparent group-hover:ring-blue-400 transition-all">
            <img :src="avatar" class="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      <div class="relative w-full rounded-[32px] p-6 mb-8 overflow-hidden transition-all duration-500 shadow-xl" 
           :class="isAway ? 'bg-orange-500 text-white' : 'bg-white text-gray-900'">
        <div class="absolute inset-0 opacity-10 pointer-events-none" :class="isAway ? 'bg-[url(https://www.transparenttextures.com/patterns/cubes.png)]' : 'bg-gradient-to-br from-blue-50 to-transparent'"></div>
        <div class="relative z-10 flex flex-col items-center text-center">
          <div class="text-[10px] mb-3 uppercase tracking-widest font-bold opacity-60">{{ isAway ? 'WAITING TIME' : 'CURRENT STATUS' }}</div>
          <div class="mb-6 min-h-[60px] flex items-center justify-center">
             <div v-if="isAway" class="animate-pulse">
                <div class="text-6xl font-bold font-mono tabular-nums tracking-tighter drop-shadow-md">{{ waitDuration }}</div>
                <p class="text-sm opacity-80 mt-2 font-medium">{{ profile.name }}正在独自等待...</p>
             </div>
             <div v-else>
                <div class="text-3xl font-bold text-blue-500">🏡 在家陪伴中</div>
                <p class="text-sm text-gray-400 mt-2">享受与{{ profile.name }}的亲密时光</p>
             </div>
          </div>
          <button @click="toggleStatus" 
            class="w-full py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 shadow-md flex items-center justify-center gap-2" 
            :class="isAway ? 'bg-white text-orange-600 hover:bg-orange-50' : 'bg-blue-500 text-white hover:bg-blue-600'">
            <span v-if="isAway">🏠 我回来了</span>
            <span v-else>🚪 我要出门</span>
          </button>
        </div>
      </div>

      <div class="mb-6 relative group">
        <h3 class="text-lg font-bold mb-4 ml-1 text-gray-800">今日备忘</h3>
        <div @click="openMemoEditor" class="relative w-full h-64 rounded-[28px] overflow-hidden shadow-lg cursor-pointer active:scale-[0.98] transition-transform bg-white">
          <img :src="heroImageLocal" class="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          <div class="absolute bottom-5 left-5 right-5">
            <div v-if="savedMemo" class="animate-fade-in">
              <div class="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold mb-2 uppercase tracking-wide text-white border border-white/30">📝 Memo</div>
              <p class="text-xl font-bold text-white leading-tight line-clamp-3 mt-2 drop-shadow-md">{{ savedMemo }}</p>
            </div>
            <div v-else class="flex items-center text-white/80">
              <span class="text-sm font-medium">点击添加今日关于{{ profile.name }}的备忘...</span>
            </div>
          </div>
        </div>
        <div v-if="showMemoEditor" class="absolute inset-0 z-20 bg-white/90 backdrop-blur-md rounded-[28px] flex flex-col items-center justify-center p-6 animate-fade-in" @click.stop>
          <h4 class="text-lg font-bold mb-4 text-gray-900">编辑备忘</h4>
          <textarea v-model="memoText" rows="4" class="w-full bg-gray-100 border border-gray-200 rounded-2xl p-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none resize-none mb-4" placeholder="写下今天需要记住的事情..."></textarea>
          <div class="flex gap-3 w-full">
            <button @click="showMemoEditor = false" class="flex-1 py-3 rounded-xl bg-gray-200 text-gray-600 font-bold">取消</button>
            <button @click="saveMemo" class="flex-1 py-3 rounded-xl bg-blue-500 text-white font-bold shadow-lg shadow-blue-200">保存</button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div @click="toggleFeed" class="rounded-3xl p-5 shadow-sm border transition-all duration-300 relative overflow-hidden bg-white" 
             :class="isFed ? 'border-green-400 ring-2 ring-green-100' : 'border-gray-100 active:scale-95'">
          <div class="flex justify-between items-start mb-4 relative z-10">
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl transition-colors shadow-sm" :class="isFed ? 'bg-green-500 text-white' : 'bg-orange-100 text-orange-500'">{{ isFed ? '✓' : '🍖' }}</div>
            <span class="text-[10px] font-mono font-bold" :class="isFed ? 'text-green-600' : 'text-gray-400'">08:00 AM</span>
          </div>
          <div class="relative z-10">
            <div class="text-xl font-bold" :class="isFed ? 'text-green-600' : 'text-gray-900'">{{ feedingStatus }}</div>
          </div>
          <div v-if="isFed" class="absolute inset-0 bg-green-50 pointer-events-none"></div>
        </div>

        <div @click="currentTab = 'health'" class="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 active:scale-95 transition-transform cursor-pointer relative">
          <div class="flex justify-between items-start mb-4">
             <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center text-xl shadow-sm">🚿</div>
             <span class="px-2 py-1 rounded-md text-[10px] font-bold bg-gray-100 text-gray-400">{{ showerStatus.days }}天</span>
          </div>
          <div>
            <div class="text-xs text-gray-400 font-bold">{{ showerStatus.text }}洗澡</div>
            <div class="text-xl font-bold text-gray-900 mt-0.5">{{ showerStatus.date }}</div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="currentTab === 'health'" class="animate-fade-in px-5 pt-12 pb-28 min-h-screen overflow-y-auto">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-3xl font-extrabold text-gray-900">健康档案</h2>
        <button @click="openAddRecord" class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-200 active:scale-90 transition">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </button>
      </div>

      <div class="bg-white rounded-[32px] p-6 shadow-xl shadow-gray-100 border border-gray-50 mb-8 relative overflow-hidden">
        <div class="flex items-center gap-5 mb-6">
          <div class="relative group cursor-pointer" @click="triggerFileInput">
            <div class="w-20 h-20 rounded-full border-4 border-gray-50 overflow-hidden shadow-inner">
              <img :src="avatar" class="w-full h-full object-cover" />
            </div>
            <div class="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition rounded-full">
               <span class="text-white text-xs">更换</span>
            </div>
            <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleAvatarChange" />
          </div>
          <div class="flex-1">
            <input v-model="profile.name" class="bg-transparent text-2xl font-bold text-gray-900 w-full border-b border-transparent focus:border-blue-500 focus:outline-none placeholder-gray-300" placeholder="名字" />
            <div class="text-gray-500 text-sm mt-1 flex items-center gap-2">
              <span class="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs font-bold">{{ ageDisplay }}</span>
              <input v-model="profile.breed" class="bg-transparent text-xs text-gray-400 w-20 border-b border-transparent focus:border-gray-300 focus:outline-none" />
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
           <div>
             <label class="text-[10px] text-gray-400 uppercase font-bold tracking-wider">生日 Birthday</label>
             <input type="date" v-model="profile.birthday" class="w-full bg-gray-50 rounded-lg px-2 py-1 text-gray-900 font-medium mt-1 focus:outline-none focus:ring-1 focus:ring-blue-300 cursor-pointer" />
           </div>
           <div>
             <label class="text-[10px] text-gray-400 uppercase font-bold tracking-wider">体重 Weight (kg)</label>
             <div class="flex items-center gap-1 mt-1 bg-gray-50 rounded-lg px-2 py-1">
               <input type="number" v-model="profile.weight" step="0.1" class="w-16 bg-transparent text-gray-900 font-medium focus:outline-none text-center" />
               <span class="text-xs text-gray-400">kg</span>
             </div>
           </div>
        </div>
      </div>

      <h3 class="text-lg font-bold mb-4 ml-1 flex items-center gap-2 text-gray-800">
        <span class="w-2 h-6 bg-blue-500 rounded-full"></span>
        医疗记录
      </h3>
      
      <div class="space-y-6 pl-4 border-l-2 border-gray-200 ml-3 pb-10">
        <div v-for="record in healthRecords" :key="record.id" class="relative pl-8 group">
           <div class="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm transition-colors"
                :class="record.type === 'vaccine' ? 'bg-green-500' : (record.type === 'deworm' ? 'bg-blue-500' : 'bg-orange-500')"></div>
           <div class="flex justify-between items-start mb-1">
             <div class="text-xs text-gray-400 font-mono font-bold">{{ record.date }}</div>
             <button @click="deleteRecord(record.id)" class="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">删除</button>
           </div>
           <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
             <div class="font-bold text-gray-900">{{ record.title }}</div>
             <div class="text-sm text-gray-500 mt-1">{{ record.note }}</div>
             <div class="mt-2 inline-flex items-center px-2 py-1 rounded text-[10px] font-bold"
               :class="record.type === 'vaccine' ? 'bg-green-50 text-green-600' : (record.type === 'deworm' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600')">
               {{ record.type === 'vaccine' ? '💉 疫苗' : (record.type === 'deworm' ? '🛡️ 驱虫' : '🚿 洗澡') }}
             </div>
           </div>
        </div>
        <div v-if="healthRecords.length === 0" class="pl-8 text-gray-400 text-sm py-4 italic">
          暂无记录，点击右上角 + 为抱抱添加第一条记录吧
        </div>
      </div>
      
      <div v-if="showAddRecordModal" class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in" @click.self="showAddRecordModal = false">
        <div class="bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl">
          <h3 class="text-xl font-bold mb-6 text-center text-gray-900">添加新记录</h3>
          <div class="space-y-4">
            <div>
              <label class="text-xs text-gray-400 font-bold ml-1">类型</label>
              <div class="flex gap-2 mt-1">
                <button @click="newRecord.type = 'vaccine'" class="flex-1 py-2 rounded-xl text-xs font-bold border transition-colors" :class="newRecord.type==='vaccine' ? 'bg-green-50 border-green-500 text-green-600' : 'border-gray-200 text-gray-500'">疫苗</button>
                <button @click="newRecord.type = 'deworm'" class="flex-1 py-2 rounded-xl text-xs font-bold border transition-colors" :class="newRecord.type==='deworm' ? 'bg-blue-50 border-blue-500 text-blue-600' : 'border-gray-200 text-gray-500'">驱虫</button>
                <button @click="newRecord.type = 'shower'" class="flex-1 py-2 rounded-xl text-xs font-bold border transition-colors" :class="newRecord.type==='shower' ? 'bg-orange-50 border-orange-500 text-orange-600' : 'border-gray-200 text-gray-500'">洗澡</button>
              </div>
            </div>
            <div>
              <label class="text-xs text-gray-400 font-bold ml-1">日期</label>
              <input type="date" v-model="newRecord.date" class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 mt-1 outline-none focus:border-blue-500">
            </div>
            <div>
              <label class="text-xs text-gray-400 font-bold ml-1">标题</label>
              <input v-model="newRecord.title" placeholder="例如：在家洗香香" class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 mt-1 outline-none focus:border-blue-500 placeholder-gray-300">
            </div>
            <div>
              <label class="text-xs text-gray-400 font-bold ml-1">备注</label>
              <textarea v-model="newRecord.note" placeholder="选填：用药品牌、体重等" rows="3" class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 mt-1 outline-none focus:border-blue-500 resize-none placeholder-gray-300"></textarea>
            </div>
          </div>
          <button @click="saveNewRecord" class="w-full bg-blue-500 text-white font-bold py-4 rounded-2xl mt-6 active:scale-95 transition shadow-lg shadow-blue-200">保存记录</button>
        </div>
      </div>
    </div>

    <div v-if="currentTab === 'gallery'" class="fixed inset-0 z-0 bg-[#F5F5F7] flex flex-col items-center justify-center animate-fade-in pb-20">
      <h2 class="text-2xl font-bold mb-6 text-gray-900">抱抱的成长瞬间</h2>
      
      <div class="w-full max-w-xs relative group">
        <swiper :effect="'cards'" :grabCursor="true" :modules="swiperModules" :loop="true" class="w-[280px] h-[400px]">
          <swiper-slide v-for="(img, index) in photos" :key="index" class="rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-black">
            <img :src="img" class="w-full h-full object-contain" />
          </swiper-slide>
        </swiper>
      </div>
      
      <p class="mt-8 text-gray-400 text-xs">左右滑动查看更多</p>
      
      <button @click="triggerGalleryUpload" class="mt-6 flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 shadow-lg rounded-full text-blue-500 font-bold active:scale-95 transition">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        添加照片
      </button>
      <input type="file" ref="galleryInput" class="hidden" multiple accept="image/*" @change="handleGalleryUpload" />
    </div>

    <nav class="fixed bottom-8 left-6 right-6 h-16 bg-white/80 backdrop-blur-xl border border-white/40 rounded-full flex justify-around items-center px-2 z-50 shadow-2xl shadow-gray-200/50">
      <button @click="currentTab = 'home'" class="w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300" 
              :class="currentTab === 'home' ? 'bg-gray-900 text-white scale-110 shadow-lg' : 'text-gray-400 hover:text-gray-600'">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      </button>
      <button @click="currentTab = 'gallery'" class="w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300" 
              :class="currentTab === 'gallery' ? 'bg-blue-500 text-white scale-110 shadow-lg shadow-blue-200' : 'text-gray-400 hover:text-gray-600'">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
      </button>
      <button @click="currentTab = 'health'" class="w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300" 
              :class="currentTab === 'health' ? 'bg-green-500 text-white scale-110 shadow-lg shadow-green-200' : 'text-gray-400 hover:text-gray-600'">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
      </button>
    </nav>
  </div>
</template>

<style>
.animate-fade-in { animation: fadeIn 0.5s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>