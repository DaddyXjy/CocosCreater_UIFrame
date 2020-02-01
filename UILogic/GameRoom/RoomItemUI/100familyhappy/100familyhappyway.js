cc.Class({
    extends: require('FortuneTell'),

    properties: {
        nextList1: [cc.Sprite],
        nextList2: [cc.Sprite],
        fList: [cc.SpriteFrame],
        lightNode: cc.Node,
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
    getBigCell(result) {
        let cell;
        if ((result & 0xf) == 1) {
            cell = cc.instantiate(this.bigZ);
        } else {
            cell = cc.instantiate(this.bigX);
        }
        if (result & 0xf0) {
            let dui = this.getSmallCell(2);
            dui.x = 17;
            dui.y = -17;
            cell.addChild(dui);
        }
        if (result & 0xf00) {
            let dui = this.getSmallCell(1);
            dui.scale = 0.4;
            dui.x = -17;
            dui.y = 17;
            cell.addChild(dui);
        }
        return cell;
    },

    getBeadCell(result) {
        let cell;
        switch (result & 0xf) {
            case 0x1:
                cell = cc.instantiate(this.beadZ);
                break;
            case 0x2:
                cell = cc.instantiate(this.beadX);
                break;
            case 0x3:
                cell = cc.instantiate(this.beadH);
                break;
        }
        if (result & 0xf0) {
            let dui = this.getSmallCell(2);
            dui.scale = 0.3;
            dui.x = 10;
            dui.y = -10;
            cell.addChild(dui);
        }
        if (result & 0xf00) {
            let dui = this.getSmallCell(1);
            dui.scale = 0.3;
            dui.x = -10;
            dui.y = 10;
            cell.addChild(dui);
        }
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