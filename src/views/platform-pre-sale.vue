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
                <a-input-number v-if="item.type == 'number'" v-model:value="platformParams[item.key]" :placeholder="'请输入' + item.label" style="width: 180px"/>
                <a-input v-if="!item.type" v-model:value="platformParams[item.key]" :placeholder="'请输入' + item.label" style="width: 180px"/>
                <a-date-picker v-if="item.type == 'date'" v-model:value="platformParams[item.key]" :show-time="{ format: 'HH:mm' }"
                               format="YYYY-MM-DD HH:mm"/>
              </a-form-item>
            </template>
          </div>
        </a-form>
        <div class="flex items-center gap-x-5">
          <a-button type="link" @click="checkEdit">编辑</a-button>
          <a-button type="primary" @click="onSubmit" :disabled="disabled">提交</a-button>
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
import {ABI97} from "@/abis/abi.ts";
import {useWrite} from "@/hooks/useWrite.ts";
import {parseEther} from "viem";
import {message} from "ant-design-vue";


const disabled = ref(true);

const platformParams = ref({})
const oldPlatformParams = ref({})
const formRef = ref();
const rules: Record<string, Rule[]> ={}
const formList = [
  {
    label:'已售数量',
    key:'already_received',
    type:"number"
  },
  {
    label:'总供应量',
    key:'totalamount',
    type:"number"
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
    type:"number"
  },
  {
    label:'一份的价格',
    key:'baseprice',
    type:"number"
  },
]

formList.forEach((item)=>{
  rules[item.key] = [{required: true, message: '请输入' + item.label, trigger: 'change'}]
})
const { refetch } = useRead('platform_subscription', undefined, {
  type:'ERC1229',
  onSuccess(data) {
    if (data.length > 0) {
      console.log(data)
      for (let i = 0; i < data.length; i++) {
        if (i == 3 || i == 4) {
          oldPlatformParams.value[formList[i].key] = dayjs(formatTime(data[i]), 'YYYY-MM-DD HH:mm');
        } else if (i == 5) {
          oldPlatformParams.value[formList[i].key] = data[i];
        } else {
          oldPlatformParams.value[formList[i].key] = getNumber(data[i]);
        }
      }
      platformParams.value = {...oldPlatformParams.value}
    }
  }
})

const allowance = ref(0);
const allowanceParams = ref([ABI97['ERC1229'].address])
useRead('allowance', allowanceParams, {
  type: 'ttoken',
  needAddress: true,
  onSuccess(data) {
    allowance.value = getNumber(data)
  },
  onError(error){
    message.error(error)
  }
})
let sendParams:any = null

const {write:ApproveWrite} = useWrite('approve',{
  type: 'ttoken',
  onSuccess(data) {
    message.success('授权成功')
    subscriptionWrite([sendParams]);

  },
  onError: (error) => {
    message.error(error)
    sendParams = null
  }
})

const {write:subscriptionWrite} = useWrite('set_platform_subscription',{
  type: 'ERC1229',
  onSuccess(data) {
    message.success('提交成功')
    sendParams = null
  },
  onError: (error) => {
    message.error(error)
    sendParams = null
  }
})
const onSubmit = () => {
  formRef.value
      .validate()
      .then(() => {
         sendParams = {
          ...platformParams.value,
          time_start: BigInt(platformParams.value.time_start.unix()),
          time_end:BigInt(platformParams.value.time_end.unix()),
          price: parseEther(String(platformParams.value.price)),
          baseprice: parseEther(String(platformParams.value.baseprice)),
          baseamount: parseEther(String(platformParams.value.baseamount)),
          totalamount: parseEther(String(platformParams.value.totalamount)),
          already_received: parseEther(String(platformParams.value.already_received)),
        }
        const approveValue = platformParams.value?.totalamount - allowance.value;
         console.log(approveValue)
        if (approveValue > 0) {
          ApproveWrite([
              ABI97['ERC1229'].address,
              parseEther(String(approveValue)),
          ])
        }else{
          subscriptionWrite([sendParams]);
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
