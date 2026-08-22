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
  RotateCw
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
  onOpenRecordingsModal,
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
      // Clear canvas if paused
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

        // Gradient from bright flame to orange
        const grad = ctx.createLinearGradient(0, y, 0, canvas.height);
        grad.addColorStop(0, '#FF3D00');
        grad.addColorStop(1, '#FF6D00');

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
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-xl border-t border-[#262626] px-3 sm:px-6 py-2.5 shadow-2xl transition-all"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Left: Station Info & Artwork */}
        <div className="flex items-center gap-3 w-full md:w-1/3 min-w-0 justify-between md:justify-start">
          <div className="flex items-center gap-3 min-w-0">
            {/* Artwork Icon with Pulse & Mini Visualizer */}
            <div 
              onClick={onOpenVisualizerModal}
              className={`relative flex-shrink-0 w-11 h-11 rounded-lg flex items-center justify-center shadow-lg bg-[#141414] border border-[#333333] hover:border-[#FF3D00] text-white font-bold cursor-pointer group`}
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
                <Radio className="w-5 h-5 text-[#888888]" />
              )}
              <div className="absolute inset-0 bg-[#0A0A0A]/60 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Maximize2 className="w-3.5 h-3.5 text-white" />
              </div>
            </div>

            {/* Titles */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-[#F0F0F0] truncate">
                  {currentStation.name}
                </h4>
                {currentStation.frequency && (
                  <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[#FF3D00]/10 text-[#FF3D00] border border-[#FF3D00]/30">
                    {currentStation.frequency}
                  </span>
                )}
              </div>
              <p className="text-xs font-malayalam text-[#888888] truncate">
                {currentStation.malayalamName || currentStation.location || 'Malayalam Live Broadcast'}
              </p>
            </div>
          </div>

          {/* Favorite & Quick Status Indicator */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              id="player-fav-btn"
              onClick={() => toggleFavorite(currentStation.id)}
              className={`p-2 rounded-lg transition ${
                isFav
                  ? 'text-[#FF3D00] bg-[#FF3D00]/15 hover:bg-[#FF3D00]/25'
                  : 'text-[#666666] hover:text-[#CCCCCC] hover:bg-[#1A1A1A]'
              }`}
              title={isFav ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-[#FF3D00] text-[#FF3D00]' : ''}`} />
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
              className="p-2 text-[#777777] hover:text-white hover:bg-[#1A1A1A] rounded-full transition active:scale-95"
              title="Previous Station"
            >
              <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Big Play/Pause Main Button */}
            <button
              id="main-play-pause-btn"
              onClick={togglePlayPause}
              disabled={playbackStatus === 'loading'}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#FF3D00] hover:bg-white text-black flex items-center justify-center shadow-lg shadow-[#FF3D00]/25 transition-all active:scale-90 disabled:opacity-75"
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
              className="p-2 text-[#777777] hover:text-white hover:bg-[#1A1A1A] rounded-full transition active:scale-95"
              title="Next Station"
            >
              <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Streaming Status Line */}
          <div className="flex items-center gap-2 text-[10px] uppercase font-mono tracking-wider">
            {playbackStatus === 'playing' ? (
              <span className="flex items-center gap-1.5 text-[#FF3D00] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF3D00] animate-pulse"></span>
                <span>Live Broadcast</span>
                <span className="text-[#444444]">•</span>
                <span className="text-[#888888]">{currentStation.bitrate || '128 kbps'}</span>
              </span>
            ) : playbackStatus === 'loading' ? (
              <span className="flex items-center gap-1.5 text-[#FF3D00] animate-pulse">
                <span>Buffering Stream...</span>
              </span>
            ) : playbackStatus === 'error' ? (
              <div className="flex items-center gap-1.5 text-[#FF3D00]">
                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                <span className="truncate max-w-[200px]">Stream offline</span>
                <button
                  onClick={() => playStation(currentStation)}
                  className="underline text-white hover:text-[#FF3D00] font-bold ml-1 flex items-center gap-0.5"
                >
                  <RotateCw className="w-3 h-3" /> Retry
                </button>
              </div>
            ) : (
              <span className="text-[#666666]">Paused</span>
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
            className={`p-2 rounded-lg border transition ${
              isRecording
                ? 'bg-[#FF3D00]/20 text-[#FF3D00] border-[#FF3D00] animate-pulse'
                : 'text-[#888888] hover:text-[#F0F0F0] bg-[#111111] border-[#333333] hover:bg-[#1A1A1A] disabled:opacity-40'
            }`}
            title={isRecording ? 'Stop Recording Clip' : 'Record Radio Clip'}
          >
            {isRecording ? <Square className="w-4 h-4 fill-[#FF3D00] text-[#FF3D00]" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Equalizer Modal Trigger */}
          <button
            id="player-eq-btn"
            onClick={onOpenEqModal}
            className="p-2 text-[#888888] hover:text-[#FF3D00] bg-[#111111] border border-[#333333] hover:bg-[#1A1A1A] rounded-lg transition"
            title="Audio Equalizer"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Sleep Timer Indicator */}
          <button
            id="player-sleep-btn"
            onClick={onOpenSleepModal}
            className={`flex items-center gap-1 p-2 rounded-lg border transition ${
              sleepTimerRemainingSec !== null
                ? 'bg-[#FF3D00]/20 text-[#FF3D00] border-[#FF3D00]'
                : 'text-[#888888] hover:text-[#F0F0F0] bg-[#111111] border-[#333333] hover:bg-[#1A1A1A]'
            }`}
            title="Sleep Timer"
          >
            <Clock className="w-4 h-4 text-[#FF3D00]" />
            {sleepTimerRemainingSec !== null && (
              <span className="font-mono text-xs font-bold text-[#FF3D00]">
                {formatSleepTime(sleepTimerRemainingSec)}
              </span>
            )}
          </button>

          {/* Volume Control */}
          <div className="hidden sm:flex items-center gap-2 bg-[#111111] border border-[#333333] px-2.5 py-1.5 rounded-lg">
            <button
              id="player-mute-btn"
              onClick={toggleMute}
              className="text-[#888888] hover:text-white transition"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-[#FF3D00]" />
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
              className="w-18 sm:w-22 h-1 bg-[#333333] rounded-lg appearance-none cursor-pointer accent-[#FF3D00]"
              title={`Volume: ${Math.round(volume * 100)}%`}
            />

            {/* 150% Volume Boost Button */}
            <button
              id="player-boost-btn"
              onClick={toggleBoost}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono transition flex items-center gap-0.5 ${
                isBoosted
                  ? 'bg-[#FF3D00] text-black shadow-sm shadow-[#FF3D00]/50'
                  : 'bg-[#222222] text-[#888888] hover:text-white'
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
            className="p-2 text-[#888888] hover:text-[#FF3D00] bg-[#111111] border border-[#333333] hover:bg-[#1A1A1A] rounded-lg transition"
            title="Open Audio Visualizer"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
