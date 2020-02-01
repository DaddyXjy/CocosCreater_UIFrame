// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var GameDataMgr = require("GameDataMgr")
let uiutil = require('UIUtil')
cc.Class({
    extends: require('RoomItemUIBase'),

    properties: {},
    refreshUI() {
        let roomData = GameDataMgr.getGameData(this.gameIndex).getRoomMgr().getRoom(this.roomID).serverRoomData;
        this._labeldi.$Label.string = roomData.downLine / 1000 + '-' + roomData.downLine / 1000 + '底分';
        this._down.$Label.string = roomData.minMoney + '入场';
        if (this._spineNode.childrenCount != 0) {
            return;
        }
        let config = {
            "体验房": "spine",
            "初级房": "spine1",
            "中级房": "spine2",
            "高级房": "spine3",
            "富豪房": "spine4",
        }
        if (!config[roomData.roomName]) {
            return;
        }
        let url = "game_room/fish/jcby/" + config[roomData.roomName]
        uiutil.createCustomerPrefab(url, (err, node) => {
            if (!err) {
                node.x = 0;
                node.y = 0;
                this._spineNode.addChild(node);
            }
        });
    },
    _onButtonTouchEnd() {
        this.doEnterRoom();
    },

    onDestroy() {
        clearInterval(this.myInterval)
    },
});