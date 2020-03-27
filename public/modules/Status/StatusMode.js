// import StatusMode from './modules/Status/StatusMode.js'

const StatusMode = function(_config, _el){
  const self = this;
  const parent = _config.parent;
  const config = Object.assign({}, _config);
  const datas = Object.assign({}, _config.datas);
  const insts = Object.assign({}, _config.insts);
  const doms = {}
  
  self.el = _el;
  self.el.instance = self;

  self.setConfig = (k,v)=>{ config[k] = v; }
  self.getConfig = (k)=>config[k];
  self.setData = (k,v)=>{ datas[k] = v; parent.setData(k, v); }
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
    const _defaultMode = self.getConfig("defaultMode");
    
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

    const mode = _defaultMode ? _defaultMode : modeMapping.filter(mapper=>mapper.default)[0];

    self.setData("modeMapping", modeMapping);
    self.setData("mode", mode);
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

    const label = document.createElement("a");
    const labelText = document.createTextNode("mode: ");
    label.appendChild(labelText);

    self.el.innerHTML = "";

    const modeMapping = self.getData("modeMapping");
    const mode = self.getData("mode");
    
    const select = document.createElement("select");
    select.name = "mode";
    
    modeMapping.forEach(function(mapper){
      const option = document.createElement("option");
      const text = document.createTextNode(mapper.label);

      option.value = mapper.data;
      option.appendChild(text);
      option.selected = mapper.label === mode.label;

      select.appendChild(option);
    });

    self.setDom("select", select);

    self.el.appendChild(label);
    self.el.appendChild(select);
  }

  function _initEvent(self){
    
  }
  
  function _setMode(self, _mode){
    const modeMapping = self.getData("modeMapping");
    const mode = modeMapping.filter(mapper=>mapper.data==_mode)[0];

    console.log( mode );

    self.setData("mode", mode);
  }

  function _getMode(self){

  }

  function _handleChangeMode(self, handler){
    const select = self.getDom("select");

    Common.event.bind(select, "change", handler.bind(self), false);
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
    },
    onChange: function(handler){
      return _handleChangeMode(this, handler);
    }
  }
})();

Common.bindElement(StatusMode, {
  parent: null,
});