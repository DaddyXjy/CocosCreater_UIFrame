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

var LoadingUI = cc.Class({
    extends: UIBase,

    properties: {

    },

    onUILoaded () {
        this.loadingSceneManager = LoadingUIBridge.bridge2LoadingSceneManager(this);
        hotFixData.tipsNotify.addListener(this.setLabel,this)
        hotFixData.infoNotify.addListener(this.onInfoChange,this)
        hotFixData.progressNotify.addListener(this.onProgressChange,this)
    },

    onDestroy(){
        hotFixData.tipsNotify.removeListener(this.setLabel,this)
        hotFixData.infoNotify.removeListener(this.onInfoChange,this)
        hotFixData.progressNotify.removeListener(this.onProgressChange,this)
    },

    onOpen(){
        this.initUI()
        this.loadingSceneManager.startRun();
    },

    onClose(){
        
    },

    initUI(){
        this._label_tips.$Label.string = '';
        this._progress.$ProgressBar.progress = 0;
        this._label_progress.$Label.string = '';
    },

    onInfoChange(info){
        this._label_tips.$Label.string = info
    },

    onProgressChange(progress) {
        this._progress.$ProgressBar.progress = progress
    },

    setLabel(text){
        this._label_progress.$Label.string = text;
    }

});

module.exports = LoadingUI;