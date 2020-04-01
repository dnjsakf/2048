// import RankingList from './modules/List/RankingList.js'

const RankingList = function(_config, _el){
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

RankingList.prototype = (function(){
  function _validateConfig(self){
    const valid = true;
    
    const url = self.getConfig("url");
    if( !url ){
      console.error("Invalid Configuration. url="+url);
      return false;
    }
    
    return valid;
  }
  
  function _initData(self, callback){
    /** Get Data **/
    const url = self.getConfig("url");
    const params = self.getConfig("params");
    
    const response = axios({
      method: "GET", 
      url: url,
      baseurl: "http://localhost:3000",
      params: params ? params : null,
      headers: {
        "Content-Type": "application/json"
      }
    }).then(function(result){
      if( result.data.success ){
        console.log( result.data );
        callback(null, result.data.payload, result);
      } else {
        callback(result.data.error, null, result);
      }
    }).catch(function(error){
      console.error( error );
      callback(error, null, null);
    });
  }
  
  function _init(self){
    if( _validateConfig(self) ){
      _initData(self, function(error, data, response){
        if( !error ){
          _checkRankList(self, data.rank_list);
          
          _initRender(self);
          _initEvent(self);

          const newRankInput = self.getDom("newRankInput");
          if( newRankInput ){
            newRankInput.focus();
          }
        }
      });
    }
  }
  
  function _initRender(self){
    self.el.innerHTML = "";
    
    const ul = document.createElement("ul");
    
    /** Render List Headers **/
    if( self.getConfig("header") ){
      const header = _renderHeader(self);
      
      ul.appendChild(header);
      
      self.setDom("header", header);
    };
    
    /** Render List Item **/
    const listItems = _renderListItem(self)
    listItems.forEach(function(item){
      ul.appendChild(item);
    });
    
    self.el.appendChild(ul);
  }

  function _initEvent(self){
   
  }
  
  function _renderHeader(self){
    const columns = self.getConfig("columns");
    
    const header = document.createElement("li");
    const row = document.createElement("div");
    
    row.className = "list-header item-row"
    
    columns.forEach(function(column){
      const col = document.createElement("div");
      
      /** Set Width **/
      const width = "c"+(column.width || 12 );      
      col.className = "item-col "+width;
      
      /** Set Align **/
      col.classList.add("text-center");
      
      /** Set Text **/      
      const textEl = document.createElement("a");
      const textNode = document.createTextNode(column.label);
      textEl.appendChild(textNode);
      col.appendChild(textEl);
      
      /** Set Visibility **/
      const visible = typeof(column.visible) === 'undefined' || column.visible;
      if( !visible ){
        col.classList.add("invisible");
      }

      row.appendChild(col);
    });
    header.appendChild(row);
    
    return header;
  }
  
  function _renderListItem(self){
    const listData = self.getData("list");
    const columns = self.getConfig("columns");
    
    const listItems = listData.map(function(data){
      const listItem = document.createElement("li");
      const row = document.createElement("div");
      
      row.className = "list-data item-row";
      columns.forEach(function(column){
        const col = document.createElement("div");
        
        /** Set Width **/
        const width = "c"+(column.width || 12 );
        col.className = "item-col "+width;
        
        /** Set Align **/
        if( column.align ){
          const align = "text-"+column.align;
          col.classList.add(align);
        }
        
        if( column.name === "name" && data.newRank ){
          const input = document.createElement("input");
          input.type = "text";
          input.className = "text-center";
          input.maxLength = 10;
          
          col.appendChild(input);

          self.setDom("newRankInput", input);

          Common.event.bind(input, "keydown", self.getConfig("events").onKeyDown(data), false);
        } else {
          /** Set Text **/  
          const text = data[column.name] || column.defaultText || ""
          const textEl = document.createElement("a");
          const textNode = document.createTextNode(text);
          textEl.appendChild(textNode);
          col.appendChild(textEl);
        }
      
        /** Set Visibility **/
        const visible = column.visible || true;
        if( !visible ){
          col.classList.add("invisible");
        }
        
        row.appendChild(col);
      });
      
      listItem.appendChild(row);
      
      return listItem;
    });
    
    return listItems;
  }
  
  function _checkRankList(self, listData){
    let rankList = listData;
    const rankData = self.getData("rankData");

    if( rankData ){
      const grateRank = listData.filter(function(data){
        return rankData.score <= data.score;
      });
      rankList = [].concat( grateRank );
  
      const ranker = grateRank.length !== listData.length;
      // if( listData.length === 0 || ranker ){
        const newRankData = Object.assign({newRank: true, rank: grateRank.length+1}, rankData);
        const lessRank = listData.filter(function(data){
          return [
            rankData.score > data.score,
            rankData.mode === data.mode
          ].reduce((prev, crnt)=>( prev && crnt ));
        }).map(function(data){
          return Object.assign(data, { rank: data.rank+1 } )
        });
        rankList.push( newRankData );
        rankList = rankList.concat( lessRank );
        
        self.setData("newRankData", newRankData);
      // }
    }
    self.setData("list", rankList);
  }
  
  return {
    init: function(){
      _init(this);
    },
    reload: function(){
      this.setData("list", null);
      this.setData("rankData", null);

      _init(this);
    },
    checkRank: function(data){
      _checkRank(this, data);
    },
    getNewRankData: function(){
      const newRankData = this.getData("newRankData");
      const newRankInput = this.getDom("newRankInput");
      const newRankName = newRankInput.value;
      
      return Object.assign(newRankData, {name: newRankName});
    }
  }
})();

Common.bindElement(RankingList, {
  parent: null,   // Instance
  url: null,      // String
  datas: {
    list: null    // Array
  }
});