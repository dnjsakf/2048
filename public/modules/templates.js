// import RankingList from './modules/List/RankingList.js'

const RankingList = function(_config, _el){
  const self = this;
  const config = Object.assign({}, _config);
  const datas = Object.assign({}, _config.datas);
  const insts = Object.assign({}, _config.insts);
  const doms = Object.assign({}, _config.doms);
  
  self.el = _el;
  self.el.instance = self;

  self.setConfig = (k,v)=>{ config[k] = v; }
  self.getConfig = (k)=>config[k];      
  self.setData = (k,v)=>{ datas[k] = v; }
  self.getData = (k)=>datas[k];
  self.setInst = (k,v)=>{ insts[k] = v; }
  self.getInst = (k)=>insts[k];
  self.setDom = (k,v)=>{ doms[k] = v; }
  self.getDom = (k)=>doms[k];

  Common.extends.bind(self)([Common]);
}

RankingList.prototype = (function(){
  function _validateConfig(self){
    const valid = true;
    
    return valid;
  }
  
  function _initData(self){

  }
  
  function _init(self){
    if( _validateConfig(self) ){
      _initData(self);
      _initRender(self);
      _initEvent(self);
    }
  }
  
  function _initRender(self){
    
  }

  function _initEvent(self){
   
  }
  
  return {
    init: function(){
      _init(this);
    }
  }
})();

Common.bindElement(RankingList, {
  parent: null
});