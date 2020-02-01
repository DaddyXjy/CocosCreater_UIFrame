let UIMgr = require('UIMgr')
let UIUtil = require('UIUtil')
var GameDataMgr = require("GameDataMgr");
cc.Class({
    extends: require("RoomUI"),

    properties: {

    },
    onRoomDataRefresh() {
        if (this._roomNode.active) {
            this.refreshRoomList();
        }
    },
    refreshRoomList(){
        if (this._roomNode.active) {
            this._super();
        }
    },
    _onBtn4TouchEnd() {
        let gameCfg = UIUtil.getGameCfg(this.gameIndex);
        this._roomList_content.removeAllChildren(false);
        gameCfg.level = 1;
        this._levelNode.active = false;
        this._roomNode.active = true;
        common.api.getWebsocket().sendMsg(gameCfg.getLevelReq(GameDataMgr.getGameData(this.gameIndex).protoData));
    },
    _onBtn10TouchEnd() {
        let gameCfg = UIUtil.getGameCfg(this.gameIndex);
        this._roomList_content.removeAllChildren(false);
        this._levelNode.active = false;
        this._roomNode.active = true;
        gameCfg.level = 2;
        common.api.getWebsocket().sendMsg(gameCfg.getLevelReq(GameDataMgr.getGameData(this.gameIndex).protoData));
    },
    _onBtn_exitTouchEnd() {
        if (this._levelNode.active) {
            UIMgr.closeUI(this);
        } else {
            this._levelNode.active = true;
            this._roomNode.active = false;
        }
    },
    onOpen(gameIndex) {
        this._levelNode.active = true;
        this._roomNode.active = false;
        this._super(gameIndex);
    }
});