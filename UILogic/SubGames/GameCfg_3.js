/**
 * Date: 2019/08/09
 * Author: dylan
 * Desc: 游戏3-金蟾捕鱼配置
 * 
 */

var GameBaseCfg = require('GameBaseCfg')
var GameConst = require('GameConst')

var GameCfg = cc.Class({
    extends: GameBaseCfg,
    statics: {
        //游戏类型
        gameType: GameConst.GameType.FISH,

        //进房间消息
        EnterGameMsgCode: 3003,
        //获取房间列表消息
        GetRoomListMsgCode: 3001,
        //游戏刷新消息
        GameRefreshMsgCode: 3007,
        //游戏中奖消息
        GameRewardMsgCode: 0,

        //proto协议文件
        protoFileData: {
            fileName: "fishMessage.proto",
            packageName: "fish"
        },
        roomItemPrefabPath : "game_room/fish/jcby/fishDoor",

        parseRoomListMsg: function (pb, msgData) {
            var protoData = pb.ResRooms.decode(msgData);
            common.playerData.setCoin(common.util.ConvertMoneyToClient(protoData.money));
            return protoData.rooms;
        },

    }
});

module.exports = GameCfg;