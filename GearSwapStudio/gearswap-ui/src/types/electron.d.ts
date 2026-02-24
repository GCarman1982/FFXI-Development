export interface UpdaterEvent {
    type: 'update-available' | 'download-progress' | 'update-downloaded' | 'error';
    info?: any;
    progress?: {
        percent: number;
        bytesPerSecond: number;
        total: number;
        transferred: number;
    };
    error?: string;
}

declare global {
    interface Window {
        electronAPI: {
            node: () => string;
            chrome: () => string;
            electron: () => string;
            onUpdaterEvent: (callback: (event: any, data: UpdaterEvent) => void) => void;
            installUpdate: () => void;
        };
    }
}

export { };
