<template>
  <div class="w-full h-full p-[12px] bg-[#F4F5F7]">
    <div class="w-full p-[9px] bg-[#fff] rounded-[5px]">
      <div class="flex items-center gap-x-10">
        <div class="text-[#3B3D47] text-[10px]">聚合空投</div>
<!--        <a-button type="primary" @click="open=true">发布空投</a-button>-->
      </div>
      <div class="mt-[12px] w-full">
        <a-table :columns="columns" :data-source="data" :scroll="{ x: 1300, y: 1000 }">
          <template #bodyCell="{ column, text}">
            <template v-if="column.key === 'action'">
              <a-button type="link" @click="edit(text)">编辑</a-button>
            </template>
            <template v-if="column.key == 'flag'">
              <a-tag color="#3DB64B"  v-if="text['baseinfo'][column.key]">审批通过</a-tag>
              <a-tag color="#4D6AEA" v-else>待审核/已下架</a-tag>
            </template>
            <template  v-else-if="column?.render">
              {{column?.render(text?.['baseinfo'][column.key])}}
            </template>
            <template v-else>
              {{text?.['baseinfo'][column.key]}}
            </template>
          </template>
        </a-table>
      </div>
    </div>
  </div>
  <a-drawer
      v-model:open="open"
      :closable="false"
      :size="524"
      placement="right"
      title="发布空投"
      destroy-on-close
  >
    <template #extra>
      <a-button type="text">X</a-button>
    </template>
    <a-form ref="formRef" :model="editData" :rules="rules">
      <div class="space-y-[25px]">
        <a-form-item name="time_start" label="开始时间">
          <a-date-picker  format="YYYY-MM-DD HH:mm"  :show-time="{ format: 'HH:mm' }" class="w-full" v-model:value="editData['time_start']"/>
        </a-form-item>
        <a-form-item label="结束时间" name="time_end">
          <a-date-picker :format="dateFormat" :show-time="{ format: 'HH:mm' }" class="w-full" v-model:value="editData['time_end']"/>
        </a-form-item>
        <a-form-item name="token" label="空投代币">
          <a-input v-model:value="editData['token']"></a-input>
        </a-form-item>
        <a-form-item name="wallet" label="结束剩余接受地址">
          <a-input v-model:value="editData['wallet']"></a-input>
        </a-form-item>
        <a-form-item name="totalamount" label="总空投数量">
          <a-input-number class="w-full" v-model:value="editData['totalamount']"></a-input-number>
        </a-form-item>
        <a-form-item name="base_amount" label="一份空投数量">
          <a-input-number class="w-full" v-model:value="editData['base_amount']"></a-input-number>
        </a-form-item>
        <a-form-item label="已空投数量" name="already_received">
          <a-input-number class="w-full" v-model:value="editData['already_received']"></a-input-number>
        </a-form-item>
        <a-form-item label="审核开关" name="flag">
          <a-switch  v-model:checked="editData['flag']"></a-switch>
        </a-form-item>

        <a-form-item name="info" label="详情">
          <a-textarea
              v-model:value="editData['info']"
              placeholder="请输入详情"
              style="width: 860px;"
              :auto-size="{ minRows: 12, maxRows: 15 }"
          />
        </a-form-item>
      </div>
    </a-form>

    <template #footer>
      <div class="flex items-center justify-end gap-x-[10px]">
        <a-button style="margin-right: 8px">取消</a-button>
        <a-button type="primary" @click="onSubmit">确认</a-button>
      </div>

    </template>
  </a-drawer>
</template>

<script lang="ts" setup>
import {useRead} from "@/hooks/useRead.ts";
import {formatAddress, formatTime, getNumber} from "utils/base.ts";
import dayjs from "dayjs";
import {Rule} from "postcss";
import {useWrite} from "@/hooks/useWrite.ts";
import {parseEther} from "viem";
import {message} from "ant-design-vue";
const open = ref(false);
const dateFormat = 'YYYY-MM-DD HH:mm';
const editData = ref({
});



const rules: Record<string, Rule[]> = {
  token: [
    { required: true, message: '请输入空投代币', trigger: 'change' },
  ],
  wallet: [{ required: true, message: '请输入结束剩余接受地址', trigger: 'change' }],
  totalamount: [{ required: true, message: '请输入空投总量', trigger: 'change' }],
  base_amount: [{ required: true, message: '请输入一份空投数量', trigger: 'change' }],
  time_start: [
    {
      required: true,
      message: '请选择开放时间',
      trigger: 'change',
    },
  ],
  time_end: [{
    required: true,
    message: '请选择结束时间',
    trigger: 'change',
  },],
  info: [{ required: true, message: '请输入详情', trigger: 'blur' }],
  already_received: [{ required: true, message: '请输入已空投数量', trigger: 'blur' }],
};
const formRef = ref();

const edit = (rowItem:any)=>{
  const baseInfo = rowItem.baseinfo
  editData.value = {
      ...rowItem.baseinfo,
      totalamount:getNumber(baseInfo.totalamount),
      base_amount:getNumber(baseInfo.base_amount),
      time_start:dayjs(formatTime(baseInfo.time_start).toString(),dateFormat),
      time_end:dayjs(formatTime(baseInfo.time_end).toString(),dateFormat),
    already_received:getNumber(baseInfo.already_received)
  };
  open.value = true;
}
const {write} = useWrite('post_aggregate_airdrop',{
  type:'ERC1229',
  onSuccess: (result) => {
    message.success('发布空投成功')
    refetch();
  },
  onError: (error) => {
    message.error(error)
  },
})
const  onSubmit = () => {
  formRef.value
      .validate()
      .then(() => {
        write([
          {
            ...editData.value,
            time_end:BigInt(editData.value.time_end.unix()),
            time_start:BigInt(editData.value.time_start.unix()),
            already_received:parseEther(String(editData.value.already_received)),
            totalamount:parseEther(String(editData.value.totalamount)),
            base_amount:parseEther(String(editData.value.base_amount)),
            already_received:parseEther(String(editData.value.already_received))
          }
        ])
      })
};

const columns = [
  {
    title: '代币地址',
    key: 'token',
    render(value:string){
      return formatAddress(value)
    }
  },
  {
    title: '空投代币地址',
    key: 'wallet',
    render(value:string){
      return formatAddress(value)
    }
  },
  {
    title: '空投总量',
    key: 'totalamount',
    render(value:string){
      return getNumber(value)
    }
  },
  {
    title: '开放时间',
    key: 'time_start',
    render(value:string){
      return formatTime(value)
    }
  },
  {
    title: '结束时间',
    key: 'time_end',
    render(value:string){
      return formatTime(value)
    }
  },
  {
    title: '1份领多少',
    key: 'base_amount',
    render(value:string){
      return getNumber(value)
    }
  },
  {

    title: '已空投数量',
    key: 'already_received',
    render(value:string){
      return getNumber(value)
    }
  },
  {

    title: '状态',
    key: 'flag',
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
  },
].map(item => {
  return {
    ...item,
    align: 'center'
  }
});

const data = ref([]);

const pages = ref([0,50])
const {refetch} = useRead('get_aggregate_airdrops',pages,{
  type:'ERC1229',
  onSuccess(res){
    console.log(res)
    data.value = res
  }
})


</script>

<style lang="scss" scoped>

</style>
