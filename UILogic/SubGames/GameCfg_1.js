/**
 * Date: 2019/08/09
 * Author: dylan
 * Desc: 游戏1-奔驰宝马配置
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
        EnterGameMsgCode: 1003,
        //获取房间列表消息
        GetRoomListMsgCode: 1001,
        //游戏刷新消息
        GameRefreshMsgCode: 1005,
        //游戏中奖消息
        GameRewardMsgCode: 1007,
        //proto协议文件
        protoFileData : {fileName: "BenzMessage2.proto" , packageName : "Benz.msg"},
        //房间ItemPrefab路径
        roomItemPrefabPath : "game_room/bcbm/BCRooms",

        //解析房间列表消息
        parseRoomListMsg: function (pb , msgData) {
            cc.assert(pb);
            cc.assert(msgData);
            var protoData = pb.ResRooms.decode(msgData);
            common.playerData.setCoin(common.util.ConvertMoneyToClient(protoData.money));
            return protoData.rooms;
        },

        //解析房间中奖消息
        parseRoomRewardMsg: function (pb , msgData) {
            cc.assert(pb);
            cc.assert(msgData);
            var protoData = pb.ResStateChange.decode(msgData);
            return protoData;
        },

    }
});

module.exports = GameCfg;