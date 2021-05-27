// eslint-disable-next-line import/no-webpack-loader-syntax
const reactRaw = require("raw-loader!./index.css")
self.addEventListener("fetch", event => {
  const request = event.request

  const requestUrl = new URL(request.url)
  console.log(requestUrl)

  console.log(11, "default" in reactRaw)
  if (requestUrl.pathname === "/alive-app.js") {
    event.respondWith(
      new Response(
        `
      console.log(13);
      `,
        {
          headers: { "Content-Type": "application/javascript; charset=UTF-8" },
        }
      )
    )
  }
  if (requestUrl.pathname === "/react") {
    event.respondWith(new Response())
  }
})
