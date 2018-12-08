/*
 * DraggableElementMixin.js
 * astro.unl.edu
 * 7 December 2018
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
    //  dragHitTestFunc(pointerPt, currPt, type) -> bool
    // Arguments:
    //  - pointerPt: the position of the pointer (mouse or touch) in the drag element's
    //      coordinate space (in other words, an offset from the element's origin),
    //  - currPt: the current position of the element,
    //  - type: either 'mouse' or 'touch'.
    // Returns: a bool that determines if dragging will start.
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
   * TODO: allow recalculations of pointer offset during active dragging
   *       (e.g. to allow the element to animate to a position)
  */


  /*
   * Misc. Internal Methods
  */

  this.___DEM_getPointerPt = function(clientPt) {
    let bb = this.___DEM_element.getBoundingClientRect();
    return {
      x: clientPt.x - bb.left,
      y: clientPt.y - bb.top
    };
  };


  /*
   * Drag Initiation Handlers
  */

  this.___DEM_onMouseDown = (function(e) {
    e.preventDefault();
    if (!this.___DEM_isDraggable) {
      return;
    }
    if (this._getIsBeingDragged()) {
      return;
    }
    let offsetPt = this.___DEM_getPointerPt({x: e.clientX, y: e.clientY});
    let startPt = this.___DEM_getPos();
    if (this.___DEM_hitTestFunc !== undefined) {
      let didHit = this.___DEM_hitTestFunc({x: offsetPt.x, y: offsetPt.y}, {x: startPt.x, y: startPt.y}, 'mouse');
      if (!didHit) {
        return;
      }
    }
    this.___DEM_startDragging(offsetPt, startPt, this.___DEM_TYPE_MOUSE);
  }).bind(this);


  this.___DEM_onTouchStart = (function(e) {
    e.preventDefault();

  }).bind(this);


  /*
   * General Dragging Methods
  */

  this.___DEM_startDragging = function(offsetPt, startPt, type) {

    if (type === this.___DEM_TYPE_MOUSE) {
      this.___DEM_typeStr = 'mouse';
      document.addEventListener('mousemove', this.___DEM_onMouseMove);
      document.addEventListener('mouseup', this.___DEM_onMouseFinished);
      document.addEventListener('mouseleave', this.___DEM_onMouseFinished);   
    } else if (type === this.___DEM_TYPE_TOUCH) {
      this.___DEM_typeStr = 'touch';


    } else {
      throw new Error('Invalid drag type.');
    }

    this.___DEM_type = type;
    this.___DEM_offsetPt = offsetPt;
    this.___DEM_startPt = startPt;

    if (this.___DEM_draggingDidStartCallback !== undefined) {
      this.___DEM_draggingDidStartCallback(startPt, this.___DEM_typeStr);
    }
  };


  this.___DEM_updateDragging = function(pointerPt) {

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

    }

    this.___DEM_type = this.___DEM_TYPE_NONE;

    if (didStop && this.___DEM_draggingDidStopCallback !== undefined) {
      this.___DEM_draggingDidStopCallback(wasCancelled);
    }
  };


  /*
   * Mouse Dragging Handlers
  */

  this.___DEM_onMouseMove = (function(e) {
    e.preventDefault();
    let pointerPt = this.___DEM_getPointerPt({x: e.clientX, y: e.clientY});
    this.___DEM_updateDragging(pointerPt);
  }).bind(this);

  this.___DEM_onMouseFinished = (function(e) {
    e.preventDefault();
    this.___DEM_stopDragging(false);
  }).bind(this);


  /*
   * Touch Dragging Handlers
  */



};

