/*
 * DragObject.js
 * PhasePositionsDemo
 * astro.unl.edu
 * 4 Decebmer 2018
*/


export class DragObject {

  constructor(parent) {

    this._parent = parent;

    this._rootElement = document.createElement('div');
    this._rootElement.style.position = 'absolute';

    this._radius = 10;
    this._dim = 4 + 2*this._radius;
    this._hitDim = 48;

    this._canvas = document.createElement('canvas');
    this._canvas.style.position = 'absolute';
    this._canvas.style.left = (-0.5*this._dim) + 'px';
    this._canvas.style.top = (-0.5*this._dim) + 'px';
    this._canvas.width = this._dim;
    this._canvas.height = this._dim;
    this._rootElement.appendChild(this._canvas);

    this._hitArea = document.createElement('div');
    this._hitArea.style.position = 'absolute';
    this._hitArea.style.width = this._hitDim + 'px';
    this._hitArea.style.height = this._hitDim + 'px';
    this._hitArea.style.left = (-0.5*this._hitDim) + 'px';
    this._hitArea.style.top = (-0.5*this._hitDim) + 'px';
    this._rootElement.appendChild(this._hitArea);

    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseFinished = this._onMouseFinished.bind(this);


    this._hitArea.addEventListener('mousedown', this._onMouseDown);
  
    // The allowed values for dragType:
    this._DRAG_TYPE_NONE = 0;
    this._DRAG_TYPE_MOUSE = 1;
    this._DRAG_TYPE_TOUCH = 2; 


    this._dragType = this._DRAG_TYPE_NONE;
  }


  getElement() {
    return this._rootElement;
  }


  setColor(color) {
    this._r = color.r;
    this._g = color.g;
    this._b = color.b;
    //this._hitArea.style.backgroundColor = 'rgba(100, 100, 100, 0.2)';
    this._rgbStr = 'rgb(' + this._r + ', ' + this._g + ', ' + this._b + ')';
    this.render();
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


  render() {

    let ctx = this._canvas.getContext('2d');

    ctx.clearRect(0, 0, this._dim, this._dim);

    let c = 0.5*this._dim;

    ctx.beginPath();
    ctx.ellipse(c, c, this._radius, this._radius, 0, 0, 2*Math.PI);
    ctx.fillStyle = this._rgbStr;
    ctx.fill();
  }


  _getOffset(e) {
    let bb = this._rootElement.getBoundingClientRect();
    return {
      x: e.clientX - bb.left,
      y: e.clientY - bb.top
    };
  }

  _onMouseDown(e) {

    let offset = this._getOffset(e);

    let d = Math.sqrt(offset.x*offset.x + offset.y*offset.y);

    if (d < this._radius) {
      let didStart = this._startDrag(offset, this._DRAG_TYPE_MOUSE);
      if (didStart) {
        e.preventDefault();
      }
    }
  }


  getIsBeingDragged() {
    return (this._dragType === this._DRAG_TYPE_MOUSE || this._dragType === this._DRAG_TYPE_TOUCH);
  }


  _startDrag(offset, dragType) {

    if (this.getIsBeingDragged()) {
      return false;
    }

    if (dragType === this._DRAG_TYPE_MOUSE) {
      document.addEventListener('mousemove', this._onMouseMove);
      document.addEventListener('mouseup', this._onMouseFinished);
      document.addEventListener('mouseleave', this._onMouseFinished);
    } else {
      throw new Error('Invalid drag type.');
    }

    this._dragType = dragType;
    this._dragOffset = offset;

    return true;
  }

  _updateDrag(delta) {

    let pos = {
      x: this._x + delta.x,
      y: this._y + delta.y
    };

    let wasRestricted = this._parent.setObjectPos(this, pos);

    if (wasRestricted) {
      console.log('was restricted');
    }

  }

  _stopDrag() {

    if (this._dragType === this._DRAG_TYPE_MOUSE) {
      document.removeEventListener('mousemove', this._onMouseMove);
      document.removeEventListener('mouseup', this._onMouseFinished);
      document.removeEventListener('mouseleave', this._onMouseFinished);
    }

    this._dragType = this._DRAG_TYPE_NONE;
  }

  _onMouseMove(e) {

    e.preventDefault();

    let newOffset = this._getOffset(e);

    let delta = {
      x: newOffset.x - this._dragOffset.x,
      y: newOffset.y - this._dragOffset.y
    };

    this._updateDrag(delta);

  }

  _onMouseFinished(e) {

    e.preventDefault();

    this._stopDrag();
  }

}

