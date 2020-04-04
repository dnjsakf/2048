const Common = {}

const _isMobile = function(){
  const checker = [
    "iPhone", "iPod", "Android", "Windows CE", 
    "BlackBerry", "Symbian", "Windows Phone", 
    "webOS", "Opera Mini", "Opera Mobi", "POLARIS", 
    "IEMobile", "lgtelecom", "nokia", "SonyEricsson",
    "LG","SAMSUNG","Samsung"
  ];
  const regex = RegExp(checker.join("|"), "i")
  
  return regex.test(navigator.userAgent);
}
export const isMobile = _isMobile;

const _getAlpha =  function(number, count){
  return number > 2 ? _getAlpha(number/2, ++count) : count
}
export const getAlpha = _getAlpha;


const _animate = function(element, animation_name, ms){
  if( !element.classList.contains("animated") ){
    element.classList.add(animation_name, "animated", "ms"+ms);
    setTimeout(function(){
      element.classList.remove(animation_name, "animated", "ms"+ms);
    }, ms+10);
  }
}
export const animate = _animate;

const _crossArray = function(array, cross, reverse){
  const crossedMatrix = cross ? array.map(function(row){
    return row.map(function(){
      return Array();
    });
  }) : array;
  
  if( cross ){
    array.forEach(function(row, rowIdx){
      row.forEach(function(col, colIdx){
        crossedMatrix[colIdx][rowIdx] = col;
      });
    });
  }
  return reverse ? crossedMatrix.map(row=>[].concat(row).reverse()) : crossedMatrix;
}
export const crossArray = _crossArray;


const _extend = function(funcs, setting){
  const self = this;
  function _load(func){
    if( typeof(func) === 'function' ){
      const obj = new func(setting);
      Object.keys(obj.__proto__).forEach(function(proto){
        if( typeof(self.__proto__[proto]) === 'undefined' ){
          self.__proto__[proto] = obj.__proto__[proto]
        }
      });
    }
  }
  if(funcs && Array.isArray(funcs)){
    funcs.forEach(function(func, idx){
      let _setting = null;
      if( setting && Array.isArray(setting) ){
        try {
          _setting = setting[idx];
        } catch {}
      }
      _load(func, _setting);
    });
  } else {
    _load(funcs, setting);
  }
}
export const extend = _extend;


const _bindElement = function(func, initConfig){
  Element.prototype[func.name] = function(setting){
    const element = this;
    const config = initConfig||{};

    if( setting ){
      Object.assign(config, setting);
    }

    element.getInstance = function(){
      return this.instance;
    }

    const obj = new func(config, element);

    obj.init();

    return obj;
  }
  return func;
}
export const bindElement = _bindElement;


let bindings = [];
const _bindEvent = function(el, action, event, args){
  const binded = bindings.filter(function(binding){
    return binding.target === el && binding.action === action;
  });
  if( binded.length === 0 ){
    el.addEventListener(action, event, args);
    bindings.push({
      target: el,
      action: action,
      event: event,
      args: args
    });
  }
}
export const bindEvent = _bindEvent;


const _unbindEvent = function(el, action, args){
  const binded = bindings.filter(function(binding){
    return binding.target === el && binding.action === action;
  });

  if( binded && binded.length > 0 ){
    const rebined = [];
    const _binded = binded[0];

    bindings.forEach(function(binding){
      const filtering = [
        binding.target === _binded.target,
        binding.action === _binded.action,
      ].reduce(function(prev, crnt){
        return prev && crnt;
      });

      if( filtering ){
        _binded.target.removeEventListener(_binded.action, _binded.event, args);
      } else {
        rebined.push( binding );
      }
      return filtering;
    });
    bindings = rebined;
  }
}
export const unbindEvent = _unbindEvent;

export default {
  isMobile: _isMobile,
  getAlpha: _getAlpha,
  bindEvent: _bindEvent,
  unbindEvent: _unbindEvent,
  bindElement: _bindElement,
  animate: _animate,
  crossArray: _crossArray
};