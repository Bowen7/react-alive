import * as Babel from 'babel-standalone'
import reactRefreshPlugin from 'react-refresh/babel'
// eslint-disable-next-line import/no-webpack-loader-syntax
import reactRaw from '!!raw-loader!react/umd/react.development.js'
// eslint-disable-next-line import/no-webpack-loader-syntax
import reactDomRaw from '!!raw-loader!react-dom/umd/react-dom.development.js'
// eslint-disable-next-line import/no-webpack-loader-syntax
import reactFreshRaw from 'raw-loader!./lib/react-refresh-runtime.js'
// eslint-disable-next-line no-restricted-globals
self.addEventListener('install', function (event) {
  event.waitUntil(self.skipWaiting())
})
self.addEventListener('activate', function (event) {
  event.waitUntil(
    (async () => {
      await self.clients.claim()
      self.clients.matchAll().then(function (clients) {
        clients.forEach(function (client) {
          client.postMessage({
            cmd: 'init',
          })
        })
      })
    })()
  )
})
// eslint-disable-next-line no-restricted-globals
self.addEventListener('fetch', async (event) => {
  const request = event.request

  const requestUrl = new URL(request.url)

  if (requestUrl.pathname === '/alive-app.js') {
    event.respondWith(
      new Response(
        `
      import React from "/react"
      import ReactDOM from '/react-dom';
      import AliveComponent from "/alive-component.jsx?t=${Date.now()}"

      import runtime from '/react-refresh/runtime'
      runtime.injectIntoGlobalHook(window)
      window.$RefreshReg$ = () => {}
      window.$RefreshSig$ = () => (type) => type

      ReactDOM.render(
        React.createElement(AliveComponent),
        document.getElementById('alive')
      );
      `,
        {
          headers: { 'Content-Type': 'application/javascript; charset=UTF-8' },
        }
      )
    )
  }
  if (requestUrl.pathname === '/alive-component.jsx') {
    event.respondWith(
      (async () => {
        const cache = await caches.open('my-cache')
        const response = await cache.match('/alive-component.jsx')
        return response
      })()
    )
  }
  if (requestUrl.pathname === '/react') {
    event.respondWith(
      new Response(
        `
      ${reactRaw};
      export default React
      `,
        {
          headers: { 'Content-Type': 'application/javascript; charset=UTF-8' },
        }
      )
    )
  }
  if (requestUrl.pathname === '/react-dom') {
    event.respondWith(
      new Response(
        `
      ${reactDomRaw};
      export default ReactDOM
      `,
        {
          headers: { 'Content-Type': 'application/javascript; charset=UTF-8' },
        }
      )
    )
  }
  if (requestUrl.pathname === '/react-refresh/runtime') {
    event.respondWith(
      new Response(
        `
      const process = {
        env: {NODE_ENV: ''}
      }
      const exports = {}
      ${reactFreshRaw};
      export default exports
      `,
        {
          headers: { 'Content-Type': 'application/javascript; charset=UTF-8' },
        }
      )
    )
  }
})

self.addEventListener('message', async (event) => {
  const { data } = event
  if (data.cmd === 'update') {
    console.time('babel')
    const code = Babel.transform(data.value, {
      plugins: [
        Babel.availablePlugins['syntax-jsx'],
        [
          Babel.availablePlugins['transform-react-jsx'],
          {
            pragma: 'React.createElement',
            pragmaFrag: 'React.Fragment',
          },
        ],
        [reactRefreshPlugin, { skipEnvCheck: true }],
      ],
    }).code
    console.timeEnd('babel')
    const response = new Response(
      `
import React from "/react";
var prevRefreshReg = window.$RefreshReg$;
var prevRefreshSig = window.$RefreshSig$;
import RefreshRuntime from '/react-refresh/runtime';

window.$RefreshReg$ = (type, id) => {
  // Note module.id is webpack-specific, this may vary in other bundlers
  const fullId = 1 + ' ' + id;
  RefreshRuntime.register(type, fullId);
}
window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;

${code}

window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
    `,
      {
        headers: { 'Content-Type': 'application/javascript; charset=UTF-8' },
      }
    )

    const cache = await caches.open('my-cache')
    cache.put('/alive-component.jsx', response).then(() => {
      self.clients.matchAll().then(function (clients) {
        clients.forEach(function (client) {
          client.postMessage({
            cmd: 'update',
          })
        })
      })
    })
  }
})
