<template>
  <a-config-provider :locale="zhCN">
  <a-layout class="h-full bg-[#1E1F24]">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" :width="266" collapsible>
      <div
          class="h-[36px] w-full text-[14px] border-b-[2px] border-solid border-[#43454E] mb-[14px] px-[10px] flex items-center text-[#fff]">
        AUC
      </div>
      <a-menu v-model:selectedKeys="selectedKeys" class="menu" mode="inline" theme="dark" @select="menuSelected">
          <a-menu-item :key="item.path" v-for="item in menuList">
            <span>{{item.meta.title}}</span>
          </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="header">
        <div class="px-[8px] flex items-center h-full gap-x-[5px]">
          <a-input  readonly class="w-[170px] h-[21px] rounded-md border-solid border-[1px] border-[#AEADBF] px-[6px] text-[8px]" :value="formatAddress(addressStore.address)" :placeholder="'请链接你的钱包！'"/>
<!--          <a-button type="primary" ghost class="w-[72px] h-[21px] rounded-md border-solid border-[1px] text-[8px] border-[#4D6AEA] text-center text-[#4D6AEA] cursor-pointer" @click="connectPurse">链接空投地址</a-button>-->
          <a-button type="primary" ghost class="w-[72px] h-[21px] rounded-md border-solid border-[1px] text-[8px] border-[#4D6AEA] text-center text-[#4D6AEA] cursor-pointer" @click="connectPurse">链接钱包</a-button>
        </div>
      </a-layout-header>
      <a-layout-content
      >
        <main class="w-full h-full overflow-y-auto">
          <div class="h-full bg-[#fff] w-full">
            <router-view/>
          </div>
        </main>
      </a-layout-content>
    </a-layout>
  </a-layout>
  </a-config-provider>
</template>

<script lang="tsx" setup>
import {ref} from 'vue';
import {menuList} from "@/routes";
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import {useUserPurse} from "@/hooks/useUserPurse.ts";
import {useAddressStore} from "@/store/useAddressStore.ts";
import {useAccountEffect} from "@wagmi/vue";
import {formatAddress} from "utils/base.ts";
import {message} from "ant-design-vue";

const selectedKeys = ref<string[]>(['']);
const collapsed = ref<boolean>(false);


const route = useRoute()
const router =useRouter()

const addressStore = useAddressStore()


watch(()=>route,(newVal)=>{
  selectedKeys.value = [newVal.path]
},{
  deep:true,
  immediate:true,
})

const {connectPurse} = useUserPurse();


const menuSelected = (menu:any)=>{
  router.push(menu.key)
}
useAccountEffect({
  onConnect: (wallet) => {
    message.success('钱包连接成功！')
    addressStore.address = wallet.address
  },
  onError: (error) => {
    addressStore.address = ""
    message.error(error)
  },
  onDisconnect:() => {
    message.success('钱包断开连接成功！')
  addressStore.address = ""
},
})

</script>

<style lang="scss" scoped>
.menu{
  height: calc(100% - 82px);
}

.content {
  height: calc(100% - 54px);
}

:deep(.ant-menu-item-selected) {
  background: linear-gradient(to right, #4B63E9, #5B98F3);
  color: #fff;
  .ant-menu-title-content {
    color: #fff;
  }
}

:deep(.ant-layout-sider),:deep(.ant-menu){
  background: #1E1F24;
}

.header{
  @apply h-[36px] bg-[#fff] p-0;
}

:deep(.ant-menu-item) {
  height: 22px;
  color: #A6A7AB;
  font-size: 10px;
}

:deep(.ant-menu) {
  padding: 0 5px;
}
</style>
