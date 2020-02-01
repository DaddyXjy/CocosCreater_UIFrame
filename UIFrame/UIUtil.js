/**
 * Date: 2019/07/23
 * Author: dylan
 * Desc: UI工具
 * 
 */


let customerUtils = require('customerUtils');
let UIGlobalCfg = require('UIGlobalCfg');
let UIUtil = {

    //组件名字匹配
    getComponentName: function (component) {
        return cc.js.getClassName(component);
    },

    //获取客户资源路径
    getCustomerResUrl(resRelativePath) {
        let customerResUrl = `CustomerUI/${customerUtils.customerMark}/${resRelativePath}`;
        //先从客户自己路径下找
        if (cc.loader._getResUuid(customerResUrl)) {
            return customerResUrl;
        }
        //再从客户所用皮肤路径下找
        let skinResUrl = `CustomerUI/common/${resRelativePath}`;
        if (cc.loader._getResUuid(skinResUrl)) {
            return skinResUrl;
        }
        //再从大厅公用路径下找
        let commonResUrl = `CommonUI/${resRelativePath}`;
        if (cc.loader._getResUuid(commonResUrl)) {
            return commonResUrl;
        }
        //再从大厅游戏公用路径:CommonDynamicAssets找
        let gameHallResUrl = `CommonDynamicAssets/new/${resRelativePath}`;
        if (cc.loader._getResUuid(gameHallResUrl)) {
            return gameHallResUrl;
        }
        //再从大厅游戏公用路径:CommonDynamicAssets找
        let textureResUrl = `CommonDynamicAssets/Texture/${resRelativePath}`;
        if (cc.loader._getResUuid(textureResUrl)) {
            return textureResUrl;
        }
        return null;
    },
    //获取prefab路径
    getCustomerPrefabUrl(prefabName) {
        let prefabPath = `prefabs/${prefabName}`;
        let prefabUrl = this.getCustomerResUrl(prefabPath);
        return prefabUrl;
    },

    //加载客户prefab
    loadCustomerPrefab(prefabName, callback) {
        let prefabUrl = this.getCustomerPrefabUrl(prefabName);
        //cc.assert(prefabUrl, 'cant find prefab url' + prefabName);
        if(!prefabUrl)
        {
            cc.warn(prefabUrl, 'cant find prefab url' + prefabName);
        }
        cc.loader.loadRes(prefabUrl, function (err, asset) {
            if (callback) {
                callback(err, asset);
            }
        });
    },

    //创建客户prefab
    createCustomerPrefab(prefabName, callback) {
        this.loadCustomerPrefab(prefabName, (err, asset) => {
            if (!err) {
                let node = cc.instantiate(asset)
                if (callback) {
                    callback(err, node);
                }
            }
        });
    },

    //加载客户prefabs,多个prefab
    loadCustomerPrefabs: function (prefabNames, callback) {
        let prefabUrls = []
        prefabNames.forEach(prefabName => {
            prefabUrls.push(this.getCustomerPrefabUrl(prefabName));
        });
        cc.loader.loadResArray(prefabUrls, function (err, assets) {
            if (!err) {
                if (callback) {
                    callback(err, assets);
                }
            }
        });
    },

    //显示Tips
    showTips(txtTips) {
        var UIMgr = require('UIMgr');
        UIMgr.openUI('TipsUI', txtTips);
    },
    //显示小黑色弹窗
    ShowBoxTip(text, callback) {
        var UIMgr = require('UIMgr');
        UIMgr.openUI("SmallBlackWindowTip", {
            text: text,
            callback: callback || null
        });
    },
    //获取UI配置
    getUICfg(uiName) {
        let UICfg = require(`${uiName}Cfg`);
        cc.assert(UICfg, 'can not find uiCfg' + uiName);
        return UICfg;
    },

    //创建UI
    createUI(prefabPath, scriptName, callback) {
        let uiComponent = require(scriptName);
        cc.assert(uiComponent, `can not find uiScript:${scriptName}.js".`);
        UIUtil.loadCustomerPrefab(prefabPath, (err, asset) => {
            cc.assert(!err, `can't load prefab: ${prefabPath}`);
            if (!err) {
                let node = cc.instantiate(asset);
                let ui = node.addComponent(uiComponent);
                cc.assert(ui, `addComponent failed ${scriptName}`);
                if (callback) {
                    callback(ui);
                }
            }
        });
    },

    //绑定UI到节点
    hookUI2Node(hookNode, prefabPath, scriptName, callback) {
        cc.assert(hookNode)
        this.createUI(prefabPath, scriptName, ui => {
            hookNode.addChild(ui.node);
            if (callback) {
                callback(ui);
            }
        });
    },

    //动态换图
    setSprite(spNode, texturePath, callback) {
        let customerResUrl = this.getCustomerResUrl(texturePath);
        cc.loader.loadRes(customerResUrl, cc.SpriteFrame, function (err, spriteFrame) {
            cc.assert(!err, "加载图片出错:" + texturePath);
            if (!err) {
                if (spNode && cc.isValid(spNode)) {
                    let spriteCmp = spNode.getComponent(cc.Sprite);
                    cc.assert(spriteCmp, `找不到节点${spriteCmp.name}的sprite组件`);
                    spriteCmp.spriteFrame = spriteFrame;
                    if (callback) {
                        callback(spNode);
                    }
                }
            }
        });
    },

    addScriptComponent(spNode, scriptName) {
        let uiComponent = require(scriptName);
        cc.assert(uiComponent, `can not find uiScript:${scriptName}.js".`);
        cc.assert(spNode, `can not find uiNode:${spNode}".`);
        spNode.addComponent(uiComponent);
    },

    //根据游戏ID打开对应二级选场
    openRoomUI(gameIndex) {
        var UIMgr = require('UIMgr');
        let GameConst = require('GameConst');
        var GameDataMgr = require('GameDataMgr')
        let gameData = GameDataMgr.getGameData(gameIndex);
        gameData.prepareEnterGame(() => {
            let gameType = gameData.getGameType();
            let gameUIList = ["BET_RoomUI", "FISH_RoomUI", "PK_RoomUI"];
            let uiName = gameUIList[gameType];
            switch (gameIndex) {
                case 3:
                    uiName = 'FISH_RoomUI';
                    break;
                case 13:
                    uiName = 'FISH_RoomUI1';
                    break;
                case 19:
                    uiName = 'FISH_RoomUI2';
                    break;
            }
            let gameCfg = UIUtil.getGameCfg(gameIndex);
            if (gameCfg.level) {
                uiName = 'LEVEL_RoomUI';
            }
            UIMgr.openUI(uiName, gameIndex);
        });
    },

    //获取游戏配置脚本
    getGameCfg(gameIndex) {
        let gameCfg;
        try {
            gameCfg = require(`GameCfg_${gameIndex}`);
        } catch (error) {
            cc.log(`can not gameCfg:${gameIndex}`)
        }
        return gameCfg;
    },

    //获取房间脚本
    getRoomItemUIScript(gameIndex) {
        let roomItemUIName = `RoomItemUI_${gameIndex}`;
        let roomItemUIScript = null;
        try {
            roomItemUIScript = require(roomItemUIName);
        } catch (error) {
            cc.log(`can not RoomItemUI:${gameIndex}`)
        }
        if (!roomItemUIScript) {
            roomItemUIName = "RoomItemUIBase";
        }
        return roomItemUIName;
    },

    playAllNodeAnimation(node){
        node.children.forEach((child) => {
            let anim = child.getComponent(cc.Animation);
            if(anim){
                anim.play();
            }
            let anim2 = child.getComponent("IntervalPlayAnimation");
            if(anim2){
                anim2.play();
            }
            this.playAllNodeAnimation(child);
        });
    },

}

module.exports = UIUtil;