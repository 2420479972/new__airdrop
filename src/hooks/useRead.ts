import {ABI, type ABIERCType, type ABIListType} from "../abis/abi.ts";
import {useAccount, useAccountEffect, useBlockNumber, useChainId, useReadContract} from "@wagmi/vue";
import {watch} from "vue";


export const useRead = (functionName:ABIERCType<'ttoken'> | ABIERCType<'ERC1229'> ,options:{
    autoRun?:boolean,
    needAddress?:boolean,
    needAddAndAuto?:boolean,
    type:ABIListType,
    onSuccess?(value:any):void,
    onError?(error:any):void,
    initParams?:any[]
})=>{
    const chainId = useChainId();
    const {address} = useAccount()
    const params:any = reactive({
        functionName,
        abi: ABI[chainId.value][options.type].abi,
        address: (ABI[chainId.value][options.type].address) as any,
        cacheTime:0,
        query:{
            enabled:typeof options.autoRun ===  'undefined'  ? true : options.autoRun
        }
    });
    if(options.initParams){
        params.args = options.initParams;
    }
    const {data,error,isLoading,refetch,status} = useReadContract(params)
    watch(()=>status.value,(newVal)=>{
        if(newVal == "success"){
            options.onSuccess && options.onSuccess(data.value)
        }else if(newVal == 'error'){
            options.onError && options.onError(error.value)
        }
    },{
        deep: true,
        immediate: true,
    })
    const setParams =async (args:any[])=>{
        params.args = args;
        await refetch();
    }
    const { data: blockNumber } = useBlockNumber({
        watch: true, // 监听区块变化
    });

    watch(()=>blockNumber.value,async()=>{
        if(status.value == 'success'){
            await refetch();
        }
    },{
        immediate:true,
        deep:true
    })

    watch(()=>address.value,(newVal)=>{
        if(!newVal) return;
        if(options.needAddress && typeof options.needAddAndAuto == 'undefined' ? true : options.needAddAndAuto){
            if(options.needAddress && options.initParams){
                params.args = [newVal].concat(...options.initParams)
            }else if(options.needAddress){
                params.args = [newVal]
            }
            refetch()
        }
    },{
        immediate: true,
        deep: true
    })
    return {
        refetch,
        isLoading,
        error,
        status,
        data,
        setParams
    }
}