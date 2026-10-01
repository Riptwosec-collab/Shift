export const VISUAL_PROFILES=Object.freeze({
  HIGH:Object.freeze({ambient:true,scan:true,parallax:true,networkMotion:true,glass:true,richHover:true,continuousMotion:true}),
  BALANCED:Object.freeze({ambient:false,scan:false,parallax:false,networkMotion:false,glass:true,richHover:false,continuousMotion:true}),
  ECO:Object.freeze({ambient:false,scan:false,parallax:false,networkMotion:false,glass:false,richHover:false,continuousMotion:false})
});

export function visualProfile(mode){return VISUAL_PROFILES[mode]||VISUAL_PROFILES.BALANCED}

export function createPerformanceController(root=typeof document!=='undefined'?document.documentElement:null){
  let mode='BALANCED';
  return {
    getVisualMode:()=>mode,
    getProfile:()=>visualProfile(mode),
    setVisualMode(v){
      if(!Object.prototype.hasOwnProperty.call(VISUAL_PROFILES,v))return mode;
      mode=v;
      if(root){
        root.dataset.visual=mode.toLowerCase();
        root.dataset.v65Profile=mode.toLowerCase();
      }
      return mode;
    }
  };
}

export const scheduleIdle=fn=>typeof requestIdleCallback==='function'?requestIdleCallback(fn,{timeout:800}):setTimeout(fn,80);
export function rafThrottle(fn){let raf=0,args;return(...a)=>{args=a;if(raf)return;raf=requestAnimationFrame(()=>{raf=0;fn(...args)})}}
