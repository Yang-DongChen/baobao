import { createApp } from 'vue'
// 关键是下面这一行！没有它，网页就是裸奔的
import './style.css' 
import App from './App.vue'

createApp(App).mount('#app')