/*
 * PhaseDisc.js
 * phase-positions-demo
 * astro.unl.edu
 * 12 December 2018
*/


export class PhaseDisc {

  constructor(parent, debugName) {
    this._parent = parent;
    this._debugName = (debugName !== undefined) ? debugName : 'unspecified';

    this._rootElement = document.createElement('div');
    this._rootElement.style.position = 'absolute';

    this._canvas = document.createElement('canvas');
    this._rootElement.appendChild(this._canvas);

    this._angle = Math.PI/4;
  }


  getElement() {
    return this._rootElement;
  }


  setPos(pos) {
    this._rootElement.style.left = pos.x + 'px';
    this._rootElement.style.top = pos.y + 'px';
  }


  setWidthAndHeight(width, height) {
    this._width = width;
    this._height = height;
    this._midX = 0.5*this._width;
    this._midY = 0.5*this._height;
    this._radius = 0.8*0.5*Math.min(this._width, this._height);
    this._canvas.width = this._width;
    this._canvas.height = this._height;
  }


  setDarkColor(color) {
    this._darkFillStyle = 'rgb(' + color.r + ', ' + color.g + ', ' + color.b + ')';
  }


  setLightColor(color) {
    this._lightFillStyle = 'rgb(' + color.r + ', ' + color.g + ', ' + color.b + ')';
  }


  setPhaseAngle(radians) {
    // A phase angle of 0 corresponds to a fully illuminated disc. As the phase angle
    //  increases the shadow moves in from the right.
    let k = 2*Math.PI;
    this._angle = (radians%k + k)%k;
  }

  getPhaseAngle() {
    return this._angle;
  }


  render() {
    this.redraw();
  }

  redraw() {

    let ctx = this._canvas.getContext('2d');

    ctx.clearRect(0, 0, this._width, this._height);

    let leftFillStyle;
    let rightFillStyle;
    let isGibbousShapeOnRight;

    // Following assumes _angle is in [0, 2*Pi).
    
    if (this._angle === 0) {
      // Disc fully illuminated.
      ctx.beginPath();
      ctx.ellipse(this._midX, this._midY, this._radius, this._radius, 0, 0, 2*Math.PI);
      ctx.fillStyle = this._lightFillStyle;
      ctx.fill();
      return;
    } else if (this._angle < 0.5*Math.PI) {
      // Illuminated gibbous on left.
      leftFillStyle = this._lightFillStyle;
      rightFillStyle = this._darkFillStyle;
      isGibbousShapeOnRight = false;
    } else if (this._angle < Math.PI) {
      // Illuminated crescent on left.
      leftFillStyle = this._lightFillStyle;
      rightFillStyle = this._darkFillStyle;
      isGibbousShapeOnRight = true;
    } else if (this._angle === Math.PI) {
      // Disc fully dark.
      ctx.beginPath();
      ctx.ellipse(this._midX, this._midY, this._radius, this._radius, 0, 0, 2*Math.PI);
      ctx.fillStyle = this._darkFillStyle;
      ctx.fill();
      return;
    } else if (this._angle < 1.5*Math.PI) {
      // Illuminated crescent on right.
      leftFillStyle = this._darkFillStyle;
      rightFillStyle = this._lightFillStyle;
      isGibbousShapeOnRight = false;
    } else {
      // Illuminated gibbous on right.
      leftFillStyle = this._darkFillStyle;
      rightFillStyle = this._lightFillStyle;
      isGibbousShapeOnRight = true;
    }

    // (Should already have returned if disc is fully light or dark.)

    let minorRadius = Math.abs(this._radius*Math.cos(this._angle));

    if (isGibbousShapeOnRight) {
      // Left side, crescent shape.
      ctx.beginPath();
      ctx.ellipse(this._midX, this._midY, this._radius, minorRadius, 0.5*Math.PI, 0, Math.PI);
      ctx.ellipse(this._midX, this._midY, this._radius, this._radius, 0.5*Math.PI, Math.PI, 2*Math.PI, true);
      ctx.fillStyle = leftFillStyle;
      ctx.fill('evenodd');
      // Right side, gibbous shape.
      ctx.beginPath();
      ctx.ellipse(this._midX, this._midY, this._radius, this._radius, 0.5*Math.PI, 0, Math.PI, true);
      ctx.ellipse(this._midX, this._midY, this._radius, minorRadius, 0.5*Math.PI, Math.PI, 2*Math.PI, true);
      ctx.fillStyle = rightFillStyle;
      ctx.fill('evenodd');
    } else {
      // Left side, gibbous shape.
      ctx.beginPath();
      ctx.ellipse(this._midX, this._midY, this._radius, minorRadius, 0.5*Math.PI, 0, Math.PI, true);
      ctx.ellipse(this._midX, this._midY, this._radius, this._radius, 0.5*Math.PI, Math.PI, 2*Math.PI, true);
      ctx.fillStyle = leftFillStyle;
      ctx.fill('evenodd');
      // Right side, crescent shape.
      ctx.beginPath();
      ctx.ellipse(this._midX, this._midY, this._radius, this._radius, 0.5*Math.PI, 0, Math.PI, true);
      ctx.ellipse(this._midX, this._midY, this._radius, minorRadius, 0.5*Math.PI, Math.PI, 2*Math.PI);
      ctx.fillStyle = rightFillStyle;
      ctx.fill('evenodd');
    }

  }

}


