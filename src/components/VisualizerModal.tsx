import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Radio, 
  Sparkles,
  Activity,
  Layers,
  CircleDot
} from 'lucide-react';
import { useRadio } from '../context/RadioContext';

interface VisualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type VisualizerMode = 'spectrum' | 'waveform' | 'radial' | 'vu-meter';

export const VisualizerModal: React.FC<VisualizerModalProps> = ({ isOpen, onClose }) => {
  const {
    currentStation,
    playbackStatus,
    togglePlayPause,
    playNextStation,
    playPreviousStation,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    analyserNode
  } = useRadio();

  const [mode, setMode] = useState<VisualizerMode>('spectrum');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isOpen || !canvasRef.current || !analyserNode || playbackStatus !== 'playing') {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const bufferLength = analyserNode.frequencyBinCount;
    const freqData = new Uint8Array(bufferLength);
    const timeData = new Uint8Array(bufferLength);

    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      analyserNode.getByteFrequencyData(freqData);
      analyserNode.getByteTimeDomainData(timeData);

      // Handle high DPI
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // MODE 1: SPECTRUM BARS
      if (mode === 'spectrum') {
        const barCount = 48;
        const barWidth = (width / barCount) * 0.7;
        const gap = (width / barCount) * 0.3;

        for (let i = 0; i < barCount; i++) {
          const index = Math.floor((i / barCount) * (bufferLength * 0.7));
          const val = freqData[index] || 0;
          const barHeight = Math.max(4, (val / 255) * height * 0.85);
          const x = i * (barWidth + gap) + gap / 2;
          const y = height - barHeight;

          // Gradient
          const gradient = ctx.createLinearGradient(0, y, 0, height);
          gradient.addColorStop(0, '#FF3D00');
          gradient.addColorStop(0.6, '#FF6D00');
          gradient.addColorStop(1, '#B71C1C');

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barHeight, [2, 2, 0, 0]);
          ctx.fill();

          // Glowing top cap
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.roundRect(x, y - 3, barWidth, 2, 1);
          ctx.fill();
        }
      }

      // MODE 2: WAVEFORM OSCILLOSCOPE
      else if (mode === 'waveform') {
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#FF3D00';
        ctx.shadowColor = '#FF3D00';
        ctx.shadowBlur = 8;
        ctx.beginPath();

        const sliceWidth = width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = timeData[i] / 128.0;
          const y = (v * height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }

        ctx.lineTo(width, height / 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // MODE 3: RADIAL SOUND MANDALA
      else if (mode === 'radial') {
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(centerX, centerY) * 0.45;

        // Inner glowing core
        const coreGradient = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, radius);
        coreGradient.addColorStop(0, 'rgba(255, 61, 0, 0.35)');
        coreGradient.addColorStop(1, 'rgba(10, 10, 10, 0.05)');
        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();

        const points = 64;
        for (let i = 0; i < points; i++) {
          const index = Math.floor((i / points) * (bufferLength * 0.6));
          const val = freqData[index] || 0;
          const barLen = (val / 255) * (radius * 0.8);
          const rad = (Math.PI * 2 / points) * i;

          const x1 = centerX + Math.cos(rad) * radius;
          const y1 = centerY + Math.sin(rad) * radius;
          const x2 = centerX + Math.cos(rad) * (radius + barLen);
          const y2 = centerY + Math.sin(rad) * (radius + barLen);

          ctx.strokeStyle = `hsl(${(i / points) * 35 + 10}, 100%, 55%)`;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }

      // MODE 4: RETRO DUAL VU METER
      else if (mode === 'vu-meter') {
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += freqData[i];
        }
        const avg = sum / bufferLength;
        const meterVal = Math.min(1, (avg / 140));

        const meterWidth = width * 0.4;
        const meterHeight = height * 0.65;

        // Left and Right Meters
        ['LEFT CHANNEL (L)', 'RIGHT CHANNEL (R)'].forEach((label, idx) => {
          const mx = idx === 0 ? width * 0.08 : width * 0.52;
          const my = height * 0.15;

          // Backlit dial plate
          ctx.fillStyle = '#0F0F0F';
          ctx.strokeStyle = '#333333';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(mx, my, meterWidth, meterHeight, 8);
          ctx.fill();
          ctx.stroke();

          // Scale Arc
          const cx = mx + meterWidth / 2;
          const cy = my + meterHeight * 0.85;
          const r = meterWidth * 0.42;

          ctx.strokeStyle = '#FF3D00';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(cx, cy, r, Math.PI * 1.2, Math.PI * 1.8);
          ctx.stroke();

          // Text & dB levels
          ctx.fillStyle = '#CCCCCC';
          ctx.font = 'bold 11px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(label, cx, my + 30);
          ctx.fillText('-20dB    -10dB    -5dB    0dB   +3dB', cx, my + 60);

          // Animated needle
          const angle = Math.PI * 1.2 + meterVal * (Math.PI * 0.6);
          const nx = cx + Math.cos(angle) * r;
          const ny = cy + Math.sin(angle) * r;

          ctx.strokeStyle = '#FF3D00';
          ctx.lineWidth = 2.5;
          ctx.shadowColor = '#FF3D00';
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(nx, ny);
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Pivot pin
          ctx.fillStyle = '#FF3D00';
          ctx.beginPath();
          ctx.arc(cx, cy, 5, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isOpen, mode, analyserNode, playbackStatus]);

  if (!isOpen || !currentStation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-2xl animate-fade-in">
      <div 
        className="relative w-full max-w-4xl bg-[#0F0F0F] border border-[#262626] rounded-2xl shadow-2xl overflow-hidden p-6 flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="w-full flex items-center justify-between border-b border-[#262626] pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#181818] border border-[#333333] text-[#FF3D00] shadow-lg">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                {currentStation.name}
                {currentStation.frequency && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#FF3D00]/15 text-[#FF3D00] border border-[#FF3D00]/30 font-mono font-bold">
                    {currentStation.frequency}
                  </span>
                )}
              </h3>
              <p className="text-xs font-malayalam text-[#888888]">
                {currentStation.malayalamName || currentStation.location || 'Malayalam Live Audio'}
              </p>
            </div>
          </div>

          {/* Mode Selector Tabs */}
          <div className="flex items-center bg-[#141414] border border-[#333333] p-1 rounded-lg">
            <button
              onClick={() => setMode('spectrum')}
              className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition flex items-center gap-1 ${
                mode === 'spectrum' ? 'bg-[#FF3D00] text-black shadow' : 'text-[#888888] hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Spectrum</span>
            </button>
            <button
              onClick={() => setMode('waveform')}
              className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition flex items-center gap-1 ${
                mode === 'waveform' ? 'bg-[#FF3D00] text-black shadow' : 'text-[#888888] hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Waveform</span>
            </button>
            <button
              onClick={() => setMode('radial')}
              className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition flex items-center gap-1 ${
                mode === 'radial' ? 'bg-[#FF3D00] text-black shadow' : 'text-[#888888] hover:text-white'
              }`}
            >
              <CircleDot className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mandala</span>
            </button>
            <button
              onClick={() => setMode('vu-meter')}
              className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition flex items-center gap-1 ${
                mode === 'vu-meter' ? 'bg-[#FF3D00] text-black shadow' : 'text-[#888888] hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">VU Meter</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#888888] hover:text-white rounded-lg hover:bg-[#1A1A1A] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Audio Canvas Visualizer */}
        <div className="w-full h-72 sm:h-80 bg-[#0A0A0A] border border-[#262626] rounded-xl relative overflow-hidden flex items-center justify-center shadow-inner">
          <canvas
            ref={canvasRef}
            width={760}
            height={320}
            className="w-full h-full object-contain"
          />

          {playbackStatus !== 'playing' && (
            <div className="absolute inset-0 bg-[#0A0A0A]/80 backdrop-blur-xs flex flex-col items-center justify-center gap-2 text-[#888888]">
              <Radio className="w-10 h-10 text-[#FF3D00] animate-pulse" />
              <p className="text-sm font-semibold text-[#CCCCCC]">Stream is currently paused</p>
              <button
                onClick={togglePlayPause}
                className="mt-2 px-4 py-2 rounded-lg bg-[#FF3D00] hover:bg-white text-black font-bold uppercase text-xs tracking-wider shadow-lg transition"
              >
                Resume Stream
              </button>
            </div>
          )}
        </div>

        {/* Bottom Playback Controls */}
        <div className="w-full flex items-center justify-between pt-6 mt-2">
          {/* Volume */}
          <div className="flex items-center gap-2">
            <button onClick={toggleMute} className="text-[#888888] hover:text-white">
              {isMuted ? <VolumeX className="w-4 h-4 text-[#FF3D00]" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-24 h-1 bg-[#333333] rounded-lg appearance-none cursor-pointer accent-[#FF3D00]"
            />
          </div>

          {/* Core Player Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={playPreviousStation}
              className="p-2.5 text-[#888888] hover:text-white rounded-full hover:bg-[#1A1A1A] transition"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              onClick={togglePlayPause}
              className="w-12 h-12 rounded-full bg-[#FF3D00] hover:bg-white text-black flex items-center justify-center shadow-xl shadow-[#FF3D00]/25 transition active:scale-95"
            >
              {playbackStatus === 'playing' ? (
                <Pause className="w-5 h-5 fill-black text-black" />
              ) : (
                <Play className="w-5 h-5 fill-black text-black ml-0.5" />
              )}
            </button>

            <button
              onClick={playNextStation}
              className="p-2.5 text-[#888888] hover:text-white rounded-full hover:bg-[#1A1A1A] transition"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Bitrate & Codec Badge */}
          <div className="text-right">
            <span className="text-xs font-mono font-bold text-[#FF3D00] block">
              {currentStation.bitrate || '128 kbps'}
            </span>
            <span className="text-[10px] text-[#777777] uppercase tracking-wider">Live Audio Broadcast</span>
          </div>
        </div>
      </div>
    </div>
  );
};
