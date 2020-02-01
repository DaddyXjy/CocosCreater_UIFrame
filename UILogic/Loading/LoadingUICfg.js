/**
 * Date: 2019/07/24
 * Author: dylan
 * Desc: 加载UI
 * 
 */

var UIGlobalCfg = require("UIGlobalCfg");
var UIBaseCfg = require("UIBaseCfg");

var LoadingUICfg = cc.Class({
    extends: UIBaseCfg,
    statics: {

        //UI类型
        uiType: UIGlobalCfg.UIType.BOTTOM_UI,

        //是否关闭其他所有UI
        isCloseAllUI: true,

        //prefab路径
        prefabPath : 'loading/LoadingUI',

        //是否是场景UI
        isSceneUI: true
    },
});

module.exports = LoadingUICfg;