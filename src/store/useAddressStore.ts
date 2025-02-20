import {defineStore} from "pinia";
export const useAddressStore = defineStore("useAddressStore",()=>{
    const address = ref("");
    return {
        address
    }
},{
    persist: {
        storage:localStorage,
    },
})