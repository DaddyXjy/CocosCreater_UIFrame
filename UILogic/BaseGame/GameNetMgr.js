/**
 * Date: 2019/08/10
 * Author: dylan
 * Desc: 游戏网络层
 * 
 */

var UIUtil = require('UIUtil');
var LobbyProto = require('LobbyProtoFactory');
var hallData = require("hallData")
var GameDataMgr = require("GameDataMgr")
var GameConst = require("GameConst")
var GameNetMgr = {

    registerAllGameMsg() {
        //现在没有提供获取所有游戏的接口,先这样写
        for (let gameIndex = 0; gameIndex < 100; gameIndex++) {
            let gameCfg = UIUtil.getGameCfg(gameIndex);
            if (gameCfg) {
                this.registerEnterGameMsg(gameCfg.EnterGameMsgCode);
                this.registerGameRoomMsg(gameCfg.GetRoomListMsgCode);
                if (gameCfg.GameRewardMsgCode) {
                    this.registerRoomRewardMsg(gameCfg.GameRewardMsgCode);
                }
                if (gameCfg.GameInfoMsgCode) {
                    this.registerRoomInfoMsg(gameCfg.GameInfoMsgCode);
                }
            }
        }
        this.registerRecordMsg();
    },

    registerEnterGameMsg(enterMsgCode) {
        var websocket = common.api.getWebsocket();
        websocket.reg(enterMsgCode, (data) => {
            if (data.status) {
                let gameIndex = parseInt(enterMsgCode / 1000);
                let gameDownloaded = common.util.ifGameDownloaded(gameIndex);
                if (!gameDownloaded) {
                    console.log('游戏没有下载，切换大厅频道');
                    this.back2Hall();
                    return;
                }
                require("GameHallBridge").hall_joinGame(gameIndex);
            } else {
                common.ShowTips(data.msg);
                common.ui.loading.hide();
            }
        }, this);
    },

    registerGameRoomMsg(roomListMsgCode) {
        var websocket = common.api.getWebsocket();
        websocket.reg(roomListMsgCode, (data) => {
            if (data.status) {
                let gameIndex = parseInt(roomListMsgCode / 1000);
                let gameData = GameDataMgr.getGameData(gameIndex);
                if (gameData.hasServerData() || common.changeChannelGameIndex) {
                    let gameCfg = UIUtil.getGameCfg(gameIndex);
                    let serverRoomDatas = gameCfg.parseRoomListMsg(gameData.protoData, data.msg)
                    gameData.getRoomMgr().initRoomsFromServer(serverRoomDatas)
                    hallData.roomDataRefresh = true;
                } else {
                    //服务器第一条消息直接发的房间列表,直接客户端切回大厅
                    this.back2Hall();
                }
            } else {
                common.ShowTips(data.msg);
            }
        }, this);
    },

    registerRoomRewardMsg(GameRewardMsgCode) {
        var websocket = common.api.getWebsocket();
        websocket.reg(GameRewardMsgCode, function (data) {
            if (data.status) {
                let gameIndex = parseInt(GameRewardMsgCode / 1000);
                let gameData = GameDataMgr.getGameData(gameIndex);
                if (gameData) {
                    let gameCfg = UIUtil.getGameCfg(gameIndex);
                    let serveData = gameCfg.parseRoomRewardMsg(gameData.protoData, data.msg);
                    hallData.gameRewardData = {
                        gameIndex: gameIndex,
                        serverData: serveData
                    }
                }
            } else {
                common.ShowTips(data.msg);
            }
        }, this);
    },

    //注册游戏状态变更消息
    registerRoomInfoMsg(GameInfoMsgCode){
        var websocket = common.api.getWebsocket();
        websocket.reg(GameInfoMsgCode, function (data) {
            if (data.status) {
                let gameIndex = parseInt(GameInfoMsgCode / 1000);
                let gameData = GameDataMgr.getGameData(gameIndex);
                if (gameData) {
                    let gameCfg = UIUtil.getGameCfg(gameIndex);
                    let serveData = gameCfg.parseRoomInfoMsg(gameData.protoData, data.msg);
                    hallData.gameInfoData = {
                        gameIndex: gameIndex,
                        serverData: serveData
                    }
                }
            } else {
                common.ShowTips(data.msg);
            }
        }, this);
    },

    //注册游戏记录消息回调
    registerRecordMsg() {
        let websocket = common.api.getWebsocket();
        websocket.reg(LobbyProto.ActionCode.Game.HISTORYS, data => {
            if (data.status) {
                data.msg = common.ProtoBase.ResHistorys.decode(data.msg);
                let records = data.msg.games;
                let pageIndex = data.msg.pageIndex + 1;
                let outPages = data.msg.pageMax % GameConst.GameRecordEachPageSize;
                let totalPages = data.msg.pageMax / GameConst.GameRecordEachPageSize;
                totalPages = totalPages < 1 ? 1 : totalPages;
                if (data.msg.pageMax > GameConst.GameRecordEachPageSize && outPages > 0) {
                    totalPages++;
                }
                hallData.gameRecordData = {
                    records: records,
                    pageIndex: pageIndex,
                    totalPages: totalPages
                }
            } else {
                common.ShowTips(data.msg);
            }

        });
    },

    //发送进房间请求
    sendEnterGameRequest(gameIndex, roomID) {
        let gameCfg = UIUtil.getGameCfg(gameIndex);
        var websocket = common.api.getWebsocket();
        let EnterGameReq = new common.ProtoBase.EnterReq();
        EnterGameReq._actionCode = gameCfg.EnterGameMsgCode;
        EnterGameReq.roomId = roomID;
        websocket.sendMsg(EnterGameReq);
        common.ui.loading.show();
    },

    //申请房间列表，切换频道时调用
    sendChangeGameChanel(gameIndex) {
        let websocket = common.api.getWebsocket();
        let channelReq = LobbyProto.newReq(LobbyProto.ActionCode.Gate.CHANGE_CHANNEL);
        channelReq.enterId = gameIndex;
        websocket.sendMsg(channelReq);
    },
    //请求游戏历史记录
    sendGameHistoryRequest(pageIndex) {
        var GameConst = require("GameConst");
        //发送申请游戏记录 应该将: 第几页  发过去     
        let gameRecordReq = new common.ProtoBase.ReqHistorys();
        gameRecordReq._actionCode = LobbyProto.ActionCode.Game.HISTORYS;
        gameRecordReq.pageSize = GameConst.GameRecordEachPageSize;
        gameRecordReq.pageIndex = pageIndex - 1;
        var websocket = common.api.getWebsocket();
        websocket.sendMsg(gameRecordReq);
    },

    back2Hall() {
        if (common.changeChannelGameIndex) {
            var UIMgr = require("UIMgr");
            UIMgr.openUI("HallUI");
        } else {
            this.sendChangeGameChanel(0)
        }
    },



}

module.exports = GameNetMgr;