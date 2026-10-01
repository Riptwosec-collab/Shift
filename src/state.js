export function createAppState(){
  const listeners=new Map();
  const state={activeView:'overview',selectedDay:1,selectedPerson:0,visualMode:'BALANCED'};
  const emit=(name,value)=>{for(const fn of listeners.get(name)||[])fn(value,{...state})};
  state.subscribe=(name,fn)=>{const list=listeners.get(name)||[];list.push(fn);listeners.set(name,list);return()=>listeners.set(name,list.filter(x=>x!==fn))};
  state.setSelectedDay=value=>{const day=Math.max(1,Math.min(31,Number(value)||1));if(day!==state.selectedDay){state.selectedDay=day;emit('day',day)}return day};
  state.setSelectedPerson=value=>{const index=Math.max(0,Math.min(9,Number(value)||0));if(index!==state.selectedPerson){state.selectedPerson=index;emit('person',index)}return index};
  state.setActiveView=value=>{const view=['overview','daily','person','month','analytics'].includes(value)?value:'overview';if(view!==state.activeView){state.activeView=view;emit('view',view)}return view};
  state.setVisualMode=value=>{const mode=['HIGH','BALANCED','ECO'].includes(value)?value:'BALANCED';if(mode!==state.visualMode){state.visualMode=mode;emit('visualMode',mode)}return mode};
  state.snapshot=()=>({activeView:state.activeView,selectedDay:state.selectedDay,selectedPerson:state.selectedPerson,visualMode:state.visualMode});
  return state;
}
