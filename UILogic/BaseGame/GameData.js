/**
 * Date: 2019/07/27
 * Author: dylan
 * Desc: 游戏数据
 * 
 */

var UIUtil = require('UIUtil')
var GameConst = require('GameConst')
var pbkiller = require('pbkiller');
var RoomDataMgr = require('RoomDataMgr');
var GameData = cc.Class({
    properties: {
        //服务器游戏数据
        serverGameData:null,
        //游戏下载状态
        downloadStatus:GameConst.GameDownLoadType.Normal,
        //游戏下载进度(0~1)
        downloadProgress : 0,
        //游戏房间管理器
        _roomDataMgr:null,
        //游戏配置
        _gameCfg : null,

        gameIndex : -1,

        gameCfg: {
            get () {
                return this._gameCfg;
            },
        },

        //游戏proto数据
        protoData : null

    },

    ctor(gameIndex) {
        this.gameIndex = gameIndex
        this._gameCfg = UIUtil.getGameCfg(gameIndex);
        this._roomDataMgr = new RoomDataMgr();
        this._roomDataMgr.gameIndex = gameIndex;
        //cc.assert(this._gameCfg);
    },

    setServerData(serverGameData){
        this.serverGameData = serverGameData;
    },

    hasServerData(){
        return this.serverGameData;
    },

    getGameStatus () {
        return this.serverGameData.gameStatus;
    },

    isNormalGameStatus (){
        return this.serverGameData.gameStatus == GameConst.GameStatus.Normal;
    },

    isHotGame (){
        return this.serverGameData.isHot == 1;
    },

    //游戏分页类型:1是棋牌类，2是捕鱼类，3是街机类
    getGamePageType (){
        return this.serverGameData.gameType + 1;
    },

    //游戏类型
    getGameType (){
        return this._gameCfg.gameType;
    },


    isFishGame(){
        return this._gameCfg.isFishGame();
    },

    isBetGame(){
        return this._gameCfg.isBetGame();
    },

    isPkGame(){
        return this._gameCfg.isPkGame();
    },


    getDownloadStatus (){
        return this.downloadStatus;
    },

    isDownloading(){
        return this.downloadStatus == GameConst.GameDownLoadType.DownLoading
    },


    isDownloaded(){
        return this.downloadStatus == GameConst.GameDownLoadType.Normal
    },
    getGameStatusText () {
        let statusText = ''
        switch(this.getGameStatus())
        {
            case GameConst.GameStatus.Working:
            {
                statusText = "紧急开发中";
                break;
            }
            case GameConst.GameStatus.ComingSoon:
            {
                statusText = "敬请期待";
                break;
            }
            case GameConst.GameStatus.PreOnline:
            {
                statusText = "即将上线";
                break;
            }
            case GameConst.GameStatus.Fixing:
            {
                statusText = "游戏维护中";
                break;
            }
        }
        return statusText;
    },

    getGameIndex (){
        return this.gameIndex;
    },

    getRoomMgr(){
        return this._roomDataMgr
    },

    loadGameProto(callback){
        pbkiller.preload((root) => 
        {
            let protoFileName = this._gameCfg.protoFileData.fileName;
            let packageName = this._gameCfg.protoFileData.packageName;
            this.protoData = pbkiller.loadFromFile(protoFileName, packageName, root);
            cc.assert(callback);
            if(callback){
                callback()
            }
        },'CommonDynamicAssets/GameProtos');
    },

    prepareEnterGame(callback){
        if(cc.sys.isNative && !this.isDownloaded()){
            UIUtil.showTips('游戏没有下载,进入游戏失败');
            return;
        }
        if(this.protoData){
            callback();
        }else{
            this.loadGameProto(callback);
        }
    },
});

module.exports = GameData