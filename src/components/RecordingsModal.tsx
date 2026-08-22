import React from 'react';
import { X, Mic, Download, Trash2, Play, Music, Calendar, Clock } from 'lucide-react';
import { useRadio } from '../context/RadioContext';

interface RecordingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RecordingsModal: React.FC<RecordingsModalProps> = ({ isOpen, onClose }) => {
  const { recordings, deleteRecording, isRecording, recordingDurationSec, stopRecording } = useRadio();

  if (!isOpen) return null;

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const formatSize = (bytes: number) => {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-[#0F0F0F] border border-[#262626] rounded-2xl shadow-2xl overflow-hidden p-6 max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#181818] border border-[#333333] flex items-center justify-center text-[#FF3D00]">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider">Radio Recordings</h3>
              <p className="text-xs text-[#888888] font-malayalam">
                റെക്കോർഡ് ചെയ്ത പാട്ടുകളും റേഡിയോ ക്ലിപ്പുകളും
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#888888] hover:text-white rounded-lg hover:bg-[#1A1A1A] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Recording Alert */}
        {isRecording && (
          <div className="my-3 p-3.5 rounded-xl bg-[#FF3D00]/15 border border-[#FF3D00]/40 flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-2 text-[#FF3D00] font-bold text-xs font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF3D00]"></span>
              <span>RECORDING STREAM LIVE ({recordingDurationSec}s)</span>
            </div>
            <button
              onClick={stopRecording}
              className="px-3 py-1 bg-[#FF3D00] text-black rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-white transition"
            >
              Stop & Save
            </button>
          </div>
        )}

        {/* Recordings List */}
        <div className="my-4 overflow-y-auto flex-1 space-y-3">
          {recordings.length === 0 ? (
            <div className="py-12 text-center text-[#888888] space-y-2">
              <Mic className="w-10 h-10 mx-auto text-[#444444] stroke-1" />
              <p className="text-sm font-semibold text-[#CCCCCC]">No radio clips recorded yet</p>
              <p className="text-xs max-w-xs mx-auto text-[#666666]">
                Click the microphone icon in the bottom player bar while listening to record and save any song or broadcast snippet.
              </p>
            </div>
          ) : (
            recordings.map(rec => (
              <div 
                key={rec.id}
                className="p-3.5 rounded-xl bg-[#0A0A0A] border border-[#262626] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#444444] transition"
              >
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-white truncate flex items-center gap-2">
                    <Music className="w-4 h-4 text-[#FF3D00] flex-shrink-0" />
                    <span className="truncate">{rec.stationName}</span>
                  </h4>
                  <div className="flex items-center gap-3 text-[11px] text-[#888888] mt-1">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-[#666666]" />
                      {formatDuration(rec.durationSec)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#666666]" />
                      {new Date(rec.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span>•</span>
                    <span className="font-mono">{formatSize(rec.sizeBytes)}</span>
                  </div>

                  {/* Audio preview control */}
                  <audio 
                    controls 
                    src={rec.blobUrl} 
                    className="w-full mt-2.5 h-8 scale-95 origin-left"
                  />
                </div>

                <div className="flex items-center gap-2 justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-[#262626]">
                  <a
                    href={rec.blobUrl}
                    download={`Malayalam-Radio-${rec.stationName.replace(/\s+/g, '-')}-${rec.id}.webm`}
                    className="p-2 rounded-lg bg-[#181818] text-[#FF3D00] hover:bg-[#FF3D00] hover:text-black border border-[#333333] transition flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider"
                    title="Download Clip"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Save</span>
                  </a>

                  <button
                    onClick={() => deleteRecording(rec.id)}
                    className="p-2 rounded-lg text-[#888888] hover:text-red-400 hover:bg-red-500/10 transition"
                    title="Delete recording"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#262626] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#141414] hover:bg-[#202020] text-white border border-[#333333] transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
