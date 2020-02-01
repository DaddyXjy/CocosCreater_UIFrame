/**
 * Date: 2019/07/27
 * Author: dylan
 * Desc: 游戏图标UI
 * 
 */

var UIUtil = require('UIUtil');
var UIMgr = require('UIMgr');
var GameDataMgr = require('GameDataMgr');
var Thor = require('Thor');
var GameConst = require('GameConst')
var AudioManager = require('AudioManager')
var AudioConst = require('AudioConst')
var GameItem = cc.Class({
    extends: Thor,
    properties: {
        //游戏编号
        gameIndex :1,
    },

    onLoad() {
        this.setGameTitle();
        this.setGameIconSpine();
        this.updateDownloadProgress();
        this.setGameBg();
        this.setGameStatus();
        this.onShow();
    },
    
    onShow(){
        let gameData = GameDataMgr.getGameData(this.gameIndex);
        cc.assert(gameData , `cannot get gameData:${this.gameIndex}`);
        this._spine_hotGame.active = gameData.isHotGame();
    },

    add2Parent(parent){
        this.node.getChildByName("_img_gameBg").opacity = 0;
        parent.addChild(this.node);    
        let animNode = this.node.getChildByName("_img_gameBg");
        let anim = animNode.getComponent(cc.Animation);
        if(anim){
            anim.stop();
        }
    },

    playAnim(){
        this.unscheduleAllCallbacks();
        let animNode = this.node.getChildByName("_img_gameBg");
        let anim = animNode.getComponent(cc.Animation);
        if(anim){
            anim.play();
        }
    },

    setGameTitle(){
        let titlePath = `textures/hall/gameIcon/gameTitle/gameTitle_${this.gameIndex}`;
        UIUtil.setSprite(this._img_gameTitle , titlePath);
    },

    setGameBg(){
        let index = GameDataMgr.getGameIndex(this.gameIndex) + 1;
        let colorIndex = (index % 6) + 1;
        let bg1 = `textures/hall/gameIcon/gameIconBg/gameIconBg_hall_${colorIndex}`;
        let bg2 = `textures/hall/gameIcon/gameIconBg/gameTitleBg_hall_${colorIndex}`;
        UIUtil.setSprite(this._img_gameBg , bg1);
        UIUtil.setSprite(this._img_gameTitleBg , bg2);
    },

    setGameIconSpine(){
        let prefabPath = `game_icon/game_icon_${this.gameIndex}`;
        UIUtil.loadCustomerPrefab(prefabPath, (err , asset)=>{
            cc.assert(!err , `cant load spine for game:${this.gameIndex}`);
            if (!err) {
                let node = cc.instantiate(asset)
                this._spine_gameIcon.addChild(node);
            }
        });
    },

    setGameStatus(){
        let gameData = GameDataMgr.getGameData(this.gameIndex);
        cc.assert(gameData , `cannot get gameData:${this.gameIndex}`);
        if(!gameData.isNormalGameStatus()){
            let status = gameData.getGameStatus();
            let gameStatusImg = `textures/hall/gameIcon/gameStatus/game_status_${status}`;
            UIUtil.setSprite(this._img_game_status , gameStatusImg);
            this._img_game_status.active = true;
            this._img_downloadMask.active = true;
        }else{
            this._img_game_status.active = false;
            this._img_downloadMask.active = false;
        }
    },

    setDownLoadStatus(_status, _progressValue)
    {
        let gameData = GameDataMgr.getGameData(this.gameIndex)
        gameData.downloadStatus = _status
        switch(_status)
        {
            case GameConst.GameDownLoadType.Normal:
            case GameConst.GameDownLoadType.NeedDownLoad:
            {
                this._download_progress.active = false;
                this._download_bg.active = false;
                this._label_download.active = false;
                this._img_downloadMask.active = false;
                this._downloadIcon.active = false;
                break;
            }
            case GameConst.GameDownLoadType.DownLoading:
            {
                gameData.downloadProgress = _progressValue
                this.updateDownloadProgress()
                break;
            }
        }
    },

    _onImg_gameBgTouchEnd(){
        cc.log(`gameIndex:${this.gameIndex} onItemClick`);
        let gameData = GameDataMgr.getGameData(this.gameIndex);
        cc.assert(gameData , `cannot get gameData:${this.gameIndex}`);
        if (!gameData.isNormalGameStatus()) {
            UIUtil.showTips(gameData.getGameStatusText());
            return;
        }
        switch(gameData.getDownloadStatus()) {
            case GameConst.GameDownLoadType.Normal: {
                AudioManager.PlayEffect2(AudioConst.LOGIN_EnterGame);
                UIUtil.openRoomUI(this.gameIndex);
                break;
            }
            case GameConst.GameDownLoadType.NeedDownLoad: {
                let hot = this.getComponent("HotForGame")
                hot.hotUpdate()
                break;
            }
            case GameConst.GameDownLoadType.DownLoading: {
                UIUtil.showTips("正在拼命下载中,请您稍等");
                break;
            }
        }
    },

    updateDownloadProgress(){
        
        let gameData = GameDataMgr.getGameData(this.gameIndex);
        cc.assert(gameData , `cannot get gameData:${this.gameIndex}`);

        let bDownload = gameData.isDownloading();
        this._label_download.active = bDownload
        this._download_progress.active = bDownload
        this._download_bg.active = bDownload
        //this._img_downloadMask.active = bDownload
        
        let progress = gameData.downloadProgress;
        this._download_progress.$Sprite.fillStart = 1 - progress;
        this._label_download.$Label.string = (progress * 100).toFixed(0) + '%';
    },

    destory(){
        
    },

    isVaild(){

    }

});

module.exports = GameItem