
const fs = require('fs'); //文件系统
const execSync = require('child_process')//执行系统命令支持
const WebSocket = require('ws');//websocket支持
const chalk = require('chalk');//控制台染色
//const low = require('lowdb')//json数据库

const tool = require('./src/tool.js')//工具模块
const user = require('./src/user_msg.js')//用户信息处理模块
const user_index = require('./src/user_index.js')//用户索引模块 当前效率不高 文件系统数据库（




var user_obj = {};
//保存用户对象

const wss = new WebSocket.Server({ port: 40233 });
//创建ws服务
wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    //当收到消息
    var getMsg = JSON.parse(message);
    if (getMsg.T == 'M') {
      //如果是发来的信息
      //  alive(getMsg, ws)
      user_index.findUser(getMsg.U.F, getMsg.U.D, (err, uid) => {
        function handle(obj) {
          
          obj.msg_handle(getMsg,ws)
        }
        if (err) {
          user_index.creatUser(getMsg.U.F, getMsg.U.D, (err, uid) => {
            //注册用户，获得uid
            console.log(chalk.blue('[调试]MH-001'),'用户不存在，创建',uid)
            user_obj[uid] = new user(uid)
            handle(user_obj[uid])
          })
        } else {
          //这个用户注册过
         // console.log(chalk.blue('[调试]MH-0010'),'用户存在',uid)
          if(typeof(user_obj[uid]) != 'undefined'){
            //如果已经初始化
            handle(user_obj[uid])
          }else{
            //没有的话，初始化
          user_obj[uid] = new user(uid)
          handle(user_obj[uid])
          }
        }
      })
    }
  })
})



function alive(getMsg, ws) {
  var idgrop = false
  if (getMsg.M.C == 'alive') {
    var request_msg = {
      'T': 'S',
      'R': getMsg.R,
      'M': '你好，谢谢，小笼包，再见'
    }
    request_msg = JSON.stringify(request_msg)
    ws.send(request_msg)
  }

}
//233
console.log(chalk.yellow('[讯息]'), '服务已启动')