<template>
  <div class="w-full h-full p-[12px] bg-[#F4F5F7]">
    <div class="w-full p-[9px] bg-[#fff] rounded-[5px]">
      <div class="text-[#3B3D47] text-[10px]">批量空投</div>
      <div class="mt-[12px] w-full">

        <a-table :columns="nodeColumns" :data-source="nodeList" :scroll="{ x: 1300, y: 1000 }">
          <template #bodyCell="{ column, text}">
            <div class="w-full cursor-pointer h-full hover:text-blue-400" @click="clickNode(text?.[column.key])">
              {{text?.[column.key]}}
            </div>
          </template>
        </a-table>
        <div class="mt-10"></div>
        <div class="flex items-center gap-x-10 mb-5">
          <a-button type="primary" @click="show">批量空投</a-button>
        </div>
        <a-table :columns="vipColumns" :data-source="tableData" :scroll="{ x: 1300, y: 1000 }" :row-selection="rowSelection" :loading="isLoading">
          <template #bodyCell="{ column, text}">
            <template  v-if="column?.render">
              {{column?.render(text?.[column.key])}}
            </template>
            <template v-else>
              {{text?.[column.key]}}
            </template>
          </template>
        </a-table>
      </div>
    </div>
  </div>
  <a-modal
      v-model:open="open"
      :closable="false"
      placement="right"
      title="批量空投"
      @cancel="batchReset"
  >
    <template #extra>
      <a-button type="text">X</a-button>
    </template>
    <a-form ref="formRef" :model="batch" :rules="rules">
      <div class="space-y-[25px]">
        <a-form-item name="token" label="空投代币地址">
          <a-input v-model:value="batch['token']"></a-input>
        </a-form-item>
        <a-form-item name="baseamount" label="空投数量">
          <a-input-number class="w-full" v-model:value="batch['baseamount']"></a-input-number>
        </a-form-item>
      </div>
    </a-form>

    <template #footer>
      <div class="flex items-center justify-end gap-x-[10px]">
        <a-button style="margin-right: 8px" @click="batchReset">取消</a-button>
        <a-button type="primary" @click="onSubmit">确认</a-button>
      </div>

    </template>
  </a-modal>
</template>

<script lang="ts" setup>
import {useRead} from "@/hooks/useRead.ts";
import {formatAddress} from "utils/base.ts";
import {message} from "ant-design-vue";
import {Rule} from "postcss";
import {useWrite} from "@/hooks/useWrite.ts";
import {parseEther} from "viem";
const open = ref(false);

const nodeColumns = [
  {
    title: '节点',
    key: 'node',
    render(value:string){
      return formatAddress(value)
    }
  },
]

const vipColumns = [
  {
    title: 'vip地址',
    key: 'vip_address',
    render(value:string){
      return formatAddress(value)
    }
  },
]
const tableData = ref([]);
const nodeList = ref([])
const nodeVipParams = ref(["",0,50])




const {refetch,data} = useRead('get_nodevipinfo',nodeVipParams,{
  type:'ERC1229',
  onSuccess(value: any) {
    tableData.value = value.vips.map((item: any, index: number) => {
      return {
        key: index,
        index: index,
        text:item,
        vip_address: item,
      }
    })
  },
  onError(error){
    message.error(error)
  }
})

watch(()=>data.value,(newVal)=>{
  tableData.value = newVal?.vips.map((item: any, index: number) => {
    return {
      key: index,
      index: index,
      text:item,
      vip_address: item,
    }
  })
},{
  deep: true,
})

const nodePage = ref([0,50])
const {isLoading,error} =  useRead('get_node_list',nodePage,{
  type:'ERC1229',
 async onSuccess(res){
    nodeList.value = res.map(item=>{
      return {
        node:item,
      }
    })
   refetch()
  },
  onError(error){
    message.error(error)
  }
})

const clickNode = (address:string)=>{
  if(nodeVipParams.value[0] == address) return;
  nodeVipParams.value[0] = address
  refetch({
    throwOnError:true
  })

}

const selectedList = ref([]);
const rowSelection = ref({
  checkStrictly: true,
  selectedRowKeys:[],
  onChange: (selectedRowKeys: [], selectedRows: []) => {
    rowSelection.value.selectedRowKeys = selectedRowKeys
    selectedList.value = selectedRows;
  },
});


const batch = ref({})
const formRef = ref();
const rules: Record<string, Rule[]> = {
  token: [
    { required: true, message: '请输入空投地址', trigger: 'change' },
  ],
  baseamount: [{ required: true, message: '请输入空投数量', trigger: 'change' }],
};

const batchReset = ()=>{
  open.value = false;
  formRef.value?.resetFields()
}


const {write} = useWrite('platform_airdrop',{
  type:'ERC1229',
  onSuccess(value: any) {
    message.success('空投发布成功')
    open.value = false
    selectedList.value = [];
    batchReset()
    refetch()
  },
  onError(error){
    message.error(error)
  }
})

const onSubmit = ()=>{
  formRef.value
      .validate()
      .then(() => {
        write([
          selectedList.value.map(item=>item.vip_address),
          batch.value.token,
          parseEther(String(batch.value.baseamount))
        ])
      })
}


const show = ()=>{
  if(selectedList.value.length < 1){
    message.error('请先选择节点')
    return
  }
  open.value = true
}

</script>

<style lang="scss" scoped>
:deep(.ant-form-item){
  margin-bottom: 0;
}
</style>
