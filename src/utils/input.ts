export function debounce(fn: Function, ms: number) {  //fn:要防抖的函数 ms:时间
    let timerId // 创建一个标记用来存放定时器的返回值
    return function () {
        timerId && clearTimeout(timerId) // 每当用户输入的时候把前一个 setTimeout clear 掉
        timerId = setTimeout(() => { 
            fn.apply(this, arguments)
        }, ms)
    }
}