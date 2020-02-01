/**
 * Date: 2019/08/08
 * Author: dylan
 * Desc: 游戏房间数据管理器
 * 
 */

var RoomDataMgr = cc.Class({
    properties: {
        //游戏序号
        gameIndex : 0,
        //房间列表
        _roomList:[],
    },

    //从服务器初始化房间
    initRoomsFromServer(serverRoomDatas){
        cc.assert(serverRoomDatas);
        var RoomData = require(`RoomData_${this.gameIndex}`);
        cc.assert(RoomData , `can't find RoomData for game : ${this.gameIndex}`);
        this._roomList = [];
        serverRoomDatas.forEach(serverRoomData => {
            var roomData = new RoomData();
            roomData.setServerRoomData(serverRoomData);
            this._roomList.push(roomData);
        });
        this._sortRoomList();
    },

    //获取房间 
    getRoom(roomID){
        let findRoom = this._roomList.find((room) => {
            return room.getRoomID() == roomID;
        })
        return findRoom;
    },

    getRoomIndex(roomData){
        let index = this._roomList.indexOf(roomData);
        return index;
    },

    hasFreeRoom(){
        let findRoom = this._roomList.find((room) => {
            return room.isFreeRoom();
        })
        return findRoom;
    },

    getRoomList(){
        return this._roomList;
    },

    _sortRoomList(){
        this._roomList.sort(function(lhs,rhs){
            if (rhs.isFreeRoom() && !lhs.isFreeRoom()) {
                return 1;
            }
            if (!rhs.isFreeRoom() && lhs.isFreeRoom()) {
                return -1;
            }
            if(rhs.getEnterScore() > lhs.getEnterScore())
            {
                return -1;
            }
            if(rhs.getEnterScore() < lhs.getEnterScore())
            {
                return 1;
            }
            if(rhs.getBaseScore() > lhs.getBaseScore())
            {
                return -1;
            }
            if(rhs.getBaseScore() < lhs.getBaseScore())
            {
                return 1;
            }
            return 0;
        });
    }

});

module.exports = RoomDataMgr