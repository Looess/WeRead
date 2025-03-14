import { useEffect, useRef, useState } from 'react'
import { WebviewTag } from 'electron'
interface WebViewProps {
  url: string
  className?: string
}

function WebView({ url }: WebViewProps): JSX.Element {
  const webviewRef = useRef<WebviewTag>(null)
  const [cssKey, setCssKey] = useState<string | null>(null)
  const [opacity, setOpacity] = useState<number>(0.5)
  const [isWebviewReady, setIsWebviewReady] = useState<boolean>(false)

  // 设置 CSS
  const setCSS = async (): Promise<void> => {
    if (webviewRef.current && isWebviewReady) {
      try {
        // 如果存在之前注入的 CSS，先移除它
        if (cssKey) {
          await webviewRef.current.removeInsertedCSS(cssKey)
        }

        // 注入新的 CSS
        const key = await webviewRef.current.insertCSS(`
          * {
            background-color: transparent !important;
          }
          body {
            opacity: ${opacity} !important;
          }
        `)
        setCssKey(key)
        console.log('CSS 已成功注入，键值为:', key)
      } catch (error) {
        console.error('应用 CSS 失败:', error)
      }
    } else {
      console.warn('WebView 尚未准备好或不可用')
    }
  }

  // 清除 CSS
  const clearCSS = async (): Promise<void> => {
    if (webviewRef.current && cssKey && isWebviewReady) {
      try {
        await webviewRef.current.removeInsertedCSS(cssKey)
        console.log('CSS 已成功清除')
        setCssKey(null)
      } catch (error) {
        console.error('清除 CSS 失败:', error)
      }
    } else {
      console.warn('没有可清除的 CSS 或 WebView 不可用')
    }
  }

  useEffect(() => {
    // 监听 webview dom-ready 事件
    const webview = webviewRef.current
    if (webview) {
      const handleReady = (): void => {
        console.log('WebView DOM 已准备好')
        setIsWebviewReady(true)
      }

      webview.addEventListener('dom-ready', handleReady)

      // 清理函数
      return (): void => {
        webview.removeEventListener('dom-ready', handleReady)
      }
    }

    // 当 webview 不存在时返回空函数作为清理函数
    return (): void => {}
  }, [])

  // 当 opacity 变化时自动应用 CSS
  useEffect(() => {
    if (isWebviewReady) {
      setCSS()
    }
  }, [opacity, isWebviewReady])

  const handleOpacityChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setOpacity(parseFloat(event.target.value))
  }

  return (
    <div className="webview-container">
      <div className="controls">
        <button onClick={setCSS}>Set CSS</button>
        <button onClick={clearCSS}>Clear CSS</button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={opacity}
          onChange={handleOpacityChange}
        />
      </div>
      <div className="webview-wrapper">
        <webview ref={webviewRef} src={url} className="webview"></webview>
      </div>
    </div>
  )
}

export default WebView
