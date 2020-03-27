const Handler = function(config){
  const self = this;
  const datas = {}
  const insts = {}
  const doms = {}
  const status = {
    focus: null,
    lock: false
  }
  
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
}

Handler.prototype = (function(){

  function _crossMatrix(matrix, cross, reverse){
    const temp = matrix.map(function(row){
      return row.getInst("cols").map(function(){
        return Array();
      });
    });

    matrix.forEach(function(row, rowIdx){
      let _rowIdx = null;
      let _colIdx = null;
      row.getInst("cols").forEach(function(col, colIdx){
        _rowIdx = cross ? colIdx : rowIdx;
        _colIdx = cross ? rowIdx : colIdx;

        col.setData("index", _colIdx);

        temp[_rowIdx][_colIdx] = col;
      });
      
      if( reverse ){
        temp[_rowIdx] = [].concat(temp[_rowIdx]).reverse(cross);
      }
    });

    return temp;
  }

  function _handleKeyDown(config){
    // Init Config
    return function(event){
      let reverse = false;
      let cross = false;
      
      let moving = null;
      if( event.key === "ArrowUp" ){
        moving = "top";
        reverse = false;
        cross = true;
      } else if( event.key === "ArrowDown" ){
        moving = "down";
        reverse = true;
        cross = true;
      } else if( event.key === "ArrowLeft" ){
        moving = "left";
        reverse = true;
        cross = false;
      } else if( event.key === "ArrowRight" ){
        moving = "right";
        reverse = false;
        cross = false;
      }

      if( moving ){
        console.log(moving, config.rows);
        const matrix = _crossMatrix(config.rows, cross, reverse);
        
        matrix.forEach(function(row, idx){
          console.groupCollapsed("row-"+idx);

          const cols = row;
          const crossedCols = [].concat(row).reverse(cross);

          console.groupCollapsed("Array");
          console.log("cols", cols.map(col=>col.el));
          console.log("crossedCols", crossedCols.map(col=>col.el));
          console.groupEnd("Array");

          console.groupCollapsed("Column-Info");

          const fromColumn = cols.reduce(function(prev, crnt){
            if( prev && prev.getData("number") ){
              console.log( crnt.getData("number") ? crnt : prev );
              return prev;
            } else if( crnt.getData("number") ){
              return crnt;
            } else {
              return null;
            }
          });
          console.log( "form", fromColumn && fromColumn.el );

          const toColumn = crossedCols.reduce(function(prev, crnt){
            if( crnt === fromColumn ){
              return prev;
            }
            if( crnt.getData("number") ){
              return crnt;
            }
            if( prev && prev.getData("number") ){
              return prev;
            }
            return prev;
          });
          console.log( "to", toColumn && toColumn.el );

          let closestCol = cols[cols.indexOf(toColumn)-1];
          if( reverse ){
            closestCol = crossedCols[crossedCols.indexOf(toColumn)+1]
          }

          console.log( "closest", closestCol && closestCol.el );
          console.groupEnd("Column-Info");

          if( fromColumn && toColumn && fromColumn !== toColumn ){
            const fromNumber = fromColumn.getData("number");
            const toNumber = toColumn.getData("number");

            fromColumn.removeNumber();

            if( !toNumber ){
              toColumn.appendNumber(fromNumber);
            } else if( toNumber === fromNumber ){
              toColumn.appendNumber(toNumber + fromNumber);
            } else {
              closestCol.appendNumber(fromNumber);
            }
          }

          if( !config.rows[idx].el.classList.contains("move") ){
            config.rows[idx].el.classList.add("move", moving);
            setTimeout(function(){
              config.rows[idx].el.classList.remove("move", moving);
            }, 310);
          }

          console.groupEnd("row-"+idx);
        });
      }
    }
  }

  function _handleMouseMove(event){
    if( status.focus && status.lock ){
      const focusPos = status.focusPos;

      const focusX = focusPos.x;
      const focusY = focusPos.y;

      const mouseX = event.clientX;
      const mouseY = event.clientY;

      const moveX = mouseX-focusX;
      const moveY = mouseY-focusY;

      status.focus.style.left = moveX+"px";
      status.focus.style.top = moveY+"px";
    }
  }
  function _handleMouseDown(event){
    event.preventDefault();

    const pos = this.getBoundingClientRect();

    const mouseX = event.clientX;
    const mouseY = event.clientY;
    
    status.lock = true;
    status.focus = this;
    status.focusPos = {
      x: (mouseX-pos.x),
      y: (mouseY-pos.y)
    }
  }
  
  function _handleMouseUp(event){
    event.preventDefault();
    
    status.lock = false;
    status.focus = null;
    status.focusPos = null;
  }

  return {
    handleKeyDown: function(setting){
      return _handleKeyDown(setting);
    },
    handleMouseDown: function(status){
      if( status ){
        Object.assign(this.status, status);
      }
      return _handleMouseDown;
    },
    handleMouseUp: function(status){
      if( status ){
        Object.assign(this.status, status);
      }
      return _handleMouseUp;
    },
    handleMouseMove: function(status){
      if( status ){
        Object.assign(this.status, status);
      }
      return _handleMouseMove;
    }
  }
})();

Handler.extends = function(obj){
  if( typeof(obj) === 'object' ){
    Object.keys(Handler.prototype).forEach(function(proto){
      if( typeof(obj.__proto__[proto]) === 'undefined' ){
        obj.__proto__[proto] = Handler.prototype[proto];
      }
    });
  }
  return obj;
}