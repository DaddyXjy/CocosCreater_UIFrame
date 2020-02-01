/**
 * Date: 2019/07/23
 * Author: dylan
 * Desc: UI基础配置
 * 
 */

var UIGlobalCfg = require('UIGlobalCfg');

var UIBaseCfg = cc.Class({
    statics: {

        //UI类型
        uiType: UIGlobalCfg.UIType.MIDDLE_UI,

        //是否关闭其他所有UI
        isCloseAllUI: false,

        //是否是单例UI
        isSingletonUI:false,

        //prefab路径
        prefabPath : '',

        //触摸阻断
        isPreventTouch : false,

        //挂载列表
        //{nodeName:"" ,prefabPath:"",scriptName:""}
        hookList :[],

        //实例化列表
        //{itemName:"" ,prefabPath:"",scriptName:""}
        dependItemList:[],

        //使用特定脚本
        useSpecificScript: "",

        //window类型
        windowType : null,
        
        //UI动画类型
        uiActionType: -1,

        //是否打开时播放动画
        isOpenPlayAnimation : false,

        //是否是全屏界面
        isFullScreenUI: false,
        //是否需要垫一张截屏当背景
        isCaptureScreen: false,

        //是否是场景UI
        isSceneUI: false
    },
});

module.exports = UIBaseCfg;