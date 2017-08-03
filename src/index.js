import React from 'react';
import ReactDOM from 'react-dom';
import Schedule from 'components/Schedule';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import 'react-virtualized/styles.css';

ReactDOM.render(<Schedule />, document.getElementById('root'));
registerServiceWorker();
