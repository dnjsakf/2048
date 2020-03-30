// import Status from './modules/Status/Status.js'

const Status = function(_config, _el){
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

      _getSize(self);
    }
  }
  
  function _initRender(self){
    const defaultMode = self.getConfig("mode");
    const html = `
    <div class="status-wrapper">
      <ul>
        <li class="status mode"></li>
        <li class="status score"></li>
      </ul>
    </div>
    `;
    self.el.innerHTML = html;

    const mode = self.el.querySelector(".status.mode").StatusMode({
      parent: self,
      defaultMode: defaultMode
    })
    const score = self.el.querySelector(".status.score").StatusScore({
      parent: self
    });

    self.setInst("mode", mode);
    self.setInst("score", score);
  }

  function _initEvent(self){
   
  }

  function _getBoardSize(self){
    const screen = self.getDom("screen");
    const boardSize = {
      width: screen.offsetWidth,
      height: screen.offsetHeight - self.el.offsetHeight
    }
    return boardSize;
  }

  function _getBoxSize(self){
    const mode = self.getInst("mode");

    const boardSize = self.getData("boardSize");
    const matrixSize = mode.getMatrixSize();
    const boxStyle = mode.getBoxStyle();

    const boxWidth = parseInt((boardSize.width - (boxStyle.margin*matrixSize)) / matrixSize);
    const boxHeight = parseInt((boardSize.height - (boxStyle.margin*matrixSize)) / matrixSize);

    const boxSize = boxWidth >= boxHeight ? boxHeight : boxWidth;

    return boxSize;
  }

  function _getSize(self){
    const boardSize = _getBoardSize(self);
    self.setData("boardSize", boardSize);

    const matrixSize = self.getInst("mode").getData("matrixSize");;
    self.setData("matrixSize", matrixSize);

    const boxSize = _getBoxSize(self);
    self.setData("boxSize", boxSize);

    const size = {
      board: boardSize,
      matrix: matrixSize,
      box: boxSize
    }
    self.setData("size", size);

    return size;
  }
  
  return {
    init: function(){
      _init(this);
    },
    getSize: function(key){
      const size = _getSize(this);

      return key ? size[key] : size;
    },
    getScore: function(){
      return this.getInst("score").getData("score")
    }
  }
})();

Common.bindElement(Status, {
  parent: null
});