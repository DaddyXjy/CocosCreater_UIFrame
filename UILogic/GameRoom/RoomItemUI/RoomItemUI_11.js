var RoomItemUIBase = require("RoomItemUIBase")
var GameDataMgr = require("GameDataMgr")
var UIUtil = require('UIUtil');
cc.Class({
    extends: RoomItemUIBase,

    properties: {
        
    },

    refreshUI(){
        let gameData = GameDataMgr.getGameData(this.gameIndex);
        let roomData = gameData.getRoomMgr().getRoom(this.roomID);
        cc.assert(roomData);
        let roomIndex = gameData.getRoomMgr().getRoomIndex(roomData);
        let hasFreeRoom = gameData.getRoomMgr().hasFreeRoom();
        let topicUIIndex = roomIndex;
        if(!hasFreeRoom){
            topicUIIndex = roomIndex + 1;
        }
        if(roomData.isFreeRoom()){
            topicUIIndex = 0;
        }
        if(topicUIIndex >5){
            topicUIIndex = 5
        }

        let roomBgPath = `textures/game_room/room_bg_${topicUIIndex}`;
        let roomTitlePath = `textures/game_room/room_title_${topicUIIndex}`;

        UIUtil.setSprite(this._img_room_title , roomTitlePath);
        UIUtil.setSprite(this._room_bg , roomBgPath);
        this._label_enter_game.$Label.string = `入场 ${roomData.getEnterScore()}`; 
        this._label_difen.$Label.string = `底分 ${roomData.getBaseScore()}元`; 
        let gameCfg = UIUtil.getGameCfg(this.gameIndex);
        this._bindGameItemSpine(gameCfg.gamePropType  , topicUIIndex)
        cc.log(`底分 ${roomData.getBaseScore()}元`)

        let _data = roomData.serverRoomData;
        this.setShowTag(_data.reward,_data.blind);
    },
    
    setShowTag(_reward,_blind){
        if(_reward){
            this._spine_xq.active = true;
        }
        if(_blind){
            this._spine_sjbm.active = true;
        }
    }

});
