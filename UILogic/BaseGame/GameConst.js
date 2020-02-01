/**
 * Date: 2019/08/09
 * Author: dylan
 * Desc: 游戏常量定义
 * 
 */


var GameConst = {
    //游戏下载类型
    GameDownLoadType: cc.Enum({
        Normal: -1,
        NeedDownLoad: -1,
        DownLoading: -1,
    }),

    //游戏状态
    GameStatus: cc.Enum({
        Normal: -1, //正常  0
        Fixing: -1, //修复中 1
        Working: -1, //开发中  2
        ComingSoon: -1, //敬请期待  3
        PreOnline: -1, //即将上线 4
    }),

    //游戏类型
    GameType: cc.Enum({
        BET: -1, //下注类
        FISH: -1, //捕鱼类
        PK: -1 //对战类
    }),

    //游戏所用道具类
    GamePropType: cc.Enum({
        POKE: -1, //扑克
        MAJIANG: -1, //麻将
        PAIJIU: -1, //牌九
        SHUIGUO: -1 //水果
    }),

    //游戏记录每页条目
    GameRecordEachPageSize: 7,

    //是否在大厅
    inHall : false
}

module.exports = GameConst;