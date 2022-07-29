import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App, { Action } from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import SGF from './common/SGF';
import './Themes.css';
import { getUrlParams } from './lib/URL';

const urlParams = getUrlParams();
let action = Action.None;
let move = 10000;
const moveParam = urlParams.get('move');
if (moveParam) {
  move = parseInt(moveParam);
}
const actionParam = urlParams.get('action');
if (actionParam === 'load') {
  action = Action.Load;
}

ReactDOM.render(
  <App
    action={action}
    sgf={urlParams.get('sgf')}
    move={move}
  />,
  document.getElementById('root') as HTMLElement
);

registerServiceWorker();
