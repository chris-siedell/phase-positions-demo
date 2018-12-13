/*
 * Main.js
 * phase-positions-demo
 * astro.unl.edu
 * 12 December 2018
*/

import ResizeSensor from 'css-element-queries/src/ResizeSensor';


import {OrbitsView} from './OrbitsView.js';
import {PhaseDisc} from './PhaseDisc.js';


class PhasePositionsDemo {

  constructor(rootElement) {

    let color1 = {r: 144, g: 144, b: 255};
    let light1 = {r: 200, g: 200, b: 255};
    let dark1 = {r: 64, g: 64, b: 96};

    let color2 = {r: 255, g: 144, b: 144};
    let light2 = {r: 255, g: 200, b: 200};
    let dark2 = {r: 96, g: 64, b: 64};

    this._rootElement = rootElement;

    this._orbits = new OrbitsView(this);
    this._rootElement.appendChild(this._orbits.getElement());
    this._orbits.setColor1(color1);
    this._orbits.setColor2(color2);

    this._phase1 = new PhaseDisc(this, 'Disc1');
    this._rootElement.appendChild(this._phase1.getElement());
    this._phase1.setLightColor(light1);
    this._phase1.setDarkColor(dark1);

    this._phase2 = new PhaseDisc(this, 'Disc2');
    this._rootElement.appendChild(this._phase2.getElement());
    this._phase2.setLightColor(light2);
    this._phase2.setDarkColor(dark2);

    this._lastWidth = -1;
    this._lastHeight = -1;

    this._rootStyle = window.getComputedStyle(this._rootElement);

    this._resizeSensor = new ResizeSensor(this._rootElement, () => {
      let didReset = this._resetLayout();
      if (didReset) {
        this.render();
      }
    });

    this._resetLayout();
  }


  init() {

    this._orbits.setState({
      body1: {
        isMoon: false,
        angle: 0.5*Math.PI,
        distance: 0.5
      },
      body2: {
        isMoon: false,
        angle: 1.25*Math.PI,
        distance: 1.0
      }
    });

    this.render();
  }

  
  _resetLayout() {

    let width = parseFloat(this._rootStyle.width);
    let height = parseFloat(this._rootStyle.height);

    if (width === this._lastWidth && height === this._lastHeight) {
      return false;
    }

    // ratioLimit helps determine the minimal size of the phase disc panels.
    //  (A smaller value makes the phase disc panels larger at their smallest,
    //  at the expense of making the orbits panel smaller.)
    let ratioLimit = 0.75;

    let orbitsWidth, orbitsHeight, phaseWidth, phaseHeight;

    if (width >= height) {

      orbitsWidth = Math.min(height, ratioLimit*width);
      orbitsHeight = height;

      phaseHeight = 0.5*height;
      phaseWidth = Math.min(phaseHeight, width - orbitsWidth);

      let orbitsX = 0.5*(width - orbitsWidth - phaseWidth);
      let phaseX = orbitsX + orbitsWidth;

      this._orbits.setPos({x: orbitsX, y: 0});
      this._phase1.setPos({x: phaseX, y: 0});
      this._phase2.setPos({x: phaseX, y: phaseHeight});

    } else {

      orbitsWidth = width;
      orbitsHeight = Math.min(ratioLimit*height, width);

      phaseWidth = 0.5*width;
      phaseHeight = Math.min(phaseWidth, height - orbitsHeight);

      let orbitsY = 0.5*(height - orbitsHeight - phaseHeight);
      let phaseY = orbitsY + orbitsHeight;

      this._orbits.setPos({x: 0, y: orbitsY});
      this._phase1.setPos({x: 0, y: phaseY});
      this._phase2.setPos({x: phaseWidth, y: phaseY});
    }

    this._orbits.setWidthAndHeight(orbitsWidth, orbitsHeight);
    this._phase1.setWidthAndHeight(phaseWidth, phaseHeight);
    this._phase2.setWidthAndHeight(phaseWidth, phaseHeight);

    this._lastWidth = width;
    this._lastHeight = height;

    return true;
  }

  render() {
    this._orbits.render();
    this._onOrbitsViewChanged();
  }


  _onOrbitsViewChanged() {
    let info = this._orbits.getInfo();
    this._phase1.setPhaseAngle(info.phaseAngle1);
    this._phase2.setPhaseAngle(info.phaseAngle2);
    this._phase1.redraw();
    this._phase2.redraw();
  }

}


if (typeof window !== 'undefined') {
  if (typeof window.astroUNL !== 'object') {
    window.astroUNL = {};
  }

  if (window.astroUNL.PhasePositionsDemo === undefined) {
    window.astroUNL.PhasePositionsDemo = PhasePositionsDemo;
  } else {
    console.warn('astroUNL.PhasePositionsDemo is already defined.');
  }
}

