const ScrollModel = cc.Enum({Horizontal:0,Vertical:1});
var ScrollDirection = cc.Enum({ None: 0, Up: 1, Down: 2, Left: 3, Rigth: 4 });
var Direction = cc.Enum({ LEFT_TO_RIGHT__TOP_TO_BOTTOM: 0, TOP_TO_BOTTOM__LEFT_TO_RIGHT: 1 });
var ViewType = cc.Enum({ Scroll: 0, Flip: 1 });

// export enum ScrollDirection{ 
//     None = 0, 
//     Up = 1, 
//     Down = 2, 
//     Left = 3, 
//     Rigth = 4 
// };
// export enum Direction { 
//     LEFT_TO_RIGHT__TOP_TO_BOTTOM = 0, 
//     TOP_TO_BOTTOM__LEFT_TO_RIGHT = 1 
// };
// export enum ViewType { 
//     Scroll = 0, 
//     Flip = 1 
// };

function pSub(t, e) {
    return cc.v2(t.x - e.x, t.y - e.y)
}

function quickSort(arr, cb) {
    //如果数组<=1,则直接返回
    if (arr.length <= 1) { return arr; }
    var pivotIndex = Math.floor(arr.length / 2);
    //找基准
    var pivot = arr[pivotIndex];
    //定义左右数组
    var left = [];
    var right = [];

    //比基准小的放在left，比基准大的放在right
    for (var i = 0; i < arr.length; i++) {
        if (i !== pivotIndex) {
            if (cb) {
                if (cb(arr[i], pivot)) {
                    left.push(arr[i]);
                } else {
                    right.push(arr[i]);
                }
            } else {
                if (arr[i] <= pivot) {
                    left.push(arr[i]);
                } else {
                    right.push(arr[i]);
                }
            }
        }
    }
    //递归
    return quickSort(left, cb).concat([pivot], quickSort(right, cb));
}

const {ccclass, property} = cc._decorator;

@ccclass
export default class TableView extends cc.ScrollView {
    // 缓存的数据
    _data:any = null;
    //cell的最小下标
    _minCellIndex:number = 0;
    //cell的最大下标
    _maxCellIndex:number = 0;
    _paramCount:number = 0;
    //一共有多少节点
    _count:number = 0;
    //scroll下有多少节点
    _cellCount:number = 0;
    //scroll一个屏幕能显示多少节点
    _showCellCount:number = 0;

    //GRID模式下，对cell进行分组管理
    //每组有几个节点
    _groupCellCount:number = 0;

    _scrollDirection = ScrollDirection.None;

    _cellPool: any = null;
    _mView:any = null;

    _page:number = 0;//当前处于那一页
    _pageTotal:number = 0;//总共有多少页

    _tableView = [];

    /**当前选中的Cell索引 */
    curSelCellIdx: number = 0;

    /**是否开启Cell选中状态变换 */
    @property
    isCellSelEffect: boolean = false;

    /***** 设置属性 */
    @property(cc.Prefab)
    cell: cc.Prefab = null;

    @property({type:ScrollModel})
    ScrollModel = ScrollModel.Horizontal;

    @property({type:ViewType})
    ViewType = ViewType.Scroll;
    
    @property(cc.Boolean)
    isFill: boolean = false;

    @property({type:Direction})
    Direction = Direction.LEFT_TO_RIGHT__TOP_TO_BOTTOM;

    @property([cc.Component.EventHandler])
    pageChangeEvents: cc.Component.EventHandler[] = [];

    _cellPoolCache = {};
    _cellSize   :any = null;
    _lastOffset :cc.Vec2 = null;
    _touchMoved :boolean = false;

    // statics: {
    // };

    onLoad() {
        window["s"] = this;
        var self = this;
        this._tableView.push(this);

        //当销毁tableView的时候，回收cell
        var destroy = this.node.destroy;
        this.node.destroy = function () :boolean {
            self.clear();
            destroy.call(self.node);
            return true;
        }

        var _onPreDestroy = this.node["_onPreDestroy"];
        this.node["_onPreDestroy"] = function () {
            self.clear();
            _onPreDestroy.call(self.node);
        }
    }
    onDestroy () {
        for (var key in this._tableView) {
            if (this._tableView[key] === this) {
                this._tableView.splice(parseInt(key));
                return;
            }
        }
    }
    //初始化cell
    _initCell (cell, reload:boolean=false) {
        if ((this.ScrollModel === ScrollModel.Horizontal && this.Direction === Direction.TOP_TO_BOTTOM__LEFT_TO_RIGHT) || (this.ScrollModel === ScrollModel.Vertical && this.Direction === Direction.LEFT_TO_RIGHT__TOP_TO_BOTTOM)) {
            var tag = parseInt(cell.name) * cell.childrenCount;
            for (var index = 0; index < cell.childrenCount; ++index) {
                var node = cell.children[index];
                var viewCell = node.getComponent('viewCell');
                if (viewCell) {
                    viewCell._cellInit_(this);
                    let cellIdx = tag + index;
                    if(this.isCellSelEffect){   //是否开启Cell选中状态变换
                        viewCell._setSelectedState(cellIdx);  //当前选中的Cell索引与cell索引比较
                    }
                    viewCell.init(cellIdx, this._data, reload, [cell.name, index]);
                }
            }
        } else {
            if (this.ViewType === ViewType.Flip) {
                var tag = Math.floor(parseInt(cell.name) / this._showCellCount);
                var tagnum = tag * this._showCellCount * cell.childrenCount;
                for (var index = 0; index < cell.childrenCount; ++index) {
                    var node = cell.children[index];
                    var viewCell = node.getComponent('viewCell');
                    if (viewCell) {
                        viewCell._cellInit_(this);
                        let cellIdx = this._showCellCount * index + parseInt(cell.name) % this._showCellCount + tagnum;
                        if(this.isCellSelEffect){   //是否开启Cell选中状态变换
                            viewCell._setSelectedState(cellIdx);  //当前选中的Cell索引与cell索引比较
                        }
                        viewCell.init(cellIdx, this._data, reload, [index + tag * cell.childrenCount, index]);
                    }
                }
            } else {
                for (var index = 0; index < cell.childrenCount; ++index) {
                    var node = cell.children[index];
                    var viewCell = node.getComponent('viewCell');
                    if (viewCell) {
                        viewCell._cellInit_(this);
                        let cellIdx = index * this._count + parseInt(cell.name);
                        if(this.isCellSelEffect){   //是否开启Cell选中状态变换
                            viewCell._setSelectedState(cellIdx);  //当前选中的Cell索引与cell索引比较
                        }
                        viewCell.init(cellIdx, this._data, reload, [index, index]);
                    }
                }
            }
        }
    }
    //设置cell的位置
    _setCellPosition (node, index) {
        if (this.ScrollModel === ScrollModel.Horizontal) {
            if (index === 0) {
                node.x = -this.content.width * this.content.anchorX + node.width * node.anchorX;
            } else {
                node.x = this.content.getChildByName((index - 1).toString()).x + node.width;
            }
            node.y = (node.anchorY - this.content.anchorY) * node.height;
        } else {
            if (index === 0) {
                node.y = this.content.height * (1 - this.content.anchorY) - node.height * (1 - node.anchorY);
            } else {
                node.y = this.content.getChildByName((index - 1).toString()).y - node.height;
            }
            node.x = (node.anchorX - this.content.anchorX) * node.width;
        }
    }
    _addCell (index) {
        var cell = this._getCell();
        this._setCellAttr(cell, index);
        this._setCellPosition(cell, index);
        cell.parent = this.content;
        this._initCell(cell);
    }
    _setCellAttr (cell, index) {
        cell.setSiblingIndex(index >= parseInt(cell.name) ? this._cellCount : 0);
        cell.name = index.toString();
    }
    _addCellsToView () {
        for (var index = 0; index <= this._maxCellIndex; ++index) {
            this._addCell(index);
        }
    }
    _getCell () {
        if (this._cellPool.size() === 0) {
            let cell = cc.instantiate(this.cell);

            var node = new cc.Node();
            node.anchorX = 0.5;
            node.anchorY = 0.5;

            var length = 0;
            if (this.ScrollModel === ScrollModel.Horizontal) {
                node.width = cell.width;
                var childrenCount = Math.floor((this.content.height) / (cell.height));
                node.height = this.content.height;

                for (var index = 0; index < childrenCount; ++index) {
                    if (!cell) {
                        cell = cc.instantiate(this.cell);
                    }
                    cell.x = (cell.anchorX - 0.5) * cell.width;
                    cell.y = node.height / 2 - cell.height * (1 - cell.anchorY) - length;
                    length += cell.height;
                    cell.setParent(node);
                    cell = null;
                }
            } else {
                node.height = cell.height;
                var childrenCount = Math.floor((this.content.width) / (cell.width));
                node.width = this.content.width;

                for (var index = 0; index < childrenCount; ++index) {
                    if (!cell) {
                        cell = cc.instantiate(this.cell);
                    }
                    cell.y = (cell.anchorY - 0.5) * cell.height;
                    cell.x = -node.width / 2 + cell.width * cell.anchorX + length;
                    length += cell.width;
                    cell.setParent(node);
                    cell = null;
                }
            }
            this._cellPool.put(node);
        }
        var cell = this._cellPool.get();
        return cell;
    }
    _getCellSize () {
        var cell = this._getCell();
        var cellSize = cell.getContentSize();
        this._cellPool.put(cell);
        return cellSize;
    }
    _getGroupCellCount () {
        var cell = this._getCell();
        var groupCellCount = cell.childrenCount;
        this._cellPool.put(cell);
        return groupCellCount;
    }
    clear () {
        for (var index = this.content.childrenCount - 1; index >= 0; --index) {
            this._cellPool.put(this.content.children[index]);
        }
        this._cellCount = 0;
        this._showCellCount = 0;
    }
    reload (data) {
        if (data !== undefined) {
            this._data = data;
        }
        if (this.ViewType === ViewType.Flip) {
            this.updateTotalPage(data.array.length, data);
        }
        if(data.array.length != this.content.childrenCount && this.ViewType != ViewType.Flip)
        {
            //var cy = this.content.y;
            //var xxx = this._lastOffset;
            //this._lastOffset = this.getScrollOffset();
            this.clear();
            this.initTableView(data.array.length,data);
        }else{
            for (var index = this.content.childrenCount - 1; index >= 0; --index) {
                this._initCell(this.content.children[index], true);
            }
        }
        if (this._page > this._pageTotal) {
            this.scrollToPage(this._pageTotal);
        }
    }
    _getCellPoolCacheName () {
        if (this.ScrollModel === ScrollModel.Horizontal) {
            return this.cell.name + 'h' + this.content.height;
        } else {
            return this.cell.name + 'w' + this.content.width;
        }
    }
    _initTableView () {
        if (this._cellPool) {
            this.clear();
        }

        var name = this._getCellPoolCacheName();
        if (!this._cellPoolCache[name]) {
            this._cellPoolCache[name] = new cc.NodePool('viewCell');
        }
        this._cellPool = this._cellPoolCache[name];

        this._cellSize = this._getCellSize();
        this._groupCellCount = this._getGroupCellCount();

        this._count = Math.ceil(this._paramCount / this._groupCellCount);
        if (this.ScrollModel === ScrollModel.Horizontal) {
            if(this._count < 2 && this._data != null && this._data.minCol != null){
                this._count = this._data.minCol;
            }

            this._mView.width = this.node.width;
            this._mView.x = (this._mView.anchorX - this.node.anchorX) * this._mView.width;

            this._cellCount = Math.ceil(this._mView.width / this._cellSize.width) + 1;
            if (this.ViewType === ViewType.Flip) {
                if (this._cellCount > this._count) {
                    if (this.isFill) {
                        this._cellCount = Math.floor(this._mView.width / this._cellSize.width);
                    } else {
                        this._cellCount = this._count;
                    }
                    this._showCellCount = this._cellCount;
                    this._pageTotal = 1;
                } else {
                    this._pageTotal = Math.ceil(this._count / (this._cellCount - 1));
                    this._count = this._pageTotal * (this._cellCount - 1);
                    this._showCellCount = this._cellCount - 1;
                }
            } else {
                if (this._cellCount > this._count) {
                    if (this.isFill) {
                        this._cellCount = Math.floor(this._mView.width / this._cellSize.width);
                    } else {
                        this._cellCount = this._count;
                    }
                    this._showCellCount = this._cellCount;
                } else {
                    this._showCellCount = this._cellCount - 1;
                }
            }

            this.content.width = this._count * this._cellSize.width;
            // if (this.content.width <= this._mView.width) {
            //     this.content.width = this._mView.width + 1;
            // }

            //停止_scrollView滚动
            this.stopAutoScroll();
            this.scrollToLeft();
        } else {
            this._mView.height = this.node.height;
            this._mView.y = (this._mView.anchorY - this.node.anchorY) * this._mView.height;

            this._cellCount = Math.ceil(this._mView.height / this._cellSize.height) + 1;
            if (this.ViewType === ViewType.Flip) {
                if (this._cellCount > this._count) {
                    if (this.isFill) {
                        this._cellCount = Math.floor(this._mView.height / this._cellSize.height);
                    } else {
                        this._cellCount = this._count;
                    }
                    this._showCellCount = this._cellCount;
                    this._pageTotal = 1;
                } else {
                    this._pageTotal = Math.ceil(this._count / (this._cellCount - 1));
                    this._count = this._pageTotal * (this._cellCount - 1);
                    this._showCellCount = this._cellCount - 1;
                }
            } else {
                if (this._cellCount > this._count) {
                    if (this.isFill) {
                        this._cellCount = Math.floor(this._mView.height / this._cellSize.height);
                    } else {
                        this._cellCount = this._count;
                    }
                    this._showCellCount = this._cellCount;
                } else {
                    this._showCellCount = this._cellCount - 1;
                }
            }

            this.content.height = this._count * this._cellSize.height;
            if(this.content.height < this._mView.height){
                this.content.height = this._mView.height + 1;
            }

            //停止_scrollView滚动
            this.stopAutoScroll();
            this.scrollToTop();
        }

        this._changePageNum(1 - this._page);

        this._lastOffset = this.getScrollOffset();
        this._minCellIndex = 0;
        this._maxCellIndex = this._cellCount - 1;

        this._addCellsToView();
    }

    /**是否开启Cell选中状态变换 */
    openListCellSelEffect(bOpen:boolean=true){
        this.isCellSelEffect = bOpen;   //是否开启Cell选中状态变换
    }

    /**根据cell点击事件来更新tableview当前选中cell索引值 */
    updateCellSelectedState(selCellIdx){
        if(this.isCellSelEffect){   //是否开启Cell选中状态变换
            this.curSelCellIdx = selCellIdx;  //当前选中的Cell索引与cell索引比较

            for (var index = this.content.childrenCount - 1; index >= 0; --index) {
                this._initCell(this.content.children[index], false);
            }
        }
    }

    reloadData(paramCount, data){
        if (this.ScrollModel === ScrollModel.Horizontal) {
            var cc = Math.floor(this._mView.width / this._cellSize.width) + 1;
            this._groupCellCount = this._getGroupCellCount();
        
            if(paramCount > this._paramCount &&  cc * this._groupCellCount >= this._paramCount ){
                //添加
                var cx = this.content.x;
                this.reload(data);
                this.content.x = cx;
                return;
            }

            this._paramCount = paramCount;
            this._data = data;

            this._cellSize = this._getCellSize();
            this._count = Math.ceil(this._paramCount / this._groupCellCount);

            this.content.width = this._count * this._cellSize.width;
            if(this.content.width < this._mView.width){
                this.content.width = this._mView.width + 1;
            }
        }else{
            var cc = Math.floor(this._mView.height / this._cellSize.height) + 1;
            this._groupCellCount = this._getGroupCellCount();
        
            if(paramCount > this._paramCount &&  cc * this._groupCellCount >= this._paramCount ){
                //添加
                var cy = this.content.y;
                this.reload(data);
                this.content.y = cy;
                return;
            }

            this._paramCount = paramCount;
            this._data = data;

            this._cellSize = this._getCellSize();
            this._count = Math.ceil(this._paramCount / this._groupCellCount);

            this.content.height = this._count * this._cellSize.height;
            if(this.content.height < this._mView.height){
                this.content.height = this._mView.height + 1;
            }
        }

        //this._getScrollDirection();
        // this._scrollDirection = ScrollDirection.Up;
        // this._updateCells(true);

        for (var index = this.content.childrenCount - 1; index >= 0; --index) {
            this._initCell(this.content.children[index], true);
        }
    }

    updateTotalPage(paramCount, data) {
        this._paramCount = paramCount;
        this._data = data;
        this._count = Math.ceil(this._paramCount / this._groupCellCount);
        this._cellCount = Math.ceil(this._mView.width / this._cellSize.width) + 1;
        if (this.ScrollModel === ScrollModel.Horizontal) {
            if(this._count < 2 && this._data != null && this._data.minCol != null){
                this._count = this._data.minCol;
            }
            if (this.ViewType === ViewType.Flip) {
                if (this._cellCount > this._count) {
                    this._pageTotal = 1;
                } else {
                    this._pageTotal = Math.ceil(this._count / (this._cellCount - 1));
                    this._count = this._pageTotal * (this._cellCount - 1);
                }
            }
        } else {
            if (this.ViewType === ViewType.Flip) {
                if (this._cellCount > this._count) {
                    this._pageTotal = 1;
                } else {
                    this._pageTotal = Math.ceil(this._count / (this._cellCount - 1));
                    this._count = this._pageTotal * (this._cellCount - 1);
                }
            }
        }
    }

    /**
     * 
     * @param paramCount cell的总个数
     * @param data 向cell传递的数据
     */
    initTableView (paramCount, data) {
        this._paramCount = paramCount;
        this._data = data;

        if (this.ScrollModel === ScrollModel.Horizontal) {
            this.horizontal = true;
            this.vertical = false;
            this.verticalScrollBar = null;
        } else {
            this.vertical = true;
            this.horizontal = false;
            this.horizontalScrollBar = null;
        }

        if (this.ViewType === ViewType.Flip) {
            this.inertia = false;
        } else {
            this.inertia = true;
        }

        if (this.ScrollModel === ScrollModel.Horizontal) {
            this.horizontal = true;
            this.vertical = false;
        } else {
            this.vertical = true;
            this.horizontal = false;
        }
        this._mView = this.content.getParent();
        //为scrollBar添加size改变的监听
        this.verticalScrollBar && this.verticalScrollBar.node.on('size-changed', function () {
            this._updateScrollBar(this._getHowMuchOutOfBoundary());
        }, this);
        this.horizontalScrollBar && this.horizontalScrollBar.node.on('size-changed', function () {
            this._updateScrollBar(this._getHowMuchOutOfBoundary());
        }, this);
        if (this.node.getComponent(cc.Widget)) {
            this.node.getComponent(cc.Widget).updateAlignment();
        }

        this._initTableView();
    }

    //*************************************************重写ScrollView方法*************************************************//
    // touch event handler
    _onTouchBegan (event, captureListeners) {
        super["_onTouchBegan"](event, captureListeners);
        this._touchstart(event);
    }
    _onTouchMoved (event, captureListeners) {
        if (!this.enabledInHierarchy) return;
        if (this["_hasNestedViewGroup"](event, captureListeners)) return;

        let touch = event.touch;
        if (this.content) {
            this["_handleMoveLogic"](touch);
        }
        // Do not prevent touch events in inner nodes
        if (!this.cancelInnerEvents) {
            return;
        }

        //let deltaMove = cc.pSub(touch.getLocation(), touch.getStartLocation());
        let deltaMove = touch.getLocation().sub(touch.getStartLocation());
        //FIXME: touch move delta should be calculated by DPI.
        if (deltaMove.mag() > 7) {
            if (!this._touchMoved && event.target !== this.node) {
                // Simulate touch cancel for target node
                let cancelEvent = new cc.Event.EventTouch(event.getTouches(), event.bubbles);
                cancelEvent.type = cc.Node.EventType.TOUCH_CANCEL;
                cancelEvent.touch = event.touch;
                cancelEvent["simulate"] = true;
                // event.target.dispatchEvent(cancelEvent);
                event.target.emit(cc.Node.EventType.TOUCH_CANCEL, cancelEvent);
                this._touchMoved = true;
            }
        }
        this["_stopPropagationIfTargetIsMe"](event);

        this._touchmove(event);
    }
    _onTouchEnded (event, captureListeners) {
        super["_onTouchEnded"](event, captureListeners);
        this._touchend(event);
    }
    _onTouchCancelled (event, captureListeners) {
        super["_onTouchCancelled"](event, captureListeners);
        this._touchend(event);
    }
    stopAutoScroll () {
        this._scrollDirection = ScrollDirection.None;
        super.stopAutoScroll();
    }
    scrollToBottom (timeInSecond=null, attenuated=null) {
        this._scrollDirection = ScrollDirection.Up;
        super.scrollToBottom(timeInSecond, attenuated);
    }
    scrollToTop (timeInSecond=null, attenuated=null) {
        this._scrollDirection = ScrollDirection.Down;
        super.scrollToTop(timeInSecond, attenuated);
    }
    scrollToLeft (timeInSecond = null, attenuated = null) {
        this._scrollDirection = ScrollDirection.Rigth;
        super.scrollToLeft(timeInSecond, attenuated);
    }
    scrollToRight (timeInSecond=null, attenuated=null) {
        this._scrollDirection = ScrollDirection.Left;
        super.scrollToRight(timeInSecond, attenuated);
    }
    scrollToOffset (offset, timeInSecond, attenuated = null) {
        var nowoffset = this.getScrollOffset();
        var p = pSub(offset, nowoffset);
        if (this.ScrollModel === ScrollModel.Horizontal) {
            if (p.x > 0) {
                this._scrollDirection = ScrollDirection.Left;
            } else if (p.x < 0) {
                this._scrollDirection = ScrollDirection.Rigth;
            }
        } else {
            if (p.y > 0) {
                this._scrollDirection = ScrollDirection.Up;
            } else if (p.y < 0) {
                this._scrollDirection = ScrollDirection.Down;
            }
        }

        super.scrollToOffset(offset, timeInSecond, attenuated);
    }
    //*******************************************************END*********************************************************//

    addScrollEvent (target, component, handler) {
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = target;
        eventHandler.component = component;
        eventHandler.handler = handler;
        this.scrollEvents.push(eventHandler);
    }
    removeScrollEvent (target) {
        for (var key in this.scrollEvents) {
            var eventHandler = this.scrollEvents[key]
            if (eventHandler.target === target) {
                this.scrollEvents.splice(parseInt(key), 1);
                return;
            }
        }
    }
    clearScrollEvent () {
        this.scrollEvents = [];
    }
    addPageEvent (target, component, handler) {
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = target;
        eventHandler.component = component;
        eventHandler.handler = handler;
        this.pageChangeEvents.push(eventHandler);
    }
    removePageEvent (target) {
        for (var key = 0; key < this.pageChangeEvents.length; key++) {
            var eventHandler = this.pageChangeEvents[key]
            if (eventHandler.target === target) {
                this.pageChangeEvents.splice(key, 1);
                return;
            }
        }
    }
    clearPageEvent () {
        this.pageChangeEvents = [];
    }
    scrollToNextPage () {
        this.scrollToPage(this._page + 1);
    }
    scrollToLastPage () {
        this.scrollToPage(this._page - 1);
    }
    scrollToPage (page) {
        if (this.ViewType !== ViewType.Flip || page === this._page) {
            return;
        }

        if (page < 1 || page > this._pageTotal) {
            return;
        }

        var time = 0.3 * Math.abs(page - this._page);

        this._changePageNum(page - this._page);

        var x = this._mView.width;
        var y = this._mView.height;
        x = (this._page - 1) * x;
        y = (this._page - 1) * y;
        this.scrollToOffset({ x: x, y: y }, time);
    }
    getCells (callback) {
        var cells = [];
        var nodes = quickSort(this.content.children, function (a, b) {
            return parseInt(a.name) < parseInt(b.name);
        });
        for (var key in nodes) {
            var node = nodes[key];
            for (var k in node.children) {
                cells.push(node.children[k]);
            }
        }
        callback(cells);
    }
    getData () {
        return this._data;
    }
    getGroupsRange (callback) {
        var arr = [];
        for (var i = this._minCellIndex; i <= this._maxCellIndex; i++) {
            arr.push(i);
        }
        callback(arr);
    }
    _changePageNum (num) {
        this._page += num;
        if (this._page <= 0) {
            this._page = 1;
        } else if (this._page > this._pageTotal) {
            this._page = this._pageTotal;
        }

        for (var key = 0; key < this.pageChangeEvents.length; key++) {
            var event = this.pageChangeEvents[key];
            event.emit([this._page, this._pageTotal]);
        }
    }
    _touchstart (event) {
        if (this.ScrollModel === ScrollModel.Horizontal) {
            this.horizontal = false;
        } else {
            this.vertical = false;
        }
    }
    _touchmove (event) {
        if (this.horizontal === this.vertical) {
            // var startL = event.getStartLocation();
            // var l = event.getLocation();
            // if (this.ScrollModel === ScrollModel.Horizontal) {
            //     if (Math.abs(l.x - startL.x) <= 7) {
            //         return;
            //     }
            // } else {
            //     if (Math.abs(l.y - startL.y) <= 7) {
            //         return;
            //     }
            // }

            if (this.ScrollModel === ScrollModel.Horizontal) {
                this.horizontal = true;
            } else {
                this.vertical = true;
            }
        }
    }
    _touchend (event) {
        if (this.ScrollModel === ScrollModel.Horizontal) {
            this.horizontal = true;
        } else {
            this.vertical = true;
        }

        if (this.ViewType === ViewType.Flip && this._pageTotal > 1) {
            this._pageMove(event);
        }
        // this._ckickCell(event);
    }
    // _ckickCell: function (event) {
    //     var srartp = event.getStartLocation();
    //     var p = event.getLocation();

    //     if (this.ScrollModel === ScrollModel.Horizontal) {
    //         if (Math.abs(p.x - srartp.x) > 7) {
    //             return;
    //         }
    //     } else {
    //         if (Math.abs(p.y - srartp.y) > 7) {
    //             return;
    //         }
    //     }

    //     var convertp = this.content.convertToNodeSpaceAR(p);
    //     for (var key in this.content.children) {
    //         var node = this.content.children[key];
    //         var nodebox = node.getBoundingBox();
    //         if (nodebox.contains(convertp)) {
    //             convertp = node.convertToNodeSpaceAR(p);
    //             for (var k in node.children) {
    //                 var cell = node.children[k]
    //                 var cellbox = cell.getBoundingBox();
    //                 if (cellbox.contains(convertp)) {
    //                     if (cell.activeInHierarchy && cell.opacity !== 0) {
    //                         cell.clicked();
    //                     }
    //                     return;
    //                 }
    //             }
    //             return;
    //         }
    //     }
    // },
    //移动距离小于25%则不翻页
    _pageMove (event) {
        var x = this._mView.width;
        var y = this._mView.height;

        if (this.ViewType === ViewType.Flip) {
            var offset = this.getScrollOffset();
            var offsetMax = this.getMaxScrollOffset();

            if (this.ScrollModel === ScrollModel.Horizontal) {
                if (offset.x >= 0 || offset.x <= -offsetMax.x) {
                    return;
                }
                y = 0;
                if (Math.abs(event.getLocation().x - event.getStartLocation().x) > this._mView.width / 4) {
                    if (this._scrollDirection === ScrollDirection.Left) {
                        if (this._page < this._pageTotal) {
                            this._changePageNum(1);
                        } else {
                            return;
                        }
                    } else if (this._scrollDirection === ScrollDirection.Rigth) {
                        if (this._page > 1) {
                            this._changePageNum(-1);
                        } else {
                            return;
                        }
                    }
                }
            } else {
                if (offset.y >= offsetMax.y || offset.y <= 0) {
                    return;
                }
                x = 0;
                if (Math.abs(event.getLocation().y - event.getStartLocation().y) > this._mView.height / 4) {
                    if (this._scrollDirection === ScrollDirection.Up) {
                        if (this._page < this._pageTotal) {
                            this._changePageNum(1);
                        } else {
                            return;          
                        }
                    } else if (this._scrollDirection === ScrollDirection.Down) {
                        if (this._page > 1) {
                            this._changePageNum(-1);
                        } else {
                            return;
                        }
                    }
                }
            }

            x = (this._page - 1) * x;
            y = (this._page - 1) * y;

            this.scrollToOffset({ x: x, y: y }, 0.3);
        }
    }
    _getBoundingBoxToWorld (node) {
        var p = node.convertToWorldSpaceAR(cc.v2(0, 0));
        return cc.rect(p.x-node.width/2, p.y-node.height/2, node.width, node.height);
    }
    _updateCells () {
        if (this.ScrollModel === ScrollModel.Horizontal) {
            if (this._scrollDirection === ScrollDirection.Left) {
                if (this._maxCellIndex < this._count - 1) {
                    var viewBox = this._getBoundingBoxToWorld(this._mView);
                    do {
                        var node = this.content.getChildByName(this._minCellIndex.toString());
                        var nodeBox = this._getBoundingBoxToWorld(node);

                        if (nodeBox.xMax <= viewBox.xMin) {
                            node.x = this.content.getChildByName(this._maxCellIndex.toString()).x + node.width;
                            this._minCellIndex++;
                            this._maxCellIndex++;
                            if (nodeBox.xMax + (this._maxCellIndex - this._minCellIndex + 1) * node.width > viewBox.xMin) {
                                this._setCellAttr(node, this._maxCellIndex);
                                this._initCell(node);
                            }
                        } else {
                            break;
                        }
                    } while (this._maxCellIndex !== this._count - 1);
                }

            } else if (this._scrollDirection === ScrollDirection.Rigth) {
                if (this._minCellIndex > 0) {
                    var viewBox = this._getBoundingBoxToWorld(this._mView);
                    do {
                        var node = this.content.getChildByName(this._maxCellIndex.toString());
                        var nodeBox = this._getBoundingBoxToWorld(node);

                        if (nodeBox.xMin >= viewBox.xMax) {
                            node.x = this.content.getChildByName(this._minCellIndex.toString()).x - node.width;
                            this._minCellIndex--;
                            this._maxCellIndex--;
                            if (nodeBox.xMin - (this._maxCellIndex - this._minCellIndex + 1) * node.width < viewBox.xMax) {
                                this._setCellAttr(node, this._minCellIndex);
                                this._initCell(node);
                            }
                        } else {
                            break;
                        }
                    } while (this._minCellIndex !== 0);
                }
            }
        } else {
            if (this._scrollDirection === ScrollDirection.Up) {
                if (this._maxCellIndex < this._count - 1) {
                    var viewBox = this._getBoundingBoxToWorld(this._mView);
                    do {
                        var node = this.content.getChildByName(this._minCellIndex.toString());
                        var nodeBox = this._getBoundingBoxToWorld(node);

                        if (nodeBox.yMin >= viewBox.yMax) {
                            var cell = this.content.getChildByName(this._maxCellIndex.toString());
                            if(cell == null){
                                cc.warn("======");
                                break;
                            }
                            node.y = cell.y - node.height;
                            this._minCellIndex++;
                            this._maxCellIndex++;
                            if (nodeBox.yMin - (this._maxCellIndex - this._minCellIndex + 1) * node.height < viewBox.yMax) {
                                this._setCellAttr(node, this._maxCellIndex);
                                this._initCell(node);
                            }
                        } else {
                            break;
                        }
                    } while (this._maxCellIndex !== this._count - 1);
                }
            } else if (this._scrollDirection === ScrollDirection.Down) {
                if (this._minCellIndex > 0) {
                    var viewBox = this._getBoundingBoxToWorld(this._mView);
                    do {
                        var node = this.content.getChildByName(this._maxCellIndex.toString());
                        var nodeBox = this._getBoundingBoxToWorld(node);

                        if (nodeBox.yMax <= viewBox.yMin) {
                            node.y = this.content.getChildByName(this._minCellIndex.toString()).y + node.height;
                            this._minCellIndex--;
                            this._maxCellIndex--;
                            if (nodeBox.yMax + (this._maxCellIndex - this._minCellIndex + 1) * node.width > viewBox.yMin) {
                                this._setCellAttr(node, this._minCellIndex);
                                this._initCell(node);
                            }
                        } else {
                            break;
                        }
                    } while (this._minCellIndex !== 0);

                }
            }
        }
    }
    _getScrollDirection () {
        var offset = this.getScrollOffset();

        var lastOffset = this._lastOffset;
        this._lastOffset = offset;
        offset = pSub(offset, lastOffset);

        if (this.ScrollModel === ScrollModel.Horizontal) {
            if (offset.x > 0) {
                this._scrollDirection = ScrollDirection.Rigth;
            } else if (offset.x < 0) {
                this._scrollDirection = ScrollDirection.Left;
            } else {
                this._scrollDirection = ScrollDirection.None;
            }
        } else {
            if (offset.y < 0) {

                this._scrollDirection = ScrollDirection.Down;
            } else if (offset.y > 0) {
                this._scrollDirection = ScrollDirection.Up;
            } else {
                this._scrollDirection = ScrollDirection.None;
            }
        }
    }

    // called every frame, uncomment this function to activate update callback
    update (dt) {
        super.update(dt);

        if (this._cellCount === this._showCellCount || this._pageTotal === 1) {
            return;
        }
        this._getScrollDirection();
        this._updateCells();
    }

    getContentPos(){
        return this.content.position;
    }
}

// tableView.reload = function () {
//     for (var key in tableView._tableView) {
//         this._tableView[key].reload();
//     }
// }
// tableView.clear = function () {
//     for (var key in tableView._tableView) {
//         this._tableView[key].clear();
//     }
// }