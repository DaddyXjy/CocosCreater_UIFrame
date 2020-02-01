cc.Class({
    extends: require('FortuneTell'),

    properties: {
        nextList1: [cc.Sprite],
        nextList2: [cc.Sprite],
        fList: [cc.SpriteFrame],
        lightNode: cc.Node
    },
    putResult(result) {
        let [x, y] = this.putBead(result);
        this.putBig(result);
        this.lightNode.x = x;
        this.lightNode.y = y;
    },

    getBigEyeCell(color) {
        let cell = null;
        if (color == 1) {
            cell = cc.instantiate(this.bigZ);
        } else {
            cell = cc.instantiate(this.bigX);
        }
        cell.scale = 0.3;
        return cell;
    },
    addNext() {
        let colors1 = this.testNext(1);
        for (let i = 0; i < this.nextList1.length; ++i) {
            this.nextList1[i].spriteFrame = this.fList[i * 2 + colors1[i] - 1];
        }
        let colors2 = this.testNext(2);
        for (let i = 0; i < this.nextList2.length; ++i) {
            this.nextList2[i].spriteFrame = this.fList[i * 2 + colors2[i] - 1];
        }
    }
});