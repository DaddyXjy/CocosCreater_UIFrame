/**
 * Date: 2019/07/26
 * Author: dylan
 * Desc: 游戏入口管理
 * 
 */

var UIUtil = require('UIUtil')
var GameItemUI = require('GameItemUI')
var GameDataMgr = require('GameDataMgr')
var GameConst = require('GameConst')
var GameItemUIMgr = {

    _gameItemPool : [],

    hookGameItem2Node(gameIndex , node , itemSize , callback){
        let findItem = this._findGameItemInPool(gameIndex);
        if(!findItem){
            this.createGameItemUI(gameIndex , ui=>{
                if (node != null && cc.isValid(node)) {
                    ui.add2Parent(node);
                    if(node.children.length == itemSize){
                        callback();
                    }
                }
            });
        }else{
            findItem.add2Parent(node);
            if(node.children.length == itemSize){
                callback();
            }
        }
    },

    


    _findGameItemInPool(gameIndex){
        let findItem = this._gameItemPool.find((ui) => {
            return ui.gameIndex == gameIndex;
        });
        if (findItem) {
            findItem.node.active = true
        }
        return findItem;
    },

    createGameItemUI(gameIndex , callback){
        let prefabPath = "hall/gameEnterItem_hall";
        UIUtil.createUI(prefabPath , 'GameItemUI' , ui=>{
            let findItem = this._findGameItemInPool(gameIndex);
            if(findItem){
                return;
            }
            this._gameItemPool.push(ui);
            cc.assert(callback)
            ui.gameIndex = gameIndex;
            //加入hotForGame
            let HotForGame = require("HotForGame")
            let hot = ui.addComponent(HotForGame)
            hot.GameItemUI = ui
            hot.setGameIndex(gameIndex)
            let gameData = GameDataMgr.getGameData(gameIndex)
            hot.gameData = gameData
            if (gameData.isNormalGameStatus()) {
                hot.checkVersion()
            }
            if(callback){
                callback(ui);
            }
        });
    }
    

}

module.exports = GameItemUIMgr