
const {ccclass, property} = cc._decorator;

@ccclass
export default class viewCell extends cc.Component {
    tableView = null;
    _isCellInit_:boolean = false;
    _longClicked_:boolean = false;

    _selectState: boolean = false;   //tableviewCell点击选中状态，默认不选中
    _cellIdx : number = -1;    //cell默认索引，用于选中状态判定

    //不可以重写
    _cellAddMethodToNode_() {
        (this.node as any).clicked = this.clicked.bind(this);
    }

    _cellAddTouch_ () {
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            if (this.node.active === true && this.node.opacity !== 0) {
                if (!this._longClicked_) {
                    this._longClicked_ = true;
                    this.scheduleOnce(this._longClicked, 1.5);
                }
            }
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function () {
            if (this._longClicked_) {
                this._longClicked_ = false;
                this.unschedule(this._longClicked);
            }
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_END, function () {
            this._updateCellSelectedState();
            this.clicked();
            if (this._longClicked_) {
                this._longClicked_ = false;
                this.unschedule(this._longClicked);
            }
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function () {
            if (this._longClicked_) {
                this._longClicked_ = false;
                this.unschedule(this._longClicked);
            }
        }, this);
    }

    _cellInit_ (tableView) {
        this.tableView = tableView;
        if (!this._isCellInit_) {
            this._cellAddMethodToNode_();
            this._cellAddTouch_();
            this._isCellInit_ = true;
        }
    }

    _longClicked () {
        this._longClicked_ = false;
        this.node.emit(cc.Node.EventType.TOUCH_CANCEL);
        this.longClicked();
    }

    //设置cell的选中状态
    _setSelectedState(cellIdx){
        this._cellIdx = cellIdx;
        let bSel = this.tableView.curSelCellIdx == cellIdx;
        this._selectState = bSel;   //tableviewCell点击选中状态，默认不选中
        this.onSelected(this._selectState);
    }

    //根据点击事件更新cell和tableview选中状态
    _updateCellSelectedState(){
        this.tableView.updateCellSelectedState(this._cellIdx);
    }

    /**点击放缩动作，只需要在clicked()调用即可 */
    onClickScale(scale){
        this.node.runAction(cc.sequence(cc.scaleTo(0.1, scale), cc.scaleTo(0.1, 1.0)));
    }

    /**需要重写， 改变选中图标*/
    onSelected(bSel){

    }

    //需要重写的方法
    longClicked() {
    }

    //被点击时相应的方法
    clicked() {
    }

    //加载需要初始化数据时调用
    init (index, data, reload, group) {
        // if (index >= data.array.length) {
        //     this.node.active = false;  //不显示
        //     return;
        // }

        // this.onSelected(this._selectState);
    }
}