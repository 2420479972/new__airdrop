<template>
  <div class="w-full h-full p-[12px] bg-[#F4F5F7]">
    <div class="w-full p-[9px] bg-[#fff] rounded-[5px]">
      <div class="flex gap-x-10 items-center">
        <div class="text-[#3B3D47] text-[10px]">平台空投</div>
      </div>
      <div class="mt-[12px] w-full">
        <a-table :columns="columns" :data-source="data" :scroll="{ x: 1300, y: 1000 }">
          <template #bodyCell="{ column, text}">
            <template v-if="column.key === 'action'">
              <a-button type="link" @click="edit(text)">编辑</a-button>
              <a-popconfirm
                  title="确定删除这条数据吗？"
                  ok-text="确定"
                  cancel-text="取消"
                  @confirm="confirm(text)"
              >
                <a-button type="link" danger>删除</a-button>
              </a-popconfirm>
            </template>
            <template v-if="column?.render">
              {{ column?.render(text, [column.key]) }}
            </template>
            <template v-else>
              {{ text?.['baseinfo'][column.key] }}
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
      destroy-on-close
      placement="right"
      title="编辑"
  >
    <template #extra>
      <a-button type="text">X</a-button>
    </template>
    <a-form ref="formRef" :model="editData['baseinfo']" :rules="rules">
      <div class="space-y-[25px]">
        <a-form-item label="代币地址" name="token">
          <a-input v-model:value="editData['baseinfo']['token']"></a-input>
        </a-form-item>
        <a-form-item label="代币名称" name="info">
          <a-input v-model:value="editData['baseinfo']['info']"></a-input>
        </a-form-item>
        <a-form-item label="空投数量" name="totalamount">
          <a-input-number v-model:value="editData['baseinfo']['totalamount']" class="w-full"></a-input-number>
        </a-form-item>
        <a-form-item label="开放时间" name="time_start">
          <a-date-picker v-model:value="editData['baseinfo']['time_start']" :show-time="{ format: 'HH:mm' }" class="w-full"
                         format="YYYY-MM-DD HH:mm"/>
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
import {Rule} from "postcss";
import dayjs from "dayjs";
import {useWrite} from "@/hooks/useWrite.ts";
import {message} from "ant-design-vue";
import {parseEther} from "viem";

const open = ref(false);
const dateFormat = 'YYYY-MM-DD HH:mm';
const editData = ref({
  baseinfo: {},
  index: 0n,
});

const edit = (rowItem: any) => {
  editData.value.baseinfo = {
    ...rowItem.baseinfo,
    totalamount: getNumber(rowItem.baseinfo.totalamount),
    time_start: dayjs(formatTime(rowItem.baseinfo.time_start).toString(), dateFormat),
  }
  editData.value.index = rowItem.index;
  open.value = true;
}


const rules: Record<string, Rule[]> = {
  token: [
    {required: true, message: '请输入代币地址', trigger: 'change'},
  ],
  info: [{required: true, message: '请输入代币名称', trigger: 'change'}],
  totalamount: [{required: true, message: '请输入空投总量', trigger: 'change'}],
  time_start: [
    {
      required: true,
      message: '请选择开放时间',
      trigger: 'change',
    },
  ],
};
const formRef = ref();


const data = ref([]);

const page = ref([0, 50]);
const {refetch} = useRead('get_platform_airdrops', page, {
  type: 'ERC1229',
  onSuccess(res) {
    console.log('get_node_list', res)
    data.value = res
  },
  onError(error){
    message.error(error)
  }
})

const {write} = useWrite('set_platform_airdrop', {
  type: 'ERC1229',
  onSuccess: (result) => {
    message.success('提交成功')
    refetch();
    open.value = false;
  },
  onError(error){
    message.error(error)
  }
})
const onSubmit = () => {
  formRef.value
      .validate()
      .then(() => {
        const editDataList = data.value.filter((item,_index)=>item.index != editData.value.index).map(item=>item.baseinfo)
        console.log([
          ...editDataList,
          {
            ...editData.value.baseinfo,
            time_start: BigInt(editData.value.baseinfo.time_start.unix()),
            totalamount: parseEther(String(editData.value.baseinfo.totalamount)),
          }
        ])
        write([
          [
              ...editDataList,
            {
              ...editData.value.baseinfo,
              time_start: BigInt(editData.value.baseinfo.time_start.unix()),
              totalamount: parseEther(String(editData.value.baseinfo.totalamount)),
            }
          ]
        ])
      })
};

const columns = [
  {
    title: '代币地址',
    key: 'token',
    render(value: string, key: string) {
      return formatAddress(value['baseinfo'][key])
    }
  },
  {
    title: '代币名称',
    key: 'info',
  },
  {
    title: '空投数量',
    key: 'totalamount',
    render(value: string, key: string) {
      return getNumber(value['baseinfo'][key])
    }
  },
  {
    title: '开放时间',
    key: 'time_start',
    render(value: string, key: string) {
      return formatTime(value['baseinfo'][key])
    }
  },
  {
    title: '价格',
    key: 'price',
    render(value: string, key: string) {
      return getNumber(value[key])
    }
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

const confirm = (_item)=>{
  const editData = data.value.filter((item,_index)=>item.index != _item.index).map(item=>item.baseinfo)
  write([
    editData
  ])
}



</script>

<style lang="scss" scoped>

</style>
