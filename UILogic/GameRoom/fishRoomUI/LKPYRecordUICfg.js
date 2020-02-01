/**
 * Date: 2019/07/25
 * Author: dylan
 * Desc: TipsUI
 * 
 */

var UIGlobalCfg = require("UIGlobalCfg");
var UIBaseCfg = require("UIBaseCfg");

var NZNHRecordUICfg = cc.Class({
    extends: UIBaseCfg,
    statics: {
        //UI类型
        uiType: UIGlobalCfg.UIType.MIDDLE_UI,

        isSingletonUI: true,

        isPreventTouch: false,

        //prefab路径
        prefabPath: 'game_record/LKPYRecordUI',
        useSpecificScript: "CommonRecordUI",

        uiActionType: UIGlobalCfg.UIActionType.TITLE_POP_IN_OUT,
    },
});

module.exports = NZNHRecordUICfg;