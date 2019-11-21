/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import ReactDOM from 'react-dom/server';
import { Helmet } from 'react-helmet';
import express from 'express';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import compress from 'compression';
import servicesLoader from './services';
import db from './database';
import ApolloClient from './ssr/apollo';
import Graphbook from './ssr';
import template from './ssr/template';

const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const webpack = require('webpack');
const config = require('../../webpack.server.config');

const utils = {
  db,
};
const services = servicesLoader(utils);
const root = path.join(__dirname, '../../');
const app = express();

if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', '*.amazonaws.com'],
      },
    }),
  );
  app.use(compress());
  app.use(cors());
}

app.use(helmet.referrerPolicy({ policy: 'same-origin' }));
app.use('/', express.static(path.join(root, 'dist/client')));
app.use('/uploads', express.static(path.join(root, 'uploads')));
const compiler = webpack(config);
app.use(devMiddleware(compiler));
app.use(hotMiddleware(compiler));

const serviceNames = Object.keys(services);
for (let i = 0; i < serviceNames.length; i += 1) {
  const name = serviceNames[i];
  if (name === 'graphql') {
    services[name].applyMiddleware({ app });
  } else {
    app.use(`/${name}`, services[name]);
  }
}

app.get('*', (req, res) => {
  const client = ApolloClient(req);
  const context = {};
  const App = (
    <Graphbook client={client} location={req.url} context={context} />
  );
  const content = ReactDOM.renderToString(App);
  if (context.url) {
    res.redirect(301, context.url);
  } else {
    const head = Helmet.renderStatic();
    res.status(200);
    res.send(`<!doctype html>\n${template(content, head)}`);
    res.end();
  }
});

app.listen(8000, () => console.log('Listening on port 8000!'));
