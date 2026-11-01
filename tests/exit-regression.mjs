import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const read = path => fs.readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const app = read('site/controls.js').replace('export function', 'function') + '\n' +
  read('site/app.js').replace("import {gameKey} from './controls.js';", '');

function loadPage() {
  let frames = 0;
  const elements = new Map();
  const element = () => ({
    classList: {add(){}, remove(){}, toggle(){}, contains(){return false;}},
    setAttribute(){}, replaceChildren(){}, click(){this.onclick();}, hidden: false,
    textContent: '',
  });
  const document = {
    querySelector(selector) {
      if (!elements.has(selector)) elements.set(selector, element());
      return elements.get(selector);
    },
    querySelectorAll(){return [];},
    createElement(tag) {
      assert.equal(tag, 'iframe');
      frames++;
      return {contentWindow: {dispatchEvent(){}}, contentDocument: {querySelector(){return null;}}};
    },
    addEventListener(){}, body: element(), documentElement: {},
  };
  const context = vm.createContext({
    document, window: {addEventListener(){}},
    location: {origin: 'https://example.test', search: ''},
    URLSearchParams, matchMedia: () => ({matches: false}),
    innerWidth: 400, innerHeight: 800,
  });
  vm.runInContext(app, context);
  return {frames: () => frames, start: () => elements.get('#start').onclick(), screenStart: () => elements.get('#screen-start').click()};
}

let page = loadPage();
assert.equal(page.frames(), 0, 'Initial page must wait for Start');
page.screenStart();
page.start();
assert.equal(page.frames(), 1, 'Start creates only one game frame');

const runtime = read('site/runtime/src/main.js');
const callback = runtime.match(/async Java_pl_zb3_freej2me_bridge_shell_Shell_exit\(lib\)\s*\{([\s\S]*?)\n            \},/);
assert.ok(callback, 'Real runtime Exit callback must exist');
let reloads = 0;
const hostLocation = {reload() {reloads++; page = loadPage();}};
Object.defineProperty(hostLocation, 'href', {set(){assert.fail('Exit must not navigate to a URL');}});
const childLocation = {reload(){assert.fail('Exit must reload the host, not the game frame');}};
const context = vm.createContext({window: {parent: {location: hostLocation}}, location: childLocation});
await vm.runInContext('(async () => {' + callback[1] + '})()', context);
assert.equal(reloads, 1, 'Exit must reload the host page once');
assert.equal(page.frames(), 0, 'Reloaded page must wait for Start');
page.screenStart();
assert.equal(page.frames(), 1, 'Phone screen Start must work again after Exit');
console.log('PASS: initial Start, duplicate Start, host reload on Exit, no URL navigation, no automatic restart, Start after Exit');
