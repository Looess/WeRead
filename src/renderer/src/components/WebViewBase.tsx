import React, { useRef } from 'react'
import { WebviewTag } from 'electron'
import WebViewToolBar from "@renderer/components/WebViewToolBar";
interface WebViewProps {
  url: string
  className?: string
}

function WebViewBase({ url }: WebViewProps): React.JSX.Element {
  const webviewRef = useRef<WebviewTag>(null)

  return (
    <div className="webview-container">
      <div className="controls">
        <WebViewToolBar webviewRef={webviewRef}></WebViewToolBar>
      </div>

      <div className="webview-wrapper">
        <webview ref={webviewRef} src={url} className="webview"></webview>
      </div>
    </div>
  )
}

export default WebViewBase
