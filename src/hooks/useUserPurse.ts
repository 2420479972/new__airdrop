import {useAccount, useConnect, useDisconnect} from '@wagmi/vue';
import {metaMask} from "@wagmi/vue/connectors";
import {useAddressStore} from "store/useAddressStore.ts";
// 链接钱包
export const useEffectWagmi = (options:{ onSuccess(address: `0x${string}` | undefined):void})=>{
    const { connect } = useConnect();
    const { disconnect } = useDisconnect()
    const addressStore = useAddressStore()
    const { status,address      } = useAccount()
    const connectPurse = ()=>{
        connect({connector:metaMask()})
    }
    const disconnectPurse = ()=>{
        disconnect();
        addressStore.address = "";
    }

    watch(()=>status.value,(newVal)=>{
        if(newVal === 'connected' && addressStore.address !== "" && !addressStore.linked){
            options.onSuccess(address.value)
            addressStore.linked = true;
        }
    },{
        immediate: true,
        deep: true,
    })
    return {
        connectPurse,
        disconnectPurse
    }
}