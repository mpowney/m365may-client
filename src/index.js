import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route } from "react-router-dom";
import SessionsLive from "./components/sessions/SessionsLive";
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

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export const SESSIONS_JSON = (getParameterByName('api') || "") === "click" ?
  `${process.env.REACT_APP_AZ_FUNCTION_HOST}/data/sessions`
  :
  `${process.env.REACT_APP_JSON_HOST}/data/sessions.json?${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}-${new Date().getHours()}`

export const VIDEOS_JSON = (getParameterByName('api') || "") === "click" ?
  `${process.env.REACT_APP_AZ_FUNCTION_HOST}/data/videos`
  :
  `${process.env.REACT_APP_JSON_HOST}/data/videos.json?${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}-${new Date().getHours()}`

export const SPEAKERS_JSON = `${process.env.REACT_APP_JSON_HOST}/data/speakers.json?${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}-${new Date().getHours()}`

function App() {
  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/">
            <MapChart />
          </Route>
          <Route path="/sessions/live">
            <SessionsLive />
          </Route>
          <Route path="/sessions-new/">
            <SessionsLive />
          </Route>
          <Route path="/sessions">
            <SessionsLive />
          </Route>
          <Route path="/sessions/">
            <SessionsLive />
          </Route>
          <Route path="/speaker/:id" component={SpeakerProfile}></Route>
          <Route path="/speaker-new/:id" component={SpeakerProfile}></Route>
          <Route path="/session/:id" component={Session}></Route>
          <Route path="/session-new/:id" component={Session}></Route>
          <Route path="/session-details/:id/" component={Session}></Route>
          <Route path="/session-details-new/:id/" component={Session}></Route>
          <Route path="/redirect/session/:id/" component={Session}></Route>
          <Route path="/redirect/session-new/:id/" component={Session}></Route>
        </Switch>
      </Router>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

