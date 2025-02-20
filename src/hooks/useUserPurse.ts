import {useConnect} from '@wagmi/vue';
import {metaMask} from "@wagmi/vue/connectors";
// 链接钱包
export const useUserPurse = ()=>{
    const { connect } = useConnect();
    const connectPurse = ()=>{
        connect({connector:metaMask()})
    }
    return {
        connectPurse,
    }
}