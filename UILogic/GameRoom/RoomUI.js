/**
 * Date: 2019/08/08
 * Author: dylan
 * Desc: 游戏房间UI
 * 
 */

var UIBase = require("UIBase")
var LobbyProto = require('LobbyProtoFactory');
var UIMgr = require("UIMgr")
var hallData = require("hallData");
var RoomItemUIMgr = require("RoomItemUIMgr");
var GameNetMgr = require("GameNetMgr");
var GameDataMgr = require("GameDataMgr");
var UIUtil = require("UIUtil");
var RoomUI = cc.Class({
    extends: UIBase,

    properties: {
        gameIndex: -1,

        _delayCallList : []
    },

    __preload() {
        this._super();
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "hideNativeAni", "()V");
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("AppController", "hideNativeAni")
        }
    },

    onUILoaded() {
        hallData.roomDataRefreshNotify.addListener(this.onRoomDataRefresh, this);
    },

    onDestroy() {
        hallData.roomDataRefreshNotify.removeListener(this.onRoomDataRefresh, this);
    },

    onRoomDataRefresh() {
        this.setPlayerInfo();
        this.refreshRoomList();
    },

    refreshRoomList() {
        let gameData = GameDataMgr.getGameData(this.gameIndex);
        let roomList = gameData.getRoomMgr().getRoomList();
        this._roomList_content.removeAllChildren(false);
        this._scrollView_gamelist.$ScrollView.scrollToLeft();
        this._delayCallList = [];
        roomList.forEach(roomData => {
            let delayCall =  () =>{
                RoomItemUIMgr.hookRoomItem2Node(this.gameIndex, roomData.getRoomID(), this._roomList_content , roomList.length , ()=>{
                    this.onGameListLoadFinish()
                });
            };
            this._delayCallList.push(delayCall);
        });
    },

    onGameListLoadFinish(){
        this.unscheduleAllCallbacks();
        let gameData = GameDataMgr.getGameData(this.gameIndex);
        if(!gameData.isBetGame()){
            for (let index = 0; index < this._roomList_content.children.length; index++) {
                this.scheduleOnce(()=>{
                    let child = this._roomList_content.children[index];
                    if(child){
                        let roomItemScript = UIUtil.getRoomItemUIScript(this.gameIndex);
                        child.getComponent(roomItemScript).playAnim();
                    }
                } , index*0.15);
            }
        }else{
            for (let index = 0; index < this._roomList_content.children.length; index = index + 2) {
                this.scheduleOnce(()=>{
                    let child1 = this._roomList_content.children[index];
                    let child2 = this._roomList_content.children[index+1];
                    let roomItemScript = UIUtil.getRoomItemUIScript(this.gameIndex);
                    if(child1){
                        child1.getComponent(roomItemScript).playAnimByName("ludan01");
                    }
                    if(child2){
                        child2.getComponent(roomItemScript).playAnimByName("ludan02");
                    }
                } , index*0.07);
            }
        }
    },

    CalculateLeftPadding(_RoomWidth , _RoomHeight, _RoomContainer)
    {
        this.TargetSpaceX = 16;
        var RoomCol = 2; 
        this.ScreenWidth = _RoomContainer.width;

        this.TargetSize = cc.v2(0,0);

        this.TargetSize.x = (this.ScreenWidth - ((RoomCol + 1) * this.TargetSpaceX))/RoomCol;
        this.ScaleRatio = this.TargetSize.x / _RoomWidth;
        this.TargetSize.y = this.ScaleRatio * _RoomHeight;

        this.TopMarrine = 20;
        this.BottomMarrine = 20;
        this.SpaceY = 20;

        this.RoomContainerHeight = 0;
    },

    onOpen(gameIndex) {
        this.gameIndex = gameIndex;
        GameNetMgr.sendChangeGameChanel(this.gameIndex);
        this.initUI();
    },

    _bindSpineTitle(){
        this._spine_title.removeAllChildren(true);
        UIUtil.createCustomerPrefab(`LoadingGame/LoadingLogoSmall_${this.gameIndex}` , (err, node)=>{
            if (!err) {
                this._spine_title.removeAllChildren(true);
                this._spine_title.addChild(node);
            }
        });
    },

    _bindSpineGirl() {
        if (this._room_girl_item) {
            let girlSpinePrefabPath = `game_room/girl/girl_${this.gameIndex}/girl_${this.gameIndex}`;
            UIUtil.loadCustomerPrefab(girlSpinePrefabPath, (err, asset) => {
                if (!err) {
                    this._room_girl_item.removeAllChildren(true);
                    let node = cc.instantiate(asset);
                    this._room_girl_item.addChild(node);
                }
            });
        }
    },

    setPlayerInfo(){
        let _tx = window.common.playerData.getPortrait();
        let _name = window.common.playerData.getNickName();
        let _coin = window.common.playerData.getCoin();

        common.ui.setPortrait(_tx,this._img_head.$Sprite);
        this._lable_roleName.$Label.string = _name;
        this._lable_goldNum.$Label.string = _coin;
    },

    onClose() {
        this._roomList_content.removeAllChildren(false);
        GameNetMgr.back2Hall();
        hallData.room2Hall = true;
    },

    initUI() {
        this._bindSpineGirl();
        this.setPlayerInfo();
        this._bindSpineTitle()
        this._adjustSrollviewRatio(this.gameIndex)
    },

    _adjustSrollviewRatio(gameIndex){
        let gameCfg = UIUtil.getGameCfg(gameIndex);
        if(gameCfg.isBetGame() && this._scrollView_gamelist){
            let ratio = cc.winSize.width / cc.view.getDesignResolutionSize().width;
            this._scrollView_gamelist.scale = ratio;
        }
    },

    _onBtn_exitTouchEnd() {
        UIMgr.closeUI(this);
    },

    _onBtn_historyTouchEnd() {
        switch (this.gameIndex) {
            case 3:
                UIMgr.openUI("JCBYRecordUI");
                return;
            case 13:
                UIMgr.openUI("LKPYRecordUI");
                return;
            case 19:
                UIMgr.openUI("NZNHRecordUI");
                return;
        }
        UIMgr.openUI("CommonRecordUI");
    },

    update(dt){
        if(this._delayCallList && this._delayCallList.length != 0){
            this._delayCallList[0].call(this);
            this._delayCallList.shift();
        }
    },


});

module.exports = RoomUI;