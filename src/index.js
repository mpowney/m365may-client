import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route } from "react-router-dom";
import SessionList from "./components/sessions/SessionList";
import MapChart from "./components/maps/MapChart";
import SpeakerProfile from "./components/speakers/Speaker";
import Session from "./components/sessions/Session";

import "./styles.css";
import { initializeIcons } from '@uifabric/icons';

// Polyfills

import 'promise-polyfill/src/polyfill';
import 'mdn-polyfills/Number.isNaN';
import 'mdn-polyfills/Object.assign';
import 'mdn-polyfills/String.prototype.startsWith';
import 'mdn-polyfills/String.prototype.repeat';

initializeIcons();
Object.is = require('object-is');
Math.trunc = require('math-trunc');
Math.sign = require('math-sign');

function App() {
  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/">
            <MapChart />
          </Route>
          <Route path="/sessions">
            <SessionList />
          </Route>
          <Route path="/speaker/:id" component={SpeakerProfile}></Route>
          <Route path="/session/:id" component={Session}></Route>
        </Switch>
      </Router>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

setInterval(function() {

  var body = document.body,
    html = document.documentElement;

  var height = Math.max( body.scrollHeight, body.offsetHeight, 
                        html.clientHeight, html.scrollHeight, html.offsetHeight );

  // eslint-disable-next-line no-restricted-globals
  parent.postMessage(height, "https://www.m365may.com");

},1000);
