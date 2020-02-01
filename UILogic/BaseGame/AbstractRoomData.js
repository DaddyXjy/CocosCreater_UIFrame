/**
 * Date: 2019/08/11
 * Author: dylan
 * Desc: 游戏房间抽象数据
 * 
 */


var AbstractRoomData = cc.Class({
    properties: {
        serverRoomData : null,
    },

    //should implementate by specific class
    //获取底分
    getBaseScore(){
    },

    //should implementate by specific class
    //获取入场分
    getEnterScore(){
    },

    //should implementate by specific class
    //获取房间名字
    getRoomName(){
    },

    //should implementate by specific class
    //是否是体验房
    isFreeRoom(){
    },

    //should implementate by specific class
    //获取房间ID
    getRoomID(){
    },

    setServerRoomData(serverData){
        this.serverRoomData = serverData;
    },

    //进房间前检查
    enterCheck(){
        if(this.isFreeRoom()){
            return true;
        }
        if(this.getEnterScore() <= 0){
            return true;
        }
        var playerCoins = parseFloat(common.playerData.getCoin());
        if (playerCoins < this.getEnterScore()) {
            return false;
        }
        return true;
    },

});

module.exports = AbstractRoomData