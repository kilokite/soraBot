const fs = require('fs'); //文件系统
const chalk = require('chalk');//控制台染色
const tool = require('./tool');
var index = {
    'QQ':{},
    'TG':{}
}
//储存索引的对象，因为仅用于临时所以单独写


var about = {
    creatUser: function (user_from, user_id, callback) {
        function creatIndex(from, id,uid, callback) {
            var index_path = 'bot_data/index/' + from + '/'
            var file = index_path + id
            var request = {
                uid: uid
            }
            fs.writeFile(file, JSON.stringify(request), (err) => {
                if (err) {
                    console.log(chalk.red('[错误]CI-001'), '为用户创建索引失败？')
                    callback(true)
                } else {
                    callback(false)
                }
            })
        }

        var uuid = tool.guid();
        //生成这个用户的uuid
        var user_path = 'bot_data/user/' + uuid + '/'
        fs.mkdir(user_path, {}, (err) => {
            //生成用户文件夹
            if (err) {
                console.log(chalk.red('[错误]CU-001'), '无法创建对应文件夹')
                callback(true, 'shit')
            } else {
                var request = {
                    F: {}, //From
                    D: uuid //D
                }
                request.F[user_from] = user_id;
                fs.writeFile(user_path + 'info.json', JSON.stringify(request), (err) => {
                    if (err) {
                        console.log(chalk.red('[错误]CU-002'), '用户信息无法写入')
                        callback(true, 'shit')
                    } else {
                        console.log(chalk.green('[信息]CU-003'), '已创建用户' + uuid)
                        creatIndex(user_from, user_id,uuid, (err) => {
                            callback(false, uuid)
                        })

                    }
                })
            }


        }
        )
    },
    findUser: function (from, id, callback) {
        //根据用户的平台搜寻用户
        var file_path = 'bot_data/index/' + from + '/' + id
        if (typeof (index[from][id]) == 'undefined') {
            //内存中无此用户
            fs.readFile(file_path, (err, data) => {
                if (err) {
                    callback(true, 0)
                } else {
                    var uid = JSON.parse(data).uid
                    index[from][id] = uid
                    callback(false, uid)
                }
            })
        }else{
            //有这个用户的话
            callback(false,index[from][id])
        }
    }
}
module.exports = about;