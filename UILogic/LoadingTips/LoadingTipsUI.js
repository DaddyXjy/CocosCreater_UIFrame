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
var UIUtil = require("UIUtil")
var UIMgr = require("UIMgr")
var LoadingUI = cc.Class({
    extends: UIBase,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    onUILoaded(){
        
    },

    onOpen(){
        this.unscheduleAllCallbacks()
        this.initUI();
        this.scheduleOnce(()=>{
            UIMgr.closeUI(this);
        }, 5);
    },

    initUI(){

    },

    onClose(){
        
    },

    update (dt) {
    },
});

module.exports = LoadingUI;