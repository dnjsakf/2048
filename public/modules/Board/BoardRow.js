const BoardRow = function(_config, _el){
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
}

BoardRow.prototype = (function(){
  function _validateConfig(self){
    const valid = true;
    
    if( !self.getConfig("index") ){
      console.error("Invalid index option.", self.getConfig("index"));
      return false;
    }
    
    return valid;
  }
  
  function _initData(self){
  
  }
  
  function _init(self){
    if( _validateConfig(self) ){
      _initData(self);
      _initRender(self);
    }
  }
  
  function _initRender(self){;
    const index = self.getConfig("index");

    const wrapper = document.createElement("div");
    wrapper.className = "row-wrapper";

    self.el.className = `pannel row r${index}`;
    self.el.appendChild(wrapper);

    self.setDom("wrapper", wrapper);
    
    const cols = self.getConfig("cols");
    if( cols ){
      _setCols(self, cols);
    }
  }
  
  function _setCols(self, cols){
    const wrapper = self.getDom("wrapper");
    if( cols && Array.isArray(cols) ){
      cols.forEach(function(col){
        wrapper.appendChild(col.el);
      });
      self.setInst("cols", cols);
    }
  }

  return {
    init: function(){
      _init(this);
    }, resizing: function(){
      _resizing(this);
    }, setCols: function(cols){
      _setCols(this, cols);
    }
  }
})();

Common.bindElement(BoardRow, {
  parent: null,
  index: null,
  size: {
    width: 100,
    height: 100
  },
  cols: null
});