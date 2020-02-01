/**
 * Date: 2019/08/20
 * Author: KEN
 * Desc: 游戏4-斗地主房间数据
 * 
 */

var AbstractRoomData = require('AbstractRoomData')
var GameConst = require('GameConst')
var RoomData_4 =  cc.Class({
    extends: AbstractRoomData,

    //implementation of interface
    //获取底分
    getBaseScore(){
        return common.util.ConvertMoneyToClient(this.serverRoomData.baseMoney);
    },
    //implementation of interface
    //获取入场分
    getEnterScore(){
        return common.util.ConvertMoneyToClient(this.serverRoomData.minMoney);
    },
    //implementation of interface
    //获取房间名字
    getRoomName(){
        return this.serverRoomData.roomName;
    },
    //implementation of interface
    //是否是体验房
    isFreeRoom(){
        return this.serverRoomData.roomType == 1;
    },
    //implementation of interface
    //获取房间ID
    getRoomID(){
        return this.serverRoomData.roomId;
    },

});

module.exports = RoomData_4;