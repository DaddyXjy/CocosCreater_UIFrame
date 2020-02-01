var GameDataMgr = require("GameDataMgr")
let uiutil = require('UIUtil')
cc.Class({
    extends: require('RoomItemUIBase'),

    properties: {},
    refreshUI() {
        let roomData = GameDataMgr.getGameData(this.gameIndex).getRoomMgr().getRoom(this.roomID).serverRoomData;
        this._labeldi.$Label.string = roomData.downLine / 1000 + '-' + roomData.downLine / 1000 + '底分';
        this._down.$Label.string = roomData.minMoney+"入场";
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
        let url = "game_room/fish/nznh/" + config[roomData.roomName]
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