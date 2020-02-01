/**
 * Date: 2019/07/23
 * Author: dylan
 * Desc: UI管理器
 * 
 */
var UIGlobalCfg = require("UIGlobalCfg")
var UIUtil = require("UIUtil")
var UIMgr = {

    //ui根
    _uiRoot : null,
    //ui列表
    _uiList : [],
    //缓存UI列表
    _uicache : {},
    //加载列表
    _loadList : [],

    //初始化
    init: function(uiRoot) {
        this._uiRoot = uiRoot
        this._uiList = []
        this._uicache = {}
    },

    update: function (dt) {

    },

    /**
     * 打开ui
     * @param {string} uiName ui名字
     * @param {string} callback ui打开回调
     */
    openUI: function(uiName , param, callback) {
        if(!this._uiRoot){
            cc.error("no this._uiRoot");
            return;
        }
        let uiCfg = require(`${uiName}Cfg`);
        cc.assert(uiCfg , 'can not find uiCfg  '+uiName);
        let ui = null;
        if(uiCfg.isSingletonUI){
            ui = this._swapUI2Top(uiName);
            cc.log("openUI ,swapUI2Top");
        }
        if(!ui){
            ui = this._getCache(uiName);
            cc.log("openUI ,get ui from cache");
        }
        if(!ui){
            this._loadList.push(uiName);
            this._addUI2Root(uiName , (ui)=>{
                this._openUI(ui , param, callback);
            })
            cc.log("openUI , load ui");
        }else{
            this._openUI(ui , param,callback);
        }
    },

    /**
     * 关闭ui
     * @param {string} uiName ui名字
     */
    closeUI: function(arg) {
        if(!this._uiRoot){
            cc.error("no this._uiRoot");
            return;
        }
        if (typeof arg == 'string') {
            this._closeUIByName(arg)
        }else{
            this._closeUIByTarget(arg)
        }
    },

    /**
     * 获取ui
     * @param {string} uiName ui名字
     */
    getUI: function(uiName) {
        let findUI = this._uiList.find((ui) => {
            return ui.uiName == uiName;
        })
        return findUI;
    },

    /**
     * 找ui
     * @param {string} targetUI 目标UI
     */
    findUI: function(targetUI) {
        let findUI = this._uiList.find((ui) => {
            return ui == targetUI;
        })
        return findUI;
    },

    //关闭所有UI
    closeAllUI: function () {
        this._uiList.forEach( ui=>{
            ui.close();
            this._add2Cache(ui);
        });
        this._uiList = []
    },

    _openUI : function (ui, param ,callback) {
        ui.open(param);
        //开场景UI,关闭前面的所有UI
        if (ui.isCloseAllUI()) {
            this.closeAllUI();
        }
        //如果是小弹窗类型，需要判断场景中是否有其他弹窗，如果有就关闭
        if (ui.isSmallWindowType()){
            this._closeAllSmallWindows();
        }
        this._sortAllUI();
        this._push2UIList(ui);    
        if(callback){
            callback();
        }
    },

    //UI排序
    _sortAllUI : function () {
        let bottomSortOrderIndex = 0;
        let middleSortOrderIndex = 0;
        let topSortOrderIndex = 0;
        this._uiList.forEach( ui =>{
            if (ui.isBottomUI()) {
                ui.sortingOrder = bottomSortOrderIndex++;
            }else if(ui.isMiddleUI()) {
                ui.sortingOrder = middleSortOrderIndex++;
            }else if(ui.isTopUI()) {
                ui.sortingOrder = topSortOrderIndex++;
            }
        });        
    },

    _swapUI2Top: function (uiName) {
        let findIndex = -1;
        for (let index = 0; index < this._uiList.length; index++) {
            const ui = this._uiList[index];
            if(ui.uiName == uiName){
                findIndex = index;
                break;
            }
        }
        let ui = null;
        if(findIndex != -1){
            ui = this._uiList[findIndex];
            let endIndex = this._uiList.length - 1;
            [this._uiList[endIndex],this._uiList[findIndex]] = [this._uiList[findIndex],this._uiList[endIndex]];
        }
        return ui;
    },

    _closeUIByName: function(uiName) {
        this._popLoadingList(uiName);
        let closeList = [];
        this._uiList.forEach( ui=>{
            if(ui.uiName == uiName){
                closeList.push(ui);
            }
        });
        closeList.forEach( ui=>{
            this._closeUIByTarget(ui);
        });
    },

    _closeUIByTarget: function(target){
        cc.assert(target , "_closeUIByTarget error, target is null");
        let findUI = this.findUI(target);
        //cc.assert(findUI , "not exist targetUI in _uiList");
        if(!findUI){
            return;
        }
        findUI.close();
        this._add2Cache(target);
        this._uiList = this._uiList.filter((ui)=>{
            return ui != target;
        });
        if(findUI.isSmallWindowType()){
           this._uiList[this._uiList.length-1].open()
        }
        this._sortAllUI();
    },

    _getCache(uiName){
        let cache =  this._uicache[uiName]
        if(!cache)
        {
            return null;
        }
        if(cache.length <= 0){
            return null;
        }
        let ui = cache.shift();
        return ui;
        
    },

    _add2Cache(ui){
        let cache =  this._uicache[ui.uiName];
        if(cache)
        {
            this._uicache[ui.uiName].push(ui);
        }else{
            this._uicache[ui.uiName] = [];
            this._uicache[ui.uiName].push(ui);
        }
    },

    //关闭所有小弹窗(此处的关闭并不会从uiList中删除)
    _closeAllSmallWindows(){
        this._uiList.forEach( ui=>{
            if(ui.getWindowType() != null){
                ui.close()
            }
        });
    },

    _push2UIList(targetUI){
        if(!this.findUI(targetUI)){
            this._uiList.push(targetUI);
        }
        this._popLoadingList(targetUI.uiName);
    },

    _popLoadingList(uiName){
        this._loadList = this._loadList.filter(_uiName => {
            return _uiName != uiName;
        });
    },

    _addUI2Root(uiName, callback){
        let uiCfg = UIUtil.getUICfg(uiName);
        let rootNode = this._getRootNodeByType(uiCfg.uiType);
        cc.assert(rootNode , `cant find rootNode for ${uiName}`);
        let scriptName = uiName;
        if(uiCfg.useSpecificScript){
            scriptName = uiCfg.useSpecificScript;
        }
        UIUtil.createUI(uiCfg.prefabPath , scriptName , ui=>{
            ui.uiCfg = uiCfg;
            ui.uiName = uiName;
            let find = this._loadList.find(uiName => uiName == ui.uiName);
            if(find){   
                rootNode.addChild(ui.node);
                ui.node.active = false;
                if(callback){
                    callback(ui);
                }
            }
        });
    },

    _getRootNodeByType(uiType){
        switch (uiType) {
            case UIGlobalCfg.UIType.BOTTOM_UI:
                return this._uiRoot.getChildByName('Bottom_UI');
            case UIGlobalCfg.UIType.MIDDLE_UI:
                return this._uiRoot.getChildByName('Middle_UI');
            case UIGlobalCfg.UIType.TOP_UI:
                return this._uiRoot.getChildByName('Top_UI');
            default:
                break;
        }
    },

    showSceneUI(bShow, notPlayAni){
        this._uiList.forEach(ui=>{
            if(ui.isSceneUI()){
                if(bShow){
                    ui.show(notPlayAni)
                }else{
                    ui.hide(notPlayAni)
                }
            }
        });        
    }

}

module.exports = UIMgr;