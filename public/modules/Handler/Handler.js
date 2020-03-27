const Handler = function(config){
  const self = this;
  const datas = {}
  const insts = {}
  const doms = {}
  
  self.setConfig = (k,v)=>{ config[k] = v; }
  self.getConfig = (k)=>config[k];
  self.setData = (k,v)=>{ datas[k] = v; }
  self.getData = (k)=>datas[k];
  self.setInst = (k,v)=>{ insts[k] = v; }
  self.getInst = (k)=>insts[k];
  self.setDom = (k,v)=>{ doms[k] = v; }
  self.getDom = (k)=>doms[k];
}

Handler.prototype = (function(){
  function _handleKeyDown(self, board){
    return function(event){
      let vector = null;
      if( event.key === "ArrowUp" ){
        vector = "up";
      } else if( event.key === "ArrowDown" ){
        vector = "down";
      } else if( event.key === "ArrowLeft" ){
        vector = "left";
      } else if( event.key === "ArrowRight" ){
        vector = "right";
      }
      
      if( vector ){
        self.move(vector);
      }
    }
  }
  
  function _handleMouseDrag(self, setting){
    return function(event){
      const lock = self.getData("lock");
      const focusPos = self.getData("focusPos");
      
      if( lock && focusPos ){
        console.log( focusPos.x - event.clientX, focusPos.y - event.clientY );
      }
    }
  }
  
  function _handleMouseDown(self, setting){
    return function(event){
      event.preventDefault(); 
      
      self.setData("lock", true);
      if( event.type === "mousedown" ){
        self.setData("focusPos", {
          x: event.clientX, 
          y: event.clientY
        });
      } else if ( event.type === "touchstart" ) {
        console.log( event.changedTouches );
        
        self.setData("focusPos", {
          x: event.changedTouches[0].clientX, 
          y: event.changedTouches[0].clientY
        });
      }
    }
  }
  
  function _handleMouseUp(self, setting){
    return function(event){
      event.preventDefault();
      console.log( event );
      
      const lock = self.getData("lock");
      const focusPos = self.getData("focusPos");
      
      if( lock && focusPos ){
        let clientX = ( event.type === "touchend" ? event.changedTouches[0].clientX : event.clientX );
        let clientY = ( event.type === "touchend" ? event.changedTouches[0].clientY : event.clientY );
        
        const leftAndRight = focusPos.x - clientX;
        const upAndDown = clientY - focusPos.y;
        
        console.log( focusPos, clientX, clientY ); 
        
        let vector = null;
        if( Math.abs(upAndDown) > Math.abs(leftAndRight) ){
          if( upAndDown > 0 ){  
            vector = "down";
          } else if ( upAndDown < 0 ) {
            vector = "up";  
          }
        } else if ( Math.abs(upAndDown) < Math.abs(leftAndRight) ){
          if( leftAndRight > 0 ){  
            vector = "left";
          } else if ( leftAndRight < 0 ) {
            vector = "right";  
          }
        }
        
        if( vector ){
          self.move(vector);
        }
      }
      
      self.setData("lock", false);
      self.setData("focusPos", null);
    }
  }

  return {
    handleKeyDown: function(setting){
      return _handleKeyDown(this, setting);
    },
    handleMouseDown: function(status){
      return _handleMouseDown(this, status);
    },
    handleMouseUp: function(status){
      return _handleMouseUp(this, status);
    },
    handleMouseDrag: function(status){
      return _handleMouseDrag(this, status);
    }
  }
})();