// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        hisItem: cc.Prefab,
        _list: [],
    },
    init() {
        this.node.destroyAllChildren();
        this._list = [];
    },
    addHisNode(list) {
        let item = cc.instantiate(this.hisItem);
        item.getComponent('bainiuHisItem').setRes(list);
        this.node.addChild(item);
        this._list.push(item);
        if (this._list.length > 12) {
            this._list.shift().destroy();
        }
    }
});