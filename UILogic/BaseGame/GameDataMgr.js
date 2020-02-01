/**
 * Date: 2019/07/26
 * Author: dylan
 * Desc: 游戏数据管理
 * 
 */

var UIUtil = require('UIUtil')
var GameData = require('GameData')
var GameDataMgr = {
    gameDataList : [],
    initAllGameData(){
        //现在没有提供获取所有游戏的接口,先这样写
        for (let gameIndex = 0; gameIndex < 100; gameIndex++) {
            this.gameDataList.push(new GameData(gameIndex));
        }
    },

    getGameData(gameIndex){
        let findItem = this.gameDataList.find((data) => {
            return data.getGameIndex() == gameIndex;
        });
        return findItem;
    },


    getItemsByType(gamePageType){
        let resultGameList = []
        this.getServerGameList().forEach((data) => {
            if(gamePageType == 0){
                if(data.isHotGame()){
                    resultGameList.push(data);
                }
            }else{
                if(data.getGamePageType() == gamePageType){
                    resultGameList.push(data);
                }
            }
        });
        return resultGameList;
    },

    //从服务器初始化游戏列表
    initGameListFromServer(serverGameDataList){
        for(var i = 0 ; i < serverGameDataList.length ; i++){
            var gameId = serverGameDataList[i].gameId.toInt();
            let gameData = this.getGameData(gameId)
            gameData.setServerData(serverGameDataList[i]);
        }
    },

    //获取类型Index
    getGameIndex(gameIndex){
        let gameItem =  this.getGameData(gameIndex);
        cc.assert(gameItem);
        let items = this.getItemsByType(gameItem.getGamePageType());
        let index = items.indexOf(gameItem);
        return index
    },

    //获取服务器的游戏列表
    getServerGameList(){
        return this.gameDataList.filter(item=>{
            return item.hasServerData();
        })
    }

}

module.exports = GameDataMgr