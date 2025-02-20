import {ABI97, type ABIERCType, type ABIListType} from "../abis/abi.ts";
import {useAccountEffect, useReadContract} from "@wagmi/vue";
import {type Ref, watch} from "vue";
import {useAddressStore} from "store/useAddressStore.ts";


export const useRead = (functionName:ABIERCType<'ttoken'> | ABIERCType<'ERC1229'>,paramsList:Ref<any[]>|undefined ,options:{
    needAddress?:boolean,
    type:ABIListType,
    onSuccess(value:any):void,
    onError?(error:any):void,
})=>{
    const addressStore = useAddressStore()
    let params:any = {
        functionName,
        abi: ABI97[options.type].abi,
        address: (ABI97[options.type].address) as any,
    };
    if(options.needAddress && addressStore.address != ""){
        params = {
            ...params,
            args: [addressStore.address]
        }
    }
    if(paramsList?.value?.length && options.needAddress && addressStore.address){
        params.args = params?.args?.concat(paramsList.value)
    }else if(paramsList?.value?.length){
        params = {
            ...params,
            args: paramsList.value,
        }
    }

    const {data,error,isLoading,refetch,status} = useReadContract(params)
    useAccountEffect({
        onConnect(data) {
            addressStore.address = data.address;
            if(options.needAddress){
                params.args = [addressStore.address].concat(params.args).filter(item=>item.length > 0)
            }
            refetch();
        }
    })

    watch(()=>status.value,(newVal)=>{
        if(newVal == "success"){
            options.onSuccess(data.value)
        }else if(newVal == 'error'){
            options.onError && options.onError(error.value)
        }
    },{
        deep: true,
        immediate: true,
    })
    return {
        refetch,
        isLoading,
        error,
        status,
        data
    }
}