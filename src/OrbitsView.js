/*
 * OrbitsView.js
 * phase-positions-demo
 * astro.unl.edu
 * 12 December 2018
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

  // The state of the OrbitsView is encapsulated in an object with these properties:
  //  - body1: an object (see definition below),
  //  - body2: an object (see definition below).
  // The body objects have the following properties:
  //  - isMoon: a bool (only one body may be a moon),
  //  - distance: a float between 0.0 (minSunDistance) and 1.0 (maxSunDistance); this
  //      property is ignored if isMoon is true, but still must be a number in [0, 1],
  //  - angle: the CCW angle, in radians, from the +x vector, measure wrt the Sun (when
  //      isMoon is false), or the other body (when isMoon is true).

  // The bodies' actual positions are derived from the state and the current size of
  //  the OrbitsView.
 

  constructor(parent) {

    this._parent = parent;

    this._rootElement = document.createElement('div');
    this._rootElement.style.position = 'relative';

    this._canvas = document.createElement('canvas');
    this._rootElement.appendChild(this._canvas);

    this._body1 = new DraggableBody(this);
    this._rootElement.appendChild(this._body1.getElement());

    this._body2 = new DraggableBody(this);
    this._rootElement.appendChild(this._body2.getElement());

    this._body1.setOtherBody(this._body2);
    this._body2.setOtherBody(this._body1);

    this._width = -1;
    this._height = -1;
  }
 

  getElement() {
    return this._rootElement;
  }


  setState(state) {
        
    this._body1._cancelDragging();
    this._body2._cancelDragging();

    this._body1.setState(state.body1);
    this._body2.setState(state.body2);

    if (this._body1.getIsMoon() && this._body2.getIsMoon()) {
      this._body2.setState({
        isMoon: false,
        angle: 0,
        distance: 0.5
      });
      console.error('Only one body may be a moon.');
    }

    this._recalculateBodyPositions();
  }


  getState() {
    return {
      body1: this._body1.getState(),
      body2: this._body2.getState()
    };
  }

  setColor1(color) {
    this._body1.setColor(color);
  }


  setColor2(color) {
    this._body2.setColor(color);
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

    // TODO: for consideration, cancel drag or recalc offset on resize? depends on magnitude?
    
    this._body1._cancelDragging();
    this._body2._cancelDragging();


    this._recalculateBodyPositions();
  }


  _recalculateBodyPositions() {
    // If a body is a moon, the other body must be recalculated
    //  first. If neither is a moon, it doesn't matter.
    if (this._body1.getIsMoon()) {
      this._recalculateBodyPos(this._body2);
      this._recalculateBodyPos(this._body1);
    } else {
      this._recalculateBodyPos(this._body1);
      this._recalculateBodyPos(this._body2);
    }
  }

  _recalculateBodyPos(body) {
    // Recalculates and sets the position of the given body.

    if (this._width < 0) {
      return;
    }

    let bodyState = body.getState();

    let x0, y0, r;

    if (bodyState.isMoon) {

      let otherBody = (body === this._body1) ? this._body2 : this._body1;
      let otherPos = otherBody.getPos();

      r = this._moonDistance;
      x0 = otherPos.x;
      y0 = otherPos.y;

    } else {

      r = this._minSunDistance + bodyState.distance*(this._maxSunDistance - this._minSunDistance);
      x0 = this._sun.x;
      y0 = this._sun.y;
    }

    body.setPos({
      x: x0 + r*Math.cos(bodyState.angle),
      y: y0 + r*Math.sin(bodyState.angle)
    });
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
    //      allowed Sun distance range,
    //  - isMoon: false,
    //  - distance, angle: see state definition.
    let x_s = origPos.x - this._sun.x;
    let y_s = origPos.y - this._sun.y;
    let r = Math.sqrt(x_s*x_s + y_s*y_s);
    let distance = (r - this._minSunDistance)/(this._maxSunDistance - this._minSunDistance);
    let angle = Math.atan2(y_s, x_s);
    if (distance < 0.0) {
      r = this._minSunDistance;
      return {
        x: this._sun.x + r*Math.cos(angle),
        y: this._sun.y + r*Math.sin(angle),
        isWithinBounds: false,
        isMoon: false,
        distance: 0.0,
        angle: angle
      };
    } else if (distance > 1.0) {
      r = this._maxSunDistance;
      return {
        x: this._sun.x + r*Math.cos(angle),
        y: this._sun.y + r*Math.sin(angle),
        isWithinBounds: false,
        isMoon: false,
        distance: 1.0,
        angle: angle
      };
    } else {
      return {
        x: origPos.x,
        y: origPos.y,
        isWithinBounds: true,
        isMoon: false,
        distance: distance,
        angle: angle
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
    //      the escape distance,
    //  - isMoon: true,
    //  - distance: 0.5,
    //  - angle: see state definition.
    let x_p = origPos.x - planetPos.x;
    let y_p = origPos.y - planetPos.y;
    let d = Math.sqrt(x_p*x_p + y_p*y_p);
    let angle = Math.atan2(y_p, x_p);
    return {
      x: planetPos.x + this._moonDistance*Math.cos(angle),
      y: planetPos.y + this._moonDistance*Math.sin(angle),
      isWithinCaptureDistance: (d < this._moonCaptureDistance),
      doesExceedEscapeDistance: (d > this._moonEscapeDistance),
      isMoon: true,
      distance: 0.5,
      angle: angle
    };
  }


  _setBodyPosition(body, pos) {
    // This method is called by the dragging code of a DraggableBody instance. The
    //  proposed position, pos, is constrained by its distance from the Sun, as well
    //  as the location of the other body.

    let otherBody = (body === this._body1) ? this._body2 : this._body1;
    let otherPos = otherBody.getPos();

    if (body.getIsMoon()) {
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
          body.setStateAndPos(planetGeom);
        } else {
          // The body's planet position has to be adjusted to stay within the
          //  allowed Sun distance range. It is possible that this adjusted
          //  position would put the body back into the moon capture range. If
          //  so, use the original calculated moon position.
          let moonGeom2 = this.calcMoonGeometry(planetGeom, otherPos);
          if (moonGeom2.isWithinCaptureDistance) {
            // body: stays moon
            body.setStateAndPos(moonGeom);
          } else {
            // body: moon -> planet
            body.setStateAndPos(planetGeom);
          }
        }
      } else {
        // body: stays moon
        body.setStateAndPos(moonGeom);
      }
    } else if (otherBody.getIsMoon()) {
      // The moon (otherBody) moves to follow the planet (body).
      // body: stays planet
      // otherBody: stays moon
      
      // The planet is constrained only by the Sun distance.
      let planetGeom = this.calcPlanetGeometry(pos);
      body.setStateAndPos(planetGeom);

      // The moon follows no matter what.
      let moonGeom = this.calcMoonGeometry(otherPos, planetGeom);
      otherBody.setStateAndPos(moonGeom);
    
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
        body.setStateAndPos(moonGeom);
      } else {
        // body: stays planet
        body.setStateAndPos(planetGeom);
      }
    }

    this.render();
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
    let pos1 = this._body1.getPos();
    let pos2 = this._body2.getPos();
    return {
      isMoon1: this._body1.getIsMoon(),
      isMoon2: this._body2.getIsMoon(),
      phaseAngle1: this.calcPhaseAngle(pos2, pos1, this._sun),
      phaseAngle2: this.calcPhaseAngle(pos1, pos2, this._sun)
    };
  }

  calcPhaseAngle(viewerPos, bodyPos, sunPos) {
    let sx = sunPos.x - bodyPos.x;
    let sy = sunPos.y - bodyPos.y;
    let vx = viewerPos.x - bodyPos.x;
    let vy = viewerPos.y - bodyPos.y;
    return Math.atan2(vx*sy - sx*vy, vx*sx + vy*sy);
  }


  render() {
    this._body1.render();
    this._body2.render();
    this.redraw();
  }


  redraw() {

    let ctx = this._canvas.getContext('2d');

    ctx.clearRect(0, 0, this._width, this._height);

    if (this._body1.getIsMoon()) {

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

    } else if (this._body2.getIsMoon()) {

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


