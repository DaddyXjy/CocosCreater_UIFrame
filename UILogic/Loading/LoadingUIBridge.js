/**
 * Date: 2019/07/24
 * Author: dylan
 * Desc: 加载UI桥接老系统
 * 
 */


 
var LoadingUIBridge = {
    
    //桥接 LoadingSceneManager.js
    bridge2LoadingSceneManager :function (ui) {
        var DataGlobalCfg = require('DataGlobalCfg');
        let LoadingSceneManager = require('LoadingSceneManager')
        let loadingSceneManager = ui.addComponent(LoadingSceneManager);    
        loadingSceneManager.manifestUrl = DataGlobalCfg.manifestUrl;
        return loadingSceneManager;
    },

    //桥接 ProgressController.js
    bridge2ProgressController :function (ui) {
        let ProgressController = require('ProgressController')
        let progressController = ui.addComponent(ProgressController);    
        progressController.m_ProgressBar = ui.getChild('loadingBar');
        progressController.m_tips = ui.getChild('leftDown_tex');
        progressController.m_label = ui.getChild('rightDown_tex');

    }
}

module.exports = LoadingUIBridge;