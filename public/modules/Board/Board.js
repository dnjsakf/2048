//import Handler from '/public/modules/Handler/Handler.js'
//import Common from '/public/modules/Common/Common.js'

const Board = function(_config, _el){
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

  Common.extends.bind(self)([Common, Handler]);
}

Board.prototype = (function(){
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

      const defaultCount = self.getConfig("defaultCount"); 
      _createNumber(self, defaultCount);
      
      const status =  self.getInst("status");
      status.getInst("score").init()
      
      _gameOver(self);
    }
  }
  
  function _initRender(self){
    self.el.innerHTML = "";
    
    const wrapper = document.createElement("div");
    wrapper.className = "board-wrapper";
  
    const size = self.getInst("status").getSize();
    const matrix = [];
    const rows = Array(size.matrix).fill(1).map(function(rowInc, rowIdx){
      const rowIndex = rowIdx+rowInc;
      const row = document.createElement("div").BoardRow({
        parent: self.el,
        index: rowIndex,
        id: "r"+rowIndex
      });
      
      const cols = Array(size.matrix).fill(1).map(function(colInc, colIdx){
        const colIndex = colIdx+colInc;
        const col = document.createElement("div").BoardCol({
          parent: row,
          index: colIndex,
          id: "c"+colIndex,
          size: size.box
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
  }

  function _initEvent(self){
    _unbindEvent(self);
    
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
    status.getInst("mode").onChange(function(event){
      this.setMode(event.target.value);

      _init(self);

      event.target.blur();
    });
    
    if( !self.isMobile() ){
      Common.event.bind(window, "resize", _handleResize(self), false);
    }
  }
  
  function _unbindEvent(self){
    Common.event.unbind(document, "keydown");
    Common.event.unbind(self.el, "mousedown");
    Common.event.unbind(self.el, "touchstart");
    Common.event.unbind(document, "mouseup");
    Common.event.unbind(document, "touchend");
    Common.event.unbind(window, "resize");
    Common.event.unbind(self.getInst("status").getInst("mode").el, "change");
  }

  function _handleResize(self){
    const status = self.getInst("status");
    const matrix = self.getData("matrix");

    return function(event){
      matrix.forEach(row=>row.forEach(col=>col.setSize(status.getSize("box"))))
    }
  }

  function _createNumber(self, count){
    const defaultNumber = self.getConfig("defaultNumber");
    
    for(let i=0; i<count; i++){
      const emptyCols = self.getData("matrix").reduce((prev, crnt, idx)=>{
        if( idx === 1 ){
          prev = prev.filter(col=>!col.getData("number"));
        }
        return prev.concat(crnt.filter(col=>!col.getData("number")));
      });
      
      if( emptyCols.length > 0 ){
        const randCol = emptyCols[parseInt(Math.random()*emptyCols.length)];
        randCol.setNumber(defaultNumber);
      } else {
        break;
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
  

  function _checkResetMatrix(self, matrix, cross, reverse){
    const crossedMatrix = self.crossArray(matrix, cross, reverse);
    const resetCols = []
    
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
          resetCols.push({
            inst: baseCol,
            number: number
          })
        } else {
          changer += 1;
        }
        checker += 1; 
      });
    });

    return {
      reset: checker !== changer,
      cols: checker !== changer ? resetCols : null
    }
  }

  function _gameOver(self){
    _unbindEvent(self);
    
    const inst =  document.createElement("div").RankingList({
      url: "/game/rank",
      params: {
        mode: self.getData("mode")
      },
      header: true,
      columns: [
        { label: "Rank", name: "rank", width: "2", align: "center" },
        { label: "Name", name: "name", width: "4", align: "center" },
        { label: "Score", name: "score", width: "3", align: "right" },
        { label: "Date", name: "reg_dttm", width: "3", align: "center" },
      ]
    });
    
    let modal = self.getInst("modal");
    if( !modal || !modal.el ){
      modal = new Modal({
        title: "Ranking",
        content: inst.el,
        buttons: [{
          label: "취소",
          id: "btn-cacnle",
          classList: [ "btn-cancle" ],
          onclick: function(event){
            event.preventDefault();
            modal.close();
          },
        }, {
          label: "저장",
          id: "btn-save",
          classList: [ "btn-save" ],
          onclick: function(event){
            event.preventDefault();
            modal.close(true);

            _init(self);
          },
        }]
      });
      self.setInst("modal", modal);
    } else {
      modal.setContent(inst.el);
    }
    modal.open();
  }

  function _checkGameOver(self){
    const matrix = self.getData("matrix");

    const check_1 = _checkResetMatrix(self, matrix, cross, !reverse);
    const check_2 = _checkResetMatrix(self, matrix, cross, !reverse);
    const check_3 = _checkResetMatrix(self, matrix, !cross, reverse);
    const check_4 = _checkResetMatrix(self, matrix, !cross, !reverse);

    return !check_1.reset && !check_2.reset && !check_3.reset && !check_4.reset
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
    
    const matrix = self.getData("matrix");
    const checked = _checkResetMatrix(self, matrix, cross, reverse);
    if( checked.reset ){
      checked.cols.forEach((reset)=>{reset.inst.setNumber(reset.number)});

      _createNumber(self, 1);

      self.getInst("status").getInst("score").setMatrixScore(matrix);
    }

    const gameOver = _checkGameOver(self);
    if( gameOver ){
      _gameOver(self);
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