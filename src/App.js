import { useEffect } from "react"
import runtime from "offline-plugin/runtime"
import "./App.css"

function App() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      console.log(123)
      console.log(12, runtime.install())
      const script = document.createElement("script")
      script.type = "module"
      script.innerText = `
        import "/alive-app.js"
        `
      document.body.appendChild(script)
    }
    return () => {
      // if (registration) {
      //   registration.then(res => res.unregister())
      // }
    }
  }, [])
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>rc/App.js</code> and save to reload.
        </p>
      </header>
    </div>
  )
}

export default App
