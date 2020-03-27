// import Status from './modules/Status/Status.js'

const Status = function(_config, _el){
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

Status.prototype = (function(){
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
    const html = `
    <div id="status_wrapper">
      <ul>
        <li class="status mode"></li>
        <li class="status score"></li>
      </ul>
    </div>
    `;
    self.el.innerHTML = html;

    const mode = self.el.querySelector(".status.mode").StatusMode({
      size: self.getConfig("size")
    })
    const score = self.el.querySelector(".status.score").StatusScore({});

    self.setInst("mode", mode);
    self.setInst("score", score);
  }

  function _initEvent(self){
   
  }
  
  return {
    init: function(){
      _init(this);
    }
  }
})();

Common.bindElement(Status, {
  parent: null,
  size: "small"
});