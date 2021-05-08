

const {ccclass, property} = cc._decorator;

@ccclass
export default class MovieClip extends cc.Component {

    /// <summary>
    /// Sprite渲染器
    /// </summary>
    protected m_sprite:cc.Sprite = null;;


    /// <summary>
    /// 动画计时间隔 每隔0.1s更新一帧
    /// </summary>
    protected timer:number = 0.1;

    /// <summary>
    /// 播放 时间 间隔
    /// </summary>

    /**
     * 播放 时间 间隔
     */
    @property(cc.Float)
    public interval:number = 0.1;

    /// <summary>
    /// 贴图文件名
    /// </summary>
    @property({type:cc.Texture2D})
    public texture:cc.Texture2D = null;

    /// <summary>
    /// 播放次数
    /// </summary>
    @property({type:cc.Integer})
    public playTimes:number = 0;

    /// <summary>
    /// 图片切割成几行
    /// </summary>

    @property(cc.Integer)
    public row:number = 5;

    /// <summary>
    /// 图片切割成几列
    /// </summary>
    @property(cc.Integer)
    public col:number = 24;

    @property(cc.Integer)
    public rowIndex:number = 0;

    @property(cc.Boolean)
    public isAll:boolean = false;

    @property(cc.Boolean)
    public autoPlayOnLoad:boolean = true;

    /// <summary>
    /// 播放完自动销毁
    /// </summary>
    @property(cc.Boolean)
    public autoDestroy:boolean = false;


    @property()
    public begin:number = 0;

    @property()
    public end:number = 0;

    /// <summary>
    /// 动画帧数
    /// </summary>
    public totalFrame:number = 8;

    /// <summary>
    /// 当前帧数
    /// </summary>
    public currentFrame:number = 0;

    /**
     * 当前播放了第几次
     */
    private currentTimes:number = 0;

    /// <summary>
    /// 影片是否在跑动中
    /// </summary>
    public running:boolean = false;

    //private _direction:number = 1;

    private _playIndex:number = 0;

    private _pieceWidth:number = 0;

    private _pieceHeight:number = 0;


    private _bitmapArr:cc.SpriteFrame[][] = [];

    // Use this for initialization
    onLoad(){
        //this. m_clips = new cc.SpriteFrame[this.row][this.col];
        //Texture2D tex = Resources.Load<Texture2D>("Image/Avatar/" + m_sprite_name);

        //this.begin = 0;

        if(this.end == 0)
        {
            this.end = this.col;
        }

        this.rowIndex = this.clamp(this.rowIndex, 0, this.row - 1);
  
        this.m_sprite = this.getComponent(cc.Sprite);

        if(!this.m_sprite)
        {
            this.m_sprite = this.addComponent(cc.Sprite);
        }

        //this.timer = this.interval;
        this.timer = 0;
    }

    /**
    * 设置角色纹理动画
    */
    setSkinTexture(texture:cc.Texture2D){
        cc.log("setSkinTexture")
        this._pieceWidth = texture.width / this.col;
        this._pieceHeight = texture.height / this.row;
        
        for(var i = 0 ; i < this.row ; i++)
        {
            this._bitmapArr[i] = [];

            for(var j = 0 ; j < this.col ; j++)
            {
                this._bitmapArr[i][j] = new cc.SpriteFrame(texture, 
                    new cc.Rect(j * this._pieceWidth, i * this._pieceHeight, this._pieceWidth, this._pieceHeight),
                    false, cc.v2(0,0), new cc.Size(this._pieceWidth,this._pieceHeight));
            }
        }
        
        this.m_sprite.spriteFrame = this._bitmapArr[this.rowIndex][0];

        this.node.width = this._pieceWidth;
        this.node.height = this._pieceHeight;

        this.texture = texture
        this.running = this.autoPlayOnLoad;
    }

    update(dt)
    {
        if(!this.texture){
            return
        }
        if (!this.running)
            return;

        if (this.playTimes != 0 && this.currentTimes == this.playTimes)
        {
            this.running = false;
            return;
        }
            

        this.timer -= dt;

        if (this.timer <= 0)
        {

            this.timer = this.interval;

            this.currentFrame = this.currentFrame % this.col;

            this.playAction();

            this.currentFrame++;

            if(this.currentFrame == this.col)
            {

                if(this.isAll)
                {
                    this.rowIndex++;

                    if(this.rowIndex == this.row)
                    {
                        this.currentTimes ++;

                        this.node.emit("completeTimes");

                        if (this.playTimes != 0 && this.currentTimes == this.playTimes)
                        {
                            this.node.emit("complete");

                            if(this.autoDestroy)
                            {
                                this.node.destroy();
                            }
                        }
                    }

                    this.rowIndex %= this.row;
                }else
                {
                    this.currentTimes ++;

                    this.node.emit("completeTimes");

                    if (this.playTimes != 0 && this.currentTimes == this.playTimes)
                    {
                        this.node.emit("complete");

                        if(this.autoDestroy)
                        {
                            this.node.destroy();
                        }
                    }
                }

            }
        }
 
    }


    private playAction()
    {
        this.rowIndex = this.clamp(this.rowIndex, 0, this.row - 1);

        this._playIndex = this._playIndex % (this.end - this.begin) + this.begin;

        this.m_sprite.spriteFrame = this._bitmapArr[this.rowIndex][this._playIndex];
        //this.m_sprite.spriteFrame.setRect(this.rect);

        this._playIndex++;
    }

    /// <summary>
    /// 播放影片
    /// </summary>
    public play()
    {
        this.running = true;
    }

    /// <summary>
    /// 停止播放影片
    /// </summary>
    public stop()
    {
        this.running = false;
    }

    /// <summary>
    /// 跳帧播放
    /// </summary>
    /// <param name="frame">帧</param>
    public gotoAndPlay(frame:number)
    {
        this.running = true;
        this._playIndex = frame;
        this._playIndex = this.clamp(this._playIndex, 0, this.col - 1);

    }

    /// <summary>
    /// 跳帧停止
    /// </summary>
    /// <param name="frame">帧</param>
    public gotoAndStop(frame:number)
    {
        this.running = false;

        this._playIndex = frame;
        this._playIndex = this.clamp(this._playIndex, 0, this.col - 1);
        
        this.m_sprite.spriteFrame = this._bitmapArr[this.rowIndex][this._playIndex];
    }


    public clamp(value:number,minLimit:number,maxLimit:number)
    {
        if(value < minLimit)
        {
            return minLimit;
        }

        if(value > maxLimit)
        {
            return maxLimit;
        }

        return value;
    }

}
