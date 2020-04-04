const Handler = function(_parent, _config){
  const self = this;
  const config = _config||{};
  const datas = {};

  self.parent = _parent;
  
  self.setConfig = (k,v)=>{ config[k] = v; }
  self.getConfig = (k)=>config[k];      
  self.setData = (k,v)=>{ datas[k] = v; }
  self.getData = (k)=>datas[k];
}

Handler.prototype = (function(){
  function _handleKeyDown(self){
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
        self.parent.move(vector);
      }
    }
  }
  
  function _handleMouseDrag(self){
    return function(event){
      const lock = self.getData("lock");
      const focusPos = self.getData("focusPos");
      
      if( lock && focusPos ){
        console.log( focusPos.x - event.clientX, focusPos.y - event.clientY );
      }
    }
  }
  
  function _handleMouseDown(self){
    return function(event){
      self.setData("lock", true);
      if( event.type === "mousedown" ){
        self.setData("focusPos", {
          x: event.clientX, 
          y: event.clientY
        });
      } else if ( event.type === "touchstart" ) {
        self.setData("focusPos", {
          x: event.changedTouches[0].clientX, 
          y: event.changedTouches[0].clientY
        });
      }
    }
  }
  
  function _handleMouseUp(self){
    return function(event){
      if( self.move ){
        const lock = self.getData("lock");
        const focusPos = self.getData("focusPos");
        
        if( lock && focusPos ){
          let clientX = ( event.type === "touchend" ? event.changedTouches[0].clientX : event.clientX );
          let clientY = ( event.type === "touchend" ? event.changedTouches[0].clientY : event.clientY );
          
          const leftAndRight = focusPos.x - clientX;
          const upAndDown = clientY - focusPos.y;

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
      }      
      self.setData("lock", false);
      self.setData("focusPos", null);
    }
  }

  return {
    handleKeyDown: function(){
      return _handleKeyDown(this);
    },
    handleMouseDown: function(){
      return _handleMouseDown(this);
    },
    handleMouseUp: function(){
      return _handleMouseUp(this);
    },
    handleMouseDrag: function(){
      return _handleMouseDrag(this);
    }
  }
})();

export default Handler;