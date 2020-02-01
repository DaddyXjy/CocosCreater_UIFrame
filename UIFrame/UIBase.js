/**
 * Date: 2019/07/23
 * Author: dylan
 * Desc: UI基类
 * 
 */

var UIUtil = require("UIUtil")
var UIGlobalCfg = require("UIGlobalCfg")
var Thor = require('Thor');
var UIAction = require('UIAction');
var UIMgr = require("UIMgr")
var UIBase = cc.Class({
    extends: Thor,
    properties: {
        uiName : "",
        _uiCfg : null,

        uiCfg: {
            get () {
                return this._uiCfg;
            },
            set (value) {
                this._uiCfg = value;
            }
        },

        sortingOrder: {
            get () {
                return this.node.zIndex;
            },
            set (value) {
                this.node.zIndex = value;
            }
        },

        _curDependNum : 0,

        _needDependNum : 0,
    },

    onLoad(){
        this.LoadedUI();
    },

    LoadedUI() {
        this._trySetBgUI();
        this._tryHookNode();
        this._tryDependItem();
        this.onUILoaded()
    },

    onUILoaded(){

    },

    //@override by subClass
    //UI打开时调用
    onOpen(param){
        cc.log("on onOpen called")
    },

    //@override by subClass
    //UI关闭时调用
    onClose(){
        cc.log("on onClose called")
    },

    open(param){
        if (this.isCaptureScreen()) {
            this._captureScreen(() => {
                this._uiParam = param;
                if(this._isLoadAllDenpend()){
                    this.doOpen(param);
                }
            })
        }
        else {
            this._uiParam = param;
            if(this._isLoadAllDenpend()){
                this.doOpen(param);
            }
        }
    },

    close(){
        this.onClose();
        this.hide();
        if(this.isFullScreenUI()){
            UIMgr.showSceneUI(true);
        }
        else if (this.isCaptureScreen()) {
            UIMgr.showSceneUI(true, true);
        }
    },

    doOpen(param){
        this.show();
        this.onOpen(param);
        this.hasFirstOpen = true
    },

    show(notPlayAni){
        this.node.active = true;
        if(this._isUseAction()){
            this._openWithAction(()=>{
            });
        }else{
            this.node.stopAllActions();
            this.node.opacity = 0;
            var fadeIn = cc.fadeIn(0.2);
            this.node.runAction(fadeIn);
        }
        if(this.isOpenPlayAnimation() && !notPlayAni){
            UIUtil.playAllNodeAnimation(this.node);
        }

        if(this.isFullScreenUI()) {
            UIMgr.showSceneUI(false);
        }
    },

    onDestroy(){

    },

    hide(){
        if(this._isUseAction()){
            return this._closeWithAction();
        }else{
            this.node.active = false;
        }
    },

    isBottomUI(){
        return this._uiCfg.uiType == UIGlobalCfg.UIType.BOTTOM_UI;
    },

    isMiddleUI(){
        return this._uiCfg.uiType == UIGlobalCfg.UIType.MIDDLE_UI;
    },

    isTopUI(){
        return this._uiCfg.uiType == UIGlobalCfg.UIType.TOP_UI;
    },

    isCloseAllUI(){
        return this._uiCfg.isCloseAllUI;
    },

    isSingletonUI(){
        return this._uiCfg.isSingletonUI;
    },

    isSmallWindowType(){
        return this._uiCfg.windowType == UIGlobalCfg.WindowType.SMALL_WINDOW;
    },

    isSceneUI(){
        return this._uiCfg.isSceneUI;
    },

    isFullScreenUI(){
        return this._uiCfg.isFullScreenUI;
    },

    isCaptureScreen(){
        return this._uiCfg.isCaptureScreen;
    },

    getWindowType(){
        return this._uiCfg.windowType;
    },

    isOpenPlayAnimation(){
        return this._uiCfg.isOpenPlayAnimation;
    },

    _closeWithAction(){
        let action = UIAction.getActionByType(this._uiCfg.uiActionType , false);
        cc.assert(action , `cant find ui out Action for ${this.uiName}`);
        cc.assert(this._ui_content , `cant find node _ui_content for ${this.uiName}`);
        if(this._uiCfg.uiActionType == UIGlobalCfg.UIActionType.TITLE_POP_IN_OUT){
            action(this._ui_content,this._ui_title,()=>{
                this.node.active = false;
            })
        }else{
            action(this._ui_content , ()=>{
                this.node.active = false;
            })
        }
    },

    _openWithAction(callback){
        this._ui_content.stopAllActions();
        let action = UIAction.getActionByType(this._uiCfg.uiActionType , true);
        cc.assert(action , `cant find ui in Action for ${this.uiName}`);
        cc.assert(this._ui_content , `cant find node _ui_content for ${this.uiName}`);
        if(this._uiCfg.uiActionType == UIGlobalCfg.UIActionType.TITLE_POP_IN_OUT){
            action(this._ui_content,this._ui_title,callback)
        }else{
            action(this._ui_content,callback);
        }
    },

    _isUseAction(){
        return this._uiCfg.uiActionType != -1;
    },

    _onBgTouched(){
        var UIMgr = require("UIMgr");
        UIMgr.closeUI(this);
    },
    _captureScreen(callback)
    {
        let node = cc.Camera.main.node.getChildByName("cameraNode")
        if (!node) {
            node = new cc.Node()
            node.name = "cameraNode"
            node.parent = cc.Camera.main.node
            let camera = node.addComponent(cc.Camera)
            camera.cullingMask = 0xffffffff
        }
        let camera = node.getComponent(cc.Camera)
        camera.enabled = true
        //截图当背景
        node = this.node.getChildByName("captured")
        if (!node) {
            node = new cc.Node()
            node.x = 0
            node.y = 0
            node.scaleY = -1
            node.name = "captured"
            node.addComponent(cc.Sprite)
            this.node.addChild(node, -1)
            let texture = new cc.RenderTexture()
            let gl = cc.game._renderContext
            texture.initWithSize(cc.winSize.width, cc.winSize.height, gl.STENCIL_INDEX8)
            camera.targetTexture = texture
        }
        let spriteFrame = new cc.SpriteFrame();
        let sp = node.getComponent(cc.Sprite)
        sp.spriteFrame = spriteFrame
        this.scheduleOnce(() => {
            let data = camera.targetTexture.readPixels();
            let texture2 = new cc.RenderTexture()
            texture2.initWithData(data, 32, cc.winSize.width, cc.winSize.height);
            spriteFrame.setTexture(texture2)
            camera.enabled = false
            this.scheduleOnce(() => {
                UIMgr.showSceneUI(false);
            }, 0)
            if (callback) {
                callback()
            }
        }, 0);
    },
    _trySetBgUI(){
        if(this._bg_black){
            this._bg_black.width = cc.winSize.width;
            this._bg_black.height = cc.winSize.height;
            this._bg_black.opacity = 180;
            this._bg_black.addComponent(cc.Button);
            if(!this._uiCfg.isPreventTouch){
                this._bg_black.on('click', this._onBgTouched.bind(this));
            }
        }
        //主UI不允许点击
        if(this._ui_content){
            this._ui_content.addComponent(cc.BlockInputEvents);
        }
    },

    _tryHookNode(){
        if(this._uiCfg.hookList.length == 0){
            return;
        }
        this._uiCfg.hookList.forEach(hookItem => {
            let hookNode = this[hookItem.nodeName];
            UIUtil.hookUI2Node(hookNode , hookItem.prefabPath , hookItem.scriptName);
        });
    },

    _tryDependItem(){
        if(this._uiCfg.dependItemList.length == 0){
            return;
        }
        var self = this;
        this._needDependNum = this._uiCfg.dependItemList.length;
        this._uiCfg.dependItemList.forEach(dependItem => {
            UIUtil.createUI(dependItem.prefabPath,dependItem.scriptName,ui=>{
                self._curDependNum++;
                self[dependItem.itemName] = ui;
                if(self._curDependNum >= self._needDependNum){
                    self.doOpen(self._uiParam);    
                }
            })
        });
    },

    _isLoadAllDenpend(){
        return this._curDependNum >= this._needDependNum;
    },

    _onBtn_exitTouchEnd(){
        UIMgr.closeUI(this);
    },
});
