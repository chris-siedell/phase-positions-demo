/*
 * DraggableItemMixin.js
 * mixins
 * astro.unl.edu
 * 11 December 2018
*/

// This mixin adds both mouse and touch draggability to an item.
//
// Example (minimal) usage:
//
//  constructor(rootElement) {
//    DraggableItemMixin.apply(this);
//    this._setDragElement(rootElement);
//  } 
//
// Several customization options are available.
//
// Methods and properties beginning with ___DIM* intended for internal
//  use. Methods beginning with a single underscore constitute the exposed
//  interface.


export function DraggableItemMixin() {

  this.___DIM_TYPE_NONE = 0;
  this.___DIM_TYPE_MOUSE = 1;
  this.___DIM_TYPE_TOUCH = 2;

  this.___DIM_type = this.___DIM_TYPE_NONE;



  /*
   * _dragElement
   *
   * The drag element must be defined. This is the element the initial pointer
   *  event handlers will be attached to. It is also the element that will be
   *  repositioned during dragging unless a custom dragSetPosFunc is defined.
  */

  this.___DIM_element = undefined;

  this._getDragElement = function() {
    return this.___DIM_element;
  };

  this._setDragElement = function(element) {
    if (this.___DIM_element !== undefined) {
      this.___DIM_element.removeEventListener('mousedown', this.___DIM_onMouseDown);
      this.___DIM_element.removeEventListener('touchstart', this.___DIM_onTouchStart);
    }
    this.___DIM_element = element;
    if (this.___DIM_element !== undefined) {
      this.___DIM_element.addEventListener('mousedown', this.___DIM_onMouseDown);
      this.___DIM_element.addEventListener('touchstart', this.___DIM_onTouchStart);
    }
  };


  /*
   * _isDraggable
   *
   * This property determines if dragging is allowed. Setting it to
   *  false does not cancel dragging in progress, nor does it cause
   *  event handlers to be removed.
  */

  this.___DIM_isDraggable = true;

  this._getIsDraggable = function() {
    return this.___DIM_isDraggable;
  };

  this._setIsDraggable = function(bool) {
    this.___DIM_isDraggable = bool;
  };


  /*
   * _dragHitTestFunc
   *
   * The hit test function, if defined, allows a more refined determination of whether a
   *  point is on the drag element. If not defined, any contact (mouse down or touch start)
   *  on the drag element will initiate dragging.
   * The hit test function must have the following signature:
   *  dragHitTestFunc(pointerPt, currPt, type, isBackup) -> bool
   * Arguments:
   *  - pointerPt: the position of the pointer (mouse or touch) in the drag element's
   *      coordinate space (in other words, an offset from the element's origin),
   *  - currPt: the current position of the element,
   *  - type: either 'mouse' or 'touch',
   *  - isBackup: a bool; if true then the hit test is being performed for a 'backup'
   *      pointer position (specifically, the active touch has ended, but another backup
   *      touch is being tested for whether it should take over the active role); in this
   *      case the hit test code may elect to be more generous.
   * Returns: a bool that indicates if the position is a hit.
  */

  this.___DIM_hitTestFunc = undefined;

  this._getDragHitTestFunc = function() {
    return this.___DIM_hitTestFunc;
  };

  this._setDragHitTestFunc = function(func) {
    this.___DIM_hitTestFunc = func;
  };


  /*
   * _dragConstraintFunc
   *
   * The optional constraint function allows dragging to be constrained in customized
   *  ways (e.g. limiting dragging to a circle, line, or discrete positions). If it is
   *  not defined then dragging will be continuous and unbounded in both x and y dimensions.
   * The constraint function must have the following signature:
   *  dragConstraintFunc(proposedPt, pointerPt, currPt, startPt, type) -> newPt
   * Arguments:
   *  - proposedPt: the default new position for the element,
   *  - pointerPt: the position of the pointer (mouse or touch) in the element's space,
   *  - currPt: the current position of the element,
   *  - startPt: the position of the object when dragging began,
   *  - type: either 'mouse' or 'touch'.
   * Returns: a point or undefined. If the return value is a point then it will be
   *   used to assign the element's new position. If the return value is undefined then
   *   the element's position will not change, but dragging will remain active.
  */

  this.___DIM_constraintFunc = undefined;

  this._getDragConstraintFunc = function() {
    return this.___DIM_constraintFunc;
  };

  this._setDragConstraintFunc = function(func) {
    this.___DIM_constraintFunc = func;
  };


  /*
   * _draggingDidStartCallback
   *
   * This optional callback is made after dragging has started. It must have the
   *  following signature:
   *  draggingDidStartCallback(startPt, type) -> ignored
   * Arguments:
   *  - startPt: the initial position of the element,
   *  - type: 'mouse' or 'touch'.
   * Return value: ignored.
  */

  this.___DIM_draggingDidStartCallback = undefined;

  this._getDraggingDidStartCallback = function() {
    return this.___DIM_draggingDidStartCallback;
  };

  this._setDraggingDidStartCallback = function(callback) {
    this.___DIM_draggingDidStartCallback = callback;
  };


  /*
   * _draggingDidUpdateCallback
   *
   * This optional callback is made when the element's position has changed during
   *  dragging. It must have the following signature:
   *  draggingDidUpdateCallback(newPt, prevPt) -> ignored
   * Arguments:
   *  - newPt: the new position of the element,
   *  - prevPt: the previous position of the element.
   * Return value: ignored.
  */

  this.___DIM_draggingDidUpdateCallback = undefined;

  this._getDraggingDidUpdateCallback = function() {
    return this.___DIM_draggingDidUpdateCallback;
  };

  this._setDraggingDidUpdateCallback = function(callback) {
    this.___DIM_draggingDidUpdateCallback = callback;
  };
 

  /*
   * _draggingDidStopCallback
   * 
   * This optional callback is made when dragging has stopped.
   *  It must have the following signature:
   *  draggingDidStopCallback(wasCancelled) -> ignored
   * Arguments:
   *  - wasCancelled: boolean indicating whether dragging stopped because
   *    _cancelDragging() was called (true), or if it ended naturally due
   *    to the pointer being released (false).
   * Return value: ignored.
  */

  this.___DIM_draggingDidStopCallback = undefined;

  this._getDraggingDidStopCallback = function() {
    return this.___DIM_draggingDidStopCallback;
  };

  this._setDraggingDidStopCallback = function(callback) {
    this.___DIM_draggingDidStopCallback = callback;
  };


  /*
   * _isBeingDragged
   *
   * This read-only property indicates if the element is being dragged.
  */

  this._getIsBeingDragged = function() {
    return (this.___DIM_type === this.___DIM_TYPE_MOUSE
              || this.___DIM_type === this.___DIM_TYPE_TOUCH);
  };


  /*
   * _dragGetPosFunc
   *
   * If defined, the dragging code will use this method to get the position
   *  of the element (or item being dragged). If not defined, the drag element's
   *  left and top style properties are used.
   * If defined, this function must have the following signature:
   *  dragGetPosFunc() -> pt
   * where pt is an object with x and y properties giving the item's position.
  */

  this._getDragGetPosFunc = function() {
    return this.___DIM_getPosFunc;
  };

  this._setDragGetPosFunc = function(func) {
    this.___DIM_getPosFunc = func;
    if (this.___DIM_getPosFunc !== undefined) {
      this.___DIM_getPos = this.___DIM_getPosFunc;
    } else {
      this.___DIM_getPos = this.___DIM_getPosDefault;
    }
  };

  this.___DIM_getPosDefault = function() {
    return {
      x: parseFloat(this.___DIM_element.style.left),
      y: parseFloat(this.___DIM_element.style.top)
    };
  };

  this.___DIM_getPos = this.___DIM_getPosDefault;


  /*
   * _dragSetPosFunc
   *
   * If defined, the dragging code will use this method to set the position
   *  of the element (or item being dragged). It not defined, the drag element's
   *  left and top style properties are used.
   * If defined, this function must have the following signature:
   *  dragSetPosFunc(pt) -> ignored
   * where pt is an object with x and y properties giving the item's position.
  */

  this._getDragSetPosFunc = function() {
    return this.___DIM_setPosFunc;
  };

  this._setDragSetPosFunc = function(func) {
    this.___DIM_setPosFunc = func;
    if (this.___DIM_setPosFunc !== undefined) {
      this.___DIM_setPos = this.___DIM_setPosFunc;
    } else {
      this.___DIM_setPos = this.___DIM_setPosDefault;
    }
  }; 

  this.___DIM_setPosDefault = function(pt) {
    this.___DIM_element.style.left = pt.x + 'px';
    this.___DIM_element.style.top = pt.y + 'px';
  };

  this.___DIM_setPos = this.___DIM_setPosDefault;


  /*
   * _cancelDragging()
   *
   * This method immediately cancels any dragging. It is safe
   *  to call even when no dragging is taking place, and when dragging is
   *  disabled. The element stays where it was last positioned.
  */

  this._cancelDragging = function() {
    this.___DIM_stopDragging(true);
  };


  /*
   * _recalculateDragOffset()
   *
   * This method should be called if the position of the element is changed
   *  via non-dragging means during dragging (e.g. the element is animated
   *  to a 'snap' position).
   * It is safe to call this method even when not dragging.
  */

  this._recalculateDragOffset = function() {
    this.___DIM_offsetPt = this.___DIM_getOffsetPt(this.___DIM_clientPt);
  };


  /*
   * _addCompetingDragItem(item)
   * _removeCompetingDragItem(item)
   *
   * These methods allow multiple items to have large, invisible, and overlapping
   *  hit areas, and for dragging to start on the closest item, even if it is not the
   *  item that actually received the initial pointer event.
   * The 'competition' is one-way: when an initial pointer event occurs on a given item 
   *  the competing items added to that item will be tested, but not vice-versa unless
   *  the given item is added to those items as well. For example, if there are two
   *  items, A and B, you'll probably want to use this code:
   *   A._addCompetingDragItem(B);
   *   B._addCompetingDragItem(A);
  */

  this.___DIM_competingItems = [];

  this._addCompetingDragItem = function(item) {
    if (item.___DIM_getDragInitScore === undefined) {
      // The given item must have DraggableItemMixin applied to it.
      throw new Error('_addCompetingDragItem called with an invalid argument.');
    }
    if (this.___DIM_competingItems.indexOf(item) >= 0) {
      throw new Error('_addCompetingDragItem called for an item already in the array.');
    }
    this.___DIM_competingItems.push(item);
  };

  this._removeCompetingDragItem = function(item) {
    let index = this.___DIM_competingItems.indexOf(item);
    if (index < 0) {
      throw new Error('_removeCompetingDragItem called for an item not in the array.');
    }
    this.___DIM_competingItems.splice(index, 1);
  };


  /*
   * Internal: Misc. Methods
  */

  this.___DIM_getOffsetPt = function(clientPt) {
    // Given a point in client space, this method returns the corresponding
    //  point in the element's coordinate space.
    // TODO: consider, shouldn't this use getPos?
    let bb = this.___DIM_element.getBoundingClientRect();
    return {
      x: clientPt.x - bb.left,
      y: clientPt.y - bb.top
    };
  };


  /*
   * Internal: General Dragging Methods
  */

  this.___DIM_startDragging = function(clientPt, type) {
    // Calling code must already have determined that dragging may be started.
    //  Specifically, this means the following:
    //  - that isDraggable is true,
    //  - that the element is not already being dragged,
    //  - and that the hit test has been performed and passed, if defined.

    if (type === this.___DIM_TYPE_MOUSE) {
      this.___DIM_typeStr = 'mouse';
      document.addEventListener('mousemove', this.___DIM_onMouseMove);
      document.addEventListener('mouseup', this.___DIM_onMouseFinished);
      document.addEventListener('mouseleave', this.___DIM_onMouseFinished);   
    } else if (type === this.___DIM_TYPE_TOUCH) {
      this.___DIM_typeStr = 'touch';
      document.addEventListener('touchmove', this.___DIM_onTouchMove);
      document.addEventListener('touchend', this.___DIM_onTouchFinished);
      document.addEventListener('touchcancel', this.___DIM_onTouchFinished);
    } else {
      throw new Error('Invalid drag type.');
    }

    this.___DIM_type = type;

    // clientPt keeps track of the latest pointer position in client space. It will
    //  be used to recalculate the offset, if required.
    this.___DIM_clientPt = clientPt;

    // offsetPt is the (target) offset of the pointer from the element's origin during
    //  dragging. It stays fixed unless explicitly recalculated.
    this._recalculateDragOffset();

    // startPt is the position of the element when dragging began, and remains constant.
    this.___DIM_startPt = this.___DIM_getPos();

    if (this.___DIM_draggingDidStartCallback !== undefined) {
      this.___DIM_draggingDidStartCallback({x: startPt.x, y: startPt.y}, this.___DIM_typeStr);
    }
  };


  this.___DIM_updateDragging = function(clientPt) {

    this.___DIM_clientPt = clientPt;

    let pointerPt = this.___DIM_getOffsetPt(clientPt);

    let prevPt = this.___DIM_getPos();

    let newPt = {
      x: prevPt.x + pointerPt.x - this.___DIM_offsetPt.x,
      y: prevPt.y + pointerPt.y - this.___DIM_offsetPt.y
    };

    if (this.___DIM_constraintFunc !== undefined) {
      newPt = this.___DIM_constraintFunc(newPt, pointerPt,
        {x: prevPt.x, y: prevPt.y},
        {x: this.___DIM_startPt.x, y: this.___DIM_startPt.y},
        this.___DIM_typeStr);
    }

    if (newPt !== undefined) {
      this.___DIM_setPos(newPt);

      if (this.___DIM_draggingDidUpdateCallback !== undefined) {
        this.___DIM_draggingDidUpdateCallback(newPt, prevPt);
      }
    }
  };


  this.___DIM_stopDragging = function(wasCancelled) {
    // It is safe to call this method even when there is no active dragging.

    let didStop = false;

    if (this.___DIM_type === this.___DIM_TYPE_MOUSE) {
      didStop = true;
      document.removeEventListener('mousemove', this.___DIM_onMouseMove);
      document.removeEventListener('mouseup', this.___DIM_onMouseFinished);
      document.removeEventListener('mouseleave', this.___DIM_onMouseFinished);   
    } else if (this.___DIM_type === this.___DIM_TYPE_TOUCH) {
      didStop = true;
      document.removeEventListener('touchmove', this.___DIM_onTouchMove);
      document.removeEventListener('touchend', this.___DIM_onTouchFinished);
      document.removeEventListener('touchcancel', this.___DIM_onTouchFinished);
    }

    this.___DIM_type = this.___DIM_TYPE_NONE;

    if (didStop && this.___DIM_draggingDidStopCallback !== undefined) {
      this.___DIM_draggingDidStopCallback(wasCancelled);
    }
  };


  /*
   * Internal
  */

  this.___DIM_getTypeStrForType = function(type) {
    if (type === this.___DIM_TYPE_MOUSE) {
      return 'mouse';
    } else if (type === this.___DIM_TYPE_TOUCH) {
      return 'touch';
    } else {
      throw new Error('Invalid type.');
    }
  };

  this.___DIM_getDragInitScore = function(clientPt, type) {
    // Given a client point and pointer type, this method returns a 'score' to signify if dragging
    //  may initialize on the item, and if so, what priority should be given to this item among
    //  competing items. 'Initialize' means either starting dragging, or allowing the pointer (e.g. a touch)
    //  to be a backup for the item.
    // Specifically, this method returns either Number.POSITIVE_INFINITY or a finite number.
    // If POSITIVE_INFINITY is returned, dragging must not start on the item -- it is out of
    //  consideration.
    // If a finite number is returned, then it is the distance squared of the client point
    //  to the item's origin. In this case, dragging may start on the item, but priority
    //  should be given to any competing items with lower scores.

    if (!this.___DIM_isDraggable) {
      // The item must be draggable.
      return Number.POSITIVE_INFINITY;
    }

    if (type === this.___DIM_TYPE_MOUSE) {
      // Mouse dragging is exclusive, with no backups, so there must be no
      //  active dragging.
      if (this._getIsBeingDragged()) {
        return Number.POSITIVE_INFINITY;
      }
    } else if (type === this.__DIM_TYPE_TOUCH) {
      // Touch dragging allows backup touches, so if the item is currently
      //  being dragged by touch a score for a touch init will be given.
      if (this.___DIM_type !== this.___DIM_TYPE_TOUCH) {
        return Number.POSITIVE_INFINITY;
      }
    }

    let offsetPt = this.___DIM_getOffsetPt(clientPt);

    if (this.___DIM_hitTestFunc !== undefined) {
      let startPt = this.___DIM_getPos();
      let typeStr = this.___DIM_getTypeStrForType(type);
      let didHit = this.___DIM_hitTestFunc({x: offsetPt.x, y: offsetPt.y}, startPt, typeStr, false);
      if (!didHit) {
        return Number.POSITIVE_INFINITY;
      }
    }
    return offsetPt.x*offsetPt.x + offsetPt.y*offsetPt.y;
  };


  /*
   * Internal: Mouse Dragging Handlers
  */

  this.___DIM_onMouseDown = (function(e) {

    let clientPt = {x: e.clientX, y: e.clientY};

    let bestScore = this.___DIM_getDragInitScore(clientPt, this.___DIM_TYPE_MOUSE);
    let bestItem = this;

    for (let i = 0; i < this.___DIM_competingItems.length; ++i) {
      let item = this.___DIM_competingItems[i];
      let score = item.___DIM_getDragInitScore(clientPt, this.___DIM_TYPE_MOUSE);
      if (score < bestScore) {
        bestScore = score;
        bestItem = item;
      }
    }

    if (Number.isFinite(bestScore)) {
      bestItem.___DIM_startDragging(clientPt, this.___DIM_TYPE_MOUSE);
      e.preventDefault();
    }
  }).bind(this);


  this.___DIM_onMouseMove = (function(e) {
    this.___DIM_updateDragging({x: e.clientX, y: e.clientY});
    e.preventDefault();
  }).bind(this);


  this.___DIM_onMouseFinished = (function(e) {
    this.___DIM_stopDragging(false);
    e.preventDefault();
  }).bind(this);


  /*
   * Internal: Touch Dragging Handlers
  */

  this.___DIM_onTouchStart = (function(e) {
   
    // Multiple touches may start at the same time, and each one must be 
    //  individually tested to determine the best item for it to be
    //  assigned to amongst any competing items.

    // Each object in bins will have these properties:
    //  - item: a draggable item (unique to each object in the array),
    //  - touches: an array of new touches that best matched to the given item (will
    //    not be empty).
    // Each item in the bin.touches array will have these properties:
    //  - score: the new touch's score (lowest is best),
    //  - clientPt: the touch's client position,
    //  - id: the touch's identifier.
    // It is possible that bins will be empty after processing.
    let bins = [];

    for (let i = 0; i < e.changedTouches.length; ++i) {

      let touchObj = e.changedTouches[i];

      let clientPt = {x: touchObj.clientX, y: touchObj.clientY};

      let bestScore = this.___DIM_getDragInitScore(clientPt, this.___DIM_TYPE_TOUCH);
      let bestItem = this;

      for (let j = 0; j < this.___DIM_competingItems.length; ++j) {
        let item = this.___DIM_competingItems[j];
        let score = item.___DIM_getDragInitScore(clientPt, this.___DIM_TYPE_TOUCH);
        if (score < bestScore) {
          bestScore = score;
          bestItem = item;
        }
      } 

      if (!Number.isFinite(bestScore)) {
        continue;
      }

      let bin = bins.find((element) => element.item === bestItem);

      if (bin === undefined) {
        bin = {
          item: bestItem,
          touches: []
        };
        bins.push(bin);
      }

      bin.touches.push({
        score: bestScore,
        clientPt: clientPt,
        id: touchObj.identifier
      });
    }

    if (bins.length === 0) {
      return;
    }

    e.preventDefault();

    // Now for each item matched, start dragging and/or start tracking
    //  backup touches.
    for (let i = 0; i < bins.length; ++i) {
      let bestItem = bins[i].item;
      let touches = bins[i].touches;

      if (this._getIsBeingDragged()) {
        // If the item is already being dragged, then the new touches simply
        //  become backup touches.
        Array.prototype.push.apply(bestItem.___DIM_backupTouches, touches);
      } else {
        // The item is not being dragged, so start dragging with the best touch.
       
        // Remove the best touch (touches is guaranteed to be non-empty).
        let bestIndex = 0;
        let bestScore = touches[0].score;
        for (let j = 1; j < touches.length; ++j) {
          if (touches[j].score < bestScore) {
            bestScore = touches[j].score;
            bestIndex = j;
          }
        }
        let bestTouch = touches.splice(bestIndex, 1)[0];
       
        // The remaining touches (if any) will be backup touches.
        bestItem.___DIM_backupTouches = touches;

        // Start dragging.
        bestItem.___DIM_activeTouchID = bestTouch.id;
        bestItem.___DIM_startDragging(bestTouch.clientPt, this.___DIM_TYPE_TOUCH);
      }
    }
  }).bind(this);


  this.___DIM_onTouchMove = (function(e) {

    this.___DIM_updateAnyBackupTouches(e.changedTouches);
   
    // If the active touch has moved, then dragging needs to be updated.
    let touch = this.___DIM_findActiveTouch(e.changedTouches);
    if (touch !== undefined) {
      this.___DIM_updateDragging(touch.clientPt);
    }
  }).bind(this);


  this.___DIM_onTouchFinished = (function(e) {

    this.___DIM_stopTrackingAnyBackupTouches(e.changedTouches);

    let touch = this.___DIM_findActiveTouch(e.changedTouches);
    if (touch !== undefined) {
      // The currently active touch has ended, so select a backup touch,
      //  if possible.
      let backup = this.___DIM_selectBackupTouch();
      if (backup !== undefined) {
        // Recalculate offset for new active touch.
        this.___DIM_clientPt = backup.clientPt;
        this._recalculateDragOffset();
      } else {
        this.___DIM_stopDragging(false);
      }
    }
  }).bind(this);


  /*
   * Internal: Touch Helper Methods
  */

  this.___DIM_selectBackupTouch = function() {
    // This method removes and returns the best touch object from the backup touches array.
    //  This touch is also designated as the active touch (i.e. _activeTouchID is set).
    //  The best touch is the closest touch that passes the hit test (if defined). If no
    //  such touch is found then undefined is returned. 

    let currPt = this.___DIM_getPos();

    let bestD2 = Number.POSITIVE_INFINITY;
    let bestIndex = -1;

    for (let i = 0; i < this.___DIM_backupTouches.length; ++i) {

      let backup = this.___DIM_backupTouches[i];

      let offsetPt = this.___DIM_getOffsetPt(backup.clientPt);

      let d2 = offsetPt.x*offsetPt.x + offsetPt.y*offsetPt.y;

      if (d2 > bestD2) {
        // The touch is not closer to the origin than the best one found so far, so it is
        //  out of consideration.
        continue;
      }

      // Perform the hit test, if defined.
      if (this.___DIM_hitTestFunc !== undefined) {
        let didHit = this.___DIM_hitTestFunc({x: offsetPt.x, y: offsetPt.y}, {x: currPt.x, y: currPt.y}, 'touch', true);
        if (!didHit) {
          continue;
        }
      }

      // The touch is the best one found so far.
      bestD2 = d2;
      bestIndex = i;
    }

    if (bestIndex >= 0) {
      let touch = this.___DIM_backupTouches.splice(bestIndex, 1)[0];
      this.___DIM_activeTouchID = touch.id;
      return touch;
    } else {
      return undefined;
    }
  };


  this.___DIM_stopTrackingAnyBackupTouches = function(touchList) {
    // This method removes any of the given touches from the backup touches array.
    for (let i = this.___DIM_backupTouches.length - 1; i >= 0; --i) {
      let id = this.___DIM_backupTouches[i].id;
      for (let j = 0; j < touchList.length; ++j) {
        if (touchList[j].identifier === id) {
          this.___DIM_backupTouches.splice(i, 1);
          break;
        }
      }
    }
  };


  this.___DIM_updateAnyBackupTouches = function(touchList) {
    // This method updates any of the given touches that are in the backup touches array.
    for (let i = 0; i < touchList.length; ++i) {
      let touch = touchList[i];
      for (let j = 0; j < this.___DIM_backupTouches.length; ++j) {
        if (this.___DIM_backupTouches[j].id === touch.identifier) {
          let pt = this.___DIM_backupTouches[j].clientPt;
          pt.x = touch.clientX;
          pt.y = touch.clientY;
          break;
        }
      }
    }
  };


  this.___DIM_findActiveTouch = function(touchList) {
    // This method searches the given touchList and returns the active touch as an object
    //  with id and clientPt properties, if found. Otherwise, undefined is returned.
    for (let i = 0; i < touchList.length; ++i) {
      if (touchList[i].identifier === this.___DIM_activeTouchID) {
        return {
          id: this.___DIM_activeTouchID,
          clientPt: {x: touchList[i].clientX, y: touchList[i].clientY}
        };
      }
    }
    return undefined;
  };

};

