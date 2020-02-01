var GameDataMgr = require("GameDataMgr")
let UIUtil = require('UIUtil')
cc.Class({
    extends: require("RoomItemUIBase"),

    properties: {
        his: null,
        tian: 0,
        di: 0,
        xuan: 0,
        huang: 0
    },

    onLoad() {
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
        this.updataState(roomData.gameState, roomData.time);
        if (roomData.banker) {
            this._label_shangzhuang.$Label.string = '可上庄';
        } else {
            this._label_shangzhuang.$Label.string = '不可上庄';
        }
        this._label_xianhong_check.$Label.string = '限红' + roomData.downLine / 1000 + '-' + roomData.upLine / 1000;
        this.his = roomData.history;
        this.updataHis();
        this.countV();
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
    updataHis() {
        let spt = this._zhuNode.getComponent('bainiuHisNode');
        spt.init();
        for (let i = 0; i < this.his.length; ++i) {
            spt.addHisNode(this.his[i].list);
        }
    },
    countV() {
        let tian, di, xuan, huang
        tian = di = xuan = huang = 0;
        let len = this.his.length;
        for (let i = 0; i < len; ++i) {
            if (this.his[i].list[0] > 0) {
                tian++;
            }
            if (this.his[i].list[1] > 0) {
                di++;
            }
            if (this.his[i].list[2] > 0) {
                xuan++;
            }
            if (this.his[i].list[3] > 0) {
                huang++;
            }
        }
        this._labelV1.$Label.string = tian;
        this._labelV2.$Label.string = di;
        this._labelV3.$Label.string = xuan;
        this._labelV4.$Label.string = huang;
        tian = tian / len * 100;
        di = di / len * 100;
        xuan = xuan / len * 100;
        huang = huang / len * 100;
        this._labelN1.$Label.string = Math.round(tian) + '%';
        this._labelN2.$Label.string = Math.round(di) + '%';
        this._labelN3.$Label.string = Math.round(xuan) + '%';
        this._labelN4.$Label.string = Math.round(100 - tian - di - xuan) + '%';
    },
    onUpdateReward(data) {
        if (this.roomID == data.roomId) {
            this.updataState(data.state, data.time)
            if (data.opens) {
                this._zhuNode.getComponent('bainiuHisNode').addHisNode(data.opens);
                this.his.push({
                    list: data.opens
                });
                if (this.his.length > 20) {
                    this.his.shift();
                }
                this.countV();
            }
        }

    },
    updataState(state, tiem) {
        let stateName = ['等待中：', '下注中：', '开奖中：'];
        this._label_time.$Label.string = stateName[state] + tiem + '秒';
    },
    _onTouchEnd() {
        this.doEnterRoom();
    },

    onDestroy() {
        clearInterval(this.myInterval)
    },
});