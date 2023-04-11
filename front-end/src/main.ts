import { createApp } from 'vue'
import App from './App.vue'
import http from '@/utils/http'

window.http = http

createApp(App).mount('#app')
