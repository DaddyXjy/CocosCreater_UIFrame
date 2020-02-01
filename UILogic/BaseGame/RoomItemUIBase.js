/**
 * Date: 2019/08/12
 * Author: dylan
 * Desc: 房间ItemUI基类
 * 
 */

var Thor = require('Thor');
var UIUtil = require('UIUtil');
var GameNetMgr = require('GameNetMgr');
var GameDataMgr = require('GameDataMgr');
var GameConst = require('GameConst');
var hallData = require('hallData');
var RoomItemUIBase = cc.Class({
    extends: Thor,
    properties: {
        //房间ID
        roomID: -1,
        //游戏ID:
        gameIndex: -1,

    },

    onLoad() {
        hallData.gameRewardDataNotify.addListener(this._updateReward, this);
        hallData.gameInfoDataNotify.addListener(this._updateInfo, this);
    },

    onDestroy() {
        hallData.gameRewardDataNotify.removeListener(this._updateReward, this);
        hallData.gameInfoDataNotify.removeListener(this._updateInfo, this);
    },

    add2Parent(parent) {
        parent.addChild(this.node);
        let animNode = this.node.getChildByName("animNode");
        if (animNode) {
            animNode.opacity = 0;
            let anim = animNode.getComponent(cc.Animation);
            if (anim) {
                anim.stop();
            }
        }
    },

    playAnim() {
        let animNode = this.node.getChildByName("animNode");
        if (animNode) {
            let anim = animNode.getComponent(cc.Animation);
            if (anim) {
                anim.play();
            }
        }
    },

    playAnimByName(name) {
        let animNode = this.node.getChildByName("animNode");
        if (animNode) {
            let anim = animNode.getComponent(cc.Animation);
            if (anim) {
                anim.play(name);
            }
        }
    },


    refreshUI() {
        let gameData = GameDataMgr.getGameData(this.gameIndex);
        let roomData = gameData.getRoomMgr().getRoom(this.roomID);
        cc.assert(roomData);
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

        let roomBgPath = `textures/game_room/room_bg_${topicUIIndex}`;
        let roomTitlePath = `textures/game_room/room_title_${topicUIIndex}`;

        UIUtil.setSprite(this._img_room_title, roomTitlePath);
        UIUtil.setSprite(this._room_bg, roomBgPath);
        this._label_enter_game.$Label.string = `入场 ${roomData.getEnterScore()}`;
        this._label_difen.$Label.string = `底分 ${roomData.getBaseScore()}元`;
        let gameCfg = UIUtil.getGameCfg(this.gameIndex);
        this._bindGameItemSpine(gameCfg.gamePropType, topicUIIndex)
    },

    _bindGameItemSpine(gamePropType, topicUIIndex) {
        var propType2SpinePrefab = {
            [GameConst.GamePropType.POKE]: "game_room/poke/spine_poke_",
            [GameConst.GamePropType.MAJIANG]: "game_room/majiang/spine_majiang_",
            [GameConst.GamePropType.PAIJIU]: "game_room/paijiu/spine_paijiu_",
            [GameConst.GamePropType.SHUIGUO]: "",
        }
        var index = topicUIIndex + 1;
        let prefabPath = propType2SpinePrefab[gamePropType] + index
        UIUtil.loadCustomerPrefab(prefabPath, (err, asset) => {
            if (!err) {
                this._spine_item.removeAllChildren(true);
                let node = cc.instantiate(asset);
                this._spine_item.addChild(node);
            }
        });
    },

    doEnterRoom() {
        let gameData = GameDataMgr.getGameData(this.gameIndex);
        let roomData = gameData.getRoomMgr().getRoom(this.roomID);
        if (!roomData.enterCheck()) {
            UIUtil.showTips("金钱不足,无法进入房间")
            return;
        }
        GameNetMgr.sendEnterGameRequest(this.gameIndex, this.roomID);
    },

    _onRoom_bgTouchEnd() {
        this.doEnterRoom();
    },

    _updateReward(rewardData) {
        if (rewardData.gameIndex = this.gameIndex) {
            this.onUpdateReward(rewardData.serverData);
        }
    },

    _updateInfo(infoData) {
        if (infoData.gameIndex = this.gameIndex) {
            this.onUpdateInfo(infoData.serverData)
        }
    },

    //更新中奖调用
    onUpdateReward(serverData) {

    },

    //更新房间状态调用
    onUpdateInfo() {

    },

});

module.exports = RoomItemUIBase