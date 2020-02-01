/**
 * Date: 2019/08/17
 * Author: KEN
 * Desc: 游戏2-飞禽走兽配置
 * 
 */

var GameBaseCfg = require('GameBaseCfg')
var GameConst = require('GameConst')

var GameCfg =  cc.Class({
    extends: GameBaseCfg,
    statics: {
        //游戏类型
        gameType : GameConst.GameType.BET,        

        //进房间消息
        EnterGameMsgCode: 2001,
        //获取房间列表消息
        GetRoomListMsgCode: 2003,
        //游戏刷新消息
        GameRefreshMsgCode: 2017,
        //游戏中奖消息
        GameRewardMsgCode: 2005,
        
        //房间ItemPrefab路径
        roomItemPrefabPath : "game_room/fqzs/FQRooms",

        //proto协议文件
        protoFileData : {fileName: "FeiQinZouShou.proto" , packageName : "com.micro.fqzs"},

        //解析房间列表消息
        parseRoomListMsg: function (pb , msgData) {
            cc.assert(pb);
            cc.assert(msgData);
            var protoData = pb.RoomListRes.decode(msgData);
            common.playerData.setCoin(common.util.ConvertMoneyToClient(protoData.selfCoins));
            return protoData.roomData;
        },

        //解析房间中奖消息
        parseRoomRewardMsg: function (pb , msgData) {
            cc.assert(pb);
            cc.assert(msgData);
            var protoData = pb.RoomRewardUpdateRes.decode(msgData);
            return protoData;
        },
    }
});

module.exports = GameCfg;
