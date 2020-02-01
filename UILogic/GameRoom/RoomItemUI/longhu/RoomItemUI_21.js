/*
 * @Author: Mango
 * @Date: 2019-08-15 10:03:31
 * @Description: 压庄龙虎房间Item
 * @LastEditTime: 2019-08-15 10:09:19
 */

var GameDataMgr = require("GameDataMgr")
let UIUtil = require('UIUtil')
let resultConvert = {
    '1': 1,
    '4': 2,
    '9': 3
}
cc.Class({
    extends: require('RoomItemUIBase'),

    properties: {

    },
    start(){
        this.schedule(() => {
            this.updateTime();
        }, 1);
    },
    refreshUI() {
        let gameData = GameDataMgr.getGameData(this.gameIndex);
        let roomData = gameData.getRoomMgr().getRoom(this.roomID);
        let roomIndex = gameData.getRoomMgr().getRoomIndex(roomData);
        let hasFreeRoom = gameData.getRoomMgr().hasFreeRoom();
        let topicUIIndex = roomIndex;
        if (!hasFreeRoom) {
            topicUIIndex = roomIndex + 1;
        }
        if (roomData.isFreeRoom()) {
            topicUIIndex = 0;
        }
        if (topicUIIndex > 5) {
            topicUIIndex = 5
        }
        let roomTitlePath = `textures/game_room/road_list/room_title_${topicUIIndex}`;
        UIUtil.setSprite(this._img_roomname, roomTitlePath);

        roomData = roomData.serverRoomData;
        let his = roomData.history;
        let future = this._way.getComponent('LongHU_WayBill');
        future.clearn();
        this.his = [];
        if (his.length > 50) {
            his = his.slice(his.length - 50);
        }
        this.his = his;
        for (let i = 0; i < his.length; ++i) {
            future.putResult(resultConvert[his[i]]);
        }
        future.addNext();
        if (roomData.hostAble) {
            this._label_shangzhuang.$Label.string = '可上庄';
        } else {
            this._label_shangzhuang.$Label.string = '不可上庄';
        }
        this._label_xianhong_check.$Label.string = '限红' + roomData.minBet / 1000 + '-' + roomData.maxBet / 1000;
        this.setData(roomData.statusInfo);
        this.updateV();
    },
    setData(state) {
        if (state.status == 2) {
            return;
        }
        let mm = ['等待中', '下注中', '下注中', '开奖中', '洗牌'];
        this._label_time.$Label.string = mm[state.status - 1] + state.restTime + '秒';
        if (state == 5) {
            let future = this._way.getComponent('LongHU_WayBill');
            future.clearn();
            this.his = [];
        }
    },
    updateTime() {
        var re = /[0-9]+/
        let str = this._label_time.$Label.string;
        let time = str.match(re);
        time = parseInt(time);
        if (time > 0) {
            time--;
        }
        this._label_time.$Label.string = str.replace(re, time);
    },
    updateV() {
        let dragon = 0,
            tiger = 0,
            pice = 0,
            len = this.his.length;
        for (var i = 0; i < len; ++i) {
            if (resultConvert[this.his[i]] == 1) {
                dragon++;
            } else if (resultConvert[this.his[i]] == 2) {
                tiger++;
            } else if (resultConvert[this.his[i]] == 3) {
                pice++;
            }
        }
        let vdragon = Math.round(dragon / len * 100);
        let vtiger = Math.round(tiger / len * 100);
        let vpice = 100 - vdragon - vtiger;
        this._labelV1.$Label.string = dragon + '(' + vdragon + '%)';
        this._labelV2.$Label.string = tiger + '(' + vtiger + '%)';
        this._labelV3.$Label.string = pice + '(' + vpice + '%)';
    },
    onUpdateReward(data) {
        if (this.roomID == data.roomId) {
            this.setData(data.statusInfo);
            if (data.statusInfo.status == 4) {
                this._way.getComponent('LongHU_WayBill').putResult(resultConvert[data.result]);
                this._way.getComponent('LongHU_WayBill').addNext();
                this.his.push(data.result);
                this.updateV();
            }
        }
    },
    _onTouchEnd() {
        this.doEnterRoom();
    },

    onDestroy() {
        clearInterval(this.myInterval)
    },
});