var mock = function(){
  return {
    straight: function(){
      return {
        setLeft: function(){},
        setTop: function(){}
      };
    },
    loopback: function(){
      return {
        setLeft: function(){},
        setTop: function(){},
        getHeight: function(){return 0;},
        getWidth: function(){return 0;}
      };
    }
  }
}

module.exports = mock;
