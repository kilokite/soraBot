'use strict';
const fs = require('fs')//文件系统支持
const chalk = require('chalk')//控制台染色
const tool = require('./tool.js')//工具模块
var path = require('path');//path
//储存插件的对象
var sys_command = require('./sys-cmd.js')//命令处理模块
var plug_command = {

}
//储存cmd命令的对象
var alphaand = '&U'

class user {
    //区分每个用户，通过id
    constructor(uid) {
        this.user_path = 'bot_data/user/' + uid + '/'
        this.num = 0
        this.user_id = uid
        this.speed = {}
        fs.readFile(this.user_path + 'info.json', (err, data) => {
            //读取用户配置文件
            if (err) {
                console.log(chalk.red('[错误]-U001'), '构造器无法通过不存在的uid构造(用户不存在)')
            } else {
                // var info = JSON.parse(data)
                //现在还没什么特别的参数要往里面写，就不解析了
                //console.log(chalk.blue('[调试]OC-0010'),'用户对象构建',this.user_path,uid)
                //console.dir(this)
                //this.ws = ws
                // 保存websocket对象 -  突然意识到这是个贼傻批的操作
                // 我保存个G8
            }
        })
    }
    //讯息处理类
    send(message) {
        //TODO requestID属实没用，找个时间给他砍喽
        var request_msg = {
            'T': 'S',//message Type
            'R': this.msg.R, //Request id
            'M': message //Message
        }
        
        request_msg = JSON.stringify(request_msg)
        this.ws.send(request_msg)
    }

    command_handle(getMsg) {
        var msg = getMsg.M.C
        //命令解析
        var get_cmd = msg.substring(1, msg.length) //delete '/'
        if(get_cmd.indexOf('=>') != -1){
        get_cmd = tool.str.sub(get_cmd, '=>','start')//get big text
        }
        get_cmd = get_cmd.split(' '); //spilt command

        var get_cont = tool.str.sub(msg, '=>','end')//get big text
        var command = get_cmd[0] //指令名 
        get_cmd[0] = get_cont //大文本 => [0]
        if (typeof (sys_command[command]) != 'undefined') {
            //如果有对应的系统命令
            sys_command[command].call(this, get_cmd, getMsg)
            //run
        }
    }

    msg_handle(getMsg, ws) {
        this.num++
        this.ws = ws
        this.msg = getMsg
        //console.dir(this)
        //console.log(chalk.blue('[调试]OC-0010'),'id',this.user_id)
        if (this.msg.M.C == 'alive') {
            //在存活命令&同时刷新资源
            var fromGroup
            console.dir(getMsg)
            if (typeof (getMsg.U.G) == 'undefined') {
                fromGroup = false
            } else {
                fromGroup = true
            }
            this.send("来自平台:" + getMsg.U.F
                + "\n平台id:" + getMsg.U.D
                + "\n平台昵称:" + getMsg.U.N
                + '\n来自群聊:' + fromGroup
                + "\nuid:" + this.user_id
                + "\nrequestID:" + getMsg.R
                + "\n已发送消息条数(你的):" + this.num)
            this.send('你好，谢谢，小笼包，再见')
            var pwd = path.resolve();
            pwd += '/src/sys-cmd.js';
            console.log(pwd);
            delete require.cache[pwd];
            sys_command = require('./sys-cmd.js');
        } else {
            var msg = getMsg.M.C
            if ((msg.length < 10 &&(typeof this.speed[msg]) != 'undefined')||this.speed['ANY'] != 'undefined') {
                getMsg.M.C = this.speed[msg].cont
                console.log(getMsg.M.C)
            }
           // this.speed = {}
            //删除speed 防止上下文不成关系
            //处理快捷方法
            //如果是其他消息
            //首先当命令处理
            if(getMsg.M.C.charAt(0) == "/"){
            this.command_handle(getMsg, this)
            }else{
                //不是命令 
                //TODO 搁这写他河里吗
                var last = msg.charAt(msg.length-1)
              //  console.log('[char]',last)
                if(last == '(' || last == '（'){
                    //this.send((()=>{var str='';for(var i=0;i<((msg.split('(').length-1)+(msg.split('(').length-1));i++){str+=['>','}',')',']','）','》','}','】'][(Math.floor(Math.random()*9))]}return str}))
                    this.send(['>','}',')',']','）','》','}','】','确实('][(Math.floor(Math.random()*9))])
                }

            }
        }
        //this.command_handle(getMsg.M.C)
    }

    showOptions() {
        //用来快速输出选项列表的，你也可以不用
        var request = ''
        for (let key in this.speed) {
            request = request + '\n[' + key + ']' + this.speed[key].info
        }
        return request
    }
}
module.exports = user;
