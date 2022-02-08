import { BackendModule, MultiReadCallback, ReadCallback, ResourceLanguage } from "i18next";
type LoadPathOption = null | string;
type AddPathOption = null | string;
export const readFileRequest: string;
export const writeFileRequest: string;
export const readFileResponse: string;
export const writeFileResponse: string;
export const changeLanguageRequest: string;
export function preloadBindings (ipcRenderer: any, process: any, path: any): void;
interface MainBindingsOptions {
  absPath: string;
}
export function mainBindings (ipcMain: any, browserWindow: any, fs: any, path: any, options: MainBindingsOptions): void;
export function clearMainBindings (ipcMain: any): void;
interface BackendOptions {
   loadPath?: LoadPathOption;
   addPath?: AddPathOption;
   debug?: boolean;
}
export default class Backend 
implements BackendModule<BackendOptions>
{
  constructor(services?: any, options?: BackendOptions);
  type: "backend";
  read(language: string, namespace: string, callback: ReadCallback): void;
  create(languages: readonly string[], namespace: string, key: string, fallbackValue: string): void;
  readMulti(languages: readonly string[], namespaces: readonly string[], callback: MultiReadCallback): void;
  requestFileRead(filename: string, callback: CallableFunction): void;
  write(writeQueue: any): void;
  setupIpcBindings(): void;
  init(services?: any, options?: BackendOptions): void;
}