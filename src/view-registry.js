export function createLazyViewRegistry(){
  const views=new Map();
  let active=null;
  return {
    register(name,mount,update=()=>{}){views.set(name,{mount,update,mounted:false})},
    start(name='overview'){active=name;const v=views.get(name);if(!v)return false;if(!v.mounted){v.mount();v.mounted=true}return true},
    show(name){const v=views.get(name);if(!v)return false;active=name;if(!v.mounted){v.mount();v.mounted=true}else v.update();return true},
    updateMounted(names=[...views.keys()]){for(const name of names){const v=views.get(name);if(v?.mounted)v.update()}},
    isMounted(name){return !!views.get(name)?.mounted},
    active(){return active},
    mountedNames(){return [...views].filter(([,v])=>v.mounted).map(([name])=>name)}
  };
}
