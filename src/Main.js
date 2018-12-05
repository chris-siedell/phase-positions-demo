/*
 * Main.js
 * PhasePositionsDemo
 * astro.unl.edu
 * 5 December 2018
*/


import {OrbitsView} from './OrbitsView.js';
import {PhaseDisc} from './PhaseDisc.js';


class PhaseDemo {

  constructor(rootElement) {

    let color1 = {r: 144, g: 144, b: 255};
    let light1 = {r: 200, g: 200, b: 255};
    let dark1 = {r: 64, g: 64, b: 96};

    let color2 = {r: 255, g: 144, b: 144};
    let light2 = {r: 255, g: 200, b: 200};
    let dark2 = {r: 96, g: 64, b: 64};

    this._rootElement = rootElement;

    let bb = this._rootElement.getBoundingClientRect();

    let orbitsSize = bb.height;
    let phaseX = orbitsSize;
    let phaseWidth = bb.width - phaseX;
    let phaseHeight = 0.5*bb.height;

    this._orbits = new OrbitsView(this);
    this._rootElement.appendChild(this._orbits.getElement());
    this._orbits.setColor1(color1);
    this._orbits.setColor2(color2);
    this._orbits.setWidthAndHeight(orbitsSize, orbitsSize);

    this._phase1 = new PhaseDisc(this, 'Disc1');
    this._rootElement.appendChild(this._phase1.getElement());
    this._phase1.setWidthAndHeight(phaseWidth, phaseHeight);
    this._phase1.setPos({x: phaseX, y: 0});
    this._phase1.setLightColor(light1);
    this._phase1.setDarkColor(dark1);

    this._phase2 = new PhaseDisc(this, 'Disc2');
    this._rootElement.appendChild(this._phase2.getElement());
    this._phase2.setWidthAndHeight(phaseWidth, phaseHeight);
    this._phase2.setPos({x: phaseX, y: phaseHeight});
    this._phase2.setLightColor(light2);
    this._phase2.setDarkColor(dark2);

    this._orbits.render();

    this.onOrbitsViewUpdate();
  }


  onOrbitsViewUpdate() {
    let info = this._orbits.getInfo();
    this._phase1.setPhaseAngle(info.phaseAngle1);
    this._phase2.setPhaseAngle(info.phaseAngle2);
    this._phase1.render();
    this._phase2.render();
  }

}


if (typeof window !== 'undefined') {
  if (typeof window.astroUNL !== 'object') {
    window.astroUNL = {};
  }

  if (window.astroUNL.PhaseDemo === undefined) {
    window.astroUNL.PhaseDemo = PhaseDemo;
  } else {
    console.warn('astroUNL.PhaseDemo is already defined.');
  }
}

