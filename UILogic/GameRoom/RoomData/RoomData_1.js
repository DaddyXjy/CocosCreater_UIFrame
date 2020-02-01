/**
 * Date: 2019/08/11
 * Author: dylan
 * Desc: 游戏1-奔驰宝马房间数据
 * 
 */

var AbstractRoomData = require('AbstractRoomData')
var GameConst = require('GameConst')

var RoomData_1 =  cc.Class({
    extends: AbstractRoomData,

    //implementation of interface
    //获取底分
    getBaseScore(){
        return this.serverRoomData.downLine;
    },
    //implementation of interface
    //获取入场分
    getEnterScore(){
        return 0;
    },
    //implementation of interface
    //获取房间名字
    getRoomName(){
        return this.serverRoomData.roomName;
    },
    //implementation of interface
    //是否是体验房
    isFreeRoom(){
        return false;
    },
    //implementation of interface
    //获取房间ID
    getRoomID(){
        return this.serverRoomData.roomId;
    },

});

module.exports = RoomData_1;