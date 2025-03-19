import './assets/App.css'
import WebView from '@renderer/components/WebView'
import React from 'react'

function App(): React.JSX.Element {
  return (
    <div className="app-container">
      <WebView url="https://weread.qq.com/" />
      {/* <WebView url="https://www.baidu.com" /> */}
    </div>
  )
}

export default App
