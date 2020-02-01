/**
 * Date: 2019/08/12
 * Author: dylan
 * Desc: 房间itemUI管理
 * 
 */

var UIUtil = require('UIUtil')
var GameDataMgr = require('GameDataMgr')
var RoomItemUIMgr = {

    _roomItemUIPool : [],

    hookRoomItem2Node(gameIndex , roomID , node, itemSize , callback){
        let findItem = this._findGameItemInPool(gameIndex , roomID);
        if(!findItem){
            this.createRoomItemUI(gameIndex , roomID , ui=>{
                if (node != null && cc.isValid(node)) {
                    ui.add2Parent(node);
                    ui.node.roomID = roomID;
                    ui.refreshUI();
                    if(node.children.length == itemSize){
                        this._sortRoomItems(node , gameIndex);
                        callback();
                    }
                }
            });
        }else{
            findItem.add2Parent(node);
            findItem.refreshUI();
            if(node.children.length == itemSize){
                this._sortRoomItems(node , gameIndex);
                callback();
            }
        }
    },

    _sortRoomItems(roomItemHookNode , gameIndex){
        let itemNodes = []
        roomItemHookNode.children.forEach(itemNode => {
            itemNodes.push(itemNode);
        });
        itemNodes.forEach(itemNode => {
            let gameData = GameDataMgr.getGameData(gameIndex);
            let roomData = gameData.getRoomMgr().getRoom(itemNode.roomID);
            let sortIndex = gameData.getRoomMgr().getRoomIndex(roomData);
            itemNode.setSiblingIndex(sortIndex);
        });

    },

    _findGameItemInPool(gameIndex , roomID){
        let roomItemUIs = this._roomItemUIPool[gameIndex]
        if(!roomItemUIs){
            return null;
        }
        let findItem = roomItemUIs.find((ui) => {
            return ui.roomID == roomID;
        });
        return findItem;
    },

    createRoomItemUI(gameIndex , roomID , callback){
        let gameCfg = UIUtil.getGameCfg(gameIndex);
        let prefabPath = gameCfg.roomItemPrefabPath;
        let roomItemScript = UIUtil.getRoomItemUIScript(gameIndex);
        UIUtil.createUI(prefabPath , roomItemScript , ui=>{
            let findItem = this._findGameItemInPool(gameIndex , roomID);
            if(findItem){
                return;
            }
            let roomItemUIs = this._roomItemUIPool[gameIndex]
            if(!roomItemUIs){
                this._roomItemUIPool[gameIndex] = [];
                roomItemUIs = this._roomItemUIPool[gameIndex];
            }
            roomItemUIs.push(ui);
            cc.assert(callback)
            ui.roomID = roomID;
            ui.gameIndex = gameIndex;
            if(callback){
                callback(ui);
            }
        });
    }
    

}

module.exports = RoomItemUIMgr