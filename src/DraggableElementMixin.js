/*
 * DraggableElementMixin.js
 * astro.unl.edu
 * 9 December 2018
*/

// This mixin adds both mouse and touch draggability to an HTML element.

// Example usage:
//
//  constructor(rootElement) {
//    DraggableElementMixin.apply(this);
//    this._setDragElement(rootElement);
//  } 


export function DraggableElementMixin() {

  this.___DEM_TYPE_NONE = 0;
  this.___DEM_TYPE_MOUSE = 1;
  this.___DEM_TYPE_TOUCH = 2;

  this.___DEM_type = this.___DEM_TYPE_NONE;
 
  this.___DEM_isDraggable = true;
  this.___DEM_element = undefined;

  this.___DEM_hitTestFunc = undefined;
  this.___DEM_constraintFunc = undefined;

  this.___DEM_draggingDidStartCallback = undefined;
  this.___DEM_draggingDidUpdateCallback = undefined;
  this.___DEM_draggingDidStopCallback = undefined;


  /*
   * _isDraggable
  */

  this._getIsDraggable = function() {
    return this.___DEM_isDraggable;
  };

  this._setIsDraggable = function(bool) {
    this.___DEM_isDraggable = bool;
  };


  /*
   * _dragElement
  */

  this._getDragElement = function() {
    return this.___DEM_element;
  };

  this._setDragElement = function(element) {
    if (this.___DEM_element !== undefined) {
      this.___DEM_element.removeEventListener('mousedown', this.___DEM_onMouseDown);
      this.___DEM_element.removeEventListener('touchstart', this.___DEM_onTouchStart);
    }
    this.___DEM_element = element;
    if (this.___DEM_element !== undefined) {
      this.___DEM_element.addEventListener('mousedown', this.___DEM_onMouseDown);
      this.___DEM_element.addEventListener('touchstart', this.___DEM_onTouchStart);
    }
  };


  /*
   * _dragHitTestFunc
  */

  this._getDragHitTestFunc = function() {
    return this.___DEM_hitTestFunc;
  };

  this._setDragHitTestFunc = function(func) {
    // The hit test function, if defined, allows a more refined determination of when
    //  dragging should begin. If not defined, any contact (mouse down or touch start)
    //  on the drag element will initiate dragging.
    // The hit test function must have the following signature:
    //  dragHitTestFunc(pointerPt, currPt, type, isBackup) -> bool
    // Arguments:
    //  - pointerPt: the position of the pointer (mouse or touch) in the drag element's
    //      coordinate space (in other words, an offset from the element's origin),
    //  - currPt: the current position of the element,
    //  - type: either 'mouse' or 'touch',
    //  - isBackup: a bool; if true then the hit test is being performed for a 'backup'
    //      pointer position (specifically, the active touch has ended, but another backup
    //      touch is being tested for whether it should take over the active role); in this
    //      case the hit test code may elect to be more generous.
    // Returns: a bool that indicates if the position is a hit.
    this.___DEM_hitTestFunc = func;
  };


  /*
   * _dragConstraintFunc
  */

  this._getDragConstraintFunc = function() {
    return this.___DEM_constraintFunc;
  };

  this._setDragConstraintFunc = function(func) {
    // The optional constraint function allows dragging to be constrained in customized
    //  ways (e.g. limiting dragging to a circle, line, or discrete positions). If it is
    //  not defined then dragging will be continuous and unbounded in both x and y dimensions.
    // The constraint function must have the following signature:
    //  dragConstraintFunc(proposedPt, pointerPt, currPt, startPt, type) -> newPt
    // Arguments:
    //  - proposedPt: the default new position for the element,
    //  - pointerPt: the position of the pointer (mouse or touch) in the element's space,
    //  - currPt: the current position of the element,
    //  - startPt: the position of the object when dragging began,
    //  - type: either 'mouse' or 'touch'.
    // Returns: a point or undefined. If the return value is a point then it will be
    //   used to assign the element's new position. If the return value is undefined then
    //   the element's position will not change, but dragging will remain active.
    this.___DEM_constraintFunc = func;
  };

  /*
   * _draggingDidStartCallback
  */

  this._getDraggingDidStartCallback = function() {
    return this.___DEM_draggingDidStartCallback;
  };

  this._setDraggingDidStartCallback = function(callback) {
    // This optional callback is made after dragging has started. It must have the
    //  following signature:
    //  draggingDidStartCallback(startPt, type) -> ignored
    // Arguments:
    //  - startPt: the initial position of the element,
    //  - type: 'mouse' or 'touch'.
    // Return value: ignored.
    this.___DEM_draggingDidStartCallback;
  };


  /*
   * _draggingDidStartCallback
  */

  this._getDraggingDidStartCallback = function() {
    return this.___DEM_draggingDidStartCallback;
  };

  this._setDraggingDidStartCallback = function(callback) {
    // This optional callback is made after dragging has started. It must have the
    //  following signature:
    //  draggingDidStartCallback(startPt, type) -> ignored
    // Arguments:
    //  - startPt: the initial position of the element,
    //  - type: 'mouse' or 'touch'.
    // Return value: ignored.
    this.___DEM_draggingDidStartCallback;
  };

  
  /*
   * _draggingDidUpdateCallback
  */

  this._getDraggingDidUpdateCallback = function() {
    return this.___DEM_draggingDidUpdateCallback;
  };

  this._setDraggingDidUpdateCallback = function(callback) {
    // This optional callback is made when the element's position has changed during
    //  dragging. It must have the following signature:
    //  draggingDidUpdateCallback(newPt, prevPt) -> ignored
    // Arguments:
    //  - newPt: the new position of the element,
    //  - prevPt: the previous position of the element.
    // Return value: ignored.
    this.___DEM_draggingDidUpdateCallback;
  };
 

  /*
   * _draggingDidStopCallback
  */

  this._getDraggingDidStopCallback = function() {
    return this.___DEM_draggingDidStopCallback;
  };

  this._setDraggingDidStopCallback = function(callback) {
    // This optional callback is made when dragging has stopped.
    //  It must have the following signature:
    //  draggingDidStopCallback(wasCancelled) -> ignored
    // Arguments:
    //  - wasCancelled: boolean indicating whether dragging stopped because
    //    _cancelDragging() was called (true), or if it ended naturally due
    //    to the pointer being released (false).
    // Return value: ignored.
    this.___DEM_draggingDidStopCallback;
  };


  /*
   * _isBeingDragged
  */

  this._getIsBeingDragged = function() {
    return (this.___DEM_type === this.___DEM_TYPE_MOUSE
              || this.___DEM_type === this.___DEM_TYPE_TOUCH);
  };

  this._cancelDragging = function() {
    // It is safe to call this method at all times (even when not dragging,
    //  and when dragging is not enabled).
    this.___DEM_stopDragging(true);
  };


  /*
   * Element Positioning Methods
  */

  this._getDragGetPosFunc = function() {
    return this.___DEM_getPosFunc;
  };

  this._setDragGetPosFunc = function(func) {
    // If defined, this function must have the following signature:
    //  dragGetPosFunc() -> pt
    // Where pt is a point giving the object's position.
    // If getPosFunc is undefined, then the drag element's left and top
    //  style properties are used.
    this.___DEM_getPosFunc = func;
    if (this.___DEM_getPosFunc !== undefined) {
      this.___DEM_getPos = this.___DEM_getPosFunc;
    } else {
      this.___DEM_getPos = this.___DEM_getPosDefault;
    }
  };

  this.___DEM_getPosDefault = function() {
    return {
      x: parseFloat(this.___DEM_element.style.left),
      y: parseFloat(this.___DEM_element.style.top)
    };
  };

  this.___DEM_getPos = this.___DEM_getPosDefault;


  this._getDragSetPosFunc = function() {
    return this.___DEM_setPosFunc;
  };

  this._setDragSetPosFunc = function(func) {
    // If defined, this function must have the following signature:
    //  dragSetPosFunc(pt) -> ignored
    // Where pt is a point giving the object's position.
    // If setPosFunc is undefined, then the drag element's left and top
    //  style properties are used.
    this.___DEM_setPosFunc = func;
    if (this.___DEM_setPosFunc !== undefined) {
      this.___DEM_setPos = this.___DEM_setPosFunc;
    } else {
      this.___DEM_setPos = this.___DEM_setPosDefault;
    }
  }; 

  this.___DEM_setPosDefault = function(pt) {
    this.___DEM_element.style.left = pt.x + 'px';
    this.___DEM_element.style.top = pt.y + 'px';
  };

  this.___DEM_setPos = this.___DEM_setPosDefault;


  /*
   * _recalculateDragOffset
  */

  this._recalculateDragOffset = function() {
    // This method should be called if the position of the element is changed
    //  via non-dragging means during dragging (e.g. the element is animating
    //  to a 'snap' position).
    // It is safe to call this method even when not dragging.
    this.___DEM_offsetPt = this.___DEM_getOffsetPt(this.___DEM_clientPt);
  };


  /*
   * Misc. Internal Methods
  */

  this.___DEM_getOffsetPt = function(clientPt) {
    // Given a point in client space, this method returns the corresponding
    //  point in the element's coordinate space.
    let bb = this.___DEM_element.getBoundingClientRect();
    return {
      x: clientPt.x - bb.left,
      y: clientPt.y - bb.top
    };
  };




  /*
   * General Internal Dragging Methods
  */

  this.___DEM_startDragging = function(clientPt, type) {
    // Calling code must already have determined that dragging may be started.
    //  Specifically, this means the following:
    //  - that isDraggable is true,
    //  - that the element is not already being dragged,
    //  - and that the hit test has been performed and passed, if defined.

    if (type === this.___DEM_TYPE_MOUSE) {
      this.___DEM_typeStr = 'mouse';
      document.addEventListener('mousemove', this.___DEM_onMouseMove);
      document.addEventListener('mouseup', this.___DEM_onMouseFinished);
      document.addEventListener('mouseleave', this.___DEM_onMouseFinished);   
    } else if (type === this.___DEM_TYPE_TOUCH) {
      this.___DEM_typeStr = 'touch';
      document.addEventListener('touchmove', this.___DEM_onTouchMove);
      document.addEventListener('touchend', this.___DEM_onTouchFinished);
      document.addEventListener('touchcancel', this.___DEM_onTouchFinished);
    } else {
      throw new Error('Invalid drag type.');
    }

    this.___DEM_type = type;

    // clientPt keeps track of the latest pointer position in client space. It will
    //  be used to recalculate the offset, if required.
    this.___DEM_clientPt = clientPt;

    // offsetPt is the (target) offset of the pointer from the element's origin during
    //  dragging. It stays fixed unless explicitly recalculated.
    this._recalculateDragOffset();

    // startPt is the position of the element when dragging began, and remains constant.
    this.___DEM_startPt = this.___DEM_getPos();

    if (this.___DEM_draggingDidStartCallback !== undefined) {
      this.___DEM_draggingDidStartCallback({x: startPt.x, y: startPt.y}, this.___DEM_typeStr);
    }
  };


  this.___DEM_updateDragging = function(clientPt) {

    this.___DEM_clientPt = clientPt;

    let pointerPt = this.___DEM_getOffsetPt(clientPt);

    let prevPt = this.___DEM_getPos();

    let newPt = {
      x: prevPt.x + pointerPt.x - this.___DEM_offsetPt.x,
      y: prevPt.y + pointerPt.y - this.___DEM_offsetPt.y
    };

    if (this.___DEM_constraintFunc !== undefined) {
      newPt = this.___DEM_constraintFunc(newPt, pointerPt,
        {x: prevPt.x, y: prevPt.y},
        {x: this.___DEM_startPt.x, y: this.___DEM_startPt.y},
        this.___DEM_typeStr);
    }

    if (newPt !== undefined) {
      this.___DEM_setPos(newPt);

      if (this.___DEM_draggingDidUpdateCallback !== undefined) {
        this.___DEM_draggingDidUpdateCallback(newPt, prevPt);
      }
    }
  };


  this.___DEM_stopDragging = function(wasCancelled) {
    // It is safe to call this method even when there is no active dragging.

    let didStop = false;

    if (this.___DEM_type === this.___DEM_TYPE_MOUSE) {
      didStop = true;
      document.removeEventListener('mousemove', this.___DEM_onMouseMove);
      document.removeEventListener('mouseup', this.___DEM_onMouseFinished);
      document.removeEventListener('mouseleave', this.___DEM_onMouseFinished);   
    } else if (this.___DEM_type === this.___DEM_TYPE_TOUCH) {
      didStop = true;
      document.removeEventListener('touchmove', this.___DEM_onTouchMove);
      document.removeEventListener('touchend', this.___DEM_onTouchFinished);
      document.removeEventListener('touchcancel', this.___DEM_onTouchFinished);
    }

    this.___DEM_type = this.___DEM_TYPE_NONE;

    if (didStop && this.___DEM_draggingDidStopCallback !== undefined) {
      this.___DEM_draggingDidStopCallback(wasCancelled);
    }
  };


  /*
   * Mouse Dragging Handlers
  */

  this.___DEM_onMouseDown = (function(e) {
    e.preventDefault();
    if (!this.___DEM_isDraggable) {
      return;
    }
    if (this._getIsBeingDragged()) {
      return;
    }
    let clientPt = {x: e.clientX, y: e.clientY};
    let offsetPt = this.___DEM_getOffsetPt(clientPt);
    let startPt = this.___DEM_getPos();
    if (this.___DEM_hitTestFunc !== undefined) {
      let didHit = this.___DEM_hitTestFunc({x: offsetPt.x, y: offsetPt.y}, {x: startPt.x, y: startPt.y}, 'mouse', false);
      if (!didHit) {
        return;
      }
    }
    this.___DEM_startDragging(clientPt, this.___DEM_TYPE_MOUSE);
  }).bind(this);


  this.___DEM_onMouseMove = (function(e) {
    e.preventDefault();
    this.___DEM_updateDragging({x: e.clientX, y: e.clientY});
  }).bind(this);


  this.___DEM_onMouseFinished = (function(e) {
    e.preventDefault();
    this.___DEM_stopDragging(false);
  }).bind(this);


  /*
   * Touch Dragging Handlers
  */

  this.___DEM_onTouchStart = (function(e) {
    e.preventDefault();
    
    if (!this.___DEM_isDraggable) {
      return;
    }

    if (this.___DEM_type === this.___DEM_TYPE_TOUCH) {
      // The element is already being dragged by touch, so start tracking all
      //  new touches as backup touches and return.
      this.___DEM_startTrackingBackupTouches(e.changedTouches);
      return;
    } else if (this._getIsBeingDragged()) {
      // The element is already being dragged by some other means (e.g. mouse), so
      //  ignore the touches.
      return;
    }

    // The element is not being dragged. Start by resetting the backup touches array
    //  and making all new touches backup touches.
    // The backupTouches array will consist of objects with these properties:
    //  - id, equivalent to the Touch object's identifier property,
    //  - clientPt, the latest client position of the corresponding Touch object.
    // The startTracking* method performs hit testing, if required.
    this.___DEM_backupTouches = [];
    this.___DEM_startTrackingBackupTouches(e.changedTouches);

    // Select the closest touch from the backups.
    let touch = this.___DEM_selectBackupTouch();
    if (touch === undefined) {
      // This may happen if none of the new touches passes the hit test.
      return;
    }
    this.___DEM_startDragging(touch.clientPt, this.___DEM_TYPE_TOUCH);
  }).bind(this);


  this.___DEM_onTouchMove = (function(e) {
    e.preventDefault();

    this.___DEM_updateAnyBackupTouches(e.changedTouches);
   
    // If the active touch has moved, then dragging needs to be updated.
    let touch = this.___DEM_findActiveTouch(e.changedTouches);
    if (touch !== undefined) {
      this.___DEM_updateDragging(touch.clientPt);
    }
  }).bind(this);


  this.___DEM_onTouchFinished = (function(e) {
    e.preventDefault();

    this.___DEM_stopTrackingAnyBackupTouches(e.changedTouches);

    let touch = this.___DEM_findActiveTouch(e.changedTouches);
    if (touch !== undefined) {
      // The currently active touch has ended, so select a backup touch,
      //  if possible.
      let backup = this.___DEM_selectBackupTouch();
      if (backup !== undefined) {
        // Recalculate offset for new active touch.
        this.___DEM_clientPt = backup.clientPt;
        this._recalculateDragOffset();
      } else {
        this.___DEM_stopDragging(false);
      }
    }
  }).bind(this);


  /*
   * Touch Helper Methods
  */

  this.___DEM_selectBackupTouch = function() {
    // This method removes and returns the best touch object from the backup touches array.
    //  This touch is also designated as the active touch (i.e. _activeTouchID is set).
    //  The best touch is the closest touch that passes the hit test (if defined). If no
    //  such touch is found then undefined is returned. 

    let currPt = this.___DEM_getPos();

    let bestD2 = Number.POSITIVE_INFINITY;
    let bestIndex = -1;

    for (let i = 0; i < this.___DEM_backupTouches.length; ++i) {

      let backup = this.___DEM_backupTouches[i];

      let offsetPt = this.___DEM_getOffsetPt(backup.clientPt);

      let d2 = offsetPt.x*offsetPt.x + offsetPt.y*offsetPt.y;

      if (d2 > bestD2) {
        // The touch is not closer to the origin than the best one found so far, so it is
        //  out of consideration.
        continue;
      }

      // Perform the hit test, if defined.
      if (this.___DEM_hitTestFunc !== undefined) {
        let didHit = this.___DEM_hitTestFunc({x: offsetPt.x, y: offsetPt.y}, {x: currPt.x, y: currPt.y}, 'touch', true);
        if (!didHit) {
          continue;
        }
      }

      // The touch is the best one found so far.
      bestD2 = d2;
      bestIndex = i;
    }

    if (bestIndex >= 0) {
      let touch = this.___DEM_backupTouches.splice(bestIndex, 1)[0];
      this.___DEM_activeTouchID = touch.id;
      return touch;
    } else {
      return undefined;
    }
  };

  this.___DEM_startTrackingBackupTouches = function(touchList) {
    // This method starts tracking all of the given Touch objects as backup touches, assuming
    //  they pass they hit test (if defined).

    let currPt = this.___DEM_getPos();

    for (let i = 0; i < touchList.length; ++i) {

      let touch = touchList[i];

      let clientPt = {x: touch.clientX, y: touch.clientY};

      if (this.___DEM_hitTestFunc !== undefined) {
        let offsetPt = this.___DEM_getOffsetPt(clientPt);
        let didHit = this.___DEM_hitTestFunc(offsetPt, {x: currPt.x, y: currPt.y}, 'touch', false);
        if (didHit) {
          this.___DEM_backupTouches.push({id: touch.identifier, clientPt: clientPt});
        }
      } else {
        this.___DEM_backupTouches.push({id: touch.identifier, clientPt: clientPt});
      }
    }
  };


  this.___DEM_stopTrackingAnyBackupTouches = function(touchList) {
    // This method removes any of the given touches from the backup touches array.
    for (let i = this.___DEM_backupTouches.length - 1; i >= 0; --i) {
      let id = this.___DEM_backupTouches[i].id;
      for (let j = 0; j < touchList.length; ++j) {
        if (touchList[j].identifier === id) {
          this.___DEM_backupTouches.splice(i, 1);
          break;
        }
      }
    }
  };


  this.___DEM_updateAnyBackupTouches = function(touchList) {
    // This method updates any of the given touches that are in the backup touches array.
    for (let i = 0; i < touchList.length; ++i) {
      let touch = touchList[i];
      for (let j = 0; j < this.___DEM_backupTouches.length; ++j) {
        if (this.___DEM_backupTouches[j].id === touch.identifier) {
          let pt = this.___DEM_backupTouches[j].clientPt;
          pt.x = touch.clientX;
          pt.y = touch.clientY;
          break;
        }
      }
    }
  };


  this.___DEM_findActiveTouch = function(touchList) {
    // This method searches the given touchList and returns the active touch as an object
    //  with id and clientPt properties, if found. Otherwise, undefined is returned.
    for (let i = 0; i < touchList.length; ++i) {
      if (touchList[i].identifier === this.___DEM_activeTouchID) {
        return {
          id: this.___DEM_activeTouchID,
          clientPt: {x: touchList[i].clientX, y: touchList[i].clientY}
        };
      }
    }
    return undefined;
  };

};

