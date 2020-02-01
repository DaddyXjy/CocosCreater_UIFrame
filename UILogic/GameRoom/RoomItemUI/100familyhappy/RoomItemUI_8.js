/*
 * @Author: Mango
 * @Date: 2019-08-15 10:03:31
 * @Description: 压庄龙虎房间Item
 * @LastEditTime: 2019-08-15 10:09:19
 */

var GameDataMgr = require("GameDataMgr")
let UIUtil = require('UIUtil')
cc.Class({
    extends: require('RoomItemUIBase'),

    properties: {

    },
    start() {
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
        let future = this._way.getComponent('100familyhappyway');
        future.clearn();
        this.his = [];
        if (his.length > 50) {
            his = his.slice(his.length - 50);
        }
        this.his = his;
        for (let i = 0; i < his.length; ++i) {
            future.putResult(this.coverResult(his[i]));
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
    coverResult(result) {
        switch (result) {
            case 1:
                return 0x1;
            case 2:
                return 0x2;
            case 3:
                return 0x3;
            case 14:
                return 0x11;
            case 15:
                return 0x101;
            case 145:
                return 0x111;
            case 24:
                return 0x12;
            case 25:
                return 0x102;
            case 245:
                return 0x112;
            case 34:
                return 0x13;
            case 35:
                return 0x103;
            case 345:
                return 0x113;
        }
    },
    setData(state) {
        console.log("专题    " + state.status);
        let mm = ['等待中', '下注中', '开奖中'];
        this._label_time.$Label.string = mm[state.status - 1] + state.restTime + '秒';
    },
    updateTime() {
        var re = /[0-9]+/;
        let str = this._label_time.$Label.string;
        let time = str.match(re);
        time = parseInt(time);
        if (time > 0) {
            time--;
        }
        this._label_time.$Label.string = str.replace(re, time);
    },
    updateV() {
        let z = 0,
            x = 0,
            h = 0,
            zd = 0,
            xd = 0;
        let len = this.his.length;
        for (var i = 0; i < len; ++i) {
            let resutl = this.coverResult(this.his[i]);
            let mm = resutl & 0xf;
            if (mm == 1) {
                z++;
            } else if (mm == 2) {
                x++;
            } else {
                h++;
            }
            if (resutl & 0xf0) {
                zd++;
            }
            if (resutl & 0xf00) {
                xd++;
            }
        }
        let vz = Math.round(z / len * 100);
        let vx = Math.round(x / len * 100);
        let vh = 100 - vz - vx;
        let vzd = Math.round(zd / len * 100);
        let vxd = Math.round(xd / len * 100);
        this._labelV1.$Label.string = z + '(' + vz + '%)';
        this._labelV2.$Label.string = x + '(' + vx + '%)';
        this._labelV3.$Label.string = h + '(' + vh + '%)';
        this._labelV4.$Label.string = zd + '(' + vzd + '%)';
        this._labelV5.$Label.string = xd + '(' + vxd + '%)';
    },
    onUpdateReward(data) {
        if (this.roomID == data.roomId) {
            this.setData(data.statusInfo);
            if (data.statusInfo.status == 3) {
                this._way.getComponent('100familyhappyway').putResult(this.coverResult(data.result));
                this._way.getComponent('100familyhappyway').addNext();
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