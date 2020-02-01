/**
 * Date: 2019/07/26
 * Author: dylan
 * Desc: LoadingTipsUI
 * 
 */

var UIGlobalCfg = require("UIGlobalCfg");
var UIBaseCfg = require("UIBaseCfg");

var LoadingTipsUICfg = cc.Class({
    extends: UIBaseCfg,
    statics: {

        //UI类型
        uiType: UIGlobalCfg.UIType.TOP_UI,

        isSingletonUI:true,

        //prefab路径
        prefabPath : 'common/LoadingTipsUI',
    },
});

module.exports = LoadingTipsUICfg;