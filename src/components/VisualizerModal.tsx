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
  CircleDot,
  Gauge,
  Palette,
  Flame,
  Flower2,
  Crown,
  Waves,
  Sun,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { useRadio } from '../context/RadioContext';
import { StationIcon } from './StationIcon';

interface VisualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export type VisualizerMode = 'spectrum' | 'waveform' | 'radial' | 'vu-meter';

export type VisualizerTheme = 
  | 'frost-sky'
  | 'azure-ocean'
  | 'kasavu-gold' 
  | 'temple-lamp' 
  | 'pookkalam' 
  | 'kathakali' 
  | 'backwaters' 
  | 'marigold';

interface VisualizerPalette {
  id: VisualizerTheme;
  name: string;
  malayalamName: string;
  tagline: string;
  icon: React.ReactNode;
  primary: string; // main accent hex
  secondary: string; // secondary accent
  highlight: string; // bright highlight/tip
  base: string; // deep gradient base
  glowColor: string;
  dialBgGradient: [string, string];
  needleColor: string;
  gradientStops: [string, string, string]; // [top, mid, bottom]
  radialColor: (index: number, total: number) => string;
  activeBtnClasses: string;
  badgeBorder: string;
  dotColor: string;
}

const VISUALIZER_THEMES: VisualizerPalette[] = [
  {
    id: 'frost-sky',
    name: 'Frost Sky',
    malayalamName: 'ഹിമവർണ്ണം',
    tagline: 'Cool Nordic Glacier, Electric Cyan & Ice White',
    icon: <Sparkles className="w-3.5 h-3.5" />,
    primary: '#0284C7',
    secondary: '#38BDF8',
    highlight: '#F0F9FF',
    base: '#0C4A6E',
    glowColor: 'rgba(56, 189, 248, 0.8)',
    dialBgGradient: ['#0B192C', '#040D1A'],
    needleColor: '#38BDF8',
    gradientStops: ['#F0F9FF', '#38BDF8', '#0284C7'],
    radialColor: (i, total) => {
      const hue = 190 + (i / total) * 30;
      return `hsl(${hue}, 95%, ${50 + (i % 3) * 12}%)`;
    },
    activeBtnClasses: 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-sky-500/25',
    badgeBorder: 'border-sky-400/40 text-sky-200 bg-sky-950/40',
    dotColor: '#38BDF8'
  },
  {
    id: 'azure-ocean',
    name: 'Azure Waves',
    malayalamName: 'നീലക്കടൽ',
    tagline: 'Arabian Sea Deep Blue & Shimmering Foam Waves',
    icon: <Waves className="w-3.5 h-3.5" />,
    primary: '#2563EB',
    secondary: '#60A5FA',
    highlight: '#EFF6FF',
    base: '#1E3A8A',
    glowColor: 'rgba(96, 165, 250, 0.8)',
    dialBgGradient: ['#0A1128', '#030718'],
    needleColor: '#60A5FA',
    gradientStops: ['#EFF6FF', '#60A5FA', '#2563EB'],
    radialColor: (i, total) => {
      const hue = 210 + (i / total) * 35;
      return `hsl(${hue}, 90%, ${55 + (i % 2) * 15}%)`;
    },
    activeBtnClasses: 'bg-gradient-to-r from-blue-600 to-indigo-500 text-white shadow-blue-500/25',
    badgeBorder: 'border-blue-400/40 text-blue-200 bg-blue-950/40',
    dotColor: '#60A5FA'
  },
  {
    id: 'kasavu-gold',
    name: 'Kasavu Gold',
    malayalamName: 'കസവ് ഗോൾഡ്',
    tagline: 'Traditional Kerala Kasavu Gold & Ivory Shimmer',
    icon: <Crown className="w-3.5 h-3.5" />,
    primary: '#F59E0B',
    secondary: '#FBBF24',
    highlight: '#FFFBEB',
    base: '#78350F',
    glowColor: 'rgba(245, 158, 11, 0.65)',
    dialBgGradient: ['#1C160E', '#0D0A06'],
    needleColor: '#FBBF24',
    gradientStops: ['#FFFBEB', '#F59E0B', '#78350F'],
    radialColor: (i, total) => {
      const hue = 38 + (i / total) * 16;
      return `hsl(${hue}, 95%, ${48 + (i % 3) * 12}%)`;
    },
    activeBtnClasses: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-amber-500/25',
    badgeBorder: 'border-amber-400/40 text-amber-300 bg-amber-950/40',
    dotColor: '#F59E0B'
  },
  {
    id: 'temple-lamp',
    name: 'Temple Lamp',
    malayalamName: 'നിലവിളക്ക് താലപ്പൊലി',
    tagline: 'Warm Sacred Nilavilakku Flame & Ember Glow',
    icon: <Flame className="w-3.5 h-3.5" />,
    primary: '#EA580C',
    secondary: '#F97316',
    highlight: '#FEF08A',
    base: '#7F1D1D',
    glowColor: 'rgba(234, 88, 12, 0.75)',
    dialBgGradient: ['#1A0C08', '#0D0504'],
    needleColor: '#FF5722',
    gradientStops: ['#FEF08A', '#EA580C', '#7F1D1D'],
    radialColor: (i, total) => {
      const step = (i / total);
      if (step < 0.3) return '#FEF08A';
      if (step < 0.6) return '#F97316';
      if (step < 0.85) return '#EA580C';
      return '#DC2626';
    },
    activeBtnClasses: 'bg-gradient-to-r from-orange-500 to-amber-500 text-black shadow-orange-500/25',
    badgeBorder: 'border-orange-500/40 text-orange-300 bg-orange-950/40',
    dotColor: '#EA580C'
  },
  {
    id: 'pookkalam',
    name: 'Pookkalam Flora',
    malayalamName: 'പൂക്കളം വസന്തം',
    tagline: 'Onam Flower Carpet Petals & Blossom Vibrance',
    icon: <Flower2 className="w-3.5 h-3.5" />,
    primary: '#EC4899',
    secondary: '#F59E0B',
    highlight: '#FDE047',
    base: '#701A75',
    glowColor: 'rgba(236, 72, 153, 0.65)',
    dialBgGradient: ['#190C16', '#0B050B'],
    needleColor: '#F43F5E',
    gradientStops: ['#FDE047', '#EC4899', '#701A75'],
    radialColor: (i) => {
      const flowerHues = [
        '#FDE047', // Kakka Poovu Yellow
        '#FB923C', // Marigold Orange
        '#F43F5E', // Chethi Red
        '#EC4899', // Lotus Pink
        '#A855F7', // Shankhupushpam Violet
        '#38BDF8', // Blue Petal
        '#34D399', // Green leaf
        '#FFFBEB'  // Thumba White
      ];
      return flowerHues[i % flowerHues.length];
    },
    activeBtnClasses: 'bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 text-black shadow-pink-500/25',
    badgeBorder: 'border-pink-400/40 text-pink-300 bg-pink-950/40',
    dotColor: '#EC4899'
  },
  {
    id: 'kathakali',
    name: 'Kathakali Green',
    malayalamName: 'കഥകളി പച്ച',
    tagline: 'Dramatic Paccha Emerald, Kireedam Gold & Chuvappu',
    icon: <Sparkles className="w-3.5 h-3.5" />,
    primary: '#10B981',
    secondary: '#059669',
    highlight: '#FDE047',
    base: '#064E3B',
    glowColor: 'rgba(16, 185, 129, 0.7)',
    dialBgGradient: ['#061811', '#030D09'],
    needleColor: '#10B981',
    gradientStops: ['#FDE047', '#10B981', '#064E3B'],
    radialColor: (i) => {
      const hues = ['#10B981', '#34D399', '#FDE047', '#F59E0B', '#EF4444', '#059669'];
      return hues[i % hues.length];
    },
    activeBtnClasses: 'bg-gradient-to-r from-emerald-400 to-teal-400 text-black shadow-emerald-500/25',
    badgeBorder: 'border-emerald-400/40 text-emerald-300 bg-emerald-950/40',
    dotColor: '#10B981'
  },
  {
    id: 'backwaters',
    name: 'Backwaters Sunset',
    malayalamName: 'കായലോരം സന്ധ്യ',
    tagline: 'Vembanad Lake Twilight, Palm Greens & Golden Sunset',
    icon: <Waves className="w-3.5 h-3.5" />,
    primary: '#06B6D4',
    secondary: '#8B5CF6',
    highlight: '#FDE047',
    base: '#1E1B4B',
    glowColor: 'rgba(6, 182, 212, 0.7)',
    dialBgGradient: ['#0A131F', '#04080F'],
    needleColor: '#22D3EE',
    gradientStops: ['#FDE047', '#06B6D4', '#1E1B4B'],
    radialColor: (i, total) => {
      const hues = ['#FDE047', '#F97316', '#EC4899', '#8B5CF6', '#06B6D4', '#10B981'];
      return hues[Math.floor((i / total) * hues.length)];
    },
    activeBtnClasses: 'bg-gradient-to-r from-cyan-400 via-teal-400 to-indigo-400 text-black shadow-cyan-500/25',
    badgeBorder: 'border-cyan-400/40 text-cyan-300 bg-cyan-950/40',
    dotColor: '#06B6D4'
  },
  {
    id: 'marigold',
    name: 'Marigold Orange',
    malayalamName: 'ചെണ്ടുമല്ലി വസന്തം',
    tagline: 'Festive Chendumalli Blossoms & Bright Sunshine',
    icon: <Sun className="w-3.5 h-3.5" />,
    primary: '#F97316',
    secondary: '#EAB308',
    highlight: '#FEF9C3',
    base: '#7C2D12',
    glowColor: 'rgba(249, 115, 22, 0.7)',
    dialBgGradient: ['#1C1208', '#0D0803'],
    needleColor: '#F97316',
    gradientStops: ['#FEF9C3', '#EAB308', '#7C2D12'],
    radialColor: (i) => {
      const hues = ['#FEF9C3', '#FDE047', '#EAB308', '#F97316', '#EA580C', '#C2410C'];
      return hues[i % hues.length];
    },
    activeBtnClasses: 'bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 text-black shadow-amber-500/25',
    badgeBorder: 'border-amber-400/40 text-amber-300 bg-amber-950/40',
    dotColor: '#F97316'
  }
];

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

  const [mode, setMode] = useState<VisualizerMode>(() => {
    return (localStorage.getItem('kerala_visualizer_mode') as VisualizerMode) || 'spectrum';
  });

  const [theme, setTheme] = useState<VisualizerTheme>(() => {
    return (localStorage.getItem('kerala_visualizer_theme') as VisualizerTheme) || 'kasavu-gold';
  });

  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const activePalette = VISUALIZER_THEMES.find(t => t.id === theme) || VISUALIZER_THEMES[0];

  const handleModeChange = (newMode: VisualizerMode) => {
    setMode(newMode);
    localStorage.setItem('kerala_visualizer_mode', newMode);
  };

  const handleThemeChange = (newTheme: VisualizerTheme) => {
    setTheme(newTheme);
    localStorage.setItem('kerala_visualizer_theme', newTheme);
  };

  // Resize canvas dynamically to match container element size
  useEffect(() => {
    if (!isOpen || !containerRef.current || !canvasRef.current) return;

    const updateCanvasSize = () => {
      if (!containerRef.current || !canvasRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      
      const width = Math.floor(rect.width);
      const height = Math.floor(rect.height);

      if (width > 0 && height > 0) {
        canvasRef.current.width = width * dpr;
        canvasRef.current.height = height * dpr;
      }
    };

    updateCanvasSize();
    const observer = new ResizeObserver(updateCanvasSize);
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [isOpen, isFullscreen]);

  // Audio animation render loop
  useEffect(() => {
    if (!isOpen || !canvasRef.current || playbackStatus !== 'playing') {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let rotationAngle = 0;
    let timeTick = 0;
    const bufferLength = analyserNode ? analyserNode.frequencyBinCount : 64;
    const freqData = new Uint8Array(bufferLength);
    const timeData = new Uint8Array(bufferLength);

    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      timeTick += 0.04;

      if (analyserNode) {
        analyserNode.getByteFrequencyData(freqData);
        analyserNode.getByteTimeDomainData(timeData);
      }

      const width = canvas.width;
      const height = canvas.height;

      // Check if real analyzer data has values, otherwise synthesize dynamic rhythmic wave
      let maxVal = 0;
      for (let i = 0; i < bufferLength; i++) {
        if (freqData[i] > maxVal) maxVal = freqData[i];
      }
      const hasRealAudio = maxVal > 15;

      ctx.clearRect(0, 0, width, height);

      // Ambient radial glow matching active theme
      const bgGlow = ctx.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, Math.max(width, height) * 0.7);
      bgGlow.addColorStop(0, `${activePalette.glowColor.replace('0.65', '0.12').replace('0.7', '0.12').replace('0.75', '0.12')}`);
      bgGlow.addColorStop(0.6, `${activePalette.base}18`);
      bgGlow.addColorStop(1, 'rgba(8, 6, 4, 0)');
      ctx.fillStyle = bgGlow;
      ctx.fillRect(0, 0, width, height);

      // ==========================================
      // MODE 1: SPECTRUM BARS (Onam Temple Pillars)
      // ==========================================
      if (mode === 'spectrum') {
        const barCount = width > 800 ? 64 : width > 500 ? 48 : 36;
        const barWidth = (width / barCount) * 0.72;
        const gap = (width / barCount) * 0.28;

        for (let i = 0; i < barCount; i++) {
          let val = 0;
          if (hasRealAudio) {
            const index = Math.floor((i / barCount) * (bufferLength * 0.75));
            val = freqData[index] || 0;
          } else {
            // Harmonic rhythmic beat simulation for lively visualizer experience
            const baseSin = Math.sin(timeTick * 2.5 + i * 0.22);
            const harmSin = Math.cos(timeTick * 4.2 - i * 0.14);
            const beatPulse = Math.sin(timeTick * 1.8) > 0.4 ? 0.35 : 0;
            const midPeak = 1 - Math.abs((i / barCount) - 0.38) * 1.4;
            val = Math.max(25, Math.min(255, (baseSin * 0.35 + harmSin * 0.25 + beatPulse + midPeak * 0.4 + 0.45) * 230));
          }

          // Scale bar height up to 88% of canvas height
          const barHeight = Math.max(12, (val / 255) * height * 0.86);
          const x = i * (barWidth + gap) + gap / 2;
          const y = height - barHeight - 16;

          // Multi-color gradient
          const gradient = ctx.createLinearGradient(0, y, 0, height - 16);
          gradient.addColorStop(0, activePalette.gradientStops[0]);
          gradient.addColorStop(0.4, activePalette.gradientStops[1]);
          gradient.addColorStop(1, activePalette.gradientStops[2]);

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
          ctx.fill();

          // Glowing top cap (Kasavu Gold / Nilavilakku peak)
          ctx.fillStyle = activePalette.highlight;
          ctx.shadowColor = activePalette.primary;
          ctx.shadowBlur = val > 120 ? 12 : 6;
          ctx.beginPath();
          ctx.roundRect(x, y - 4, barWidth, 3.5, 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          // Soft reflection floor
          ctx.fillStyle = activePalette.base;
          ctx.globalAlpha = 0.3;
          ctx.fillRect(x, height - 12, barWidth, Math.min(10, barHeight * 0.18));
          ctx.globalAlpha = 1.0;
        }

        // Base line in gold/theme color
        ctx.strokeStyle = activePalette.primary;
        ctx.globalAlpha = 0.5;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, height - 15);
        ctx.lineTo(width, height - 15);
        ctx.stroke();
        ctx.globalAlpha = 1.0;
      }

      // ==========================================
      // MODE 2: WAVEFORM OSCILLOSCOPE (Kasavu Thread Wave)
      // ==========================================
      else if (mode === 'waveform') {
        const centerY = height / 2;

        // Center guideline
        ctx.strokeStyle = `${activePalette.primary}33`;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.stroke();
        ctx.setLineDash([]);

        const points = 120;
        const sliceWidth = width / points;

        // Outer glow path
        ctx.lineWidth = 7;
        ctx.strokeStyle = activePalette.glowColor;
        ctx.shadowColor = activePalette.primary;
        ctx.shadowBlur = 20;
        ctx.beginPath();

        let x = 0;
        for (let i = 0; i < points; i++) {
          let y = centerY;
          if (hasRealAudio) {
            const idx = Math.floor((i / points) * bufferLength);
            const v = timeData[idx] / 128.0;
            y = (v * height) / 2;
          } else {
            const wave1 = Math.sin(timeTick * 3 + i * 0.15);
            const wave2 = Math.cos(timeTick * 1.5 + i * 0.08);
            const wave3 = Math.sin(timeTick * 5.2 - i * 0.28);
            const amp = (height * 0.38) * (0.5 + 0.5 * Math.sin(timeTick * 1.2));
            y = centerY + (wave1 * 0.6 + wave2 * 0.3 + wave3 * 0.1) * amp;
          }

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          x += sliceWidth;
        }
        ctx.stroke();

        // Inner bright crisp line
        ctx.lineWidth = 3;
        ctx.strokeStyle = activePalette.highlight;
        ctx.shadowColor = activePalette.highlight;
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Secondary harmonic echo
        ctx.lineWidth = 2;
        ctx.strokeStyle = `${activePalette.secondary}88`;
        ctx.beginPath();
        x = 0;
        for (let i = 0; i < points; i++) {
          const wave1 = Math.sin(timeTick * 2.2 + i * 0.18);
          const amp = (height * 0.26);
          const y = centerY + wave1 * amp;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          x += sliceWidth;
        }
        ctx.stroke();
      }

      // ==========================================
      // MODE 3: RADIAL SOUND MANDALA (Onam Pookkalam Petals)
      // ==========================================
      else if (mode === 'radial') {
        const centerX = width / 2;
        const centerY = height / 2;
        const baseRadius = Math.min(centerX, centerY) * 0.44;

        rotationAngle += 0.006;

        // Inner glowing core (Lamp / Floral Center)
        const coreGradient = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, baseRadius * 0.95);
        coreGradient.addColorStop(0, `${activePalette.highlight}ee`);
        coreGradient.addColorStop(0.35, `${activePalette.primary}99`);
        coreGradient.addColorStop(0.7, `${activePalette.base}44`);
        coreGradient.addColorStop(1, 'rgba(10, 8, 6, 0.05)');
        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, baseRadius, 0, Math.PI * 2);
        ctx.fill();

        // Inner decorative ring
        ctx.strokeStyle = `${activePalette.primary}88`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, baseRadius * 0.55, 0, Math.PI * 2);
        ctx.stroke();

        const points = 80;
        for (let i = 0; i < points; i++) {
          let val = 0;
          if (hasRealAudio) {
            const index = Math.floor((i / points) * (bufferLength * 0.7));
            val = freqData[index] || 0;
          } else {
            const petal = Math.sin(i * 0.5 + timeTick * 3);
            const pulse = Math.cos(timeTick * 2.4 + i * 0.2);
            val = Math.max(30, (petal * 0.5 + pulse * 0.3 + 0.55) * 220);
          }

          const barLen = (val / 255) * (baseRadius * 1.15);
          const rad = (Math.PI * 2 / points) * i + rotationAngle;

          const x1 = centerX + Math.cos(rad) * baseRadius;
          const y1 = centerY + Math.sin(rad) * baseRadius;
          const x2 = centerX + Math.cos(rad) * (baseRadius + barLen);
          const y2 = centerY + Math.sin(rad) * (baseRadius + barLen);

          ctx.strokeStyle = activePalette.radialColor(i, points);
          ctx.lineWidth = 3.2;
          ctx.shadowColor = activePalette.primary;
          ctx.shadowBlur = val > 140 ? 10 : 3;

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();

          // Petal tip sparkler
          if (barLen > 15) {
            ctx.fillStyle = activePalette.highlight;
            ctx.beginPath();
            ctx.arc(x2, y2, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.shadowBlur = 0;
      }

      // ==========================================
      // MODE 4: RETRO DUAL VU METER (Onam Brass Gauge)
      // ==========================================
      else if (mode === 'vu-meter') {
        let meterVal = 0;
        if (hasRealAudio) {
          let sum = 0;
          for (let i = 0; i < bufferLength; i++) {
            sum += freqData[i];
          }
          const avg = sum / bufferLength;
          meterVal = Math.min(1, (avg / 130));
        } else {
          const beat = Math.sin(timeTick * 2.8) * 0.35 + Math.cos(timeTick * 4.5) * 0.25 + 0.45;
          meterVal = Math.max(0.15, Math.min(0.92, beat));
        }

        const meterWidth = width * 0.43;
        const meterHeight = height * 0.72;

        ['ഇടത് ചാനൽ (CH-L)', 'വലത് ചാനൽ (CH-R)'].forEach((label, idx) => {
          const mx = idx === 0 ? width * 0.05 : width * 0.52;
          const my = height * 0.12;

          // Backlit dial plate with warm lamp or gold backlight gradient
          const plateGrad = ctx.createLinearGradient(mx, my, mx, my + meterHeight);
          plateGrad.addColorStop(0, activePalette.dialBgGradient[0]);
          plateGrad.addColorStop(1, activePalette.dialBgGradient[1]);

          ctx.fillStyle = plateGrad;
          ctx.strokeStyle = `${activePalette.primary}99`;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.roundRect(mx, my, meterWidth, meterHeight, 12);
          ctx.fill();
          ctx.stroke();

          // Decorative Kasavu Border Inset
          ctx.strokeStyle = `${activePalette.primary}44`;
          ctx.lineWidth = 1.2;
          ctx.strokeRect(mx + 8, my + 8, meterWidth - 16, meterHeight - 16);

          // Scale Arc
          const cx = mx + meterWidth / 2;
          const cy = my + meterHeight * 0.88;
          const r = meterWidth * 0.44;

          // Normal zone arc
          ctx.strokeStyle = activePalette.primary;
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.arc(cx, cy, r, Math.PI * 1.2, Math.PI * 1.65);
          ctx.stroke();

          // Peak zone arc (Red/Highlight)
          ctx.strokeStyle = '#EF4444';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(cx, cy, r, Math.PI * 1.65, Math.PI * 1.8);
          ctx.stroke();

          // Scale ticks
          for (let a = Math.PI * 1.2; a <= Math.PI * 1.8; a += (Math.PI * 0.6) / 8) {
            const tx1 = cx + Math.cos(a) * (r - 6);
            const ty1 = cy + Math.sin(a) * (r - 6);
            const tx2 = cx + Math.cos(a) * (r + 6);
            const ty2 = cy + Math.sin(a) * (r + 6);
            ctx.strokeStyle = a > Math.PI * 1.65 ? '#EF4444' : `${activePalette.primary}cc`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(tx1, ty1);
            ctx.lineTo(tx2, ty2);
            ctx.stroke();
          }

          // Text & dB levels
          ctx.fillStyle = activePalette.highlight;
          ctx.font = 'bold 13px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(label, cx, my + 30);

          ctx.fillStyle = '#E5E7EB';
          ctx.font = 'bold 11px monospace';
          ctx.fillText('-20dB    -10dB    -5dB    0dB   +3dB', cx, my + 60);

          // Malayalam Subtitle
          ctx.fillStyle = `${activePalette.primary}dd`;
          ctx.font = '11px sans-serif';
          ctx.fillText('ശബ്ദ തീവ്രത • VU METER', cx, cy - 22);

          // Animated needle with channel variance
          const channelVariance = idx === 0 ? 1 : 0.94 + Math.sin(timeTick * 3.5) * 0.08;
          const adjustedVal = Math.min(1, meterVal * channelVariance);
          const angle = Math.PI * 1.2 + adjustedVal * (Math.PI * 0.6);
          const nx = cx + Math.cos(angle) * (r + 8);
          const ny = cy + Math.sin(angle) * (r + 8);

          ctx.strokeStyle = activePalette.needleColor;
          ctx.lineWidth = 3;
          ctx.shadowColor = activePalette.needleColor;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(nx, ny);
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Needle Pivot Pin with gold rim
          ctx.fillStyle = activePalette.primary;
          ctx.beginPath();
          ctx.arc(cx, cy, 7, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = activePalette.highlight;
          ctx.beginPath();
          ctx.arc(cx, cy, 3, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isOpen, mode, theme, analyserNode, playbackStatus, activePalette]);

  if (!isOpen || !currentStation) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/92 backdrop-blur-2xl animate-fade-in"
      onClick={onClose}
    >
      <div 
        className={`relative w-full ${
          isFullscreen 
            ? 'h-full max-w-none rounded-none p-3 sm:p-5' 
            : 'max-w-5xl h-[92vh] sm:h-[88vh] max-h-[920px] rounded-2xl p-3 sm:p-5 shadow-2xl shadow-amber-950/60'
        } bg-[#120D08] border-2 border-amber-500/35 overflow-hidden flex flex-col items-center transition-all`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="w-full flex items-center justify-between border-b border-amber-500/20 pb-3 mb-2.5 gap-2 flex-shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <StationIcon
              station={currentStation}
              size="sm"
              isPlaying={playbackStatus === 'playing'}
            />
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-amber-100 flex items-center gap-1.5 truncate">
                <span className="truncate">{currentStation.name}</span>
                {currentStation.frequency && (
                  <span className="hidden xs:inline text-[10px] px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30 font-mono font-bold flex-shrink-0">
                    {currentStation.frequency}
                  </span>
                )}
              </h3>
              <p className="text-[11px] font-malayalam text-amber-300/70 truncate">
                {currentStation.malayalamName || currentStation.location || 'Malayalam Live Audio'}
              </p>
            </div>
          </div>

          {/* Mode Selector Tabs & Controls */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div className="flex items-center bg-[#1D160E] border border-amber-500/30 p-0.5 rounded-xl shadow-inner">
              <button
                id="visualizer-mode-spectrum"
                onClick={() => handleModeChange('spectrum')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1 ${
                  mode === 'spectrum' ? activePalette.activeBtnClasses : 'text-amber-300/70 hover:text-amber-100 hover:bg-amber-950/30'
                }`}
                title="Spectrum Bars"
              >
                <Activity className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Spectrum</span>
              </button>
              <button
                id="visualizer-mode-waveform"
                onClick={() => handleModeChange('waveform')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1 ${
                  mode === 'waveform' ? activePalette.activeBtnClasses : 'text-amber-300/70 hover:text-amber-100 hover:bg-amber-950/30'
                }`}
                title="Waveform Oscilloscope"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Wave</span>
              </button>
              <button
                id="visualizer-mode-radial"
                onClick={() => handleModeChange('radial')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1 ${
                  mode === 'radial' ? activePalette.activeBtnClasses : 'text-amber-300/70 hover:text-amber-100 hover:bg-amber-950/30'
                }`}
                title="Pookkalam Sound Mandala"
              >
                <CircleDot className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mandala</span>
              </button>
              <button
                id="visualizer-mode-vu"
                onClick={() => handleModeChange('vu-meter')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1 ${
                  mode === 'vu-meter' ? activePalette.activeBtnClasses : 'text-amber-300/70 hover:text-amber-100 hover:bg-amber-950/30'
                }`}
                title="Dual VU Meter"
              >
                <Gauge className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">VU</span>
              </button>
            </div>

            {/* Fullscreen Toggle */}
            <button
              id="visualizer-toggle-fullscreen"
              onClick={() => setIsFullscreen(prev => !prev)}
              className="p-1.5 text-amber-400/80 hover:text-amber-100 rounded-xl hover:bg-amber-950/40 border border-amber-500/20 transition hidden xs:flex items-center justify-center"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen View'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 text-amber-400/80 hover:text-amber-100 rounded-xl hover:bg-amber-950/40 border border-amber-500/20 transition"
              title="Close Visualizer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Compact Horizontal Onam Theme Strip (Space-Saving) */}
        <div className="w-full mb-2 flex-shrink-0">
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1 flex-shrink-0 pl-1">
              <Palette className="w-3 h-3 text-amber-400" />
              <span className="hidden md:inline">Theme:</span>
            </span>
            
            {VISUALIZER_THEMES.map((themeItem) => {
              const isSelected = themeItem.id === theme;
              return (
                <button
                  key={themeItem.id}
                  id={`theme-btn-${themeItem.id}`}
                  onClick={() => handleThemeChange(themeItem.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap border transition-all flex-shrink-0 ${
                    isSelected 
                      ? 'bg-amber-500/20 border-amber-400 text-amber-100 shadow-sm shadow-amber-500/30 ring-1 ring-amber-400/50' 
                      : 'bg-[#18120B] border-amber-500/25 text-amber-300/75 hover:border-amber-400/50 hover:text-amber-200'
                  }`}
                  title={`${themeItem.malayalamName} - ${themeItem.tagline}`}
                >
                  <span 
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: themeItem.dotColor }}
                  />
                  <span>{themeItem.name}</span>
                  <span className="text-[10px] opacity-70 font-malayalam hidden sm:inline">
                    ({themeItem.malayalamName})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Huge Live Audio Canvas Visualizer Container */}
        <div 
          ref={containerRef}
          className="w-full flex-1 min-h-[280px] sm:min-h-[380px] md:min-h-[460px] bg-[#0A0704] border-2 border-amber-500/35 rounded-2xl relative overflow-hidden flex items-center justify-center shadow-inner"
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full block"
          />

          {playbackStatus !== 'playing' && (
            <div className="absolute inset-0 bg-[#0B0805]/85 backdrop-blur-xs flex flex-col items-center justify-center gap-2.5 text-amber-300/80 p-4 text-center">
              <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-400/30 flex items-center justify-center shadow-lg shadow-amber-500/10">
                <Radio className="w-7 h-7 text-amber-400 animate-pulse" />
              </div>
              <div>
                <p className="text-sm font-bold text-amber-100">റേഡിയോ തത്സമയ സ്ട്രീം നിശ്ചലമാണ്</p>
                <p className="text-xs text-amber-400/70 font-malayalam">ശബ്ദ തരംഗങ്ങൾ ദൃശ്യമാക്കാൻ പ്ലേ ചെയ്യുക</p>
              </div>
              <button
                onClick={togglePlayPause}
                className="mt-1 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 text-black font-bold uppercase text-xs tracking-wider shadow-lg shadow-amber-500/30 transition active:scale-95"
              >
                Start Stream
              </button>
            </div>
          )}
        </div>

        {/* Bottom Playback Controls */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between pt-3 mt-2 border-t border-amber-500/20 gap-3 flex-shrink-0">
          {/* Volume Slider */}
          <div className="flex items-center gap-2.5 bg-[#1A130B] px-3 py-1 rounded-full border border-amber-500/20">
            <button onClick={toggleMute} className="text-amber-400 hover:text-amber-200 transition">
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-20 sm:w-24 h-1.5 bg-[#382613] rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <span className="text-[10px] font-mono font-bold text-amber-300/80 w-7">
              {Math.round(isMuted ? 0 : volume * 100)}%
            </span>
          </div>

          {/* Core Player Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={playPreviousStation}
              className="p-2 text-amber-300 hover:text-white rounded-full bg-[#1A130B] hover:bg-[#251B10] border border-amber-500/20 transition active:scale-95"
              title="Previous Station"
            >
              <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              onClick={togglePlayPause}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 text-black flex items-center justify-center shadow-xl shadow-amber-500/30 transition active:scale-95"
              title={playbackStatus === 'playing' ? 'Pause' : 'Play'}
            >
              {playbackStatus === 'playing' ? (
                <Pause className="w-5 h-5 fill-black text-black" />
              ) : (
                <Play className="w-5 h-5 fill-black text-black ml-0.5" />
              )}
            </button>

            <button
              onClick={playNextStation}
              className="p-2 text-amber-300 hover:text-white rounded-full bg-[#1A130B] hover:bg-[#251B10] border border-amber-500/20 transition active:scale-95"
              title="Next Station"
            >
              <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Bitrate & Codec Badge */}
          <div className="text-center sm:text-right">
            <span className="text-xs font-mono font-bold text-amber-400 block">
              {currentStation.bitrate || '128 kbps'} • {activePalette.name}
            </span>
            <span className="text-[10px] text-amber-300/60 uppercase tracking-wider font-mono">
              Live Kerala Radio Stream
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};


