var mock = {
  loadSVGFromString: function(){},
  util: {
    object:{
      clone: function(){
        return {
          clone: function(){
            return this;
          },
          getWidth: function(){
            return 0;
          },
          getHeight: function(){
            return 0;
          },
          setScaleX: function(){},
          setScaleY: function(){},
          setLeft: function(){},
          setTop: function(){},
          set: function(){}
        };
      }
    },
    groupSVGElements: function(){}
  },
  Canvas: function(){
    return {
      add: function(){},
      clear: function(){}
    };
  },
  Line: function(){
    return {
      getWidth: function() {
        return 10;
      },
      set: function(){}
    }
  },
  Group: function(){
    return {
      removeWithUpdate: function(){},
      addWithUpdate: function(){},
      setLeft: function(left){
        this.left = left;
      },
      setTop: function(top){
        this.top = top;
      },
      setWidth: function(width){
        this.width = width;
      }
    }
  },
  Text: function(text){
    var widthHeight = text.split(',');
    var width = parseInt(widthHeight[0]);
    var height = parseInt(widthHeight[1]);

    return {
      getWidth: function(){
        return width;
      },
      getHeight: function(){
        return height;
      }
    }
  }
}

module.exports = mock;
