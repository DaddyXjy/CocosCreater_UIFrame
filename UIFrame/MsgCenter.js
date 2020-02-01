/**
 * Date: 2018/09/07
 * Author: dylan_xi
 * Desc: 消息中心
 * 
 * module use example:
 */

var MsgCenter = {

    init(){
        this._listeners = [];
    },

    clean(){
        this._listeners = [];
    },

    addListener(msgId, callback , target){
        cc.assert(callback)
        var listener = {
            callback : callback,
            target: target,
        }
        this._listeners[msgId] = this._listeners[msgId] || [];
        for (const listener of this._listeners[msgId]) {
            if (target === listener.target){
                return;
            }
        }
        this._listeners[msgId].push(listener);
    },

    removeListener(msgId, callback , target){
        let listeners = this._listeners[msgId];
        if (!listeners) {
            return;
        }
        for (const listener of listeners) {
            if (target === listener.target){
                cc.js.array.remove(listeners, listener);
                break;
            }
        }
    },



};

module.exports = MsgCenter;