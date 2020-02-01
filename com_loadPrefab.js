// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        PREFAB: {
            default: null,
            type: cc.Prefab,     //绑定的prefab
        },
        parent: {
            default: null,
            type: cc.Node,       //预制体实例化的父节点
        },
        autoLoad: true,        //自动加载       
        persistFlag: false, //是否是常驻节点       
    },
    
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if(this.autoLoad)
        {
            this.loadPrefab();
        }
        if (this.persistFlag){
            cc.game.addPersistRootNode(this.node);
        }
    },

    loadPrefab () {
        if(this.PREFAB)
        {
            let node = cc.instantiate(this.PREFAB);
            //当父节点不存在, 使用当前组件为父节点
            node.parent = this.parent || this.node;
        }
    },



    // update (dt) {},
});
