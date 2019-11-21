import React from 'react';
import ReactDOM from 'react-dom/server';

export default function htmlTemplate(content) {
  return `
    <html lang="en">
      <head>
      ${head.title.toString()}
      ${head.meta.toString()}

        <meta charSet="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-
         scale=1.0"/>
        <meta httpEquiv="X-UA-Compatible" content="ie=edge"/>
        <link rel="shortcut icon" href="data:image/x-icon;," type="image/x-icon"> 
        ${
          process.env.NODE_ENV === 'development'
            ? ''
            : "<link rel='stylesheet' href='/bundle.css'/>"
        }
      </head>
      <body>
        ${ReactDOM.renderToStaticMarkup(
          <div
            id="root"
            dangerouslySetInnerHTML={{ __html: content }}
          />,
        )}
        <script src="/bundle.js"></script>
      </body>
    </html>
  `;
}
