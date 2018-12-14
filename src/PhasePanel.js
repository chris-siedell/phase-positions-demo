/*
 * PhasePanel.js
 * phase-positions-demo
 * astro.unl.edu
 * 14 December 2018
*/


import {PhaseDisc} from './PhaseDisc.js';


export class PhasePanel {


  constructor(parent, bodyNum) {

    this._parent = parent;
    this._bodyNum = bodyNum;

    this._rootElement = document.createElement('div');
    this._rootElement.style.position = 'absolute';
    
    this._phaseDisc = new PhaseDisc();
    this._rootElement.appendChild(this._phaseDisc.getElement());
    
    this._showDiscDiv = document.createElement('div');
    this._showDiscDiv.style.position = 'absolute';
    this._showDiscDiv.style.fontFamily = 'sans-serif';
    this._showDiscDiv.style.fontSize = '14px';
    this._showDiscDiv.style.color = 'white';

    let checkboxID = 'showDiscCheckbox' + this._bodyNum;

    this._showDiscCheckbox = document.createElement('input');
    this._showDiscCheckbox.type = 'checkbox';
    this._showDiscCheckbox.id = checkboxID;
    this._showDiscCheckbox.checked = this._phaseDisc.getShowDisc();
    this._showDiscDiv.appendChild(this._showDiscCheckbox);
    
    this._onShowDiscToggled = this._onShowDiscToggled.bind(this);
    this._showDiscCheckbox.addEventListener('change', this._onShowDiscToggled);

    this._showDiscLabel = document.createElement('label');
    this._showDiscLabel.htmlFor = checkboxID;
    this._showDiscLabel.textContent = 'Show Disc';
    this._showDiscDiv.appendChild(this._showDiscLabel);

    this._rootElement.appendChild(this._showDiscDiv);

    this._label = document.createElement('div');
    this._label.style.position = 'absolute';
    this._label.style.fontFamily = 'sans-serif';
    this._label.style.fontSize = '16px';
    this._label.style.color = 'white';
    this._label.style.textAlign = 'center';
    this._rootElement.appendChild(this._label);

  }

  _onShowDiscToggled(e) {
    this._phaseDisc.setShowDisc(this._showDiscCheckbox.checked);
    this.render();
  }

  getElement() {
    return this._rootElement;
  }

  getPos() {
    return {
      x: this._x,
      y: this._y
    }
  }


  setLabel(text) {
    this._labelText = text;
  }


  setDarkColor(color) {
    this._phaseDisc.setDarkColor(color);
  }


  setLightColor(color) {
    this._phaseDisc.setLightColor(color);
  }

  setPhaseAngle(radians) {
    this._phaseDisc.setPhaseAngle(radians);
  }

  getPhaseAngle() {
    return this._phaseDisc.getPhaseAngle();
  }


  setPos(pos) {
    this._x = pos.x;
    this._y = pos.y;
  }

  getDim() {
    return {
      width: this._width,
      height: this._height
    };
  }

  setDim(dim) {
    this._width = dim.width;
    this._height = dim.height;
  }

  render() {

    this._rootElement.style.left = this._x + 'px';
    this._rootElement.style.top = this._y + 'px';
    this._rootElement.style.width = this._width + 'px';
    this._rootElement.style.height = this._height + 'px';

    let padding = Math.min(10, 0.05*Math.min(this._width, this._height));

    this._label.style.width = (this._width - 2*padding) + 'px';

    this._label.textContent = this._labelText;

    let discWidth = this._width - 2*padding;

    let labelHeight = this._label.offsetHeight;

    // Since the disc is circular, it doesn't need to be higher than it is wide. But
    //  it does need to fit in the available vertical space.
    let discHeight = Math.min(discWidth, this._height - (labelHeight + this._showDiscDiv.offsetHeight + 4*padding));

    let fixedHeight = labelHeight + discHeight + this._showDiscDiv.offsetHeight + 2*padding;

    let labelY = 0.5*(this._height - fixedHeight);
    
    this._label.style.top = labelY + 'px';
    this._label.style.left = padding + 'px';

    let discY = labelY + labelHeight + padding;

    this._phaseDisc.setDim({
      width: discWidth,
      height: discHeight
    });

    this._phaseDisc.setPos({
      x: padding,
      y: discY
    });

    this._phaseDisc.render();

    this._showDiscDiv.style.left = padding + 'px';
    this._showDiscDiv.style.top = (discY + discHeight + padding) + 'px';
  }




}



