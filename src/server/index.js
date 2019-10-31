/* eslint-disable no-console */
/* eslint-disable spaced-comment */
import path from 'path';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compress from 'compression';

const app = express();
const root = path.join(__dirname, '../../');
/*
app.get('*', (req, res) => res.send('yo world!'));
*/
app.use(cors());
app.use(compress());
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
app.use(helmet.referrerPolicy({ policy: 'same-origin' }));

app.use('/', express.static(path.join(root, 'dist/client')));
app.use('/uploads', express.static(path.join(root, 'uploads')));
app.get('/', (req, res) => {
  res.sendFile(path.join(root, '/dist/client/index.html'));
});

app.listen(8000, () => console.log('working on port 8000'));
