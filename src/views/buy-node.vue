<template>
  <div class="w-full h-full p-[12px] bg-[#F4F5F7]">
    <div class="w-full p-[9px] bg-[#fff] rounded-[5px]">
      <div class="flex items-center gap-x-[5px]">
        <template v-for="item in Object.keys(vipList)" :key="item.info">
          <div class="px-[11px] py-[5px] rounded-[3px] text-[7px] text-[#fff] cursor-pointer" @click="selectType = item" :style="{background:selectType == item ? '#4D6AEA' : '#E2E5EA',color:selectType == item?'#fff':'#181818'}">{{vipType[item]}}</div>
        </template>
      </div>
      {{showItem}}
<a-form :model="buyNodeParams" :rules="rules" ref="formRef">
  <div class="mt-[15px] w-full  flex items-center gap-x-[45px]">
    <div class="text-[#3B3D47] text-[8px] flex items-center">
        <a-form-item label="开始时间" name="time_start">
          <a-date-picker  format="YYYY-MM-DD HH:mm"  :show-time="{ format: 'HH:mm' }" class="w-full" v-model:value="buyNodeParams['time_start']"/>
        </a-form-item>
    </div>
    <div class="text-[#3B3D47] text-[8px] flex items-center">
      <a-form-item label="结束时间" name="time_end">
        <a-date-picker  format="YYYY-MM-DD HH:mm"  :show-time="{ format: 'HH:mm' }" class="w-full" v-model:value="buyNodeParams['time_end']"/>
      </a-form-item>
    </div>
    <div class="text-[#3B3D47] text-[8px] flex items-center">
        <a-form-item label="价格" name="price">
          <a-input-number   v-model:value="buyNodeParams['price']"  placeholder="请输入价格" style="width: 180px"/>
        </a-form-item>
    </div>
  </div>
<!--  <div class="text-[#3B3D47] text-[8px] flex items-center">-->
<!--    <a-form-item label="详情" name="info">-->
<!--      <a-textarea-->
<!--          v-model:value="buyNodeParams['info']"-->
<!--          placeholder="请输入详情"-->
<!--          style="width: 860px;"-->
<!--          :auto-size="{ minRows: 12, maxRows: 15 }"-->
<!--      />-->
<!--    </a-form-item>-->
<!--  </div>-->
</a-form>

      <div class="flex items-center justify-end gap-x-[10px] mt-[15px]">
        <a-button type="primary" @click="onSubmit" :loading="isPending">确认发布</a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useRead} from "@/hooks/useRead.ts";
import {useWrite} from "@/hooks/useWrite.ts";
import {Rule} from "postcss";
import dayjs from "dayjs";
import {formatTime, getNumber} from "utils/base.ts";
import {message} from "ant-design-vue";
import {parseEther} from "viem";
const dateFormat = 'YYYY-MM-DD HH:mm';
enum vipType {
  node = "节点",
  vip = "会员",
  ambassador = "大使"
}

const vipList =  {
  node:'node',
  vip:'vip',
  ambassador:'ambassador',
}


enum vipNode {
  node = 0,
  vip = 1,
  ambassador = 2,
}

const selectType = ref('');


watch(()=>selectType.value,(newVal)=>{
  const selectItem = vipTypeList.value.find(item=>item.info == newVal) || {};
  buyNodeParams.value = {
    ...selectItem,
    price: getNumber(selectItem.price),
    time_start: selectItem.time_start ? dayjs(formatTime(selectItem.time_start).toString(), dateFormat) : undefined,
    time_end:selectItem.time_end?  dayjs(formatTime(selectItem.time_end).toString(), dateFormat) : undefined,
  }
},{
  deep: true,
})



const buyNodeParams = ref({
  // info:undefined,
  time_end:undefined,
  price: undefined,
  time_start:undefined,
})
const formRef = ref();
const rules: Record<string, Rule[]> = {
  // info: [
  //   { required: true, message: '请输入详情', trigger: 'change' },
  // ],
  time_end: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
  time_start: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  price: [{ required: true, message: '请输入价格', trigger: 'change' }],
};


const {write,isPending} = useWrite('set_product_info',{
  type:'ERC1229',
  onSuccess(value: any) {
    console.log(value)
    message.success('发布成功')
    refetch()
  },
  onError(error) {
    message.error(error)
  }
})


const  onSubmit = () => {
  formRef.value
      .validate()
      .then(() => {
        write([
          vipNode[selectType.value],
          {
            time_end:BigInt(buyNodeParams.value.time_end.unix()),
            time_start:BigInt(buyNodeParams.value.time_start.unix()),
            price:parseEther(String(buyNodeParams.value.price)),
            info:vipList[selectType.value]
          }
        ])
      })
};


const vipTypeList = ref<{
  info: keyof typeof vipType,
  price:BigInt,
  time_end: string,
  time_start: string,
}[]>([])


const {refetch,data:productInfo} =  useRead('get_product_infos',{
  type:'ERC1229',
  onSuccess:(res)=>{
    console.log(res)


  },
  onError(error){
    message.error(error)
  }
})


watch(()=>productInfo.value,(newVal:any)=>{
  console.log(newVal)
  if(!newVal) return;
  vipTypeList.value = newVal;
  selectType.value = selectType.value == '' ? 'node' : selectType.value
},{
  deep: true,
  immediate:true,
})

</script>

<style lang="scss" scoped>

</style>
