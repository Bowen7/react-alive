import { useEffect, useState, useRef } from 'react'
import { Controlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/mode/javascript/javascript'
import runtime from 'serviceworker-webpack-plugin/lib/runtime'
// eslint-disable-next-line import/no-webpack-loader-syntax
import template from '!!raw-loader!./template.jsx'
import './App.css'
function App() {
  const [value, setValue] = useState(template)
  const [loading, setLoading] = useState(true)
  const script = useRef()
  const init = () => {
    setLoading(false)
    navigator.serviceWorker.controller.postMessage({ cmd: 'update', value })
  }
  const handleChange = (editor, data, value) => {
    navigator.serviceWorker.controller.postMessage({ cmd: 'update', value })
  }

  useEffect(() => {
    let registration
    if ('serviceWorker' in navigator) {
      registration = runtime.register()
      registration.then((res) => {
        if (res.active) {
          init()
        }
      })

      navigator.serviceWorker.addEventListener('message', (event) => {
        const { data } = event
        if (data.cmd === 'init') {
          init()
        } else if (data.cmd === 'update') {
          if (script.current) {
            window.hotUpdate()
          } else {
            script.current = document.createElement('script')
            script.current.type = 'module'
            script.current.innerHTML = `
          import "/alive-app.js"
          window.hotUpdate = async () => {
            await import("/alive-component.jsx?t=" + Date.now())
            const RefreshRuntime = (await import('/react-refresh/runtime')).default;
            RefreshRuntime.performReactRefresh()
          }
          `
            document.body.appendChild(script.current)
          }
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <>
      {loading ? (
        <p>loading...</p>
      ) : (
        <div className="App">
          <CodeMirror
            value={value}
            options={{
              mode: 'javascript',
              theme: 'material',
              lineNumbers: true,
            }}
            onBeforeChange={(editor, data, value) => {
              setValue(value)
            }}
            onChange={handleChange}
          />
          <div id="alive"></div>
        </div>
      )}
    </>
  )
}

export default App
