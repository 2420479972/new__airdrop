// 获取目标 DOM 元素
import {Snackbar} from "@varlet/ui";


function useClipboard() {
    const isCopied = ref(false); // 用于记录复制状态
    // 复制到剪贴板的函数
    const copyText = (text: string) => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            // 使用现代浏览器的 Clipboard API
            navigator.clipboard.writeText(text).then(() => {
                isCopied.value = true;
                setTimeout(() => {
                    isCopied.value = false;
                }, 2000); // 复制后 2 秒内显示已复制
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        } else {
            // 兼容较旧的浏览器
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                isCopied.value = true;
                setTimeout(() => {
                    isCopied.value = false;
                }, 2000);
            } catch (err) {
                console.error('Fallback: Failed to copy text: ', err);
            } finally {
                document.body.removeChild(textarea);
            }
        }
    };
    return {
        isCopied,
        copyText
    };
}

const {copyText,isCopied} = useClipboard()

export const handleCopy = async (text: string,t:any) => {
    copyText(text);
    if(isCopied){
        Snackbar.success({
            content: t('public.copy'),
            duration: 1000,
        })

    }

};