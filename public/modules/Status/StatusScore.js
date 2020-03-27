// import StatusScore from './modules/Status/StatusScore.js'

const StatusScore = function(_config, _el){
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

StatusScore.prototype = (function(){
  function _validateConfig(self){
    const valid = true;
    
    return valid;
  }
  
  function _initData(self){
    self.setData("score", 0);
  }
  
  function _init(self){
    if( _validateConfig(self) ){
      _initData(self);
      _initRender(self);
      _initEvent(self);
    }
  }
  
  function _initRender(self){
    self.el.innerHTML = '<a>score:</a>&nbsp;<a>0</a>';
  }

  function _initEvent(self){
   
  }
  
  function _setMatrixScore(self, matrix){
    const score = matrix.reduce(function(prev, crnt, idx){
      if( idx === 1 ){
        prev = prev.filter(col=>col.getData("number"));
      }
      return prev.concat(crnt.filter(col=>col.getData("number")));
    }).reduce(function(prev, crnt, idx){
      if( idx === 1 ){
        prev = prev.getData("number");
      }
      return prev + crnt.getData("number");
    });
    
    _setScore(self, score);
  }

  function _setScore(self, score){
    self.el.innerHTML = '<a>score:</a>&nbsp;<a>'+score+'</a>';
    self.setData("score", score);
  }

  return {
    init: function(){
      _init(this);
    },
    setMatrixScore: function(matrix){
      _setMatrixScore(this, matrix);
    },
    setScore: function(score){
      _setScore(this, score);
    },
    getScore: function(){
      return this.getData("score");
    }
  }
})();

Common.bindElement(StatusScore, {
  parent: null,
});