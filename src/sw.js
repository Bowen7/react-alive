self.addEventListener("fetch", event => {
  console.log(reactRaw)
  const request = event.request

  const requestUrl = new URL(request.url)
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
