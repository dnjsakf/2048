// import Modal from './modules/Common/Modal.js'

const Modal = function(_config){
  const self = this;
  const config = Object.assign({}, _config);
  const datas = Object.assign({}, _config.datas);
  const insts = Object.assign({}, _config.insts);
  const doms = Object.assign({}, _config.doms);

  self.el = null;
  
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

Modal.prototype = (function(){
  function _validateConfig(self){
    const valid = true;

    const content = self.getConfig("content");
    if( !content ){
      console.error("Invalid Configuration. content="+content);
    };
    
    return valid;
  }
  
  function _initData(self){

  }
  
  function _init(self){
    if( _validateConfig(self) ){
      _initRender(self);
      _initEvent(self);
    }
  }
  
  function _initRender(self){
    const modals = document.querySelectorAll(".modal.modal-container");

    const id = "modal_" + (modals.length + 1)
    const body = document.querySelector("body");

    const container = document.createElement("div");
    const wall = document.createElement("div");
    const wrapper = document.createElement("div");

    container.id = id;
    container.className = "modal modal-container";
    wall.className = "modal modal-wall";
    wrapper.className = "modal modal-wrapper";
    
    let modalHeader = null;
    let modalBody = null;
    let modalFooter = null;

    const title = self.getConfig("title");
    if( title ){
      modalHeader = _renderHeader(self, title);
      wrapper.appendChild(modalHeader);
    }

    const content = self.getConfig("content");
    if( content ){
      modalBody = _renderBody(self, content);
      wrapper.appendChild(modalBody);
    }

    const buttons = self.getConfig("buttons");
    if( buttons ){
      modalFooter = _renderFooter(self, buttons);
      wrapper.appendChild(modalFooter);
    }
    
    container.appendChild(wall);
    container.appendChild(wrapper);

    self.setDom("container", container);
    self.setDom("wall", wall);
    self.setDom("wrapper", wrapper);
    self.setDom("header", modalHeader);
    self.setDom("body", modalBody);
    self.setDom("footer", modalFooter);

    body.appendChild(container);

    self.el = container;
  }

  function _initEvent(self){
    const wall = self.getDom("wall");
    
    Common.event.bind(wall, "click", function(event){
      event.preventDefault();
      _close(self);
    }, false);
  }

  function _renderHeader(self, title){
    const header = document.createElement("div");
    const wrapper = document.createElement("div");
    const titleEl = document.createElement("a");
    const titleText = document.createTextNode(title);
    
    wrapper.className = "modal modal-header-wrapper";
    header.className = "modal modal-header";
    
    titleEl.appendChild(titleText);    
    wrapper.appendChild(titleEl);
    header.appendChild(wrapper);

    return header;
  }

  function _renderBody(self, content){
    const body = document.createElement("div");
    const wrapper = document.createElement("div");

    body.className = "modal modal-body";
    wrapper.className = "modal modal-body-wrapper";
    
    if( content instanceof Element ){
      wrapper.appendChild( content );
    } else {
      wrapper.innerHTML = content;
    }      
    
    body.appendChild(wrapper);

    return body;
  }

  function _renderFooter(self, options){
    const footer = document.createElement("div");
    const wrapper = document.createElement("div");

    footer.className = "modal modal-footer";
    wrapper.className = "modal modal-footer-wrapper";

    const buttons = document.createElement("div");
    buttons.className = "modal modal-buttons text-right";
    
    options.forEach(function(btnOpt){
      const buttonEl = document.createElement("button");
      const buttonLabel = document.createTextNode(btnOpt.label);

      buttonEl.className = "modal modal-button";
      
      if( btnOpt.id ){
        buttonEl.id = btnOpt.id;
      }

      if( btnOpt.classList && Array.isArray(btnOpt.classList) ){
        btnOpt.classList.forEach(buttonClassName=>{buttonEl.classList.add(buttonClassName)});
      }

      if( btnOpt.onclick && typeof(btnOpt.onclick) === "function" ){
        Common.event.bind(buttonEl, "click", btnOpt.onclick, false);
      }
      /** Set Visibility **/
      const visible = typeof(btnOpt.visible) === 'undefined' || btnOpt.visible;
      if( !visible ){
        buttonEl.classList.add("invisible");
      }

      buttonEl.appendChild(buttonLabel);
      buttons.appendChild(buttonEl);
    });

    wrapper.appendChild(buttons);
    footer.appendChild(wrapper);

    return footer;
  }

  function _handleClose(self){
    return function(event){
      event.preventDefault();
      
    }
  }
  
  function _setContent(self, content){
    const body = self.getDom("body");
    if( content instanceof Element ){
      body.innerHTML = "";
      body.appendChild( content );
    } else {
      body.querySelector(".modal-body-wrapper").innerHTML = content;
    }      
  }

  function _open(self){
    self.getDom("container").classList.add("open");
  }

  function _close(self){
    self.getDom("container").classList.remove("open");
    self.el = null;
  }
  
  function _destroy(self){
    self.getDom("container").remove();
    self.el = null;
  }
  
  return {
    init: function(){
      _init(this);
      return this;
    },
    open: function(){
      if( !this.el ){
        _init(this);
      }
      _open(this);
    },
    close: function(force){
      force ? _destroy(this) : _close(this);
    },
    destroy: function(){
      _destroy(this);
    },
    setContent: function(content){
      _setContent(this, content);
    },
    scrollTop: function(){
      this.getDom("body").querySelector(".modal-body-wrapper").scrollTop = 0;
    }
  }
})();