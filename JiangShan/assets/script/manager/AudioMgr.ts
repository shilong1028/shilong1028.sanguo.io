

/**
 * 注意，
 * 游戏运行在chrome里面  听不见声音；其它浏览器可以听见声音
    开发者模式提示如下：
 The AudioContext was not allowed to start. It must be resume (or created) after a user gesture on the page
    解决方案:
 pc端打开chrome浏览器，新建页签，地址栏输入 chrome://flags/#autoplay-policy 选择 No user gesture is required，之后重启浏览器即可，chrome浏览器更新版本后的新增的安全策略。
 */

import { LDMgr, LDKey } from "./StorageManager";
import { SDKMgr } from "./SDKManager";

class AudioMgr_class {

    KEY_Music_onOff: number = 0;   //音乐或音效开关(开启)
    KEY_Music_Volume: number = 0.5;     //本地音乐音量
    KEY_Sound_Volume: number = 0.5;    //本地音效音量

    //初始化音频信息
    initAudioData(){
        this.KEY_Music_onOff = this.getMusicOnOffState();
        this.KEY_Music_Volume = this.getMusicVolume();   //本地音乐音量 
        this.KEY_Sound_Volume = this.getEffectVolume();   //本地音效音量
    }

    /**获取音效总开关状态 */
    getMusicOnOffState(){
        let keyVal = LDMgr.getItemInt(LDKey.KEY_Music_onOff); 
        return keyVal;
    }
    setMusicOnOffState(keyVal: number){
        if(keyVal != 0){
            keyVal = 1;
        }
        this.KEY_Music_onOff = keyVal;
        LDMgr.setItem(LDKey.KEY_Music_onOff, keyVal);
    }
    /*** 设置背景音乐音量 0 - 1.0 */
    setMusicVolume(vol: number) {
        this.KEY_Music_Volume = vol;
        cc.audioEngine.setMusicVolume(vol);
        LDMgr.setItem(LDKey.KEY_Music_Volume, vol);
    }
    getMusicVolume() : number {
        let keyVal = LDMgr.getItemFloat(LDKey.KEY_Music_Volume, 0.5); 
        return keyVal;
    }
    /*** 设置音效音量 0 - 1.0 */
    setEffectsVolume(vol: number) {
        this.KEY_Sound_Volume = vol;
        cc.audioEngine.setEffectsVolume(vol);
        LDMgr.setItem(LDKey.KEY_Sound_Volume, vol);
    }
    getEffectVolume() : number {
        let keyVal = LDMgr.getItemFloat(LDKey.KEY_Sound_Volume, 0.5); 
        return keyVal;
    }

    /*****暂停所有 */
    pauseAll() {
        cc.audioEngine.pauseAll();
    }
    /*****恢复所有 */
    resumeAll() {
        cc.audioEngine.resumeAll();
    }

    /***播放背景音乐 */
    bgmAudio : any = null;
    playBGM(fileName: string, loop:boolean = true) {
        this.stopBGM();
        if(this.KEY_Music_onOff == 0){   //开启
            AudioMgr.playBGM(fileName, loop);
        }
    }
    stopBGM(){
        if(SDKMgr.is_wechat_platform() == true){
            if(this.bgmAudio != null){
                this.bgmAudio.stop();
            }
        }else{
            cc.audioEngine.stopMusic();
        }
    }

    /**播放Effect bOverlap是否覆盖类型的音效 */
    playEffect(fileName: string, loop:boolean = false, bOverlap: boolean=false) {
        if(this.KEY_Music_onOff == 0){   //开启
            cc.loader.loadRes("sound/" + fileName, cc.AudioClip, function (err, ac) {
                this.lastEffectName = "";  //上一个音效名称
                if (err) {
                    cc.log(err+"; fileName = "+fileName);
                    return;
                }
                let idx = cc.audioEngine.playEffect(ac, loop);
                if(bOverlap == true){
                    this.lastOverlap = idx;
                }
            }.bind(this)); 
        }
    }

    /**通用按钮音效 */
    playBtnClickEffect(){
        this.playEffect("effect/ui_click");
    }

}

export var AudioMgr = new AudioMgr_class();