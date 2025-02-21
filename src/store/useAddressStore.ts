import {defineStore} from "pinia";
export const useAddressStore = defineStore("useAddressStore",()=>{
    const address = ref("");
    const linked = ref(false);
    return {
        address,
        linked
    }
},{
    persist: {
        storage:localStorage,
    },
})