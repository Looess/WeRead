import { useEffect, useRef, useState } from 'react'
import { WebviewTag } from 'electron'
interface WebViewProps {
  url: string
  className?: string
}

function WebView({ url}: WebViewProps): JSX.Element {
  const webviewRef = useRef<WebviewTag>(null)
  const [cssKey, setCssKey] = useState<string | null>(null)
  const [opacity, setOpacity] = useState<number>(0.5)
  // 设置 CSS
  const setCSS = async (): Promise<void> => {
    if (webviewRef.current) {
      try {
        const key = await webviewRef.current.insertCSS(`
          * {
            background-color: transparent !important;
        
          }
          body{
            opacity: ${opacity} !important;
          }
        `)
        setCssKey(key)
      } catch (error) {
        console.error('应用 CSS 失败:', error)
      }
    }
  }

  // 清除 CSS
  const clearCSS = (): void => {
    if (webviewRef.current && cssKey) {
      try {
        // 使用保存的键移除 CSS
        webviewRef.current.removeInsertedCSS(cssKey)
        setCssKey(null)
      } catch (error) {
        console.error('清除 CSS 失败:', error)
      }
    } else {
      console.warn('没有可清除的 CSS 或 WebView 不可用')
    }
  }

  useEffect(() => {}, [])
  const handleOpacityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOpacity(parseFloat(event.target.value))
    setCSS()
  }
  return (
    <div  style={{ width: '100%', height: '100%'}}>
      <button onClick={setCSS} style={{ marginLeft : '100px'}}>Set CSS</button>
      <button onClick={clearCSS}>clear CSS</button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={opacity}
        onChange={handleOpacityChange}
      />
      <webview ref={webviewRef} src={url} style={{ width: '100%', height: '100%' }}></webview>
    </div>
  )
}

export default WebView
