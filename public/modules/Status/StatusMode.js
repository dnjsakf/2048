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
    
    return valid;
  }
  
  function _initData(self){
    const modeMapping = [{
      label: "4x4",
      data: 4,
      default: true,
    }, {
      label: "5x5",
      data: 5
    }, {
      label: "6x6",
      data: 6
    }];

    const _defaultMode = self.getConfig("defaultMode");
    const defaultMode = _defaultMode ? _defaultMode : modeMapping.filter(mapper=>mapper.default);

    self.setData("modeMapping", modeMapping);
    self.setData("defaultMode", defaultMode);
  }
  
  function _init(self){
    if( _validateConfig(self) ){
      _initData(self);
      _initRender(self);
      _initEvent(self);
    }
  }
  
  function _initRender(self){
    self.el.innerHTML = "";

    const modeMapping = self.getData("modeMapping");
    const defaultMode = self.getData("defaultMode");
    
    const select = document.createElement("select");
    select.name = "mode";
    
    modeMapping.forEach(function(mode){
      const option = document.createElement("option");
      const text = document.createTextNode(mode.label);

      option.value = mode.data;
      option.appendChild(text);
      option.selected = mode.label === defaultMode.label;

      select.appendChild(option);
    });

    self.el.appendChild(select);
  }

  function _initEvent(self){
    const onChangeMode = function(event){
      event.preventDefault();

      const board = self.getInst("board");

    }
    self.el.removeEventListener("change", onChangeMode, false);
    self.el.addEventListener("change", onChangeMode, false);
  }
  
  function _setMode(self, mode){

  }

  function _getMode(self){

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