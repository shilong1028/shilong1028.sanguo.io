

const { ccclass, property } = cc._decorator;

@ccclass
export default class MapLayer extends cc.Component {

	/**
	 *游戏视图宽度 
	 */
	private _viewWidth: number;

	/**
	 *游戏视图高度 
	 */
	private _viewHeight: number;

	/**
	 *切割的小图片高 
	 */
	private _sliceWidth: number = 200;

	/**
	 *切割的小图片宽 
	 */
	private _sliceHeight: number = 200;

	/**
	 *切割小图片集 
	 */
	private _sliceImgDic: { [key: string]: cc.Texture2D } = {};

	private _bitmapDataArr: cc.Texture2D[];

	private bgImg: cc.Sprite = null;

	public constructor() {
		super();
	}

	public init(viewWidth: number, viewHeight: number, sliceWidth: number, sliceHeight: number, mapImg: cc.Texture2D): void {
		this._viewWidth = viewWidth;
		this._viewHeight = viewHeight;
		this._sliceWidth = sliceWidth;
		this._sliceHeight = sliceHeight;
		this.bgImg = this.node.getChildByName("mapBg").getComponent(cc.Sprite);

		if (mapImg) {
			this.bgImg.spriteFrame = new cc.SpriteFrame(mapImg);
		}

		this.node.width = this.width;
		this.node.height = this.height;

		//_bitmapDataArr = PictureClip.divide2(mapImg,_sliceWidth,_sliceHeight);
	}



	public load(url: String): void {
		//ResourceLoader.getInstance().load(url,onLoadComplete);	
	}

	public onLoadComplete(): void {
		//var bitmapData:BitmapData = (content as Bitmap).bitmapData;
		//_bgImg.bitmapData = bitmapData;
		//this.dispatchEvent(new MsgEvent(MsgEvent.INIT_COMP,{width:bitmapData.width,height:bitmapData.height}));
	}


	/**
	 * 根据视图区域加载小地图
	 * @param px 滚动视图左上角的x坐标 
	 * @param py 滚动视图左上角的y坐标 
	 * 
	 */
	public loadSmallImage(px: number, py: number): void {
		if (!this._bitmapDataArr) {
			return;
		}

		var ix1: number = Math.floor(px / this._sliceWidth);
		var iy1: number = Math.floor(py / this._sliceHeight);

		var ix2: number = Math.floor((px + this._viewWidth) / this._sliceWidth);
		var iy2: number = Math.floor((py + this._viewHeight) / this._sliceHeight);

		var key: String;

		/*for(var i:number = ix1 ; i <= ix2 ; i++)
		{
			for(var j:number = iy1 ; j <= iy2 ; j++)
			{
				key = i + "_" + j;
				
				if(!_sliceImgDic[key] && j < _bitmapDataArr.length && i < _bitmapDataArr[0].length)
				{
					var bitmap:Bitmap = new Bitmap();
					_sliceImgDic[key] = bitmap;
					this.addChild(bitmap);
					bitmap.x = i * _sliceWidth;
					bitmap.y = j * _sliceHeight;
					
					setTimeout((btp:Bitmap,c:number,r:number):void{
						btp.bitmapData = _bitmapDataArr[r][c];
						//ResourceLoader.getInstance().loadImage(key + ".jpg",bitmap);
					},1000,bitmap,i,j);
					
				}
				
			}
		}*/

	}

	public clear(): void {
		this.bgImg.spriteFrame = null;

		/*for(var param in this._sliceImgDic)
		{
			var bitmap:Bitmap = _sliceImgDic[param];
			bitmap && bitmap.bitmapData.dispose();
			_sliceImgDic[param] = null;
			delete _sliceImgDic[param];
		}*/

	}

	public get bgImage(): cc.Sprite {
		return this.bgImg;
	}

	public get width(): number {
		if (this.bgImg) {
			return this.bgImg.node.width;
		}

		return this._viewWidth;
	}

	public get height(): number {
		if (this.bgImg) {
			return this.bgImg.node.height;
		}

		return this._viewHeight;
	}
}
