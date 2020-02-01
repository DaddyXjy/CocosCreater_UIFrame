/**
 * Date: 2019/08/10
 * Author: dylan
 * Desc: 大厅网络层
 * 
 */

var UIUtil = require('UIUtil');
var LobbyProto = require('LobbyProtoFactory');
var hallData = require("hallData")
var GameDataMgr = require("GameDataMgr")
var GameConst = require("GameConst")
var UIMgr = require("UIMgr")
var VipNetMgr = require("VipNetMgr");
var HallNetMgr = {

    init(){
        this.registerMailListMsg();
        this.registChargeNotify();
        this.registUserInfoNotify();
        this.registMoneyUpdate();
        this.registToDraw();
        this.registSafe();
        this.registSetSafePassword();
        this.registPayList();
        this.registUserPortrait();
        this.registAttrChange();
        this.registPromotionData();
        this.registReceiveRebate();
        this.registRebateRecord();
        this.registUpdateMode();
        this.registPromotionLevel();
        
        VipNetMgr.init();
    },

    registerMailListMsg()
    {
        var websocket = common.api.getWebsocket();
        websocket.reg(LobbyProto.ActionCode.Lobby.GET_MSG_LIST, function (data) 
        {
            if (data.status) 
            {
                var MailData = [];
                data.msg = LobbyProto.newRsp(data.msgType, data.msg);
                for(var i = 0 ; i < data.msg.notices.length ; i++)
                {
                    var CurrentData = data.msg.notices[i];
                    MailData.push(CurrentData);
                }
                hallData.MailData = MailData
            }
            else 
            {
                common.ShowTips(data.msg);
            }
        },this);
    },

    registChargeNotify() {
        var websocket = common.api.getWebsocket();
        websocket.reg(LobbyProto.ActionCode.Game.GAME_CHARGE_NOTIFY, function (data) {
            if (!data.status) {
                common.ShowTips(data.msg)
                return
            }
            data.msg = common.ProtoBase.GameChargeNotify.decode(data.msg);
            cc.log("充值金币来了 data ", data);
            var currentMoney = common.util.ConvertMoneyToClient(data.msg.currentMoney);
            var chargeMoney = common.util.ConvertMoneyToClient(data.msg.chargeMoney);
            common.playerData.setCoin(currentMoney);
        }, this);
    },

    registUserInfoNotify() {
        var websocket = common.api.getWebsocket();
        websocket.reg(LobbyProto.ActionCode.Lobby.USER_INFO_CHANGED, function (data) {
            if (!data.status) {
                common.ShowTips(data.msg)
                return
            }
            console.log('有人通过后台改了玩家信息......');
            common.playerData.loadDataFromServer(data);
        }, this);
    },

    registMoneyUpdate() {
        var websocket = common.api.getWebsocket();
        websocket.reg(LobbyProto.ActionCode.Lobby.GET_MONEY_VARIETY, function (data) //更新金币
        {
                if (data.status) {
                    data.msg = LobbyProto.newRsp(data.msgType, data.msg);
                    var Coins = common.util.ConvertMoneyToClient(data.msg.coins);
                    common.playerData.setCoin(Coins);
                }
        }, this);
    },

    registToDraw(){
        var websocket = common.api.getWebsocket();
        websocket.reg(LobbyProto.ActionCode.Lobby.TO_DRAW, function (data) {
            common.ui.loading.hide();
            if (data.status) {
                data.msg = LobbyProto.newRsp(data.msgType, data.msg);
                if (data.msg.code == 203) {
                    common.ShowTips(data.msg.msg);
                } else {
                    popLayout.showBoxBySrcName("selementTip", (Box) => {
                        Box.getComponent('tipPanel').setContent(1, "异常失败");
                        if (data.msg.code == 200) {
                            Box.getComponent('tipPanel').setContent(0, "提现金额将在2-5分钟内到账，请注意资金变动。");
                        } else if (data.msg.code == 201) {
                            Box.getComponent('tipPanel').setContent(1, "请点击右上角客服图标，咨询提现未成功原因。");
                        } else if (data.msg.code == 202) {
                            Box.getComponent('tipPanel').setContent(1, data.msg.msg);
                        }
                    });
                }
            } else {
                common.ShowTips(data.msg);
            }
        });
        websocket.reg(LobbyProto.ActionCode.Lobby.Msk_Re_Sure,(data)=>{
            common.ui.loading.hide();
            let msg = LobbyProto.newRsp(data.msgType, data.msg);
            UIMgr.openUI('maskTip',msg);
        });
    },

    registSafe(){
        var websocket = common.api.getWebsocket();
        websocket.reg(LobbyProto.ActionCode.Lobby.OPEN_SAFE, function (data) {
            common.ui.loading.hide();
            if (data.status) {
                popLayout.hideBox(true);
                popLayout.showBoxByindex(1);
            } else {
                common.ShowTips("密码错误");
            }
        });
    },

    registSetSafePassword(){
        var websocket = common.api.getWebsocket();
        websocket.reg(LobbyProto.ActionCode.Lobby.SET_SAFE_PASSWORD, function (data) {
            common.ui.loading.hide();
            if (data.status) {
                common.ShowTips("设置成功");
                common.playerData.safeFlag = 1;
            } else {
                common.ShowTips("设置失败");
            }
        });
    },

    registPayList(){
        var websocket = common.api.getWebsocket();
        websocket.reg(LobbyProto.ActionCode.Lobby.PAY_LIST, function (data) {
            common.ui.loading.hide();
            if (data.status) {
                common.shopInfo = LobbyProto.newRsp(data.msgType, data.msg);
                common.moneyList = common.shopInfo.moneyArray.split(",");
                UIMgr.openUI("shopWin");
            } else {
                common.ShowTips(data.msg);
            }
        });
    },

    registUserPortrait(){
        var websocket = common.api.getWebsocket();
        websocket.reg(LobbyProto.ActionCode.Lobby.USER_PORTRAIT, function (data) //设置头像
        {
            if (data.status) {
                data.msg = LobbyProto.newRsp(data.msgType, data.msg);
                var Portrait = parseInt(data.msg.portrait);
                common.playerData.setPortrait(Portrait);
            }
        });  
    },

    registAttrChange(){
        var websocket = common.api.getWebsocket();
        websocket.reg(LobbyProto.ActionCode.Lobby.attrChange, function (data) {
            if (data.msg.attributeType == 1) {
                common.playerData.safeFlag = data.msg.attributeNum;
            }
        });
    },

    registSignData(){
        let websocket = common.api.getWebsocket();
        var actionCode = LobbyProto.ActionCode.Lobby.GET_ACTIVITY_SIGN_DATA;
        websocket.reg(actionCode, function (data) {
            if (data.status) {
                data.msg = LobbyProto.newRsp(data.msgType, data.msg);
                if (data.msg.signState == SignData.EnumSignState.SignNormalOpen) {
                    SignData.signServerData = data;
                    let tempData = SignData.signServerData;
                    let showSignDot = false;
                    for (let i = 0; i < tempData.msg.daysRewardList.length; i++) {
                        let perDayData = tempData.msg.daysRewardList[i];
                        if (perDayData.state == SignData.EnumDaySignState.CanSign) {
                            if (bShow) {
                                var PrefabsLoader = require('MM_PrefabsLoader');
                                PrefabsLoader.GetNodeByName("SignDialogBox", (_Node) => {
                                    _Node.getComponent("DialogBox").Show();
                                });
                            }
                            showSignDot = true;
                            break;
                        }
                    }
                    if (showSignDot) {
                        hallData.signDotShow = true;
                    } else {
                        hallData.signDotShow = false;
                    }
                }
            }
        });

    },

    sendMailListMsg(){
        var websocket = common.api.getWebsocket();
        let msgReq = LobbyProto.newReq(LobbyProto.ActionCode.Lobby.GET_MSG_LIST);
        websocket.sendMsg(msgReq);
    },

    /**
     * 注册请求推广员数据消息
     */
    registPromotionData(){
        var websocket = common.api.getWebsocket();
        websocket.reg(LobbyProto.ActionCode.Lobby.PROMOTION_DATA, function (data) {
            if (data.status) {
                let Msg = LobbyProto.newRsp(LobbyProto.ActionCode.Lobby.PROMOTION_DATA,data.msg);
                hallData.promotionData = Msg;
                if(Msg.yCommission != null){
                    common.playerData.setPrometerYCommission(common.util.ConvertMoneyToClient(Msg.yCommission))
                }
                if(Msg.yTeamResult != null){
                    common.playerData.setPrometerYTeamResult(common.util.ConvertMoneyToClient(Msg.yTeamResult))
                }
                if(Msg.yNewLower != null){
                    common.playerData.setPrometerYNewLower(common.util.ConvertMoneyToClient(Msg.yNewLower))
                }
            }else{
                common.ShowTips(data.msg);
            }
        });
    },

    /**
     * 发送请求推广员数据消息
     */
    sendPromotionData(){
        let reqData = LobbyProto.newReq(LobbyProto.ActionCode.Lobby.PROMOTION_DATA);
        common.api.getWebsocket().sendMsg(reqData);
    },

    /**
     * 注册领取推广奖励消息
     */
    registReceiveRebate(){
        var websocket = common.api.getWebsocket();
        websocket.reg(LobbyProto.ActionCode.Lobby.RECEIVE_REBATE, function (data) {
            if (data.status) {
                let Msg = LobbyProto.newRsp(LobbyProto.ActionCode.Lobby.RECEIVE_REBATE,data.msg);
                hallData.receiveRebate = Msg;
                var PlayerCoins = common.util.ConvertMoneyToClient(Msg.palyerCoin).toFixed(2);
                common.playerData.setCoin(PlayerCoins);
            }else{
                common.ShowTips(data.msg);
            }
        });
    },

    /**
     * 发送领取推广奖励消息
     */
    sendReceiveRebate(){
        let reqData = LobbyProto.newReq(LobbyProto.ActionCode.Lobby.RECEIVE_REBATE);
        common.api.getWebsocket().sendMsg(reqData);
    },

    /**
     * 注册推广领取记录消息
     */
    registRebateRecord(){
        var websocket = common.api.getWebsocket();
        websocket.reg(LobbyProto.ActionCode.Lobby.REBATE_RECORD, function (data) {
            if (data.status) {
                let Msg = LobbyProto.newRsp(LobbyProto.ActionCode.Lobby.REBATE_RECORD,data.msg);
                hallData.rebateRecord = Msg;
            }else{
                common.ShowTips(data.msg);
            }
        });
    },

    /**
     * 发送推广领取记录消息
     */
    sendRebateRecord(data){
        if(data == null){
            return
        }
        let reqData = LobbyProto.newReq(LobbyProto.ActionCode.Lobby.REBATE_RECORD);
        reqData.pageNum = Number(data.pageNum)
        reqData.pageSize = Number(data.pageSize)
        common.api.getWebsocket().sendMsg(reqData);
    },

    /**
     * 注册修改模板消息
     */
    registUpdateMode(){
        var websocket = common.api.getWebsocket();
        websocket.reg(LobbyProto.ActionCode.Lobby.UPDATE_MODE, function (data) {
            if (data.status) {
                let Msg = LobbyProto.newRsp(LobbyProto.ActionCode.Lobby.UPDATE_MODE,data.msg);
                hallData.updateMode = Msg;
            }else{
                common.ShowTips(data.msg);
            }
        });
    },

    /**
     * 发送推广领取记录消息
     */
    sendUpdateMode(data){
        if(data == null){
            return
        }
        let reqData = LobbyProto.newReq(LobbyProto.ActionCode.Lobby.UPDATE_MODE);
        reqData.modeId = Number(data.modeId)
        reqData.accountId = Number(data.accountId)
        common.api.getWebsocket().sendMsg(reqData);
    },

    /**
     * 注册推广等级配置消息
     */
    registPromotionLevel(){
        var websocket = common.api.getWebsocket();
        websocket.reg(LobbyProto.ActionCode.Lobby.PROMOTION_LEVEL, function (data) {
            if (data.status) {
                let Msg = LobbyProto.newRsp(LobbyProto.ActionCode.Lobby.PROMOTION_LEVEL,data.msg);
                hallData.promotionLevel = Msg;
            }else{
                common.ShowTips(data.msg);
            }
        });
    },

    /**
     * 发送推广等级配置消息
     */
    sendPromotionLevel(){
        let reqData = LobbyProto.newReq(LobbyProto.ActionCode.Lobby.PROMOTION_LEVEL);
        common.api.getWebsocket().sendMsg(reqData);
    },
}

module.exports = HallNetMgr;