/**
 * Date: 2019/07/23
 * Author: dylan
 * Desc: 游戏基础配置
 * 
 */

var GameConst = require('GameConst')
var GameBaseCfg = cc.Class({
    statics: {
        //游戏类型
        gameType : GameConst.GameType.BET,
        //游戏所用道具
        gamePropType: GameConst.GamePropType.POKE,

        //进房间消息
        EnterGameMsgCode: 0,
        //获取房间列表消息
        GetRoomListMsgCode: 0,
        //游戏刷新消息
        GameRefreshMsgCode: 0,
        //游戏中奖消息
        GameRewardMsgCode: 0,
        //游戏状态变更消息
        GameInfoMsgCode: 0,
        //proto协议文件
        protoFileData : {fileName: "" , packageName : ""},

        //房间ItemPrefab路径
        roomItemPrefabPath : "game_room/game_room_item_common",

        //解析房间列表消息
        parseRoomListMsg: function (pb , msgData) {
        },

        //解析房间中奖消息
        parseRoomRewardMsg: function (pb , msgData) {
        },

        //解析房间状态变更消息
        parseRoomInfoMsg: function (pb, msgData){
        },

        isFishGame(){
            return this.gameType == GameConst.GameType.FISH;
        },
    
        isBetGame(){
            return this.gameType == GameConst.GameType.BET;
        },
    
        isPkGame(){
            return this.gameType == GameConst.GameType.PK;
        },
    
    }
});

module.exports = GameBaseCfg;