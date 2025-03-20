import React, { useEffect, useState } from 'react'
import { WebviewTag } from 'electron'
interface WebViewToolBarProps {
  webviewRef: React.RefObject<WebviewTag>
}
function WebViewToolBar({ webviewRef }: WebViewToolBarProps): React.JSX.Element {

  const [cssKey, setCssKey] = useState<string | null>(null)
  const [transparentKey, setTransparent] = useState<string | null>(null)
  const [opacity, setOpacity] = useState<number>(0.5)
  const [isWebviewReady, setIsWebviewReady] = useState<boolean>(false)
  const [controlsVisible, setControlsVisible] = useState<boolean>(true)


  const setBackgroundTransparent = async (): Promise<void> => {
    if (webviewRef.current && isWebviewReady) {
      try {
        const key = await webviewRef.current.insertCSS(`
          * {
            background-color: transparent !important;
          }`)
        setTransparent(key)
      } catch (error) {
        console.error('[setBackgroundTransparent] error :', error)
      }
    } else {
      console.warn('WebView 尚未准备好或不可用')
    }
  }
  const removeBackgroundTransparent = async (): Promise<void> => {
    if (webviewRef.current && isWebviewReady) {
      try {
        if (transparentKey) {
          await webviewRef.current.removeInsertedCSS(transparentKey)
          setTransparent(null)
        }
      } catch (error) {
        console.error('[removeBackgroundTransparent] error :', error)
      }
    } else {
      console.warn('WebView 尚未准备好或不可用')
    }
  }
  // 设置 CSS
  const setCSS = async (): Promise<void> => {
    if (webviewRef.current && isWebviewReady) {
      try {
        // 如果存在之前注入的 CSS，先移除它
        if (cssKey) {
          await webviewRef.current.removeInsertedCSS(cssKey)
        }
        const key = await webviewRef.current.insertCSS(`
          body {
            opacity: ${opacity} !important;
          }
        `)
        setCssKey(key)
      } catch (error) {}
    } else {

    }
  }

  // 清除 CSS
  const clearCSS = async (): Promise<void> => {
    if (webviewRef.current && cssKey && isWebviewReady) {
      try {
        await webviewRef.current.removeInsertedCSS(cssKey)
        setCssKey(null)
      } catch (error) {}
    } else {
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

      const handleKeyDown = (event: KeyboardEvent): void => {
        // 检查组合键 (Ctrl+H)
        if (event.metaKey && event.key === 'p') {
          toggleControls() // 切换控制面板可见性
        }
      }
      window.addEventListener('keydown', handleKeyDown)
      return (): void => {
        webview.removeEventListener('dom-ready', handleReady)
        window.removeEventListener('keydown', handleKeyDown)
      }
    }

    // 当 webview 不存在时返回空函数作为清理函数
    return (): void => {}
    //空数组代表只在组件挂载时执行
  }, [])

  // 当 opacity 变化时自动应用 CSS
  useEffect(() => {
    if (isWebviewReady) {
      setCSS()
    }
  }, [opacity])

  const handleOpacityChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setOpacity(parseFloat(event.target.value))
  }
  const toggleControls = (): void => {
    setControlsVisible((prev) => !prev)
  }
  return (
    <div className="webview-container">
      <div className="controls">
        {controlsVisible && (
          <div className="controls">
            <button onClick={setBackgroundTransparent}>Set Transparent</button>
            <button onClick={removeBackgroundTransparent}>
              Remove Transparent
            </button>
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
        )}
      </div>
    </div>
  )
}

export default WebViewToolBar
