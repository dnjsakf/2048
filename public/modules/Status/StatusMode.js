// import StatusMode from './modules/Status/StatusMode.js'

const StatusMode = function(_config, _el){
  const self = this;
  const config = Object.assign({}, _config);
  const datas = {}
  const insts = {}
  const doms = {}
  
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

StatusMode.prototype = (function(){
  function _validateConfig(self){
    const valid = true;

    const size = self.getConfig("size");
    if( !size ){
      console.error("Invalid size option.", size);
      return false;
    }
    
    return valid;
  }
  
  function _initData(self){
    const size = self.getConfig("size");
    const modeMapping = {
      "small": "4x4",
      "meddium": "6x6",
      "large": "9x9"
    }
    self.setData("modeMapping", modeMapping);
    self.setData("mode", modeMapping[size]);
  }
  
  function _init(self){
    if( _validateConfig(self) ){
      _initData(self);
      _initRender(self);
      _initEvent(self);
    }
  }
  
  function _initRender(self){
    const mode = self.getData("mode");

    self.el.innerHTML = '<a>mode:</a>&nbsp;<a>'+mode+'</a>';
  }

  function _initEvent(self){
   
  }
  
  function _setMode(self, mode){
    self.el.innerHTML = '<a>mode:</a>&nbsp;<a>'+mode+'</a>';

    self.setData("mode", self.getData("modeMapping")[mode]);
  }

  return {
    init: function(){
      _init(this);
    },
    setMode: function(mode){
      _setMode(this, mode);
    },
    getMode: function(){
      return this.getData("mode");
    }
  }
})();

Common.bindElement(StatusMode, {
  parent: null,
});