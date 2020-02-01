cc.Class({
    extends: require('AbstractRoomData'),
    getRoomID() {
        return this.serverRoomData.roomId;
    },
    getBaseScore() {
        return this.serverRoomData.minMoney;;
    },
    //implementation of interface
    //获取入场分
    getEnterScore() {
        return this.serverRoomData.downLine;;
    },
    //implementation of interface
    //获取房间名字
    getRoomName() {
        return this.serverRoomData.roomName;
    },
    //implementation of interface
    //是否是体验房
    isFreeRoom() {
        return this.serverRoomData.roomType == 1;
    },


});