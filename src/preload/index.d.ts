import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
  }
}
interface ContextAPI {
  locale: string;
  togglePinToDesktop: (shouldPin: boolean) => Promise<boolean>;
  getPinStatus: () => Promise<boolean>;
}

declare global {
  interface Window {
    context: ContextAPI;
  }
}
