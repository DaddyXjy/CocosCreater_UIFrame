var FortuneTell = require('FortuneTell')
cc.Class({
    extends: FortuneTell,

    properties: {
        bigEyeZ: {
            default: null,
            type: cc.Prefab,
        },
        bigEyeX: {
            default: null,
            type: cc.Prefab,
        },
        sBead: 26.5,
        sBig: 26.5,
        sSmall: 13,
        beadNum: 8,
        bigNum: 24,
        smallNum: 24,
    },

    getBigEyeCell(color) {
        let cell = null;
        if (color == 1) {
            cell = cc.instantiate(this.bigEyeZ);
        } else {
            cell = cc.instantiate(this.bigEyeX);
        }
        return cell;
    },

});
