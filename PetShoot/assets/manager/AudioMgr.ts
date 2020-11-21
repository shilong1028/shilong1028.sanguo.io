
import { SDKMgr } from "./SDKManager";
import { LDMgr, LDKey } from "./StorageManager";

/**
 * 注意，
 * 游戏运行在chrome里面  听不见声音；其它浏览器可以听见声音
    开发者模式提示如下：
 The AudioContext was not allowed to start. It must be resume (or created) after a user gesture on the page
    解决方案:
 pc端打开chrome浏览器，新建页签，地址栏输入 chrome://flags/#autoplay-policy 选择 No user gesture is required，之后重启浏览器即可，chrome浏览器更新版本后的新增的安全策略。
 */

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
        if(this.KEY_Music_onOff === 1){   //关闭
            this.stopBGM();
        }
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
        if(this.KEY_Music_onOff === 0){   //开启
            cc.loader.loadRes("sound/" + fileName, cc.AudioClip, function (err, ac) {
                if (err) {
                    cc.log(err+"; fileName = "+fileName);
                    return;
                }
                this.bgmAudio = cc.audioEngine.playMusic(ac, loop);
            }.bind(this)); 
        }
    }
    stopBGM(){
        if(SDKMgr.isSDK && SDKMgr.WeiChat){
            if(this.bgmAudio != null){
                this.bgmAudio.stop();
            }
        }else{
            cc.audioEngine.stopMusic();
        }
    }

    /**播放Effect bOverlap是否覆盖类型的音效 */
    playEffect(fileName: string, loop:boolean = false, bOverlap: boolean=false, endCallback:Function=null) {
        if(this.KEY_Music_onOff === 0){   //开启
            cc.loader.loadRes("sound/" + fileName, cc.AudioClip, function (err, ac) {
                this.lastEffectName = "";  //上一个音效名称
                if (err) {
                    cc.log(err+"; fileName = "+fileName);
                    return;
                }
                let id = cc.audioEngine.playEffect(ac, loop);
                if(bOverlap == true){
                    this.lastOverlap = id;
                }
                if(endCallback){
                    cc.audioEngine.setFinishCallback(id, endCallback);
                }
            }.bind(this)); 
        }
    }

    pianoArr:number[] = [];
    pianoIdx: number = 0;
    yinfuCount: number = 0;
    playYinfu(){
        this.yinfuCount ++;
        if(this.yinfuCount == 1){
            //this.playPiano();
        }
        AudioMgr.playEffect("effect/hit");    //砖块碰撞音效
    }
    playPiano(){
        this.yinfuCount --;
        if(this.yinfuCount < 0 ){
            this.yinfuCount = 0;
            return;
        }
        let idx = this.pianoIdx++;
        if(idx >= this.pianoArr.length){
            this.setPianoArr();
            this.pianoIdx = 0;
            idx = this.pianoIdx;
        }
        AudioMgr.playEffect("piano/"+this.pianoArr[idx], false, false, ()=>{
            this.playPiano();
        });    //砖块碰撞音效
    }

    xiaoniao: number[] = [
        14, 34, 54, 12, 64, 12, 54, 44, 54, 34, 14, 24, 14, 
        54, 44, 34, 54, 34, 24, 54, 44, 34, 54, 34, 24,
        14, 34, 54, 12, 64, 12, 64, 54, 44, 54, 34, 14, 24, 14
    ];  //小鸟小鸟飞来了

    beijing: number[] = [
        34, 54, 34, 24, 34, 24, 34, 34, 24, 64, 14, 34, 24, 
        24, 14, 64, 14, 24, 34, 54, 24, 34, 64, 54, 64, 24, 14, 
        24, 14, 64, 14, 24, 34, 54, 24, 34, 64, 54, 54, 34, 
        24, 34, 24, 14, 54, 64, 34, 64, 34, 24, 24, 14,
        34, 54, 14, 54, 64, 54, 64, 54, 34, 34, 54, 64, 
        34, 54, 64, 12, 22, 12, 54, 34, 24, 54, 34, 34
    ];  //北京欢迎你

    pengyou: number[] = [
        56, 14, 14, 14, 14, 74, 14, 24, 56, 24, 24, 24, 24, 14, 24, 34, 
        14, 34, 54, 64, 64, 54, 44, 44, 34, 34, 24, 24, 14
    ];  //我的朋友在哪里

    kangding: number[] = [
        34, 54, 64, 54, 64, 34, 24, 24, 34, 54, 64, 54, 64, 34, 34, 34, 54, 64, 54, 
        64, 34, 24, 24, 54, 34, 24, 34, 24, 14, 24, 66, 66, 24
    ];   //康定情歌

    setPianoArr(){
        this.pianoArr = this.beijing;
        this.pianoIdx = 0;
    }
    setPianoIdx(){
        //this.pianoIdx = Math.floor(Math.random()*this.pianoArr.length*0.99);
    }

}


export var AudioMgr = new AudioMgr_class();