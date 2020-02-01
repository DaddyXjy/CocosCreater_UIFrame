/**
 * Date: 2019/07/25
 * Author: dylan
 * Desc: TipsUI
 * 
 */

var UIGlobalCfg = require("UIGlobalCfg");
var UIBaseCfg = require("UIBaseCfg");

var CommonRecordUICfg = cc.Class({
    extends: UIBaseCfg,
    statics: {
        //UI类型
        uiType: UIGlobalCfg.UIType.MIDDLE_UI,

        isSingletonUI: true,

        isPreventTouch: false,

        //prefab路径
        prefabPath: 'game_record/JCBYRecordUI',
        useSpecificScript: "CommonRecordUI",

        uiActionType: UIGlobalCfg.UIActionType.TITLE_POP_IN_OUT,
        
    },
});

module.exports = CommonRecordUICfg;