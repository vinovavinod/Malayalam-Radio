import React, { useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Volume1,
  Maximize2, 
  Heart, 
  Sliders, 
  Clock, 
  Mic, 
  Square,
  AlertCircle,
  Radio,
  Zap,
  RotateCw,
  Sparkles
} from 'lucide-react';
import { useRadio } from '../context/RadioContext';

interface AudioPlayerBarProps {
  onOpenVisualizerModal: () => void;
  onOpenEqModal: () => void;
  onOpenSleepModal: () => void;
  onOpenRecordingsModal: () => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  onOpenVisualizerModal,
  onOpenEqModal,
  onOpenSleepModal,
}) => {
  const {
    currentStation,
    playbackStatus,
    errorMessage,
    volume,
    isMuted,
    isBoosted,
    favorites,
    togglePlayPause,
    playNextStation,
    playPreviousStation,
    setVolume,
    toggleMute,
    toggleBoost,
    toggleFavorite,
    sleepTimerRemainingSec,
    isRecording,
    recordingDurationSec,
    startRecording,
    stopRecording,
    analyserNode,
    playStation
  } = useRadio();

  const miniCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Mini canvas waveform visualizer in bottom player bar
  useEffect(() => {
    if (!miniCanvasRef.current || !analyserNode || playbackStatus !== 'playing') {
      if (miniCanvasRef.current) {
        const ctx = miniCanvasRef.current.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, miniCanvasRef.current.width, miniCanvasRef.current.height);
      }
      return;
    }

    const canvas = miniCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      analyserNode.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barCount = 18;
      const barWidth = 3;
      const gap = 2;
      const totalWidth = barCount * (barWidth + gap);
      const startX = (canvas.width - totalWidth) / 2;

      for (let i = 0; i < barCount; i++) {
        const index = Math.floor((i / barCount) * (bufferLength / 2));
        const val = dataArray[index] || 0;
        const barHeight = Math.max(2, (val / 255) * canvas.height * 0.9);
        const x = startX + i * (barWidth + gap);
        const y = canvas.height - barHeight;

        // Gradient from bright Onam gold to amber
        const grad = ctx.createLinearGradient(0, y, 0, canvas.height);
        grad.addColorStop(0, '#FFE066');
        grad.addColorStop(0.5, '#FFD700');
        grad.addColorStop(1, '#D4AF37');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 1);
        ctx.fill();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [analyserNode, playbackStatus]);

  if (!currentStation) return null;

  const isFav = favorites.includes(currentStation.id);

  const formatSleepTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div 
      id="bottom-audio-player-bar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#14100B]/95 backdrop-blur-xl border-t border-amber-500/40 px-3 sm:px-6 py-2.5 shadow-2xl transition-all shadow-black/80"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Left: Station Info & Artwork */}
        <div className="flex items-center gap-3 w-full md:w-1/3 min-w-0 justify-between md:justify-start">
          <div className="flex items-center gap-3 min-w-0">
            {/* Artwork Icon with Pulse & Mini Visualizer */}
            <div 
              onClick={onOpenVisualizerModal}
              className={`relative flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center shadow-lg bg-[#221B12] border border-amber-500/40 hover:border-amber-400 text-amber-300 font-bold cursor-pointer group`}
              title="Click to open Fullscreen Visualizer"
            >
              {playbackStatus === 'playing' ? (
                <canvas 
                  ref={miniCanvasRef} 
                  width={48} 
                  height={32} 
                  className="w-full h-8 px-1"
                />
              ) : (
                <Radio className="w-5 h-5 text-amber-400/60" />
              )}
              <div className="absolute inset-0 bg-[#0E0B08]/70 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Maximize2 className="w-3.5 h-3.5 text-amber-300" />
              </div>
            </div>

            {/* Titles */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-[#FAF7F0] truncate">
                  {currentStation.name}
                </h4>
                {currentStation.frequency && (
                  <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-400/35">
                    {currentStation.frequency}
                  </span>
                )}
              </div>
              <p className="text-xs font-malayalam text-amber-200/70 truncate">
                {currentStation.malayalamName || currentStation.location || 'Malayalam Live Broadcast'}
              </p>
            </div>
          </div>

          {/* Favorite Toggle */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              id="player-fav-btn"
              onClick={() => toggleFavorite(currentStation.id)}
              className={`p-2 rounded-xl transition ${
                isFav
                  ? 'text-rose-400 bg-rose-500/20 hover:bg-rose-500/30'
                  : 'text-amber-200/50 hover:text-amber-100 hover:bg-[#251D14]'
              }`}
              title={isFav ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-400 text-rose-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Center: Playback Controls & Status */}
        <div className="flex flex-col items-center gap-1 w-full md:w-1/3">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Previous Station */}
            <button
              id="prev-station-btn"
              onClick={playPreviousStation}
              className="p-2 text-amber-300/70 hover:text-amber-100 hover:bg-[#251D14] rounded-full transition active:scale-95"
              title="Previous Station"
            >
              <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Big Play/Pause Main Button in Kasavu Gold */}
            <button
              id="main-play-pause-btn"
              onClick={togglePlayPause}
              disabled={playbackStatus === 'loading'}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 text-black flex items-center justify-center shadow-lg shadow-amber-500/30 transition-all active:scale-90 disabled:opacity-75"
              title={playbackStatus === 'playing' ? 'Pause Stream' : 'Play Stream'}
            >
              {playbackStatus === 'loading' ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : playbackStatus === 'playing' ? (
                <Pause className="w-5 h-5 fill-black text-black" />
              ) : (
                <Play className="w-5 h-5 fill-black text-black ml-0.5" />
              )}
            </button>

            {/* Next Station */}
            <button
              id="next-station-btn"
              onClick={playNextStation}
              className="p-2 text-amber-300/70 hover:text-amber-100 hover:bg-[#251D14] rounded-full transition active:scale-95"
              title="Next Station"
            >
              <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Streaming Status Line */}
          <div className="flex items-center gap-2 text-[10px] uppercase font-mono tracking-wider">
            {playbackStatus === 'playing' ? (
              <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                <span>Live Broadcast</span>
                <span className="text-amber-500/40">•</span>
                <span className="text-amber-200/80">{currentStation.bitrate || '128 kbps'}</span>
              </span>
            ) : playbackStatus === 'loading' ? (
              <span className="flex items-center gap-1.5 text-amber-300 animate-pulse">
                <span>Connecting to stream...</span>
              </span>
            ) : playbackStatus === 'error' ? (
              <div className="flex items-center gap-1.5 text-rose-400">
                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                <span className="truncate max-w-[200px]">{errorMessage || 'Stream offline'}</span>
                <button
                  onClick={() => playStation(currentStation)}
                  className="underline text-amber-300 hover:text-amber-100 font-bold ml-1 flex items-center gap-0.5"
                >
                  <RotateCw className="w-3 h-3" /> Retry
                </button>
              </div>
            ) : (
              <span className="text-neutral-500">Paused</span>
            )}
          </div>
        </div>

        {/* Right: Audio Volume, Boost, Equalizer, Recording, Sleep Timer, Fullscreen */}
        <div className="flex items-center justify-end gap-2 w-full md:w-1/3">
          
          {/* Record Button */}
          <button
            id="player-record-btn"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={playbackStatus !== 'playing' && !isRecording}
            className={`p-2 rounded-xl border transition ${
              isRecording
                ? 'bg-rose-500/25 text-rose-300 border-rose-500 animate-pulse'
                : 'text-amber-200/70 hover:text-amber-100 bg-[#1D160E] border-amber-500/30 hover:bg-[#2A2015] disabled:opacity-40'
            }`}
            title={isRecording ? 'Stop Recording Clip' : 'Record Radio Clip'}
          >
            {isRecording ? <Square className="w-4 h-4 fill-rose-400 text-rose-400" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Equalizer Trigger */}
          <button
            id="player-eq-btn"
            onClick={onOpenEqModal}
            className="p-2 text-amber-200/70 hover:text-amber-100 bg-[#1D160E] border border-amber-500/30 hover:bg-[#2A2015] rounded-xl transition"
            title="Audio Equalizer"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Sleep Timer Indicator */}
          <button
            id="player-sleep-btn"
            onClick={onOpenSleepModal}
            className={`flex items-center gap-1 p-2 rounded-xl border transition ${
              sleepTimerRemainingSec !== null
                ? 'bg-amber-500/25 text-amber-300 border-amber-400'
                : 'text-amber-200/70 hover:text-amber-100 bg-[#1D160E] border-amber-500/30 hover:bg-[#2A2015]'
            }`}
            title="Sleep Timer"
          >
            <Clock className="w-4 h-4 text-amber-400" />
            {sleepTimerRemainingSec !== null && (
              <span className="font-mono text-xs font-bold text-amber-300">
                {formatSleepTime(sleepTimerRemainingSec)}
              </span>
            )}
          </button>

          {/* Volume Slider & Boost */}
          <div className="hidden sm:flex items-center gap-2 bg-[#1D160E] border border-amber-500/30 px-2.5 py-1.5 rounded-xl">
            <button
              id="player-mute-btn"
              onClick={toggleMute}
              className="text-amber-300/80 hover:text-amber-100 transition"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : volume < 0.5 ? (
                <Volume1 className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>

            <input
              id="player-volume-slider"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-18 sm:w-22 h-1 bg-[#3A2E20] rounded-lg appearance-none cursor-pointer accent-amber-400"
              title={`Volume: ${Math.round(volume * 100)}%`}
            />

            {/* 150% Volume Boost Button */}
            <button
              id="player-boost-btn"
              onClick={toggleBoost}
              className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold font-mono transition flex items-center gap-0.5 ${
                isBoosted
                  ? 'bg-amber-400 text-black shadow-sm shadow-amber-400/50'
                  : 'bg-[#2E2418] text-amber-300/70 hover:text-amber-100'
              }`}
              title="150% Audio Booster"
            >
              <Zap className="w-2.5 h-2.5 fill-current" />
              <span>150%</span>
            </button>
          </div>

          {/* Visualizer Fullscreen Button */}
          <button
            id="player-fullscreen-visualizer-btn"
            onClick={onOpenVisualizerModal}
            className="p-2 text-amber-200/70 hover:text-amber-100 bg-[#1D160E] border border-amber-500/30 hover:bg-[#2A2015] rounded-xl transition"
            title="Open Audio Visualizer"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
