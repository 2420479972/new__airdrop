import { createApp } from 'vue'
import App from './App.vue'
import 'tailwindcss/tailwind.css'
import 'assets/scss/base.scss'
import { createPinia } from "pinia"
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import i18n from "@/language"
import { Buffer } from 'buffer'
import { WagmiPlugin } from '@wagmi/vue'
import { config } from './wagmi'
import 'ant-design-vue/dist/reset.css';
import Antd from 'ant-design-vue';
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import router from "@/routes";


const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const queryClient = new QueryClient()
const app = createApp(App)
app.use(i18n).use(pinia).use(router)
.use(WagmiPlugin, { config}).use(Antd).use(VueQueryPlugin, { queryClient })
.mount('#app')
globalThis.Buffer = Buffer
BigInt.prototype.toJSON = function () {
    return { $bigint: this.toString() };
};