/**
 * Date: 2019/07/23
 * Author: dylan
 * Desc: UI动画
 * 
 */

let customerUtils = require('customerUtils');
let UIGlobalCfg = require('UIGlobalCfg');
let UIAction = {

    //UI弹入
    popIn(uiNode , callback){
        uiNode.stopAllActions();
        uiNode.scaleX = 0.5;
        uiNode.scaleY = 0.5;
        uiNode.opacity = 0;
        var FadeIn = cc.fadeIn(0.15);
        var ScaleToBiggest  =  cc.scaleTo(0.15, 1.0).easing(cc.easeBackOut());
        var Spawn = cc.spawn(ScaleToBiggest,FadeIn)
        var CC_CallBack = cc.callFunc(callback);
        var Sequence = cc.sequence(Spawn , CC_CallBack);
        uiNode.runAction(Sequence);
    },

    //UI弹出
    popOut(uiNode , callback){
        uiNode.stopAllActions();
        uiNode.scaleX = 1.0;
        uiNode.scaleY = 1.0;
        uiNode.opacity = 255;
        var ScaleToSmallest = cc.scaleTo(0.15,0.95);
        var FadeOut = cc.fadeOut(0.2);
        var CC_CallBack = cc.callFunc(callback);
        var Spawn = cc.spawn(ScaleToSmallest,FadeOut);
        var Sequence = cc.sequence(Spawn, CC_CallBack);
        uiNode.runAction(Sequence);
    },

    //带有标题动画的UI弹入
    titleWindowPopIn(uiNode , titleNode , callback){
        uiNode.stopAllActions();
        titleNode.stopAllActions();
        titleNode.y = 0
        uiNode.scaleX = 0.5;
        uiNode.scaleY = 0.5;
        uiNode.opacity = 0;
        titleNode.scaleX = 0.5;
        titleNode.scaleY = 0.5;
        titleNode.opacity = 0;

        var FadeIn1 = cc.fadeIn(0.2);
        var FadeIn2 = cc.fadeIn(0.25);
        var ScaleToNoraml =  cc.scaleTo(0.2, 1.0).easing(cc.easeBackOut());
        var TitleScaleToNoraml =  cc.scaleTo(0.25, 1.0).easing(cc.easeBackOut());
        var CC_CallBack = cc.callFunc(callback);
        var Spawn1 = cc.spawn(ScaleToNoraml,FadeIn1)
        var Sequence = cc.sequence(Spawn1 , CC_CallBack);
        var Spawn2 = cc.spawn(TitleScaleToNoraml,FadeIn2)
        uiNode.runAction(Sequence);
        titleNode.runAction(Spawn2)
    },

    //带有标题动画的UI弹出
    titleWindowPopOut(uiNode , titleNode , callback){
        uiNode.stopAllActions();
        titleNode.stopAllActions();
        titleNode.y = 0
        uiNode.scaleX = 1.0;
        uiNode.scaleY = 1.0;
        uiNode.opacity = 255;
        var ScaleToSmallest = cc.scaleTo(0.15,0.8);
        var FadeOut = cc.fadeOut(0.2);
        var CC_CallBack = cc.callFunc(callback);
        var Spawn = cc.spawn(ScaleToSmallest,FadeOut)
        var Sequence = cc.sequence(Spawn, CC_CallBack);
        uiNode.runAction(Sequence);
        titleNode.runAction(cc.moveTo(0.1,0,100));
        // titleNode.runAction(cc.fadeOut(0.1));
    },

    //获取动画
    getActionByType(uiActionType , bOpen){
        if(uiActionType == UIGlobalCfg.UIActionType.POP_IN_OUT){
            return bOpen? this.popIn : this.popOut;
        }else if(uiActionType == UIGlobalCfg.UIActionType.TITLE_POP_IN_OUT){
            return bOpen? this.titleWindowPopIn : this.titleWindowPopOut;
        }
    }
}

module.exports = UIAction;