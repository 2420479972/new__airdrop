<template>
  <div class="h-[179px] w-full relative px-[64px] py-[46px]">
    <img alt="" class="w-full absolute left-0 top-0 h-[179px]" src="/images/banner.png">
    <div class="relative z-10">
      <div class="text-[#1A1E58] text-[38px] font-bold"><span class="gradient-text mr-[10px]">AUC</span>
        <span>后台管理系统</span></div>
      <div class="w-[165px] h-[2px] bg-[#1A1E58] mt-[21px] mb-[10px]"></div>
      <div class="text-[#1A1E58] text-[14px] text">web1.0正式上线</div>
    </div>
  </div>
  <div class="w-full content py-[14px] px-[12px] bg-[#F4F5F7]">
    <div class="grid grid-cols-4 gap-x-[11px]">
      <div class="w-full h-[111px] bg-[#fff] shadow rounded-[5px] py-[19px] px-[14px] flex items-center">
        <div class="w-[63px]">
          <img alt="" class="w-full" src="/images/icon-setting1.png">
        </div>
        <div class="ml-[17px] h-full pt-[5px] space-y-[9px]">
          <div class="text-[#3B3D47] text-[12px] text">真实流动性池</div>
          <div class="text-[##181818] text-[21px]">{{getNumber(realPoolStakeData) }}</div>
          <div class="flex items-center gap-x-[6px]">
            <div
                @click="takeOutShow = true"
                class="py-[3px] px-[7px]  text-center border-[#EF3F3F] border-solid border-[1px] rounded-[3px] text-[#EF3F3F] cursor-pointer">
              取出
            </div>
            <div
                @click="transferShow = true"
                class="py-[3px] px-[7px]  text-center border-[#4D6AEA] border-solid border-[1px] rounded-[3px] text-[#4D6AEA] cursor-pointer">
              转入
            </div>
<!--            <div-->
<!--                class="py-[3px] px-[7px]  bg-[#4D6AEA] text-center border-solid border-[1px] rounded-[3px] text-[#fff] cursor-pointer">-->
<!--              展示数据000-->
<!--            </div>-->
          </div>
        </div>
      </div>
      <div class="w-full h-[111px] bg-[#fff] shadow rounded-[5px] py-[19px] px-[14px] flex items-center">
        <div class="w-[63px]">
          <img alt="" class="w-full" src="/images/icon-setting1.png">
        </div>
        <div class="ml-[17px] h-full pt-[5px] space-y-[9px]">
          <div class="text-[#3B3D47] text-[12px] text">假流动性池</div>
          <div class="text-[##181818] text-[21px]">{{getNumber(fakePoolStakeData) }}</div>
          <div class="flex items-center gap-x-[6px]">
            <div
                @click="fakePoolStakeShow = true"
                class="py-[3px] px-[7px]  bg-[#4D6AEA] text-center border-solid border-[1px] rounded-[3px] text-[#fff] cursor-pointer">
              更改展示数据
            </div>
<!--            <div-->
<!--                class="py-[3px] px-[7px]  bg-[#4D6AEA] text-center border-solid border-[1px] rounded-[3px] text-[#fff] cursor-pointer">-->
<!--              展示数据000-->
<!--            </div>-->
          </div>
        </div>
      </div>
      <div class="w-full h-[111px] bg-[#fff] shadow rounded-[5px] py-[19px] px-[14px] flex items-center">
        <div class="w-[63px]">
          <img alt="" class="w-full" src="/images/icon-setting2.png">
        </div>
        <div class="ml-[17px] h-full pt-[5px] space-y-[9px]">
          <div class="text-[#3B3D47] text-[12px] text">平台用户</div>
          <div class="text-[##181818] text-[21px]">{{getNumber(userInfo,'number_user')}}</div>
          <div class="flex items-center gap-x-[6px]">
            <div
                @click="editUserNumberShow = true"
                class="py-[3px] px-[7px]  bg-[#4D6AEA] text-center border-solid border-[1px] rounded-[3px] text-[#fff] cursor-pointer">
              更改展示数据
            </div>
          </div>
        </div>
      </div>
      <div class="w-full h-[111px] bg-[#fff] shadow rounded-[5px] py-[19px] px-[14px] flex items-center">
        <div class="w-[63px]">
          <img alt="" class="w-full" src="/images/icon-setting2.png">
        </div>
        <div class="ml-[17px] h-full pt-[5px] space-y-[9px]">
          <div class="text-[#3B3D47] text-[12px] text">代币AUN</div>
          <div class="text-[##181818] text-[21px]">{{getNumber(userInfo,'stake_amount',true)}}</div>
          <div class="flex items-center gap-x-[6px]">

            <!--            <div-->
            <!--                class="py-[3px] px-[7px]  bg-[#4D6AEA] text-center border-solid border-[1px] rounded-[3px] text-[#fff] cursor-pointer">-->
            <!--              展示数据000-->
            <!--            </div>-->
          </div>
        </div>
      </div>
    </div>
    <div class="w-[100%] h-[177px] bg-[#fff] shadow rounded-[5px] py-[22px] px-[55px] flex items-center mt-[9px]">
      <div class="h-[134px] w-[134px]">
        <img src="/images/icon-setting2.png" alt="" class="h-full w-full">
      </div>
      <div class="ml-[35px] h-full pt-[5px] space-y-[9px]">
        <div class="text-[#3B3D47] text-[12px] text">系统参数</div>
        <div class="mt-[20px] grid grid-cols-2 gap-y-[8px] gap-x-[21px] text-[10px] text-[#4D6AEA]">
          <div class="w-[248px] h-[24px] border-[1px] border-solid border-[#AEADBF] rounded-[5px] flex items-center justify-between p-[10px] cursor-pointer" @click="systemShow  = true">
            <span>系统参数设置</span>
            <img src="/images/right.png" alt="" class="w-[14px]">
          </div>
          <div class="w-[248px] h-[24px] border-[1px] border-solid border-[#AEADBF] rounded-[5px] flex items-center justify-between p-[10px] cursor-pointer" @click="noticeShow = true">
            <span>平台跳转连接设置</span>
            <img src="/images/right.png" alt="" class="w-[14px]">
          </div>
        </div>
      </div>
    </div>
  </div>
  <a-modal v-model:open="transferShow" :width="300"  title="请输入你的转入金额" @ok="transferOK" @cancel="transferValue = undefined" destroyOnClose :confirm-loading="transferPending">
    <a-form-item label="转入金额">
      <a-input-number v-model:value="transferValue" :min="0.000000001" placeholder="请输入你的转入金额" class="w-full"></a-input-number>
    </a-form-item>
  </a-modal>
  <a-modal v-model:open="takeOutShow" :width="300"  title="请输入你的取款金额" @ok="takeOutOK" destroyOnClose :confirm-loading="withdrawPending">
    <a-form-item label="取款金额">
      <a-input-number v-model:value="takeOutValue" :min="getNumber(userInfo,'liquidity',true) > 0 ? 0.00000000000001 : 0" :max="getNumber(userInfo,'liquidity',true)" :placeholder="'最大取款金额为' + getNumber(userInfo,'liquidity',true)"  class="w-full"></a-input-number>
    </a-form-item>
  </a-modal>
  <a-modal v-model:open="editUserNumberShow" :width="300"  title="编辑平台用户" @ok="editUserNumberOk" @cancel="editReset" destroyOnClose :confirm-loading="baseInfoPending">
    <div class="space-y-3">
      <a-form :model="editUser" ref="editForm">
        <a-form-item label="商户地址" name="merchant_add">
          <a-input v-model:value="editUser['merchant_add']" placeholder="0x....." class="w-full"></a-input>
        </a-form-item>
        <a-form-item label="平台用户" name="number_user">
          <a-input-number :min="1" v-model:value="editUser['number_user']" placeholder="请输入平台用户" class="w-full"></a-input-number>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
<!--  <a-modal v-model:open="editTokenAUNShow" :width="300"  title="编辑代币AUN" @ok="editTokenAUNOk" destroyOnClose>-->
<!--    <a-input-number v-model:value="editTokenAUNValue" placeholder="请输入代币AUN" class="w-full"></a-input-number>-->
<!--  </a-modal>-->
  <a-modal v-model:open="systemShow" title="编辑系统参数" @ok="systemOnSubmit" destroyOnClose @cancel="systemReset" :confirm-loading="systemPending">
    <a-form :model="systemParams" ref="systemDomRef">
      <div class="mt-[15px] w-full">
        <div class="text-[#3B3D47] text-[8px] flex items-center">
          <a-form-item label="路由地址" name="tokenRouter">
            <a-input  v-model:value="systemParams['tokenRouter']"  placeholder="0x....." style="width: 180px"/>
          </a-form-item>
        </div>
        <div class="text-[#3B3D47] text-[8px] flex items-center">
          <a-form-item label="付费Token地址" name="usdt">
            <a-input  v-model:value="systemParams['usdt']"   placeholder="0x....." style="width: 180px"/>
          </a-form-item>
        </div>
        <div class="text-[#3B3D47] text-[8px] flex items-center">
          <a-form-item label="推荐获得佣金比例" name="buy2parent_rate">
            <a-input-number  v-model:value="systemParams['buy2parent_rate']"  placeholder="请输入推荐获得佣金比例" style="width: 180px"/>
          </a-form-item>
        </div>
        <div class="text-[#3B3D47] text-[8px] flex items-center">
          <a-form-item label="节点推会员累加奖励比例" name="node2vip_add_rate">
            <a-input-number  v-model:value="systemParams['node2vip_add_rate']"  placeholder="请输入节点推会员累加奖励比例" style="width: 180px"/>
          </a-form-item>
        </div>
        <div class="text-[#3B3D47] text-[8px] flex items-center">
          <a-form-item label="提交空投项目的价格" name="post_aggregate_airdrop_price">
            <a-input-number  v-model:value="systemParams['post_aggregate_airdrop_price']"  placeholder="请输入提交空投项目的价格" style="width: 180px"/>
          </a-form-item>
        </div>
      </div>
      <!--  <div class="text-[#3B3D47] text-[8px] flex mt-[15px] w-full">-->
      <!--    <a-form-item label="详情" name="mark">-->
      <!--      <a-textarea v-model:value="systemParams['mark']" placeholder="请输入详情" :rows="10" style="width:875px" class="bg-[#F4F5F7] text-[9px]"/>-->
      <!--    </a-form-item>-->
      <!--  </div>-->
    </a-form>

  </a-modal>


  <a-modal v-model:open="noticeShow" title="平台通知设置" @ok="noticeOnSubmit"   @cancel="noticeReset" :confirm-loading="otherPending">
  <a-form :model="noticeParams" ref="noticeDomRef">
    <div class="mt-[15px] w-full">
      <div class="text-[#3B3D47] text-[8px] flex items-center">
        <a-form-item label="通知" name="notice">
          <a-input  v-model:value="noticeParams['notice']"  placeholder="请输入通知" style="width: 180px"/>
        </a-form-item>
      </div>
      <div class="text-[#3B3D47] text-[8px] flex items-center">
        <a-form-item label="电报链接" name="telegram_link">
          <a-input  v-model:value="noticeParams['telegram_link']"  placeholder="请输入电报链接" style="width: 180px"/>
        </a-form-item>
      </div>
      <div class="text-[#3B3D47] text-[8px] flex items-center">
        <a-form-item label="推特链接" name="twitter_link">
          <a-input  v-model:value="noticeParams['twitter_link']"  placeholder="请输入推特链接" style="width: 180px"/>
        </a-form-item>
      </div>
      <div class="text-[#3B3D47] text-[8px] flex items-center">
        <a-form-item label="链接1" name="link_1">
          <a-input  v-model:value="noticeParams['link_1']"  placeholder="请输入链接1" style="width: 180px"/>
        </a-form-item>
      </div>
      <div class="text-[#3B3D47] text-[8px] flex items-center">
        <a-form-item label="链接2" name="link_2">
          <a-input  v-model:value="noticeParams['link_2']"  placeholder="请输入链接2" style="width: 180px"/>
        </a-form-item>
      </div>
    </div>

  </a-form>
  </a-modal>
  <a-modal v-model:open="fakePoolStakeShow" :width="300" title="请输入假流动性金额" @cancel="fakePoolStakeValue = getNumber(fakePoolStakeData)" @ok="fakePoolStakeOK" destroyOnClose :confirm-loading="fakePoolStakePending">
    <a-form-item label="假流动性金额">
      <a-input-number v-model:value="fakePoolStakeValue" :min="0" placeholder="请输入假流动性金额"  class="w-full"></a-input-number>
    </a-form-item>
  </a-modal>

</template>

<script lang="ts" setup>

import {useRead} from "@/hooks/useRead.ts";
import {getNumber} from "../utils/base.ts";
import {useWrite} from "@/hooks/useWrite.ts";
import {ethers} from "ethers";
import {Form, message} from "ant-design-vue";
import {parseEther} from "viem";
const userInfo = ref<{
  liquidity?:BigInt,
  number_user?:BigInt,
  stake_amount?:BigInt,
}>({});

const transferShow = ref(false);
const transferValue = ref("");


const takeOutShow = ref(false);
const takeOutValue = ref("");
const systemShow= ref(false);
const noticeShow = ref(false);

const {write:transferWrite,isPending:transferPending} = useWrite('transfer',{
  type:'ttoken',
  onSuccess(){
  message.success('转账成功')
    refetch()
    realPoolStakeReFetch()
  },
  onError(err){
  message.error(err)
  }
})
const transferOK = ()=>{
  transferWrite([
    userInfo.value.systeminfo.initinfo.liquidity_pool,
      parseEther(String(transferValue.value))
  ])
}


const {write,isPending:withdrawPending} = useWrite('withdraw_liquidity_pool',{
  type:'ERC1229',
  onSuccess(){
    message.success('提现成功')
    refetch()
    realPoolStakeReFetch()
  },
  onError(error:any){
    message.error(error)
  }
})
const takeOutOK = ()=>{
  write([
    parseEther(String(takeOutValue.value))
  ])
}

const editTokenAUNValue = ref("0");

// 修改平台用户
const editUserNumberShow = ref(false);
const editUser = ref({
  merchant_add:'',
  number_user:''
});




const { write:baseInfoWrite,isPending:baseInfoPending } = useWrite('set_baseinfo',{
  type:'ERC1229',
  onSuccess(){
    message.success('修改成功')
    refetch()
  },
  onError(error){
    message.error(error)
  }
})
const editUserNumberOk = ()=>{
  baseInfoWrite([
    {
      merchant_add:editUser.value.merchant_add,
      number_user: String(editUser.value.number_user)
    },
  ])
}



const systemParams = ref({});
const systemDomRef = ref<InstanceType<typeof Form>>();


const {write:systemWrite,isPending:systemPending} = useWrite('set_longinfo',{
  type:'ERC1229',
  onSuccess(value:any){
    message.success('修改成功')
    refetch()
  },
  onError(error){
    message.error(error)
  }
})
const systemOnSubmit = ()=>{
  systemDomRef.value
      .validate()
      .then(() => {
        systemWrite([{
          ...systemParams.value,
          buy2parent_rate:ethers.parseEther(String(systemParams.value.buy2parent_rate)),
          node2vip_add_rate:ethers.parseEther(String(systemParams.value.node2vip_add_rate)),
          post_aggregate_airdrop_price:ethers.parseEther(String(systemParams.value.post_aggregate_airdrop_price)),
        }])

      })
}
const systemReset = ()=>{
  systemDomRef.value?.resetFields()
}

const noticeParams = ref({});
const noticeDomRef = ref<InstanceType<typeof Form>>();
const {write:noticeWrite,isPending:otherPending,reset:otherReset} = useWrite('set_otherinfo',{
  type:'ERC1229',
  onSuccess(){
    message.success('修改成功')
    refetch()
  },
  onError(error){
    message.error(error)
  }
})
const noticeOnSubmit = ()=>{
        noticeWrite([noticeParams.value])
}
const noticeReset = ()=>{
  otherReset();
  noticeDomRef.value?.resetFields()
}

const editForm = ref();
const editReset = ()=>{
  console.log(editForm.value)
  editForm.value?.resetFields()
}


const {refetch,data:infoData} = useRead('getinfo',{
  autoRun:false,
  type:'ERC1229',
  needAddress:true,
  onError(error){
    message.error(error)
  }
})


watch(()=>infoData.value,(newVal:any)=>{
  if(!newVal) return;
  userInfo.value = newVal
  console.log(newVal)
  systemParams.value = {
    ...newVal.systeminfo?.longinfo,
    buy2parent_rate:getNumber(newVal.systeminfo?.longinfo,'buy2parent_rate',true),
    node2vip_add_rate:getNumber(newVal.systeminfo?.longinfo,'node2vip_add_rate',true),
    post_aggregate_airdrop_price:getNumber(newVal.systeminfo?.longinfo,'post_aggregate_airdrop_price',true),
  }

  editTokenAUNValue.value = getNumber(newVal,'stake_amount',true)
  editUser.value.number_user = getNumber(newVal.systeminfo.baseinfo,'number_user')
  editUser.value.merchant_add = newVal.systeminfo.baseinfo.merchant_add
  noticeParams.value = {
    ...newVal.systeminfo?.otherinfo
  }
},{
  deep:true,
  immediate:true,
})

const fakePoolStakeShow = ref(false);
const fakePoolStakeValue = ref(0);
const {refetch:fakePoolStakeReFetch, data:fakePoolStakeData} = useRead('fake_add_pool_stake_amount',{
  type:'ERC1229',
  onSuccess(value) {
    fakePoolStakeValue.value = getNumber(value);
  },
})



const {refetch:realPoolStakeReFetch, data:realPoolStakeData} = useRead('total_real_pool_stake_amount',{
  type:'ERC1229'
})



const {write:fakePoolStakeWrite,isPending:fakePoolStakePending} = useWrite('set_fake_add_pool_stake_amount',{
  type:'ERC1229',
  onSuccess(){
    message.success('修改成功')
    fakePoolStakeReFetch()
    fakePoolStakeShow.value = false
  },
  onError(error){
    message.error(error)
  }
})


const fakePoolStakeOK = ()=>{
  if(!fakePoolStakeValue.value){
    message.error('输入错误')
    return;
  }
  fakePoolStakeWrite([parseEther(String(fakePoolStakeValue.value))])
}



</script>

<style lang="scss" scoped>
.gradient-text {
  font-size: 41px;
  font-weight: bold;
  background-image: linear-gradient(to right, #048FFF, #155DFE);
  -webkit-background-clip: text; /* Safari 支持 */
  background-clip: text; /* 其他浏览器 */
  color: transparent; /* 文字本身透明 */
}

.text {
  letter-spacing: 3px;
}

.content {
  height: calc(100% - 179px);
}
</style>
