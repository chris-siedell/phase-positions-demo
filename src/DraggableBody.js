/*
 * DraggableBody.js
 * phase-positions-demo
 * astro.unl.edu
 * 14 December 2018
*/

import {DraggableItemMixin} from './mixins/DraggableItemMixin.js';


export class DraggableBody {

  constructor(parent) {

    this._parent = parent;

    this._rootElement = document.createElement('div');
    this._rootElement.style.position = 'absolute';

    this._mouseRadius = 10;
    this._touchRadius = 45;
    this._touchBackupRadius = this._touchRadius + 20;

    this._radius = this._mouseRadius; 
    this._dim = 4 + 2*this._radius;
    this._hitAreaDim = 2*this._touchRadius;

    this._canvas = document.createElement('canvas');
    this._canvas.style.position = 'absolute';
    this._canvas.style.left = (-0.5*this._dim) + 'px';
    this._canvas.style.top = (-0.5*this._dim) + 'px';
    this._canvas.width = this._dim;
    this._canvas.height = this._dim;
    this._rootElement.appendChild(this._canvas);

    this._hitArea = document.createElement('div');
    this._hitArea.style.position = 'absolute';
    this._hitArea.style.width = this._hitAreaDim + 'px';
    this._hitArea.style.height = this._hitAreaDim + 'px';
    this._hitArea.style.left = (-0.5*this._hitAreaDim) + 'px';
    this._hitArea.style.top = (-0.5*this._hitAreaDim) + 'px';
    this._rootElement.appendChild(this._hitArea);

    // Apply and set up dragging mixin code.
    DraggableItemMixin.apply(this);
    this._setDragElement(this._rootElement);
    this._setDragHitTestFunc(this._hitTestFunc);
    this._setDragConstraintFunc(this._dragConstraintFunc);
    this._setDragGetPosFunc(this.getPos);
  }


  _hitTestFunc(pointerPt, currPt, type, isBackup) {
    // This function is called by the DraggableElementMixin code to determine if
    //  a point is on the object (e.g. if dragging should start).
    // Arguments:
    //  - pointerPt: the position of the pointer (mouse or touch) in the drag element's
    //      coordinate space (in other words, an offset from the element's origin),
    //  - currPt: the current position of the element,
    //  - type: either 'mouse' or 'touch',
    //  - isBackup: a bool; if true then the hit test is being performed for a 'backup'
    //      pointer position (specifically, the active touch has ended, but another backup
    //      touch is being tested for whether it should take over the active role); in this
    //      case the hit test code may elect to be more generous.
    // Returns: a bool that determines if dragging will start.
    let r = Math.sqrt(pointerPt.x*pointerPt.x + pointerPt.y*pointerPt.y);
    if (type === 'mouse') {
      return r <= this._mouseRadius;
    } else if (type === 'touch') {
      if (isBackup) {
        return r <= this._touchBackupRadius;
      } else {
        return r <= this._touchRadius;
      }
    } else {
      console.error('Unrecognized drag type. Will ignore.');
      return false;
    }
  }

  _dragConstraintFunc(proposedPt, pointerPt, currPt, startPt, type) {
    // This function is called by the DraggableElementMixin code to constrain the body's
    //  position during dragging. It always returns undefined (thereby relieving the
    //  mixin from the responsibility of moving the body) since the parent (OrbitsView)
    //  will move the body.
    this._parent._setBodyPosition(this, proposedPt);
    return undefined;
  }

  getRadius() {
    return this._radius;
  }

  getElement() {
    return this._rootElement;
  }


  getOtherBody() {
    return this._otherBody;
  }

  setOtherBody(otherBody) {
    this._otherBody = otherBody;
    this._addCompetingDragItem(otherBody);
  }


  setColor(color) {
    this._r = color.r;
    this._g = color.g;
    this._b = color.b;
    //this._hitArea.style.backgroundColor = 'rgba(100, 100, 100, 0.2)';
    this._rgbStr = 'rgb(' + this._r + ', ' + this._g + ', ' + this._b + ')';
  }

  getRGBString() {
    return this._rgbStr;
  }


  getPos() {
    return {
      x: this._x,
      y: this._y
    };
  }

  setPos(pos) {
    this._x = pos.x;
    this._y = pos.y;
    this._rootElement.style.left = this._x + 'px';
    this._rootElement.style.top = this._y + 'px';
  }

  setStateAndPos(stateAndPos) {
    this.setState(stateAndPos);
    this.setPos(stateAndPos);
  }

  getIsMoon() {
    return this._isMoon;
  }

  getState() {
    return {
      isMoon: this._isMoon,
      angle: this._angle,
      distance: this._distance
    };
  }

  setState(state) {

    if (state === undefined) {
      this._isMoon = false;
      this._angle = 0.0;
      this._distance = 0.5;
      console.error('The body\'s state object is undefined.');
      return;
    }

    this._isMoon = Boolean(state.isMoon);

    if (Number.isFinite(state.angle)) {
      this._angle = state.angle;
    } else {
      this._angle = 0.0;
      console.error('The body\'s angle property must be a finite number.');
    }

    if (Number.isFinite(state.distance)) {
      if (state.distance < 0.0) {
        this._distance = 0.0;
        console.error('The body\'s distance property must be between in the range [0.0, 1.0].');
      } else if (state.distance > 1.0) {
        this._distance = 1.0;
        console.error('The body\'s distance property must be between in the range [0.0, 1.0].');
      } else {
        this._distance = state.distance;
      }
    } else {
      this._distance = 0.5;
      console.error('The body\'s distance property must be a finite number.');
    }
  }


  render() {
    this.redraw();
  }

  redraw() {

    let ctx = this._canvas.getContext('2d');

    ctx.clearRect(0, 0, this._dim, this._dim);

    let c = 0.5*this._dim;

    ctx.beginPath();
    ctx.ellipse(c, c, this._radius, this._radius, 0, 0, 2*Math.PI);
    ctx.fillStyle = this._rgbStr;
    ctx.fill();
  }

}

