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
var UIMgr = require("UIMgr")
var TipsUI = cc.Class({
    extends: UIBase,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    onOpen(text){
        this.node.scaleX = 0.1;
        this.node.scaleY = 0.1;
        this.node.opacity = 255;
        var ScaleToBig = cc.scaleTo(0.2,1.2);
        var ScaleToNormal = cc.scaleTo(0.15,1.0);
        var DelayTime = cc.delayTime(2.0);
        var FadeOut  =  cc.fadeOut (1.0);
        var CallBack = cc.callFunc(this.DestroySelf,this,this);
        var Sequence = cc.sequence(ScaleToBig,ScaleToNormal,DelayTime,FadeOut,CallBack);
        this.node.stopAllActions();
        this.node.runAction(Sequence);

        this._ContentLabel.$Label.string = text;
    },

    onClose(){
        
    },

    onUpdate (dt) {
        
    },
});

module.exports = TipsUI;