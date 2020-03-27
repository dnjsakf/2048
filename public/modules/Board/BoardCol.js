const BoardCol = function(_config, _el){
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

  Common.extends.bind(self)([Common,Handler]);
}

BoardCol.prototype = (function(){
  function _validateConfig(self){
    const valid = true;
    
    if( !self.getConfig("index") ){
      console.error("Invalid index option.", self.getConfig("index"));
      return false;
    }
    
    if( !self.getConfig("size") ){
      console.error("Invalid size option.", self.getConfig("size"));
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
      _initEvent(self);
    }
  }
  
  function _initRender(self){
    const pIndex = self.getConfig("parent").getConfig("index")
    const index = self.getConfig("index");
    const size = self.getConfig("size");
    
    self.el.className = `pannel col r${pIndex} c${index} s${size} empty`;
    self.el.style.left = ((size*(index-1))+(5*index))+"px";
    self.el.style.top = ((size*(pIndex-1))+(5*pIndex))+"px";
    self.el.style.paddingTop = (parseInt(size/2)-15)+"px"
  }
  
  function _initEvent(self){
    const col = self.el;

    col.addEventListener("mousedown", self.handleMouseDown());
    col.addEventListener("mouseup", self.handleMouseUp());
  }

  function _resetNumber(self){
    Array.from(self.el.children).forEach(children=>children.remove());
    self.el.classList.add("empty");
    self.el.style.removeProperty("background-color");
    self.setData("number", null);
  }

  function _setNumber(self, number){
    _resetNumber(self);

    if( number ){
      const a = document.createElement("a");
      const text = document.createTextNode(number);
      a.appendChild(text);

      console.log( self.getAlpha(number) );
  
      self.el.style.backgroundColor = `rgba(255, 71, 0, ${self.getAlpha(number)*2}%)`;
      self.el.appendChild(a);
    }
    
    self.setData("number", number);
  }
  
  return {
    init: function(){
      _init(this);
    }, setNumber: function(number){
      _setNumber(this, number);
    }, resetNumber: function(){
      _resetNumber(this);
    }
  }
})();

Common.bindElement(BoardCol, {
  parent: null,
  index: null,
  size: {
    width: 100,
    height: 100
  }
});