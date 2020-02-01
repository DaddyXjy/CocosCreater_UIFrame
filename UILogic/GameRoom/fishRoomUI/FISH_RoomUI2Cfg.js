var UIGlobalCfg = require("UIGlobalCfg");
var UIBaseCfg = require("UIBaseCfg");

var GameRoomUICfg = cc.Class({
    extends: UIBaseCfg,
    statics: {
        //UI类型
        uiType: UIGlobalCfg.UIType.MIDDLE_UI,

        isSingletonUI: true,

        //prefab路径
        prefabPath: 'game_room/fish/nznh/GameRoomUIFISH',

        
        //使用特定脚本
        useSpecificScript: "RoomUI",

        //是否打开时播放动画
        isOpenPlayAnimation : true,

        //是否是全屏界面
        isFullScreenUI: true,        
    },
});

module.exports = GameRoomUICfg;