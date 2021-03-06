/**
 * Date: 2019/08/08
 * Author: dylan
 * Desc: 下注游戏房间UI配置
 * 
 */

var UIGlobalCfg = require("UIGlobalCfg");
var UIBaseCfg = require("UIBaseCfg");

var GameRoomUICfg = cc.Class({
    extends: UIBaseCfg,
    statics: {
        //UI类型
        uiType: UIGlobalCfg.UIType.MIDDLE_UI,

        isSingletonUI: true,

        //prefab路径
        prefabPath: 'game_room/LEVELRoomUI',

        //是否是全屏界面
        isFullScreenUI: true,
    },
});

module.exports = GameRoomUICfg;