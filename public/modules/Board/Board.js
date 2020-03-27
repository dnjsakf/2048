// import Handler from './modules/Handler/Handler.js'

const Board = function(_config, _el){
  const self = this;
  const config = Object.assign({}, _config);
  const datas = Object.assign({}, _config.datas);
  const insts = Object.assign({}, _config.insts);
  const doms = {}
  const status = {
    focus: null,
    lock: false
  }
  
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
  self.setStatus = (k,v)=>{ status[k] = v; }
  self.getStatus = (k)=>status[k];
  self.getAllStatus = ()=>status;

  Common.extends.bind(self)([Common, Handler]);
}

Board.prototype = (function(){
  function _validateConfig(self){
    const valid = true;
    
    return valid;
  }
  
  function _initData(self){
    const isMobile = self.isMobile();

    _sizing(self);
  }

  function _sizing(self){
    const status = self.getInst("status");

    const matrixSize = status.getData("mode").data;
    const margin = status.getData("margin");
    const screen = status.getData("screen");

    const boxWidth = parseInt((screen.width - (margin*matrixSize)) / matrixSize);
    const boxHeight = parseInt((screen.height - (margin*matrixSize)) / matrixSize);

    const boxSize = boxWidth >= boxHeight ? boxHeight : boxWidth;

    self.setData("matrixSize", matrixSize);
    self.setData("boxSize", boxSize);
  }
  
  function _init(self){
    if( _validateConfig(self) ){
      _initData(self);
      _initRender(self);
      _initEvent(self);
    }
  }
  
  function _initRender(self){
    const wrapper = document.createElement("div");
    wrapper.className = "board-wrapper";
    
    if( self.el.children ){
      Array.from(self.el.children).forEach(children=>children.remove());
    }
  
    const matrixSize = self.getData("matrixSize");
    const matrix = [];
    const rows = Array(matrixSize).fill(1).map(function(rowInc, rowIdx){
      const rowIndex = rowIdx+rowInc;
      const row = document.createElement("div").BoardRow({
        parent: self.el,
        index: rowIndex,
        id: "r"+rowIndex
      });
      
      const cols = Array(matrixSize).fill(1).map(function(colInc, colIdx){
        const colIndex = colIdx+colInc;
        const col = document.createElement("div").BoardCol({
          parent: row,
          index: colIndex,
          id: "c"+colIndex,
          size: self.getData("boxSize")
        });

        return col;
      });
      
      row.setCols(cols);
      
      matrix.push(cols);
      
      wrapper.appendChild(row.el);
      
      return row;
    });
    
    self.setInst("rows", rows);
    self.setData("matrix", matrix);
    
    self.el.appendChild(wrapper);

    _createNumber(self, self.getConfig("defaultCount"));
  }

  function _initEvent(self){
    const onHandleKeyDown = self.handleKeyDown();
    Common.event.bind(document, "keydown", onHandleKeyDown, false);
    
    const onMouseDown = self.handleMouseDown();
    Common.event.bind(self.el, "mousedown", onMouseDown, false);
    
    const onTouchDown = self.handleMouseDown();
    Common.event.bind(self.el, "touchstart", onTouchDown, {passive:false});
    
    const onMouseUp = self.handleMouseUp();
    Common.event.bind(document, "mouseup", onMouseUp, false);
    
    const onTouchUp = self.handleMouseUp();
    Common.event.bind(document, "touchend", onTouchUp, {passive:false});

    const status = self.getInst("status");
    const mode = status.getInst("mode");

    mode.onChange(function(event){
      this.setMode(event.target.value);

      _init(self);

      event.target.blur();
    });
  }
  
  function _createNumber(self, count){
    const defaultNumber = self.getConfig("defaultNumber");
    
    const emptyCols = self.getData("matrix").reduce((prev, crnt, idx)=>{
      if( idx === 1 ){
        prev = prev.filter(col=>!col.getData("number"));
      }
      return prev.concat(crnt.filter(col=>!col.getData("number")));
    });
    
    if( emptyCols.length > 0 ){
      for(let i=0; i<count; i++){
        const randCol = emptyCols[parseInt(Math.random()*emptyCols.length)];
        randCol.setNumber(defaultNumber);
      }
    }
  }
  
   function _extractNumber(self, numbers){
    if( numbers && Array.isArray(numbers) && numbers.length > 1 ){
      const storage = [];
      numbers.reduce(function(prev, crnt, _idx){
        let returnNumber = crnt;

        if( prev === crnt ){
          storage.push( prev + crnt );
          returnNumber = null;
        } else {
          if( prev ){
            storage.push( prev );
          }
        }

        if( returnNumber && _idx === numbers.length-1 ){
          storage.push( crnt );
        }

        return returnNumber;
      });
      return storage;
    } else {
      return numbers;
    }
  }
  
  function _resetMatrix(self, cross, reverse){
    const crossedMatrix = self.getData("matrix").cross(cross, reverse);
    
    let checker = 0;
    let changer = 0;
    crossedMatrix.forEach(function(row, idx){
      const filteredNumbers = row.map(col=>col.getData("number")).filter(number=>!!number).reverse();
      const calcedNumbers = _extractNumber(self, filteredNumbers);      
      
      const emptyArr = Array(crossedMatrix.length-calcedNumbers.length).fill(null);
      
      const numbersMatrix = reverse ? calcedNumbers.concat(emptyArr) : emptyArr.concat(calcedNumbers.reverse());

      const reverseRow = [].concat(row).reverse();
      numbersMatrix.forEach(function(number, idx){
        const baseCol = reverse ? reverseRow[idx] : row[idx];
        const baseNumber = baseCol.getData("number");

        if( baseNumber !== number ){
          baseCol.setNumber(number);
        } else {
          changer += 1;
        }
        checker += 1; 
      });
    });

    return checker !== changer;
  }
  
  function _move(self, vector){
    if( vector === "up" ){
      reverse = true;
      cross = true;
    } else if( vector === "down" ){
      reverse = false;
      cross = true;
    } else if( vector === "left" ){
      reverse = true;
      cross = false;
    } else if( vector === "right" ){
      reverse = false;
      cross = false;
    }
    
    const create = _resetMatrix(self, cross, reverse);
    const scoreInst = self.getInst("status").getInst("score");
    if( create ){
      _createNumber(self, 1);

      scoreInst.setMatrixScore(self.getData("matrix"))
    }
  }

  return {
    init: function(){
      _init(this);
    },
    createNumber: function(count){
      _createNumber(this, (count?count:1));
    },
    move: function(vector){
      if( vector ){
        _move(this, vector);
      }
    },
    reset: function(config){
      const self = this;
      if( config ){
        const resetConfig = Object.assign({}, initBoardConfig, config);
        
        Object.keys(resetConfig).forEach((key)=>self.setConfig(key, resetConfig[key]));
      }
      _init(self);
    }
  }
})();

const initBoardConfig = {
  parent: null,
  size: "medium",
  defaultNumber: 2,
  defaultCount: 2,
  resize: true
}

Common.bindElement(Board, initBoardConfig);