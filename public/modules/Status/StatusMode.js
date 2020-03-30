// import StatusMode from './modules/Status/StatusMode.js'

const StatusMode = function(_config, _el){
  const self = this;
  const parent = _config.parent;
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

StatusMode.prototype = (function(){
  function _validateConfig(self){
    const valid = true;
    
    return valid;
  }
  
  function _initData(self){
    const defaultMode = self.getConfig("defaultMode");
    const modeOptions = [{
      label: "3x3",
      data: 3,
      style: {
        margin: 5+3
      }
    }, {
      label: "4x4",
      data: 4,
      style: {
        margin: 5+3
      },
      default: true,
    }, {
      label: "5x5",
      data: 5,
      style: {
        margin: 5+3
      }
    }, {
      label: "6x6",
      data: 6,
      style: {
        margin: 5+3
      }
    }];
    self.setData("modeOptions", modeOptions);

    const mode = modeOptions.filter(mapper=>defaultMode ? mapper.label === defaultMode : mapper.default)[0];

    _setMode(self, mode.data);
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

    const container = document.createElement("div");
    container.className = "input-field";
    
    const modeOptions = self.getData("modeOptions");
    const mode = self.getData("mode");
    
    const select = document.createElement("select");
    select.name = "mode";
    select.className = "dropdown-select";
    
    modeOptions.forEach(function(mapper){
      const option = document.createElement("option");
      const text = document.createTextNode(mapper.label);

      option.value = mapper.data;
      option.appendChild(text);
      option.selected = mapper.label === mode.label;

      select.appendChild(option);
    });

    container.appendChild(select);
    
    self.el.appendChild(container);
    self.setDom("select", container);
  }

  function _initEvent(self){
    
  }
  
  function _setMode(self, _mode){
    const modeOptions = self.getData("modeOptions");
    const mode = modeOptions.filter(mapper=>mapper.data==_mode)[0];

    self.setData("mode", mode);
    self.setData("boxStyle", mode.style);
    self.setData("matrixSize", mode.data);
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
    getMatrixSize: function(){
      return this.getData("matrixSize");
    },
    getBoxStyle: function(){
      return this.getData("boxStyle");
    },
    onChange: function(handler){
      return _handleChangeMode(this, handler);
    }
  }
})();

Common.bindElement(StatusMode, {
  parent: null,
});