export interface UpdaterEvent {
    type: 'update-available' | 'download-progress' | 'update-downloaded' | 'error' | 'log';
    message?: string;
    info?: { version?: string };
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
            onUpdaterEvent: (callback: (event: unknown, data: UpdaterEvent) => void) => void;
            checkForUpdates: () => void;
            downloadUpdate: () => void;
            installUpdate: () => void;
        };
    }
}

export { };
