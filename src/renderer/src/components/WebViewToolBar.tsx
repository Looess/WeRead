import React, {useCallback, useEffect, useState} from 'react'
import { throttle } from 'lodash';
import { WebviewTag } from 'electron'


interface WebViewToolBarProps {
  webviewRef: React.RefObject<WebviewTag>
}


function WebViewToolBar({ webviewRef }: WebViewToolBarProps): React.JSX.Element {

  const [webViewOpacityKey, setWebViewOpacityKey] = useState<string | null>(null)
  const [webViewTransparentKey, setWebViewTransparentKey] = useState<string | null>(null)
  const [opacity, setOpacity] = useState<number>(1)

  const [isWebviewReady, setIsWebviewReady] = useState<boolean>(false)
  const [toolBarVisible, setToolBarVisible] = useState<boolean>(true)
  const [isPinned, setIsPinned] = useState(false);


  const setWebViewBackgroundTransparent = async (): Promise<void> => {
    if (webviewRef.current) {
      const key = await webviewRef.current.insertCSS(`
          * {
            background-color: transparent !important;
          }`)
      setWebViewTransparentKey(key)
    }
  }
  const setWebViewOpacity = async (): Promise<void> => {
    if (webviewRef.current) {
      if (webViewOpacityKey) {
        await webviewRef.current.removeInsertedCSS(webViewOpacityKey)
      }
      const key = await webviewRef.current.insertCSS(`
          body {
            opacity: ${opacity} !important;
          }
        `)
      setWebViewOpacityKey(key)
    }
  }
  const setWebViewCss = async (): Promise<void> => {
    if (webviewRef.current) {
      if (!webViewOpacityKey) {
        await setWebViewOpacity()
      }
      if(!webViewTransparentKey) {
        await setWebViewBackgroundTransparent()
      }

    }
  }
  const removeWebViewCss = async (): Promise<void> => {
    if (webviewRef.current) {
      if (webViewOpacityKey) {
        await webviewRef.current.removeInsertedCSS(webViewOpacityKey)
        setWebViewOpacityKey(null)
      }
      if( webViewTransparentKey) {
        await webviewRef.current.removeInsertedCSS(webViewTransparentKey)
        setWebViewTransparentKey(null)
      }
    }
  }

  useEffect(() => {
    if (isWebviewReady) {
      setWebViewOpacity()
    }
  }, [opacity])


  useEffect(() => {
    const webview = webviewRef.current
    if (webview) {
      const handleReady = (): void => {
        setIsWebviewReady(true)

      }

      const handleKeyDown = (event: KeyboardEvent): void => {
        if (event.metaKey && event.key === 'p') {
          setToolBarVisible((prev) => !prev);
        }
      }
      setPinStatus()
      window.addEventListener('keydown', handleKeyDown)
      webview.addEventListener('dom-ready', handleReady)
      return (): void => {
        webview.removeEventListener('dom-ready', handleReady)
        window.removeEventListener('keydown', handleKeyDown)
      }
    }
    return (): void => {}
  }, [])
  const throttledChangeHandler = useCallback(
      throttle((value: number) => {
        setOpacity(value);
      }, 100),
      []
  );

  const setPinStatus = async () => {
    const status = await window.context.getPinStatus();
    setIsPinned(status);
  };
  const togglePin = async () => {
    const status = await window.context.togglePinToDesktop(!isPinned);
    setIsPinned(status);
  };


  return (
      <div>
        {toolBarVisible && (
            <div className="controls">
              <button onClick={setWebViewCss}>🌫️</button>
              <button onClick={removeWebViewCss}>❌</button>
              {
                  webViewOpacityKey && (
                      <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={opacity}
                          onChange={(e) => throttledChangeHandler(parseFloat(e.target.value))}

                      />
                  )
              }

              <button
                  onClick={togglePin}
                  title={isPinned ? "Unpin from desktop" : "Pin to desktop"}
              >
                {isPinned ? "📌" : "📍"}
              </button>

            </div>
        )}
      </div>

  )

}

export default WebViewToolBar
