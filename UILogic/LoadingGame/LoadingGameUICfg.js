/**
 * Date: 2019/08/26
 * Author: dylan
 * Desc: 游戏加载UI
 * 
 */

var UIGlobalCfg = require("UIGlobalCfg");
var UIBaseCfg = require("UIBaseCfg");

var TipsUICfg = cc.Class({
    extends: UIBaseCfg,
    statics: {
        //UI类型
        uiType: UIGlobalCfg.UIType.TOP_UI,

        isSingletonUI: true,

        isPreventTouch : true,

        //prefab路径
        prefabPath : 'LoadingGame/LoadingGameUI',
    },
});

module.exports = TipsUICfg;