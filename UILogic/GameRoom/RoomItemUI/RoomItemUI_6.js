var RoomItemUIBase = require("RoomItemUIBase")
var GameDataMgr = require("GameDataMgr")

cc.Class({
    extends: RoomItemUIBase,

    properties: {
        _AwardTotal:[],
        _historyList:[],
        _cardTypeList:[],
        _maxHisNum:48,
        _maxCardNum:10,
    },

    start(){

    },

    onDestroy(){
        
    },

    clearnUI(){
        this._label_cutDown.$Label.string = "0秒"
        this.unscheduleAllCallbacks()
    },

    refreshUI() {
        this.clearnUI()
        let gameData = GameDataMgr.getGameData(this.gameIndex);
        let roomData = gameData.getRoomMgr().getRoom(this.roomID);
        cc.assert(roomData);
        roomData = roomData.serverRoomData;

        this.setMaster(roomData.roomData.master)
        var minBet = common.util.ConvertMoneyToClient(roomData.roomData.minBet)
        var maxBet = common.util.ConvertMoneyToClient(roomData.roomData.maxBet)
        this.setEnterCoin(minBet,maxBet)
        this.setRoomName(roomData.roomData.roomName)
        this.setDownName(roomData.roomPhaseData.status)
        this.setCutDown(roomData.roomPhaseData.restTime/1000)

        this.setHistory(roomData.history)
    },

    onUpdateReward(_data) {
        if(this.roomID == _data.roomId){
            if(this._historyList){
                var isContinue = true;
                for (let index = 0; index < this._historyList.length; index++) {
                    if(this._historyList[index].gameUUID === _data.history.gameUUID){
                        console.error("这局记录已经刷新过！"+_data.history.gameUUID);
                        isContinue = false;
                        return
                    }
                }
                if(isContinue){
                    this._historyList.push(_data.history)
                    this.updateWayBill(_data.history.winner+1)
                    this._cardTypeList.push(_data.history.cardType-1)
                    this.updateCardItem()
                }
            }
        }
    },

    onUpdateInfo(_data){
        if(this.roomID == _data.roomId){
            this.setDownName(_data.roomPhaseData.status)
            this.setCutDown(_data.roomPhaseData.restTime/1000)
        }
    },

    refreshAwardCount(){
    },

    _onBtn_startEnterTouchEnd(){
        this.doEnterRoom();
    },

    /**
     * @description 设置是否可上庄的文字
     * @param isMaster 是否可上庄 1可上庄 0不可上庄
     */
    setMaster(_isMaster){
        this._label_canBanker.active = _isMaster == 1
    },

    /**
     * @description 设置限红文字
     * @param _minBet 最低下注
     * @param _maxBet 最高下注
     */
    setEnterCoin(_minBet,_maxBet){
        var text = "限红 "+_minBet+"-"+_maxBet;
        this._label_enter.$Label.string = text;
    },

    /**
     * @description 设置房间名称图片
     * @param _data 房间名称 
     */
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
        this._img_roomName.$MagicSprite.index = id;
    },

    /**
     * @description 设置当前的状态名称
     * @param _value 当前的房间状态 
     */
    setDownName(_value){
        var str;
        switch(_value){
            case 0:
                str = "开奖中: ";
                break;
            case 1:
                str = "下注中: ";
                break;
            case 2:
                str = "等待中: ";
                break;
        }
        this._label_state.$Label.string = str;
    },

    /**
     * @description 设置当前倒计时时间
     * @param _time 当前倒计时时间
     */
    setCutDown(_time){
        var _curTime = _time;
        this._label_cutDown.$Label.string = _curTime+"秒";
        this.unscheduleAllCallbacks()
        this.schedule(function(){
            _curTime--;
            if(_curTime <= 0){
                this.unscheduleAllCallbacks()
            }
            this._label_cutDown.$Label.string = _curTime+"秒";
        }, 1, cc.macro.REPEAT_FOREVER);
    },

    /**
     * @description 设置历史记录
     * @param _history 历史记录数据
     */
    setHistory(_history){
        var self = this
        this._historyList = _history;
        var list = this._historyList.slice(this._historyList.length-this._maxHisNum,this._historyList.length)
        list.forEach(element => {
            self.updateWayBill(element.winner+1)
            self._cardTypeList.push(element.cardType-1)
        });
        this.updateCardItem()
    },

    /**
     * @description 更新路单数据
     * @param _data 更新的单条路单数据
     */
    updateWayBill(_data){
        this.getComponent('HHDZ_WayBill').putResult(_data);
    },

    /**
     * @description 更新牌型数据
     */
    updateCardItem(){
        var cardList = null
        if(this._cardTypeList.length <= this._maxCardNum){
            cardList = this._cardTypeList
        }else{
            cardList = this._cardTypeList.slice(this._cardTypeList.length-this._maxCardNum,this._cardTypeList.length)
        }
        cardList = cardList.reverse()
        for (let index = 0; index < this._maxCardNum; index++) {
            if(cardList[index] != null){
                this['_cardItem_'+index].active = true
                this['_cardItem_'+index].$MagicSprite.index = cardList[index]
            }else{
                this['_cardItem_'+index].active = false
            }
        }
    },

    /**
     * @description 更新下一局预测数据
     */
    updateNextBill(){
        this.getComponent('HHDZ_WayBill').putResult(_data);
    },

    // update (dt) {},
});
