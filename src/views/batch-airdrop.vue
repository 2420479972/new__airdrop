<template>
  <div class="w-full h-full p-[12px] bg-[#F4F5F7]">
    <div class="w-full p-[9px] bg-[#fff] rounded-[5px]">
      <div class="text-[#3B3D47] text-[10px]">批量空投</div>
      <div class="mt-2"></div>
      <div class="flex items-center gap-x-10 mb-5">
        <a-button type="primary" @click="show">批量空投</a-button>
      </div>
      <div class="mt-[12px] w-full">
        <a-table :columns="nodeColumns" :data-source="nodeList" :scroll="{ x: 1300, y: 1000 }" :row-selection="nodeSelection"  :loading="nodeLoading">
          <template #bodyCell="{ column, text}">
            <div class="w-full cursor-pointer h-full hover:text-blue-400" @click="clickNode(text?.[column.key])">
              {{text?.[column.key]}}
            </div>
          </template>
        </a-table>
        <a-table :columns="vipColumns" :data-source="tableData" :scroll="{ x: 1300, y: 1000 }" :row-selection="vipSelection" :loading="vipLoading">
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
          <a-input v-model:value="batch['token']" placeholder="0x..."></a-input>
        </a-form-item>
        <a-form-item name="baseamount" label="空投数量">
          <a-input-number class="w-full" v-model:value="batch['baseamount']" placeholder="空投数量"></a-input-number>
        </a-form-item>
      </div>
    </a-form>

    <template #footer>
      <div class="flex items-center justify-end gap-x-[10px]">
        <a-button style="margin-right: 8px" @click="batchReset">取消</a-button>
        <a-button type="primary" @click="onSubmit" :loading="isPending">确认</a-button>
      </div>

    </template>
  </a-modal>
</template>

<script lang="ts" setup>
import {useRead} from "@/hooks/useRead.ts";
import {formatAddress, getNumber} from "utils/base.ts";
import {message} from "ant-design-vue";
import {Rule} from "postcss";
import {useWrite} from "@/hooks/useWrite.ts";
import {parseEther} from "viem";
import {ABI} from "@/abis/abi.ts";
import {useChainId} from "@wagmi/vue";

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

const {refetch,data,setParams,isLoading:vipLoading} = useRead('get_nodevipinfo',{
  autoRun:false,
  initParams:["",0,50],
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

const {isLoading:nodeLoading,data:dataList} =  useRead('get_node_list',{
  initParams:[0,50],
  type:'ERC1229',
  onError(error){
    message.error(error)
  }
})

watch(()=>dataList.value,(newVal:any)=>{
  if(!newVal) return;
  nodeList.value = newVal.map((item,index)=>{
    return {
      key: 'index' + index,
      index:  index,
      text:item,
      node: item,
    }
  })
  setParams([newVal[0],0,50])
},{
  deep: true,
  immediate: true,
})



const clickNode = (address:string)=>{
  setParams([address,0,50])
}


const nodeSelectedList = ref([]);
const nodeSelection = ref({
  checkStrictly: true,
  selectedRowKeys:[],
  onChange: (selectedRowKeys: [], selectedRows: []) => {
    nodeSelection.value.selectedRowKeys = selectedRowKeys;
    console.log(selectedRows)
    nodeSelectedList.value = selectedRows;
  },
});
const vipSelectedList = ref([]);

const vipSelection = ref({
  checkStrictly: true,
  selectedRowKeys:[],
  onChange: (selectedRowKeys: [], selectedRows: []) => {
    vipSelection.value.selectedRowKeys = selectedRowKeys
    vipSelectedList.value = selectedRows;
  },
});

const chainId = useChainId();

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

const allowance = ref(0);
const { setParams:allowSetParams } =  useRead('allowance', {
  autoRun:false,
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
    setTimeout(()=>{
      write(sendParams);
    },500)
  },
  onError: (error) => {
    message.error(error)
    sendParams = null
  }
})

const {write,isPending} = useWrite('platform_airdrop',{
  type:'ERC1229',
  onSuccess(value: any) {
    message.success('空投发布成功')
    open.value = false
    nodeSelectedList.value = [];
    vipSelectedList.value = [];
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
      .then(async () => {
        sendParams = [
          [...vipSelectedList.value.map(item=>item.vip_address),...nodeSelectedList.value.map(item=>item.node)],
          batch.value.token,
          parseEther(String(batch.value.baseamount))
        ]
        console.log('sendParams',sendParams)
        await allowSetParams([ABI[chainId.value]['ERC1229'].address,batch.value.token]);
        const balanceValue =batch.value.baseamount - allowance.value;
        if(balanceValue > 0){
          await ApproveWrite([ABI[chainId.value]['ERC1229'].address,parseEther(String(batch.value.baseamount))],{
            address: batch.value.token
          })
        }else{
          await write(sendParams)
        }

      })
}


const show = ()=>{
  if(vipSelectedList.value.length < 1 && nodeSelectedList.value.length < 1){
    message.error('请先选择节点或者会员')
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
