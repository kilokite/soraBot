
var tool = {
    //工具类
    guid: function (){
      //生成uuid
      function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      }
      return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    },
    test: function () {
      //这个没G8用
      console.log("tool is okay")
    },
    str: {
      sub: function (text, start, end = 'end') {
        if (end == 'end') {
          //默认参数 截取到最后
          return text.substring(text.indexOf(start) + start.length, text.length)
        } else if (end == 'start') {
          //从头开始
          return text.substring(0, text.indexOf(start))
        } else {
          //两个字符串之间截取
          return text.substring(text.indexOf(start) + start.length, text.indexOf(end))
        }
      }
    }
  }
module.exports =   tool;