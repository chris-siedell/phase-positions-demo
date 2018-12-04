/*
 * OrbitsView.js
 * PhasePositionsDemo
 * astro.unl.edu
 * 4 December 2018
*/

import {DragObject} from './DragObject.js';


export class OrbitsView {


  constructor(parent) {

    this._parent = parent;

    this._rootElement = document.createElement('div');
    this._rootElement.style.position = 'relative';

    this._canvas = document.createElement('canvas');
    this._rootElement.appendChild(this._canvas);


    this._obj1 = new DragObject(this);
    this._rootElement.appendChild(this._obj1.getElement());
    this._obj1.__isMoon = false;

    this._obj2 = new DragObject(this);
    this._rootElement.appendChild(this._obj2.getElement());
    this._obj2.__isMoon = false;
  }

  
  getElement() {
    return this._rootElement;
  }

  setColor1(color) {
    this._obj1.setColor(color);
  }

  setColor2(color) {
    this._obj2.setColor(color);
  }

  setWidthAndHeight(width, height) {

    this._width = width;
    this._height = height;

    this._moonDistance = 60;
    this._moonCaptureDistance = 75;
    this._moonEscapeDistance = 125;

    this._minSunDistance = 60;
    this._maxSunDistance = 0.5*Math.min(this._width, this._height) - this._minSunDistance;

    this._rootElement.style.width = this._width + 'px';
    this._rootElement.style.height = this._height + 'px';

    this._canvas.width = this._width;
    this._canvas.height = this._height;
    
    this._sun = {x: 0.5*this._width, y: 0.5*this._height};
    this._obj1.setPos({x: 320, y: 320});
    this._obj2.setPos({x: 400, y: 200});
  }

  calcDistance(posA, posB) {
    let x = posA.x - posB.x;
    let y = posA.y - posB.y;
    return Math.sqrt(x*x + y*y);
  }

  getLegalPos(pos) {
    let x = pos.x - this._sun.x;
    let y = pos.y - this._sun.y;
    let r = Math.sqrt(x*x + y*y);
    if (r < this._minSunDistance) {
      let theta = Math.atan2(y, x);
      return {
        x: this._sun.x + this._minSunDistance*Math.cos(theta),
        y: this._sun.y + this._minSunDistance*Math.sin(theta)
      };
    } else if (r > this._maxSunDistance) {
      let theta = Math.atan2(y, x);
      return {
        x: this._sun.x + this._maxSunDistance*Math.cos(theta),
        y: this._sun.y + this._maxSunDistance*Math.sin(theta)
      };
    } else {
      return {
        x: pos.x,
        y: pos.y
      };
    }
  }

  
  setObjectPos(obj, pos) {

    let otherObj = (obj === this._obj1) ? this._obj2 : this._obj1;

    pos = this.getLegalPos(pos);
    let otherPos = otherObj.getPos();

    if (!otherObj.__isMoon && !obj.__isMoon) {
      // obj: is planet
      // otherObj: stays planet

      let d = this.calcDistance(pos, otherPos);

      if (d < this._moonCaptureDistance) {
        // obj: planet -> moon
        let x = pos.x - otherPos.x;
        let y = pos.y - otherPos.y;
        let theta = Math.atan2(y, x);
        obj.setPos({
          x: otherPos.x + this._moonDistance*Math.cos(theta),
          y: otherPos.y + this._moonDistance*Math.sin(theta)
        });
        obj.__isMoon = true;
      } else {
        // obj: stays planet
        obj.setPos(pos);
      }
    } else if (obj.__isMoon) {
      // obj: is moon
      // otherObj: stays planet

      let d = this.calcDistance(pos, otherPos);

      if (d > this._moonEscapeDistance) {
        // obj: moon -> planet
        obj.setPos(pos);
        obj.__isMoon = false;
      } else {
        // obj: stays moon
        let x = pos.x - otherPos.x;
        let y = pos.y - otherPos.y;
        let theta = Math.atan2(y, x);
        obj.setPos({
          x: otherPos.x + this._moonDistance*Math.cos(theta),
          y: otherPos.y + this._moonDistance*Math.sin(theta)
        });
      }

    } else {
      // obj: stays planet
      // otherObj: stays moon

      obj.setPos(pos);

      let x = otherPos.x - pos.x;
      let y = otherPos.y - pos.y;
      let theta = Math.atan2(y, x);
      let moonPos = {
        x: pos.x + this._moonDistance*Math.cos(theta), 
        y: pos.y + this._moonDistance*Math.sin(theta)
      };

      x = moonPos.x - this._sun.x;
      y = moonPos.y - this._sun.y;
      let r = Math.sqrt(x*x + y*y);

      if (r < this._minSunDistance) {
        console.warn('Min sun distance constraint not applied to trailing moon.');
      } else if (r > this._maxSunDistance) {
        console.warn('Max sun distance constraint not applied to trailing moon.');
      }

      otherObj.setPos(moonPos);
    }

    this.render();

    this._parent.updatePhaseDiscs();
  }


  calcPhaseAngleOfObj1FromObj2() {
    return this._calcPhaseAngle(this._obj2.getPos(), this._obj1.getPos(), this._sun);
  }

  calcPhaseAngleOfObj2FromObj1() {
    return this._calcPhaseAngle(this._obj1.getPos(), this._obj2.getPos(), this._sun);
  }

  _calcPhaseAngle(viewerPos, objectPos, sunPos) {
    let sx = sunPos.x - objectPos.x;
    let sy = sunPos.y - objectPos.y;
    let vx = viewerPos.x - objectPos.x;
    let vy = viewerPos.y - objectPos.y;
    return Math.atan2(vx*sy - sx*vy, vx*sx + vy*sy);
  }


  render() {

    let ctx = this._canvas.getContext('2d');

    ctx.clearRect(0, 0, this._width, this._height);

    if (this._obj1.__isMoon) {

      let pos2 = this._obj2.getPos();

      let r1 = this.calcDistance(this._obj1.getPos(), pos2);
      let r2 = this.calcDistance(pos2, this._sun);

      ctx.beginPath();
      ctx.ellipse(pos2.x, pos2.y, r1, r1, 0, 0, 2*Math.PI);
      ctx.strokeStyle = this._obj1.getRGBString();
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(this._sun.x, this._sun.y, r2, r2, 0, 0, 2*Math.PI);
      ctx.strokeStyle = this._obj2.getRGBString();
      ctx.stroke();

    } else if (this._obj2.__isMoon) {

      let pos1 = this._obj1.getPos();

      let r1 = this.calcDistance(pos1, this._sun);
      let r2 = this.calcDistance(this._obj2.getPos(), pos1);

      ctx.beginPath();
      ctx.ellipse(this._sun.x, this._sun.y, r1, r1, 0, 0, 2*Math.PI);
      ctx.strokeStyle = this._obj1.getRGBString();
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(pos1.x, pos1.y, r2, r2, 0, 0, 2*Math.PI);
      ctx.strokeStyle = this._obj2.getRGBString();
      ctx.stroke();

    } else {

      let r1 = this.calcDistance(this._obj1.getPos(), this._sun);
      let r2 = this.calcDistance(this._obj2.getPos(), this._sun);

      ctx.beginPath();
      ctx.ellipse(this._sun.x, this._sun.y, r1, r1, 0, 0, 2*Math.PI);
      ctx.strokeStyle = this._obj1.getRGBString();
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(this._sun.x, this._sun.y, r2, r2, 0, 0, 2*Math.PI);
      ctx.strokeStyle = this._obj2.getRGBString();
      ctx.stroke();
    }
    
    let sunRadius = 12;
    ctx.beginPath();
    ctx.ellipse(this._sun.x, this._sun.y, sunRadius, sunRadius, 0, 0, 2*Math.PI);
    ctx.fillStyle = 'rgb(249, 225, 156)';
    ctx.fill();
  }


  _calcPos(clientPos) {
    let bb = this._rootElement.getBoundingClientRect();
    return {
      x: clientPos.x - bb.left,
      y: clientPos.y - bb.top,
    };
  }

  _onMouseDown(e) {
    e.preventDefault();
    let pos = this._calcPos({x: e.clientX, y: e.clientY});
    console.log(pos);
  }

  _onTouchStart(e) {



  }

  _startDrag() {


  }


}


