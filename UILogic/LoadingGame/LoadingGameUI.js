// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

var UIBase = require("UIBase")
var LoadingUIBridge = require("LoadingUIBridge")
var UIUtil = require("UIUtil")
var hotFixData = require('hotFixData')
let gameBrideg = require('GameHallBridge')
let customCfg = require('customerUtils')

var LoadingUI = cc.Class({
    extends: UIBase,

    properties: {

    },

    onUILoaded() {},

    onDestroy() {

    },
    onOpen(params) {
        gameBrideg.showNativeAni(params.gameIndex);
        this.scheduleOnce(() => {
            gameBrideg.gameRestart();
        }, 0.2);
        // UIUtil.createCustomerPrefab(`LoadingGame/LoadingLogo_${gameIndex}` , (err , node)=>{
        //     this._game_icon_hook.addChild(node);
        //     if(hallOpen){
        //         let animNode = node.getChildByName("animNode");
        //         if(animNode){
        //             animNode.getComponent(cc.Animation).play();
        //         }
        //     }
        // });
        // this._progress.$ProgressBar.progress = 0;
        // this.isFinish = false;
    },

    onClose() {

    },

    initUI() {

    },

    update(dt) {
        // if (this.isFinish) {
        //     return;
        // }
        // let progress = this._progress.$ProgressBar.progress + 1 * dt;
        // if (progress > 1) {
        //     progress = 1;
        //     this.isFinish = true;
        // }
        // this._progress.$ProgressBar.progress = progress;
    }

});

module.exports = LoadingUI;