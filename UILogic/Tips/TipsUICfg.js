/**
 * Date: 2019/07/25
 * Author: dylan
 * Desc: TipsUI
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

        isPreventTouch : false,

        //prefab路径
        prefabPath : 'TipsUI',
    },
});

module.exports = TipsUICfg;