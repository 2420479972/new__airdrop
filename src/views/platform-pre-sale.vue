<template>
  <div class="w-full h-full p-[12px] bg-[#F4F5F7]">
    <div class="w-full p-[9px] bg-[#fff] rounded-[5px]">
      <div class="flex gap-x-10 items-center">
        <div class="text-[#3B3D47] text-[10px]">平台预售</div>
      </div>
      <div class="mt-[12px] w-full">
        <a-form ref="formRef" :disabled="disabled" :model="platformParams" :rules="rules">
          <div class="text-[#3B3D47] text-[8px]">
            <template v-for="item in formList" :key="item.label">
              <a-form-item :label="item.label" :name="item.key">
                <a-input-number :min="item?.min || 0" v-if="item.type == 'number'" v-model:value="platformParams[item.key]" :placeholder="'请输入' + item.label" style="width: 180px"/>
                <a-input v-if="!item.type" v-model:value="platformParams[item.key]" :placeholder="'请输入' + item.label" style="width: 180px"/>
                <a-date-picker v-if="item.type == 'date'" v-model:value="platformParams[item.key]" :show-time="{ format: 'HH:mm' }"
                               format="YYYY-MM-DD HH:mm"/>
              </a-form-item>
            </template>
          </div>
        </a-form>
        <div class="flex items-center gap-x-5">
          <a-button type="link" @click="checkEdit">编辑</a-button>
          <a-button type="primary" @click="onSubmit" :disabled="disabled" :loading="loading||isPending || approvePending">提交</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {Rule} from "postcss";
import {useRead} from "@/hooks/useRead.ts";
import {formatTime, getNumber} from "utils/base.ts";
import dayjs from "dayjs";
import {ABI} from "@/abis/abi.ts";
import {useWrite} from "@/hooks/useWrite.ts";
import {parseEther} from "viem";
import {message} from "ant-design-vue";
import {useChainId} from "@wagmi/vue";

const chainId = useChainId();

const disabled = ref(true);

const platformParams = ref({})
const oldPlatformParams = ref({})
const formRef = ref();
const rules: Record<string, Rule[]> ={}
const formList = [
  {
    label:'已售数量',
    key:'already_received',
    type:"number",
    rules:[{
      validator: async (value)=>{
        if(platformParams.value.already_received > platformParams.value.totalamount){
          return Promise.reject('已售数量不能大于总供应量');
        }
      },
      trigger: 'change'
    }]
  },
  {
    label:'总供应量',
    key:'totalamount',
    type:"number",
    min:1
  },
  {
    label:'上线价格',
    key:'price',
    type:"number"
  },
  {
    label:'开始时间',
    key:'time_start',
    type:"date"
  },
  {
    label:'结束时间',
    key:'time_end',
    type:"date"
  },
  {
    label:'代币地址',
    key:'token'
  },
  {
    label:'一份的数量',
    key:'baseamount',
    type:"number",
    min:1
  },
  {
    label:'一份的价格',
    key:'baseprice',
    type:"number"
  },
]

formList.forEach((item)=>{
  rules[item.key] = [{required: true, message: '请输入' + item.label, trigger: 'change'}]
  if(item.rules){
    rules[item.key] = [...rules[item.key],...item.rules]
  }
})
const { refetch,data:subscriptionData } = useRead('platform_subscription', {
  type:'ERC1229',
})

watch(()=>subscriptionData.value,(newVal)=>{
  if(!newVal) return;
  if (newVal.length > 0) {
    for (let i = 0; i < newVal.length; i++) {
      if (i == 3 || i == 4) {
        oldPlatformParams.value[formList[i].key] = dayjs(formatTime(newVal[i]), 'YYYY-MM-DD HH:mm');
      } else if (i == 5) {
        oldPlatformParams.value[formList[i].key] = newVal[i];
      } else {
        oldPlatformParams.value[formList[i].key] = getNumber(newVal[i]);
      }
    }
    platformParams.value = {...oldPlatformParams.value}
  }
},{
  deep: true,
  immediate: true
})



const allowance = ref(0);
const { setParams } =  useRead('allowance', {
  autoRun:false,
  type: 'ttoken',
  needAddAndAuto:false,
  needAddress: true,
  onSuccess(data) {
    allowance.value = getNumber(data)
  },
  onError(error){
    message.error(error)
  }
})
let sendParams:any = null
const loading = ref(false);
const {write:ApproveWrite,isPending:approvePending} = useWrite('approve',{
  type: 'ttoken',
  onSuccess(data) {
    console.log(data,'这个数据')
    loading.value = true;
    setTimeout(()=>{
      console.log(sendParams);
      subscriptionWrite([sendParams]);
    },15000)
  },
  onError: (error) => {
    message.error(error)
    sendParams = null
  }
})

const {write:subscriptionWrite,isPending} = useWrite('set_platform_subscription',{
  type: 'ERC1229',
  onSuccess(data) {
    message.success('提交成功')
    refetch()
    sendParams = null
    loading.value = false;
  },
  onError: (error) => {
    message.error(error)
    sendParams = null
    loading.value = false;

  }
})
const onSubmit = () => {
  formRef.value
      .validate()
      .then(async () => {
         sendParams = {
          ...platformParams.value,
           already_received: parseEther(String(platformParams.value.already_received)),
           totalamount: parseEther(String(platformParams.value.totalamount)),
           price: parseEther(String(platformParams.value.price)),
          time_start: BigInt(platformParams.value.time_start.unix()),
          time_end:BigInt(platformParams.value.time_end.unix()),
          baseamount: parseEther(String(platformParams.value.baseamount)),
           baseprice: parseEther(String(platformParams.value.baseprice)),
        }
        await setParams([ABI[chainId.value]['ERC1229'].address,platformParams.value.token]);
        const approveValue = platformParams.value?.totalamount - allowance.value;
        if (approveValue > 0) {
          await ApproveWrite([
            ABI[chainId.value]['ERC1229'].address,
            parseEther(String(approveValue)),
          ], {
            address: platformParams.value.token
          })
        }else{
          await subscriptionWrite([sendParams]);
        }
      })
};

const checkEdit = ()=>{
  if(!disabled.value){
    platformParams.value = {...oldPlatformParams.value}
  }
  disabled.value = !disabled.value;
}


</script>

<style lang="scss" scoped>

</style>
