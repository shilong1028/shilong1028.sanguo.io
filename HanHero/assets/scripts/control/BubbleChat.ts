import UI from '../util/ui';
import BubbleLabel from './BubbleLabel';
/*
 * @Autor: dongsl
 * @Date: 2021-03-20 14:47:03
 * @LastEditors: dongsl
 * @LastEditTime: 2021-03-20 14:51:38
 * @Description: 
 */

/******************************************
 * 气泡聊天框控件，里面有Label和表情，背景自适应宽和高
 * 气泡Label脚本，自适应宽和高
 * 先将Label设定为overflow 设置为 NONE，
 * 然后根据设定的maxWidth来控制Label的overflow方式
 * 如果width > maxWidth，则改overflow为 RESIZE_HEIGHT
 
 ******************************************/
const { ccclass, property, disallowMultiple, menu, executionOrder, requireComponent } = cc._decorator;

@ccclass
@disallowMultiple()
@menu('自定义组件/BubbleChat')
@executionOrder(-1000)

export default class BubbleChat extends cc.Component {
    private _lblMaxWidth: number = 100;
    @property({ type: cc.Integer, tooltip: CC_DEV && '文本最大宽度', })
    set lblMaxWidth(val: number) {
        this._lblMaxWidth = val;
        if (this._lblMaxWidth <= 0) {
            this._lblMaxWidth = 1;
        }
    }
    get lblMaxWidth() {
        return this._lblMaxWidth;
    }

    private _inited: boolean = false;
    private _chatLabel: cc.Label;   //聊天文本
    get chatLabel() {
        return this._chatLabel;
    }

    private _imgEmoticon: cc.Sprite;  //聊天表情
    get imgEmoticon() {
        return this._imgEmoticon;
    }


    onLoad() {
        this._init();
    }

    onEnable() {
        this._init();
    }

    onDestroy() {
    }

    //初始化各种..
    private _init() {
        if (this._inited)
            return;

        this._chatLabel = UI.find(this.node, "lbl_chat").getComponent(cc.Label);
        this._chatLabel.overflow = cc.Label.Overflow.NONE;
        this._chatLabel.string = ""

        let bubbleLabel = this._chatLabel.getComponent(BubbleLabel);
        if (!bubbleLabel) {
            bubbleLabel = this._chatLabel.addComponent(BubbleLabel);
        }
        bubbleLabel.maxWidth = this._lblMaxWidth;
        this._chatLabel.node.active = false;

        this._imgEmoticon = UI.find(this.node, "imgEmoticon").getComponent(cc.Sprite);
        this._imgEmoticon.spriteFrame = null;
        this._imgEmoticon.node.active = false;

        this.node.active = false;

        this._inited = true;
    }

    //显示聊天内容
    public showChatMsg(chatMsg: any, bAutoHide: boolean) {
        if (chatMsg.configId > 0) { //默认0为自定文本，>0为配置快捷语或表情
            // let chatConf = ChatContentConfig.getInstance().getChatConfByid(chatMsg.configId);
            // if (!chatConf || chatConf == undefined) { //表情开关只会影响其他玩家发过来的表情,不影响自己发表情
            //     return;
            // }
            // this.node.active = true;
            // this.node.stopAllActions();
            // if (chatConf && chatConf.type == CHATCONTENTTYPE.EMOTICON) {  //表情
            //     this.showChatEmoticonAni(chatConf.action, bAutoHide);
            // } else {
            //     this.showChatText(chatConf.data, bAutoHide);
            //     if (chatMsg.playerInfo) {
            //         let voice = chatConf.voice_femal
            //         if (chatMsg.playerInfo.heroId) {
            //             let sex = HerosConfig.getInstance().getHeroSex(chatMsg.playerInfo.heroId);
            //             if (sex == 1) {
            //                 voice = chatConf.voice_male
            //             }
            //         }
            //         LogUtil.log("文本语音 voice = " + voice)
            //         if (voice.length > 0) {
            //             PlayAudio.playChatContent(voice.split('.')[0]);
            //         }
            //     }
            // }
        } else {   //自定义文本
            this.showChatText(chatMsg.msgStr, bAutoHide);
        }
    }

    //显示聊天表情动画
    public showChatEmoticonAni(emotSpine: string, bAutoHide: boolean) {
        this.chatLabel.node.active = false;
        this.imgEmoticon.node.active = true;
        // UI.playSpineAni(this.imgEmoticon.node, "spine/ui/ddz_biaoqingbao/" + emotSpine, 'ddz_bqb_ani', false, false, () => {
        //     //CompleteListener
        //     if (bAutoHide) {
        //         this.node.active = false;
        //     }
        // }, (spine) => {
        //     //StartListener
        //     spine.node.y = -this.imgEmoticon.node.height / 2;
        // }, "emotionSpine");
    }

    //显示聊天文本
    public showChatText(chatText: string, bAutoHide: boolean) {
        this.node.active = true;
        this.node.stopAllActions();
        this.chatLabel.node.active = true;
        this.imgEmoticon.node.active = false;

        let bubbleLabel = this._chatLabel.getComponent(BubbleLabel);
        if (!bubbleLabel) {
            bubbleLabel = this._chatLabel.addComponent(BubbleLabel);
        }
        bubbleLabel.maxWidth = this._lblMaxWidth;

        this.chatLabel.string = chatText;
        //(<any>this.chatLabel)._forceUpdateRenderData();
        if (bAutoHide) {
            this.node.runAction(cc.sequence(cc.delayTime(2.0), cc.callFunc(() => {
                this.node.active = false;
            })))
        }
    }

}
