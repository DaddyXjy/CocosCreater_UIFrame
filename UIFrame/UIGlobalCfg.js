/**
 * Date: 2019/07/24
 * Author: dylan
 * Desc: UI全局配置
 * 
 */

 
var UIGlobalCfg = {

    //UI类型
    UIType:cc.Enum
    ({
        //底层UI(场景相关,始终放在最下面)
        BOTTOM_UI:-1,
        //中层UI(各种UI,弹窗)
        MIDDLE_UI:-1,
        //上层UI(各种提示,始终盖在中层UI之上)
        TOP_UI:-1,
    }), 
    
    //Window类型
    WindowType:cc.Enum
    ({
        //正常弹窗
        NORMAL_WINDOW:-1,
        //全屏弹窗（创建弹窗的时候会增加一个全屏黑色背景）
        FULLSCENE_WINDOW:-1,
        //小弹窗(开启的时候会关闭界面中已经开启的其他弹窗，关闭之后会还原其他弹窗)
        SMALL_WINDOW:-1,
    }),

    //UI动画类型
    UIActionType:cc.Enum
    ({
        //弹窗弹入弹出动画
        POP_IN_OUT: -1,
        //带有标题动画的弹窗弹入弹出动画
        TITLE_POP_IN_OUT: -1,
    }), 

}

module.exports = UIGlobalCfg;