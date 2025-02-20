import {ABI97, type ABIERCType, type ABIListType} from "../abis/abi.ts";
import {useWriteContract} from "@wagmi/vue";
import {useAddressStore} from "store/useAddressStore.ts";

export const useWrite = (functionName: ABIERCType<'ttoken'> | ABIERCType<'ERC1229'>, options: {
    needAddress?: boolean,
    type: ABIListType,
    onSettled?:(error: any)=>void,
    onSuccess(value: any): void,
    onError?(error: any): void,

}) => {
    const addressStore = useAddressStore()
    const {writeContractAsync, isPending,error} = useWriteContract()
    const write = async (paramsList: any[]) => {
        let params:any= {
            functionName
        };
        if (options.needAddress && addressStore.address) {
            params = {
                ...params,
                args: [addressStore.address]
            }
        }
        if (paramsList.length && options.needAddress && addressStore.address) {
            params.args = params?.args?.concat(paramsList)
        } else if (paramsList.length) {
            params = {
                ...params,
                args: paramsList
            }
        }
        await writeContractAsync({
            abi: ABI97[options.type].abi,
            address: (ABI97[options.type].address) as any,
            
            ...params
        }, {
            onSuccess: async (value) => {
                options.onSuccess(value)
            },
            onError: async (error) => {
                options.onError?.(error)
            },
        })
    }
    return {
        isPending,
        write,

    }
}