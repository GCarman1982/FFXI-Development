import { useEffect, useState } from "react";
import { UpdaterEvent } from "../types/electron";

export function UpdateProgress() {
    const [status, setStatus] = useState<'idle' | 'checking' | 'downloading' | 'downloaded' | 'error'>('idle');
    const [progress, setProgress] = useState(0);
    const [version, setVersion] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        if (!window.electronAPI) return;

        window.electronAPI.onUpdaterEvent((_event: any, data: UpdaterEvent) => {
            if (data.type === 'update-available') {
                setStatus('checking');
                setVersion(data.info?.version || null);
            } else if (data.type === 'download-progress') {
                setStatus('downloading');
                setProgress(data.progress?.percent || 0);
            } else if (data.type === 'update-downloaded') {
                setStatus('downloaded');
                setProgress(100);
            } else if (data.type === 'error') {
                setStatus('error');
                setErrorMsg(data.error || 'Unknown error occurred.');
            }
        });
    }, []);

    if (status === 'idle') return null;

    return (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[100] w-96 
                    bg-black/90 backdrop-blur-lg border border-white/20 rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.6)] 
                    p-4 overflow-hidden ff-window transition-all duration-500 animate-in slide-in-from-bottom-5 fade-in">

            {/* Header */}
            <div className="flex justify-between items-center mb-2 no-hand">
                <h3 className="text-sm font-semibold" style={{ color: '#DCDCAA' }}>
                    {status === 'checking' && 'Update Available'}
                    {status === 'downloading' && 'Downloading Update...'}
                    {status === 'downloaded' && 'Update Ready'}
                    {status === 'error' && 'Update Failed'}
                </h3>
                {version && <span className="text-xs opacity-50 cursor-default">v{version}</span>}
            </div>

            {status === 'error' ? (
                <div className="text-red-400 text-xs no-hand">
                    {errorMsg}
                </div>
            ) : (
                <div className="no-hand">
                    {/* Progress Bar Track */}
                    <div className="w-full h-2.5 bg-black/50 border border-white/10 rounded-full overflow-hidden mb-1 relative shadow-inner">
                        <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[rgba(100,150,255,0.8)] to-[rgba(150,200,255,0.9)] transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                        {/* Subtle gloss line */}
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-white/30" />
                    </div>

                    {/* Details */}
                    {status === 'downloading' && (
                        <div className="flex justify-end min-h-[16px]">
                            <span className="text-[10px] opacity-70 tabular-nums font-mono">
                                {progress.toFixed(1)}%
                            </span>
                        </div>
                    )}

                    {status === 'downloaded' && (
                        <button
                            onClick={() => window.electronAPI.installUpdate()}
                            className="mt-3 w-full py-2 px-3 bg-[rgba(30,60,100,0.6)] hover:bg-[rgba(50,90,140,0.8)] 
                           border border-[rgba(100,150,255,0.4)] rounded text-sm text-blue-50 
                           transition-all duration-200 active:scale-95 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                        >
                            Restart & Install
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
