import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import SGF from './common/SGF';
import './Themes.css';
import { getUrlParams } from './lib/Utils';

const urlParams = getUrlParams();
let move = 10000;
const moveParam = urlParams.get('move');
if (moveParam) {
  move = parseInt(moveParam);
}
let vbSize = 3;
const vbSizeParam = urlParams.get('vbsize');
if (vbSizeParam) {
  vbSize = parseInt(vbSizeParam);
}
let vbOffsetX = 3;
const vbOffsetXParam = urlParams.get('vboffsetx');
if (vbOffsetXParam) {
  vbOffsetX = parseInt(vbOffsetXParam);
}
let vbOffsetY = 3;
const vbOffsetYParam = urlParams.get('vboffsety');
if (vbOffsetYParam) {
  vbOffsetY = parseInt(vbOffsetYParam);
}

ReactDOM.render(
  <App
    sgf={urlParams.get('sgf')}
    move={move}
    vbSize={vbSize}
    vbOffsetX={vbOffsetX}
    vbOffsetY={vbOffsetY}
  />,
  document.getElementById('root') as HTMLElement
);

registerServiceWorker();
