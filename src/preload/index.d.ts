import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI;
    context: ContextAPI;
    api: unknown;
  }
}
interface ContextAPI {
  locale: string;
  togglePinToDesktop: (shouldPin: boolean) => Promise<boolean>;
  getPinStatus: () => Promise<boolean>;
}
