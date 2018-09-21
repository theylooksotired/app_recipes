'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import IndexPage from './components/IndexPage';
import db from './db/db.json';

window.onload = () => {
    ReactDOM.render(<IndexPage/>, document.getElementById('main'));
}

function initApp() {
    if (AdMob) {
        AdMob.createBanner({
            adId : db.admobBanner,
            position : AdMob.AD_POSITION.TOP_CENTER,
            autoShow : true
        });
        AdMob.prepareInterstitial({
            adId : db.admobIntersitial,
            autoShow : true
        });
        AdMob.showInterstitial();
    }
}

document.addEventListener('deviceready', initApp, false);
