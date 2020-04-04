import Common, { bindElement } from '/public/modules/Common/Common.js';
import Board from '/public/modules/Game/Board/Board.js';
import Status from '/public/modules/Game/Status/Status.js';


const initConfig = {
  parent: null
}

const Game = function(_config, _el){
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
}

Game.prototype = (function(){
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
    }
  }

  function _initRender(self){
    const wrapper = document.createElement("div");
    wrapper.className = "root-wrapper";
    wrapper.innerHTML = `
    <div id="status"></div>
    <div id="board"></div>
    `;
    self.el.appendChild(wrapper);

    const status = self.el.querySelector("#status").Status({
      parent: self,
      mode: "4x4",
      doms: {
        screen: wrapper
      }
    });
    self.setInst("status", status);
    
    const board = self.el.querySelector("#board").Board({
      parent: self,
      insts: {
        status: status
      }
    });
    self.setInst("board", board);
  }

  return {
    init: function(){
      _init(this);
    }
  }
})();

export default bindElement(Game, initConfig);