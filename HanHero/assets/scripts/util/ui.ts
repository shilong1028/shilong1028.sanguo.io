import ExecuteInterval from './ExecuteInterval';
import Timer from './Timer';
import { AudioMgr } from '../manager/AudioMgr';

/*
 * @Autor: dongsl
 * @Date: 2021-03-19 17:01:47
 * @LastEditors: dongsl
 * @LastEditTime: 2021-07-15 10:00:56
 * @Description: 
 */

//UI通用接口类
export default class UI {

    /**
     * 从指定的根节点，查找某个子节点
     */
    static raw_find(node: cc.Node, childName: string): cc.Node {
        if (!node || !childName) return null;

        //广度优先遍历
        let nodeQueue: cc.Node[] = [node];

        let queueSize = 1;
        for (let i = 0; i < nodeQueue.length; ++i) {
            if (nodeQueue[i].name == childName) {
                return nodeQueue[i]
            }
            if (nodeQueue[i].children.length > 0) {
                nodeQueue = nodeQueue.concat(nodeQueue[i].children)
            }
        }
    }

    /**
     * 从指定的根节点，查找某个子节点
     */
    static find(node: cc.Node, ...childNames: string[]): cc.Node {
        if (childNames.length <= 0) return null;

        let root = node
        for (const childName of childNames) {
            root = UI.raw_find(root, childName)
            if (!root) {
                return null;
            }
        }

        return root;
    }

    /**
     * 节点（包括非Button)点击回调
     * @param node 
     * @param callback 
     * @param useCapture 
     * @param args 
     * @returns 
     */
    static on_click(node: cc.Node, callback, useCapture?: boolean, ...args) {
        if (!node || !callback) return;
        node.on(cc.Node.EventType.TOUCH_END, function (touch) {
            AudioMgr.playBtnClickEffect();
            ExecuteInterval.default_execute_interval.execute(callback, ...args)
        }, null, useCapture)
    }

    /**
     * 节点(仅限Button或Toggle)点击回调
     * @param node 
     * @param callback 
     * @param useCapture 
     * @param args 
     * @returns 
     */
    static on_btn_click(node: cc.Node, callback, useCapture?: boolean, ...args) {
        if (!node || !callback) return;
        node.targetOff(this)
        node.on('click', function () {
            AudioMgr.playBtnClickEffect();
            ExecuteInterval.default_execute_interval.execute(callback)   //同一件事（比如弹出提示）时间间隔必须大于一定的时间(0.001秒)
        }, this, useCapture)
    }

    /**
     * 一些List复用节点上的点击事件
     * @param node 按钮节点
     * @param callback  触摸回调
     * @param interactable 是否按钮可用，用于Button
     * @param useCapture 
     * @param args 
     */
    static on_multiplex_click(node: cc.Node, callback, interactable: boolean = true, useCapture?: boolean, ...args) {
        if (!node || !callback) return;
        node.targetOff(this)
        if (node.getComponent(cc.Button) || node.getComponent(cc.Toggle)) {
            //如果是按钮Button则监听click事件，否则按钮调用onClick监听touchEnd，则会在点击后有些按钮会变大而不还原
            //node.off('click');  //interactable=false不会触发click
            if (interactable) {
                // node.on(cc.Node.EventType.TOUCH_END, function (touch){
                //     cc.log(" click  end ")
                // }, null, useCapture)
                node.on('click', function () {
                    AudioMgr.playBtnClickEffect();
                    ExecuteInterval.default_execute_interval.execute(callback)
                }, this, useCapture)
            } else {
                //node.off(cc.Node.EventType.TOUCH_END);
                node.on(cc.Node.EventType.TOUCH_END, function (touch) {
                    AudioMgr.playBtnClickEffect();
                    ExecuteInterval.default_execute_interval.execute(callback, ...args)
                }, this, useCapture)
            }
        } else {
            // 添加注册事件之前需要移除之前的，否则添加事件无效
            //node.off(cc.Node.EventType.TOUCH_END);
            node.on(cc.Node.EventType.TOUCH_END, function (touch) {
                AudioMgr.playBtnClickEffect();
                ExecuteInterval.default_execute_interval.execute(callback, ...args)
            }, this, useCapture)
        }
    }


    /**
     * 设置节点是否置灰
     * 
     * @param node 拥有cc.Sprite的节点 
     * @param shall_gray 是否要置灰
     */
    static set_gray(node: cc.Node, shall_gray: boolean) {
        let sp = node.getComponent(cc.Sprite)
        if (sp) {
            let state = sp.getState()
            let is_gray = state === cc.Sprite.State.GRAY
            if (shall_gray === is_gray) return
            Timer.delay_do_safe(node, 0, () => {
                sp.setState(shall_gray ? cc.Sprite.State.GRAY : cc.Sprite.State.NORMAL)
            })
        }
    }


    /**
     * 设置节点及子节点是否置灰
     * 
     * @param node 拥有cc.Sprite的节点 
     * @param shall_gray 是否要置灰
     */
    static set_all_grays(node: cc.Node, shall_gray: boolean, lb_color?: cc.Color, lb_out_color?: cc.Color) {
        let sp = node.getComponent(cc.Sprite)
        if (sp) {
            let state = sp.getState()
            let is_gray = state === cc.Sprite.State.GRAY
            if (shall_gray === is_gray) return
            sp.setState(shall_gray ? cc.Sprite.State.GRAY : cc.Sprite.State.NORMAL)
        }

        let lb_out = node.getComponent(cc.LabelOutline)
        if (lb_out) {
            if (lb_out_color) {
                Timer.delay_do_safe(node, 0, () => {
                    lb_out.color = lb_out_color
                })
            }
        }

        let lb = node.getComponent(cc.Label)
        if (lb) {
            if (lb_color) {
                Timer.delay_do_safe(node, 0, () => {
                    node.color = lb_color
                })
            }
        }

        for (let i = 0; i < node.childrenCount; i++) {
            this.set_all_grays(node.children[i], shall_gray, lb_color, lb_out_color)
        }
    }


}
