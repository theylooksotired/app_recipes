'use strict';

import path from 'path';
import { Server } from 'http';
import Express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import routes from './routes';
import NotFoundPage from './components/NotFoundPage';

const app = new Express();
const server = new Server(app);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(Express.static(path.join(__dirname, 'dir')));

app.get('*', (req, res) => {
    match(
        { routes, location: req.url },
        (err, redirectLocation, renderProps) => {
            // Error messages
            if (err) {
                return res.status(500).send(err.message);
            }
            // Redirection
            if (redirectLocation) {
                return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
            }
            // React markup
            let markup;
            if (renderProps) {
                // if the current route matched we have renderProps
                markup = renderToString(<RouterContext {...renderProps}/>);
            } else {
                // otherwise we can render a 404 page
                markup = renderToString(<NotFoundPage/>);
                res.status(404);
            }
            return res.render('index', { markup });
        }
    );
});

const port = process.env.PORT || 4444;
const env = process.env.NODE_ENV || 'production';
server.listen(port, err => {
    if (err) {
        return console.error(err);
    }
    console.info(`Server running on http://localhost:${port} [${env}]`);
});
