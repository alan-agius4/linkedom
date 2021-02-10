'use strict';
const {escape} = require('html-escaper');

const {ATTRIBUTE_NODE} = require('../shared/constants.js');
const {CHANGED, VALUE} = require('../shared/symbols.js');
const {String} = require('../shared/utils.js');
const {attrAsJSON} = require('../shared/jsdon.js');

const {attributeChangedCallback: moAttributes} = require('./mutation-observer.js');
const {attributeChangedCallback: ceAttributes} = require('./custom-element-registry.js');

const {Node} = require('./node.js');

/**
 * @implements globalThis.Attr
 */
class Attr extends Node {
  constructor(ownerDocument, name, value = '') {
    super(ownerDocument, '#attribute', ATTRIBUTE_NODE);
    this.ownerElement = null;
    this.name = String(name);
    this[VALUE] = String(value);
    this[CHANGED] = false;
  }

  get value() { return this[VALUE]; }
  set value(newValue) {
    const {[VALUE]: oldValue, name, ownerElement} = this;
    this[VALUE] = String(newValue);
    this[CHANGED] = true;
    if (ownerElement) {
      moAttributes(ownerElement, name, oldValue);
      ceAttributes(ownerElement, name, oldValue, this[VALUE]);
    }
  }

  cloneNode() {
    const {ownerDocument, name, [VALUE]: value} = this;
    return new Attr(ownerDocument, name, value);
  }

  toString() {
    const {name, [VALUE]: value} = this;
    return value ? `${name}="${escape(value)}"` : name;
  }

  toJSON() {
    const json = [];
    attrAsJSON(this, json);
    return json;
  }
}
exports.Attr = Attr
