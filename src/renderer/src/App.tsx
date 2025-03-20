import './assets/App.css'
// import WebView from '@renderer/components/WebView'
import React from 'react'
import WebViewBase from "@renderer/components/WebViewBase";

function App(): React.JSX.Element {
  return (
    <div className="app-container">
      {/* <WebView url="https://weread.qq.com/" /> */}
      {/*<WebView url="https://www.baidu.com" />*/}
        <WebViewBase url="https://www.baidu.com" />
    </div>
  )
}

export default App
