import './assets/App.css'
import WebView from "@renderer/components/WebView";


function App(): JSX.Element {
  return (
    <div className="app-container">
      <WebView url="https://weread.qq.com/" />
    </div>
  )
}

export default App
