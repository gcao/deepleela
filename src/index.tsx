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

ReactDOM.render(
  <App
    sgf={urlParams.get('sgf')}
    move={move}
  />,
  document.getElementById('root') as HTMLElement
);

registerServiceWorker();
