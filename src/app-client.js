'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import IndexPage from './components/IndexPage';
import db from './db/db.json';

let indexPage = {};

window.onload = () => {
    ReactDOM.render(<IndexPage ref={instance => { indexPage = instance; console.log(instance); }}/>, document.getElementById('main'));
}

function initApp() {
    document.addEventListener('backbutton', function(){indexPage.goBack();}, false);
    if (AdMob) {
        AdMob.createBanner({
            adId : db.site.admobBanner,
            position : AdMob.AD_POSITION.TOP_CENTER,
            autoShow : true
        });
        AdMob.prepareInterstitial({
            adId : db.site.admobIntersitial,
            autoShow : true
        });
        AdMob.showInterstitial();
    }
}

document.addEventListener('deviceready', initApp, false);
