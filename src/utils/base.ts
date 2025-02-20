import {ethers} from "ethers";
import {BigNumber} from "bignumber.js";
import dayjs from "dayjs";
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');
export function formatAddress(address:string) {
    // 确保地址以 '0x' 开头且长度为42字符
    if (address && address.length === 42 && address.startsWith('0x')) {
        const start = address.slice(0, 6);   // 取前4个字符（0x和第一个字符）
        const end = address.slice(-4);        // 取最后4个字符
        return start + '***' + end;           // 中间部分用'***'替换
    }
    return 'Invalid address';               // 如果地址不符合规范，返回提示
}


export function getNumber(accountInfo:any,key?:string,isBig:boolean = false){
    if(typeof accountInfo === "bigint"){
        return ethers.formatEther(accountInfo)
    }
    if(!key) return 0;
    if(!accountInfo || !accountInfo[key]) return 0;
    if(Number(accountInfo[key]) === 0) return 0;
    if(isBig){
        return ethers.formatEther(accountInfo[key]);
    }
    return accountInfo[key]
}

export async function pingTest(url:string) {
    try {
        const startTime = performance.now(); // 开始时间
        const response = await fetch(url, { cache: 'no-cache', mode: 'no-cors' }); // 避免缓存
        const endTime = performance.now(); // 结束时间
        if (!response.ok && response.type !== 'opaque') {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
         // 计算延迟
        return (endTime - startTime).toFixed(2);
    } catch (error) {
        return 0;
    }
}

export const formatTime = (time:any)=>{
    const timestamp = new BigNumber(time.toString());
    return dayjs(timestamp.toNumber() * 1000).format('YYYY-MM-DD HH:mm').toString();
}


