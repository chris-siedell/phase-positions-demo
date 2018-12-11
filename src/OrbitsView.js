/*
 * OrbitsView.js
 * phase-positions-demo
 * astro.unl.edu
 * 11 December 2018
*/

import {DraggableBody} from './DraggableBody.js';


export class OrbitsView {

  // This component allows two bodies to be dragged around a central Sun.
  // When sufficiently separated, the two bodies are treated as planets in
  //  circular orbits around the Sun. If one body is dragged close to the other
  //  one, it snaps into orbit as a moon around the other body. It remains a moon
  //  unless it is dragged far enough away from the other body.
  // As a planet, a body is constrained to a range of distances from the Sun.
  // As a moon, a body is constrained to an orbit of a fixed radius from the other body.


  constructor(parent) {

    this._parent = parent;

    this._rootElement = document.createElement('div');
    this._rootElement.style.position = 'relative';

    this._canvas = document.createElement('canvas');
    this._rootElement.appendChild(this._canvas);

    this._body1 = new DraggableBody(this);
    this._rootElement.appendChild(this._body1.getElement());
    this._body1.__isMoon = false;

    this._body2 = new DraggableBody(this);
    this._rootElement.appendChild(this._body2.getElement());
    this._body2.__isMoon = false;

    this._body1._addCompetingDragItem(this._body2);
    this._body2._addCompetingDragItem(this._body1);
  }

  
  getElement() {
    return this._rootElement;
  }


  setColor1(color) {
    this._body1.setColor(color);
  }


  setColor2(color) {
    this._body2.setColor(color);
  }


  setWidthAndHeight(width, height) {

    this._width = width;
    this._height = height;

    this._moonDistance = 45;
    this._moonCaptureDistance = 50;
    this._moonEscapeDistance = 60;

    let margin = this._moonDistance + 10;
    this._minSunDistance = margin;
    this._maxSunDistance = 0.5*Math.min(this._width, this._height) - margin;

    this._rootElement.style.width = this._width + 'px';
    this._rootElement.style.height = this._height + 'px';

    this._canvas.width = this._width;
    this._canvas.height = this._height;
    
    this._sun = {x: 0.5*this._width, y: 0.5*this._height};
    this._body1.setPos({x: this._sun.x - this._maxSunDistance, y: this._sun.y});
    this._body2.setPos({x: this._sun.x, y: this._sun.y + this._minSunDistance});
  }


  calcDistance(posA, posB) {
    let x = posA.x - posB.x;
    let y = posA.y - posB.y;
    return Math.sqrt(x*x + y*y);
  }


  calcPlanetGeometry(origPos) {
    // Given an unconstrained position of a planet (e.g. from the dragging code), this method
    //  calculates the closest position that is within the allowed Sun distance range.
    // The returned object has these properties:
    //  - x, y: the constrained planet position,
    //  - isWithinBounds: boolean indicating if the unconstrained position is within the
    //      allowed Sun distance range.
    let x_s = origPos.x - this._sun.x;
    let y_s = origPos.y - this._sun.y;
    let d = Math.sqrt(x_s*x_s + y_s*y_s);
    let theta = Math.atan2(y_s, x_s);
    if (d < this._minSunDistance) {
      d = this._minSunDistance;
      return {
        x: this._sun.x + d*Math.cos(theta),
        y: this._sun.y + d*Math.sin(theta),
        isWithinBounds: false
      };
    } else if (d > this._maxSunDistance) {
      d = this._maxSunDistance;
      return {
        x: this._sun.x + d*Math.cos(theta),
        y: this._sun.y + d*Math.sin(theta),
        isWithinBounds: false
      };
    } else {
      return {
        x: origPos.x,
        y: origPos.y,
        isWithinBounds: true
      };
    }
  }


  calcMoonGeometry(origPos, planetPos) {
    // Given an unconstrained position of a moon and the position of the planet it orbits, this
    //  method calculates the closest point on the moon's allowed orbit.
    // The returned object has these properties:
    //  - x, y: the constrained moon position,
    //  - isWithinCaptureDistance: boolean indicating if the unconstrained position is within
    //      the capture distance,
    //  - doesExceedEscapeDistance: boolean indicating if the unconstrained position exceeds
    //      the escape distance.
    let x_p = origPos.x - planetPos.x;
    let y_p = origPos.y - planetPos.y;
    let d = Math.sqrt(x_p*x_p + y_p*y_p);
    let theta = Math.atan2(y_p, x_p);
    return {
      x: planetPos.x + this._moonDistance*Math.cos(theta),
      y: planetPos.y + this._moonDistance*Math.sin(theta),
      isWithinCaptureDistance: (d < this._moonCaptureDistance),
      doesExceedEscapeDistance: (d > this._moonEscapeDistance)
    };
  }


  _setBodyPosition(body, pos) {
    // This method is called by the dragging code of a DraggableBody instance. The
    //  proposed position, pos, is constrained by its distance from the Sun, as well
    //  as the location of the other body.

    let otherBody = (body === this._body1) ? this._body2 : this._body1;
    let otherPos = otherBody.getPos();

    if (body.__isMoon) {
      // If the moon (body) is moved far enough away from the planet (otherBody), 
      //  then it will break free and become a planet.
      // body: is moon
      // otherBody: stays planet
      
      let moonGeom = this.calcMoonGeometry(pos, otherPos);
      if (moonGeom.doesExceedEscapeDistance) {
        // The moon *may* break free. Whether or not it does depends on how its position
        //  is adjusted to stay within the allowed Sun distance range.
        let planetGeom = this.calcPlanetGeometry(pos);
        if (planetGeom.isWithinBounds) {
          // No planet position adjustment necessary, so the moon breaks free.
          // body: moon -> planet
          body.__isMoon = false;
          body.setPos(planetGeom);
        } else {
          // The body's planet position has to be adjusted to stay within the
          //  allowed Sun distance range. It is possible that this adjusted
          //  position would put the body back into the moon capture range. If
          //  so, use the original calculated moon position.
          let moonGeom2 = this.calcMoonGeometry(planetGeom, otherPos);
          if (moonGeom2.isWithinCaptureDistance) {
            // body: stays moon
            body.setPos(moonGeom);
          } else {
            // body: moon -> planet
            body.__isMoon = false;
            body.setPos(planetGeom);
          }
        }
      } else {
        // body: stays moon
        body.setPos(moonGeom);
      }
    } else if (otherBody.__isMoon) {
      // The moon (otherBody) moves to follow the planet (body).
      // body: stays planet
      // otherBody: stays moon
      
      // The planet is constrained only by the Sun distance.
      let planetGeom = this.calcPlanetGeometry(pos);
      body.setPos(planetGeom);

      // The moon follows no matter what.
      let moonGeom = this.calcMoonGeometry(otherPos, planetGeom);
      otherBody.setPos(moonGeom);
    
    } else {
      // If the given planet (body) is moved close enough to the other planet (otherBody),
      //  then it will become its moon.
      // body: is planet
      // otherBody: stays planet
     
      // First restrict the body to within the allowed Sun distance, then see if that
      //  position is close enough to the other body for moon capture.
      let planetGeom = this.calcPlanetGeometry(pos);
      let moonGeom = this.calcMoonGeometry(planetGeom, otherPos);

      if (moonGeom.isWithinCaptureDistance) {
        // body: planet -> moon
        body.__isMoon = true;
        body.setPos(moonGeom);
      } else {
        // body: stays planet
        body.setPos(planetGeom);
      }
    }

    this.redraw();
    this._parent._onOrbitsViewChanged();
  }

  
  getInfo() {
    // The returned info object has the following properties:
    //  - isMoon1: a boolean indicating if body 1 is a moon,
    //  - isMoon2: a boolean indicating if body 2 is a moon,
    //  - phaseAngle1: the phase angle of body 1 as viewed from body 2,
    //  - phaseAngle2: the phase angle of body 2 as viewed from body 1.
    // The phase angles are in radians, with 0 corresponding to a fully illuminated
    //  disc.
    return {
      isMoon1: this._body1.__isMoon,
      isMoon2: this._body2.__isMoon,
      phaseAngle1: this.calcPhaseAngle(this._body2.getPos(), this._body1.getPos(), this._sun),
      phaseAngle2: this.calcPhaseAngle(this._body1.getPos(), this._body2.getPos(), this._sun)
    };
  }

  calcPhaseAngle(viewerPos, bodyPos, sunPos) {
    let sx = sunPos.x - bodyPos.x;
    let sy = sunPos.y - bodyPos.y;
    let vx = viewerPos.x - bodyPos.x;
    let vy = viewerPos.y - bodyPos.y;
    return Math.atan2(vx*sy - sx*vy, vx*sx + vy*sy);
  }


  redraw() {

    let ctx = this._canvas.getContext('2d');

    ctx.clearRect(0, 0, this._width, this._height);

    if (this._body1.__isMoon) {

      let pos2 = this._body2.getPos();

      let r1 = this.calcDistance(this._body1.getPos(), pos2);
      let r2 = this.calcDistance(pos2, this._sun);

      ctx.beginPath();
      ctx.ellipse(pos2.x, pos2.y, r1, r1, 0, 0, 2*Math.PI);
      ctx.strokeStyle = this._body1.getRGBString();
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(this._sun.x, this._sun.y, r2, r2, 0, 0, 2*Math.PI);
      ctx.strokeStyle = this._body2.getRGBString();
      ctx.stroke();

    } else if (this._body2.__isMoon) {

      let pos1 = this._body1.getPos();

      let r1 = this.calcDistance(pos1, this._sun);
      let r2 = this.calcDistance(this._body2.getPos(), pos1);

      ctx.beginPath();
      ctx.ellipse(this._sun.x, this._sun.y, r1, r1, 0, 0, 2*Math.PI);
      ctx.strokeStyle = this._body1.getRGBString();
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(pos1.x, pos1.y, r2, r2, 0, 0, 2*Math.PI);
      ctx.strokeStyle = this._body2.getRGBString();
      ctx.stroke();

    } else {

      let r1 = this.calcDistance(this._body1.getPos(), this._sun);
      let r2 = this.calcDistance(this._body2.getPos(), this._sun);

      ctx.beginPath();
      ctx.ellipse(this._sun.x, this._sun.y, r1, r1, 0, 0, 2*Math.PI);
      ctx.strokeStyle = this._body1.getRGBString();
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(this._sun.x, this._sun.y, r2, r2, 0, 0, 2*Math.PI);
      ctx.strokeStyle = this._body2.getRGBString();
      ctx.stroke();
    }
    
    let sunRadius = 12;
    ctx.beginPath();
    ctx.ellipse(this._sun.x, this._sun.y, sunRadius, sunRadius, 0, 0, 2*Math.PI);
    ctx.fillStyle = 'rgb(249, 225, 156)';
    ctx.fill();
  }



}


