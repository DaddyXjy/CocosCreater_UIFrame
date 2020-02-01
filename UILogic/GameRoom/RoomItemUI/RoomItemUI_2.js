var RoomItemUIBase = require("RoomItemUIBase")
var GameDataMgr = require("GameDataMgr")

cc.Class({
    extends: RoomItemUIBase,

    properties: {
        
    },

    onDestroy(){
        clearInterval(this.myInterval)
    },

    refreshUI() {
        let gameData = GameDataMgr.getGameData(this.gameIndex);
        let roomData = gameData.getRoomMgr().getRoom(this.roomID);
        cc.assert(roomData);
        cc.log("==========房间数据==========",roomData);
        roomData = roomData.serverRoomData;
        
        this.setRoomName(roomData.roomName);
        this._awardTotal = roomData.history;
        this.setAllAward();
        this.refreshAwardCount();
        this.setCountDown(roomData.roomPhaseData.restTime);
        this.setDownName(roomData.roomPhaseData.status);
        this.setXianHong(common.util.ConvertMoneyToClient(roomData.minBet),common.util.ConvertMoneyToClient(roomData.maxBet));
        this.setIsBanker(roomData.hostable);
    },

    onUpdateReward(_data) {
        if(this.roomID == _data.roomId){
            cc.log("==========更新房间数据==========",_data);
            this._awardTotal = _data.history;
            this.refreshAwardCount();
            this.setAllAward();
            this.setCountDown(_data.roomPhaseData.restTime);
            this.setDownName(_data.roomPhaseData.status);
        }
    },

    refreshAwardCount(){
        let awardCount = [0,0,0,0,0,0,0,0,0,0]
        this._awardTotal.forEach(index => {
            awardCount[index]++;
        });
        for (let index = 0; index < 10; index++) {
            const ele = awardCount[index];
            var a  = this['_label_count_' + index];
            var b = a.$Label;
            b.string = ele;
            
        }
    },

    setXianHong(_min,_max){
        this._label_xianhong.$Label.string = '限红' + String(_min) + '-' +String(_max)
    },

    setIsBanker(_data){
        if(_data){
            this._label_shangzhuang.$Label.string = '可上庄'
        }else{
            this._label_shangzhuang.$Label.string = '不可上庄'
        }
    },

    setDownName(_value){
        var str;
        switch(_value){
            case 0:
                str = "下注中";
                break;
            case 1:
                str = "开奖中";
                break;
            case 2:
                str = "等待中";
                break;
        }
        this._label_text.$Label.string = str;
    },

    setCountDown(_data){
        clearInterval(this.myInterval)

        this._label_stutas.$Label.string = String(_data);
        var countTime = Number(_data) - 1
        this.myInterval = setInterval(function(){
            if(countTime <= 0){
                clearInterval(this.myInterval)
            }
            this._label_stutas.$Label.string = String(countTime);
            countTime = Number(countTime) - 1
        }.bind(this),1000)
    },

    setAllAward(){
        let history = this._awardTotal.slice().reverse();
        for(let index = 0 ; index < 6 ; index++){
            let award = history[index];
            let awardUI = this["_node_prize_"+index];
            if(award == undefined){
                awardUI.active = false;
            }else{
                awardUI.active = true;
                awardUI.getChildByName('_img_anispr').getComponent('MagicSprite').index = award;
            }
        }
    },
 
    setIsNew(_bool ,awardItemNode){
        awardItemNode.getChildByName('_img_newspr').active = _bool
        awardItemNode.getChildByName('_img_new').active = _bool
    },

    setRoomName(_data){
        var id;
        switch(_data){
            case "体验房":
                id = 0;
                break;
            case "初级房":
                id = 1;
                break;
            case "中级房":
                id = 2;
                break;
            case "高级房":
                id = 3;
                break;
            case "富豪房":
                id = 4;
                break;
            case "至尊房":
                id = 5;
                break;
        }
        this._img_roomname.$MagicSprite.index = id;
    },

    _onBtn_startEnterTouchEnd(){
        this.doEnterRoom();
    }

    // update (dt) {},
});
