/*
 * @Autor: dongsl
 * @Date: 2021-03-19 13:56:02
 * @LastEditors: dongsl
 * @LastEditTime: 2021-03-19 15:34:16
 * @Description: 
 */

//通用消息处理的代理

/**
 * 场景类型
 */
export enum SceneType {
    Default,
    Login,
    Captical,
    Map,
    Fight,
}

/**
 * 场景状态
 */
export enum SceneState {
    Default_State = 0,

    Login_Ready = 1,   //准备进入登录场景
    Login_Finish = 2,  //登录场景加载完毕
    Login_InitOver = 3,    //登录场景初始化完毕

    Captical_Ready = 11,   //准备进入大厅场景
    Captical_Finish = 12,  //大厅场景加载完毕
    Capical_InitOver = 13,    //大厅场景初始化完毕

    Map_Ready = 21,   //准备进入地图场景
    Map_Finish = 22,  //地图场景加载完毕
    Map_InitOver = 23,    //地图场景初始化完毕

    Fight_Ready = 21,   //准备进入战斗场景
    Fight_Finish = 22,  //战斗场景加载完毕
    Fight_InitOver = 23,    //战斗场景初始化完毕
}


export default class CommonProxy extends puremvc.Proxy implements puremvc.IProxy {
    public static NAME = "CommonProxy"
    private curSceneType: SceneType = SceneType.Default;
    private curSceneState: SceneState = SceneState.Default_State

    public constructor() {
        super(CommonProxy.NAME);
    }
    onRegister() {
        cc.log("register CommonProxy")
        this.init()
    }
    public onRemove() {
        cc.log("remove CommonProxy")
    }

    init() {

    }

    /**
     * 设置当前场景
     * @param sceneType 
     */
    public setCurSceneType(sceneType: SceneType) {
        this.curSceneType = sceneType;
    }
    public getCurSceneType() {
        return this.curSceneType
    }

    /**
     * 重置场景类型及场景状态
     */
    public setDefaultSceneType() {
        this.curSceneState = SceneState.Default_State;
        this.curSceneType = SceneType.Default;
    }

    /**
     * 设置当前场景状态
     * @param state 
     */
    public setSceneState(state: SceneState) {
        cc.log("setSceneState oldState = "+this.curSceneState+"; newState = "+state)
        this.curSceneState = state;
        if (state >= SceneState.Login_Ready && state <= SceneState.Login_InitOver) {   //登陆场景
            this.setCurSceneType(SceneType.Login)
        } else if (state >= SceneState.Captical_Ready && state <= SceneState.Capical_InitOver) {   //大厅场景
            this.setCurSceneType(SceneType.Captical)
        } else if (state >= SceneState.Map_Ready && state <= SceneState.Map_InitOver) {   //地图场景
            this.setCurSceneType(SceneType.Map)
        } else if (state >= SceneState.Fight_Ready && state <= SceneState.Fight_InitOver) {   //战斗场景
            this.setCurSceneType(SceneType.Fight)
        }
    }
    public getSceneState() {
        return this.curSceneState
    }


    /**
     * 大厅场景是否存在
     * @returns 
     */
    public isExistCapitalScene() {
        return (this.curSceneState == SceneState.Captical_Ready || this.curSceneState == SceneState.Capical_InitOver)
    }

    /**
     * 地图场景是否存在
     * @returns 
     */
    public isExistMapScene() {
        return (this.curSceneState == SceneState.Map_Ready || this.curSceneState == SceneState.Map_InitOver)
    }

    /**
     * 战斗场景是否存在
     * @returns 
     */
    public isExistFightScene() {
        return (this.curSceneState == SceneState.Fight_Ready || this.curSceneState == SceneState.Fight_InitOver)
    }



}
