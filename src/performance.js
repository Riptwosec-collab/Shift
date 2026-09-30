export function createPerformanceController(root=typeof document!=='undefined'?document.documentElement:null){let mode='BALANCED';return {getVisualMode:()=>mode,setVisualMode(v){if(!['HIGH','BALANCED','ECO'].includes(v))return mode;mode=v;if(root){root.dataset.visual=mode.toLowerCase()}return mode}}}
export const scheduleIdle=fn=>typeof requestIdleCallback==='function'?requestIdleCallback(fn,{timeout:800}):setTimeout(fn,80);
export function rafThrottle(fn){let raf=0,args;return(...a)=>{args=a;if(raf)return;raf=requestAnimationFrame(()=>{raf=0;fn(...args)})}}
