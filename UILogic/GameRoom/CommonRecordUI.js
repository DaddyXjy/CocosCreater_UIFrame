// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

var UIBase = require("UIBase")
var GameNetMgr = require("GameNetMgr")
var hallData = require("hallData")
var UIUtil = require("UIUtil")
var CommonRecordUI = cc.Class({
    extends: UIBase,

    properties: {

    },


    // onLoad () {},

    start() {

    },

    onUILoaded() {
        hallData.gameRecordDataNotify.addListener(this.onRecordRefresh, this);
    },

    onOpen() {
        this.pageIndex = 1;
        GameNetMgr.sendGameHistoryRequest(this.pageIndex);
    },

    initUI() {

    },

    onClose() {

    },

    onRecordRefresh(recordDatas) {
        common.ui.loading.hide();
        let records = recordDatas.records;
        let pageIndex = recordDatas.pageIndex;
        this.totalPages = recordDatas.totalPages;
        this._historyContent.removeAllChildren(true);
        records.forEach(data => {
            this._historyContent.addChild(this.createItemUI(data));
        });
        if (this.totalPages == 0) {
            this.totalPages = 1;
        }
        this._label_tip1.$Label.string = "第" + pageIndex + " / " + this.totalPages + "页";
    },

    createItemUI(recordData) {
        let historyItem = cc.instantiate(this._historyItem);
        var Tempid = recordData.gameId;
        var RoomName = recordData.roomName;
        var WinLose = common.util.ConvertMoneyToClient(recordData.win);
        var times = new Number(recordData.endTime.toString());
        var ExitTime = common.timeFormat(times);
        historyItem.getChildByName("_label_sortid").getComponent(cc.Label).string = Tempid
        historyItem.getChildByName("_label_roomName").getComponent(cc.Label).string = RoomName
        if (WinLose < 0) {
            historyItem.getChildByName("_label_win").color = cc.color(222, 52, 0);
        } else {
            historyItem.getChildByName("_label_win").color = cc.color(1, 184, 87);
        }
        historyItem.getChildByName("_label_win").getComponent(cc.Label).string = WinLose
        historyItem.getChildByName("_label_time").getComponent(cc.Label).string = ExitTime;
        return historyItem;
    },

    update(dt) {},

    _onBtn_previous_pageTouchEnd() {
        this.pageIndex = this.pageIndex - 1;
        if (this.pageIndex < 1) {
            this.pageIndex = 1;
            UIUtil.showTips("已经是第一页了");
            return;
        }
        common.ui.loading.show();
        GameNetMgr.sendGameHistoryRequest(this.pageIndex);
    },

    _onBtn_next_pageTouchEnd() {
        this.pageIndex = this.pageIndex + 1;
        if (this.pageIndex > this.totalPages) {
            this.pageIndex = this.totalPages;
            UIUtil.showTips("已经是最后一页了");
            return;
        }
        common.ui.loading.show();
        GameNetMgr.sendGameHistoryRequest(this.pageIndex);
    }

});

module.exports = CommonRecordUI;