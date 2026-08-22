import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Hls from 'hls.js';
import { RadioStation, RadioCategory, PlaybackStatus, EqualizerPreset, RadioRecording } from '../types/radio';
import { DEFAULT_STATIONS } from '../data/defaultStations';

export const EQUALIZER_PRESETS: EqualizerPreset[] = [
  { name: 'Flat', bands: [0, 0, 0, 0, 0] },
  { name: 'Bass Boost', bands: [6, 4, 1, 0, -1] },
  { name: 'Vocal Clarity', bands: [-2, 2, 5, 3, 1] },
  { name: 'Treble Boost', bands: [-2, 0, 1, 4, 6] },
  { name: 'Acoustic / Melody', bands: [3, 2, 0, 2, 3] },
  { name: 'Vintage Radio (Warm AM)', bands: [4, 6, 2, -3, -6] },
  { name: 'Club / Dance', bands: [7, 3, 0, 3, 5] },
];

const EQUALIZER_FREQUENCIES = [60, 230, 910, 4000, 14000];

interface RadioContextType {
  currentStation: RadioStation | null;
  playbackStatus: PlaybackStatus;
  errorMessage: string | null;
  volume: number;
  isMuted: boolean;
  isBoosted: boolean;
  favorites: string[];
  customStations: RadioStation[];
  allStations: RadioStation[];
  filteredStations: RadioStation[];
  recentStations: RadioStation[];
  recordings: RadioRecording[];
  activeCategory: RadioCategory;
  searchQuery: string;
  sleepTimerMinutes: number | null;
  sleepTimerRemainingSec: number | null;
  selectedPresetName: string;
  equalizerGains: number[];
  analyserNode: AnalyserNode | null;
  isRecording: boolean;
  recordingDurationSec: number;
  activeStreamIndex: number;
  
  // Actions
  playStation: (station: RadioStation) => void;
  togglePlayPause: () => void;
  stopPlayback: () => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  toggleBoost: () => void;
  toggleFavorite: (stationId: string) => void;
  addCustomStation: (station: Omit<RadioStation, 'id' | 'isCustom'> & { id?: string }) => void;
  editCustomStation: (station: RadioStation) => void;
  deleteCustomStation: (stationId: string) => void;
  importStations: (stations: RadioStation[]) => number;
  exportStationsJson: () => string;
  exportStationsM3U: () => string;
  setActiveCategory: (cat: RadioCategory) => void;
  setSearchQuery: (query: string) => void;
  setSleepTimer: (minutes: number | null) => void;
  setEqualizerPreset: (presetName: string) => void;
  setBandGain: (bandIndex: number, gainDb: number) => void;
  startRecording: () => void;
  stopRecording: () => void;
  deleteRecording: (id: string) => void;
  playNextStation: () => void;
  playPreviousStation: () => void;
  testStreamUrl: (url: string) => Promise<{ success: boolean; message?: string }>;
  resetToDefaultStations: () => void;
}

const RadioContext = createContext<RadioContextType | null>(null);

const STORAGE_KEYS = {
  FAVORITES: 'malayalam_radio_favorites_v3',
  CUSTOM_STATIONS: 'malayalam_radio_custom_stations_v3',
  RECENTS: 'malayalam_radio_recent_v3',
  VOLUME: 'malayalam_radio_vol_v3',
  PRESET: 'malayalam_radio_eq_preset_v3',
  GAINS: 'malayalam_radio_eq_gains_v3'
};

export const RadioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customStations, setCustomStations] = useState<RadioStation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_STATIONS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return saved ? JSON.parse(saved) : ['radio4u', 'sargakshetra-896', 'radio-malabar', 'air-kochi'];
    } catch {
      return ['radio4u', 'sargakshetra-896', 'radio-malabar', 'air-kochi'];
    }
  });

  const [recentStationIds, setRecentStationIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RECENTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null);
  const [playbackStatus, setPlaybackStatus] = useState<PlaybackStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeStreamIndex, setActiveStreamIndex] = useState<number>(0);
  
  const [volume, setVolumeState] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VOLUME);
    return saved ? Number(saved) : 0.85;
  });
  const [isMuted, setIsMuted] = useState(false);
  const [isBoosted, setIsBoosted] = useState(false);

  const [activeCategory, setActiveCategory] = useState<RadioCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(null);
  const [sleepTimerRemainingSec, setSleepTimerRemainingSec] = useState<number | null>(null);

  const [selectedPresetName, setSelectedPresetName] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.PRESET) || 'Flat';
  });

  const [equalizerGains, setEqualizerGains] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GAINS);
      return saved ? JSON.parse(saved) : [0, 0, 0, 0, 0];
    } catch {
      return [0, 0, 0, 0, 0];
    }
  });

  const [isRecording, setIsRecording] = useState(false);
  const [recordingDurationSec, setRecordingDurationSec] = useState(0);
  const [recordings, setRecordings] = useState<RadioRecording[]>([]);

  // Refs for Audio & Web Audio API
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const filterNodesRef = useRef<BiquadFilterNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);
  const analyserNodeRef = useRef<AnalyserNode | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<number | null>(null);
  const sleepTimerIntervalRef = useRef<number | null>(null);

  // Combine default and custom stations
  const allStations = useMemo(() => {
    const combined = [...customStations, ...DEFAULT_STATIONS];
    // Deduplicate by ID
    const seen = new Set<string>();
    return combined.filter(st => {
      if (seen.has(st.id)) return false;
      seen.add(st.id);
      return true;
    });
  }, [customStations]);

  // Filtered stations based on category, search, and favorites
  const filteredStations = useMemo(() => {
    return allStations.filter(station => {
      // Category filter
      if (activeCategory === 'favorites') {
        if (!favorites.includes(station.id)) return false;
      } else if (activeCategory === 'custom') {
        if (!station.isCustom) return false;
      } else if (activeCategory !== 'all') {
        if (station.category !== activeCategory) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = station.name.toLowerCase().includes(q);
        const matchesMalayalam = station.malayalamName?.toLowerCase().includes(q);
        const matchesLocation = station.location?.toLowerCase().includes(q);
        const matchesDesc = station.description?.toLowerCase().includes(q);
        const matchesTags = station.tags?.some(t => t.toLowerCase().includes(q));
        const matchesFreq = station.frequency?.toLowerCase().includes(q);
        if (!matchesName && !matchesMalayalam && !matchesLocation && !matchesDesc && !matchesTags && !matchesFreq) {
          return false;
        }
      }

      return true;
    });
  }, [allStations, activeCategory, searchQuery, favorites]);

  // Recent stations object list
  const recentStations = useMemo(() => {
    return recentStationIds
      .map(id => allStations.find(s => s.id === id))
      .filter((s): s is RadioStation => Boolean(s));
  }, [recentStationIds, allStations]);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_STATIONS, JSON.stringify(customStations));
  }, [customStations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECENTS, JSON.stringify(recentStationIds));
  }, [recentStationIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VOLUME, volume.toString());
  }, [volume]);

  // Initialize Web Audio Graph
  const initWebAudio = useCallback(() => {
    if (!audioRef.current || audioContextRef.current) return;

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.8;
      analyserNodeRef.current = analyser;

      const gain = ctx.createGain();
      gainNodeRef.current = gain;

      // Create 5-band Biquad Filters
      const filters = EQUALIZER_FREQUENCIES.map((freq, i) => {
        const filter = ctx.createBiquadFilter();
        if (i === 0) {
          filter.type = 'lowshelf';
        } else if (i === EQUALIZER_FREQUENCIES.length - 1) {
          filter.type = 'highshelf';
        } else {
          filter.type = 'peaking';
          filter.Q.value = 1.4;
        }
        filter.frequency.value = freq;
        filter.gain.value = equalizerGains[i] || 0;
        return filter;
      });
      filterNodesRef.current = filters;

      // Connect source to filters
      const source = ctx.createMediaElementSource(audioRef.current);
      sourceNodeRef.current = source;

      let prevNode: AudioNode = source;
      filters.forEach(filter => {
        prevNode.connect(filter);
        prevNode = filter;
      });

      prevNode.connect(gain);
      gain.connect(analyser);
      analyser.connect(ctx.destination);
    } catch {
      // Browser cross-origin or autoplay policy fallback
    }
  }, [equalizerGains]);

  // Update Equalizer filters when gains change
  useEffect(() => {
    filterNodesRef.current.forEach((filter, index) => {
      if (filter && typeof equalizerGains[index] === 'number') {
        filter.gain.setTargetAtTime(equalizerGains[index], audioContextRef.current?.currentTime || 0, 0.05);
      }
    });
    localStorage.setItem(STORAGE_KEYS.GAINS, JSON.stringify(equalizerGains));
  }, [equalizerGains]);

  // Update volume & boost
  useEffect(() => {
    if (audioRef.current) {
      const effectiveVol = isMuted ? 0 : volume;
      audioRef.current.volume = isBoosted ? Math.min(1, effectiveVol) : effectiveVol;
    }
    if (gainNodeRef.current && audioContextRef.current) {
      const multiplier = isBoosted ? 1.5 : 1.0;
      gainNodeRef.current.gain.setTargetAtTime(multiplier, audioContextRef.current.currentTime, 0.05);
    }
  }, [volume, isMuted, isBoosted]);

  // MediaSession API setup
  const updateMediaSession = useCallback((station: RadioStation) => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: station.name,
        artist: station.malayalamName || station.location || 'Malayalam Radio Live',
        album: `${station.frequency || 'Live FM'} • ${station.category.toUpperCase()}`,
        artwork: [
          { src: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=512&auto=format&fit=crop&q=80', sizes: '512x512', type: 'image/jpeg' }
        ]
      });

      navigator.mediaSession.setActionHandler('play', () => {
        audioRef.current?.play();
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        audioRef.current?.pause();
      });
    }
  }, []);

  // Sleep Timer countdown handler
  useEffect(() => {
    if (sleepTimerMinutes === null) {
      if (sleepTimerIntervalRef.current) clearInterval(sleepTimerIntervalRef.current);
      setSleepTimerRemainingSec(null);
      return;
    }

    const totalSeconds = sleepTimerMinutes * 60;
    setSleepTimerRemainingSec(totalSeconds);

    if (sleepTimerIntervalRef.current) clearInterval(sleepTimerIntervalRef.current);

    sleepTimerIntervalRef.current = window.setInterval(() => {
      setSleepTimerRemainingSec(prev => {
        if (prev === null || prev <= 1) {
          if (sleepTimerIntervalRef.current) clearInterval(sleepTimerIntervalRef.current);
          if (audioRef.current) {
            audioRef.current.pause();
            setPlaybackStatus('paused');
          }
          setSleepTimerMinutes(null);
          return null;
        }

        // Gentle volume fade during last 20 seconds
        if (prev <= 20 && audioRef.current && !isMuted) {
          audioRef.current.volume = Math.max(0, (volume * (prev / 20)));
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (sleepTimerIntervalRef.current) clearInterval(sleepTimerIntervalRef.current);
    };
  }, [sleepTimerMinutes, volume, isMuted]);

  // Audio Playback implementation
  const playStreamUrl = useCallback((url: string, station: RadioStation, streamIdx: number) => {
    setPlaybackStatus('loading');
    setErrorMessage(null);
    setActiveStreamIndex(streamIdx);

    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.crossOrigin = 'anonymous';
      audioRef.current.preload = 'auto';
    }

    const audio = audioRef.current;

    // Resume Web Audio Context if suspended
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    } else if (!audioContextRef.current) {
      initWebAudio();
    }

    // Cleanup previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const isHlsStream = url.includes('.m3u8') || station.codec === 'hls';

    if (isHlsStream && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 30
      });
      hlsRef.current = hls;
      hls.loadSource(url);
      hls.attachMedia(audio);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        audio.play().catch(() => {
          setPlaybackStatus('paused');
        });
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          tryFallback(station, streamIdx);
        }
      });
    } else {
      audio.src = url;
      audio.load();

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setPlaybackStatus('playing');
            updateMediaSession(station);
          })
          .catch((err) => {
            if (err.name === 'NotAllowedError') {
              setPlaybackStatus('paused');
            } else {
              tryFallback(station, streamIdx);
            }
          });
      }
    }

    // Attach listeners
    audio.onplaying = () => {
      setPlaybackStatus('playing');
      setErrorMessage(null);
      updateMediaSession(station);
    };

    audio.onwaiting = () => {
      setPlaybackStatus('loading');
    };

    audio.onpause = () => {
      setPlaybackStatus(prev => (prev === 'loading' ? 'loading' : 'paused'));
    };

    audio.onerror = () => {
      tryFallback(station, streamIdx);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initWebAudio, updateMediaSession]);

  // Fallback stream logic
  const tryFallback = useCallback((station: RadioStation, currentIdx: number) => {
    const allUrls = [station.streamUrl, ...(station.fallbackUrls || [])];
    const nextIdx = currentIdx + 1;

    if (nextIdx < allUrls.length) {
      playStreamUrl(allUrls[nextIdx], station, nextIdx);
    } else {
      setPlaybackStatus('error');
      setErrorMessage(`Unable to connect to stream for ${station.name}. Please check stream URL or try another station.`);
    }
  }, [playStreamUrl]);

  // Play a station
  const playStation = useCallback((station: RadioStation) => {
    setCurrentStation(station);

    // Add to recent stations
    setRecentStationIds(prev => {
      const filtered = prev.filter(id => id !== station.id);
      return [station.id, ...filtered].slice(0, 15);
    });

    playStreamUrl(station.streamUrl, station, 0);
  }, [playStreamUrl]);

  // Play / Pause toggle
  const togglePlayPause = useCallback(() => {
    if (!audioRef.current) {
      if (currentStation) {
        playStation(currentStation);
      } else if (filteredStations.length > 0) {
        playStation(filteredStations[0]);
      }
      return;
    }

    if (playbackStatus === 'playing') {
      audioRef.current.pause();
      setPlaybackStatus('paused');
    } else if (playbackStatus === 'paused' || playbackStatus === 'error') {
      if (currentStation) {
        const allUrls = [currentStation.streamUrl, ...(currentStation.fallbackUrls || [])];
        const urlToPlay = allUrls[activeStreamIndex] || currentStation.streamUrl;
        playStreamUrl(urlToPlay, currentStation, activeStreamIndex);
      }
    }
  }, [currentStation, playbackStatus, filteredStations, activeStreamIndex, playStation, playStreamUrl]);

  const stopPlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = '';
    }
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    setPlaybackStatus('idle');
  }, []);

  // Previous & Next station controls
  const playNextStation = useCallback(() => {
    if (filteredStations.length === 0) return;
    if (!currentStation) {
      playStation(filteredStations[0]);
      return;
    }
    const currentIndex = filteredStations.findIndex(s => s.id === currentStation.id);
    const nextIndex = (currentIndex + 1) % filteredStations.length;
    playStation(filteredStations[nextIndex]);
  }, [filteredStations, currentStation, playStation]);

  const playPreviousStation = useCallback(() => {
    if (filteredStations.length === 0) return;
    if (!currentStation) {
      playStation(filteredStations[filteredStations.length - 1]);
      return;
    }
    const currentIndex = filteredStations.findIndex(s => s.id === currentStation.id);
    const prevIndex = (currentIndex - 1 + filteredStations.length) % filteredStations.length;
    playStation(filteredStations[prevIndex]);
  }, [filteredStations, currentStation, playStation]);

  // Volume & Mute actions
  const setVolume = useCallback((vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setVolumeState(clamped);
    if (isMuted && clamped > 0) setIsMuted(false);
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const toggleBoost = useCallback(() => {
    setIsBoosted(prev => !prev);
  }, []);

  // Favorites
  const toggleFavorite = useCallback((stationId: string) => {
    setFavorites(prev => {
      if (prev.includes(stationId)) {
        return prev.filter(id => id !== stationId);
      } else {
        return [...prev, stationId];
      }
    });
  }, []);

  // Custom stations CRUD
  const addCustomStation = useCallback((stationData: Omit<RadioStation, 'id' | 'isCustom'> & { id?: string }) => {
    const id = stationData.id || `custom-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newStation: RadioStation = {
      ...stationData,
      id,
      isCustom: true,
      category: stationData.category || 'custom',
      gradient: stationData.gradient || 'from-emerald-600 to-teal-800',
      addedAt: Date.now()
    };
    setCustomStations(prev => [newStation, ...prev]);
    return newStation;
  }, []);

  const editCustomStation = useCallback((updated: RadioStation) => {
    setCustomStations(prev => prev.map(s => (s.id === updated.id ? { ...updated, isCustom: true } : s)));
    if (currentStation?.id === updated.id) {
      setCurrentStation(updated);
    }
  }, [currentStation]);

  const deleteCustomStation = useCallback((stationId: string) => {
    setCustomStations(prev => prev.filter(s => s.id !== stationId));
    setFavorites(prev => prev.filter(id => id !== stationId));
    if (currentStation?.id === stationId) {
      stopPlayback();
      setCurrentStation(null);
    }
  }, [currentStation, stopPlayback]);

  // Import / Export
  const importStations = useCallback((stations: RadioStation[]) => {
    const validStations = stations.filter(s => s.name && s.streamUrl).map(s => ({
      ...s,
      id: s.id || `custom-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      isCustom: true
    }));

    setCustomStations(prev => {
      const existingIds = new Set(prev.map(p => p.id));
      const newItems = validStations.filter(s => !existingIds.has(s.id));
      return [...newItems, ...prev];
    });

    return validStations.length;
  }, []);

  const exportStationsJson = useCallback(() => {
    return JSON.stringify(customStations, null, 2);
  }, [customStations]);

  const exportStationsM3U = useCallback(() => {
    let content = '#EXTM3U\n';
    const stationsToExport = customStations.length > 0 ? customStations : allStations;
    stationsToExport.forEach(station => {
      content += `#EXTINF:-1 tvg-name="${station.name}" group-title="${station.category}",${station.name}\n${station.streamUrl}\n`;
    });
    return content;
  }, [customStations, allStations]);

  const resetToDefaultStations = useCallback(() => {
    setCustomStations([]);
    localStorage.removeItem(STORAGE_KEYS.CUSTOM_STATIONS);
  }, []);

  // Sleep Timer Setter
  const setSleepTimer = useCallback((minutes: number | null) => {
    setSleepTimerMinutes(minutes);
  }, []);

  // Equalizer Preset Setter
  const setEqualizerPreset = useCallback((presetName: string) => {
    setSelectedPresetName(presetName);
    localStorage.setItem(STORAGE_KEYS.PRESET, presetName);
    const preset = EQUALIZER_PRESETS.find(p => p.name === presetName);
    if (preset) {
      setEqualizerGains([...preset.bands]);
    }
  }, []);

  const setBandGain = useCallback((bandIndex: number, gainDb: number) => {
    setSelectedPresetName('Custom');
    localStorage.setItem(STORAGE_KEYS.PRESET, 'Custom');
    setEqualizerGains(prev => {
      const next = [...prev];
      next[bandIndex] = gainDb;
      return next;
    });
  }, []);

  // Recording feature
  const startRecording = useCallback(() => {
    if (!audioRef.current || playbackStatus !== 'playing' || !currentStation) return;

    try {
      let stream: MediaStream;
      if (audioContextRef.current && gainNodeRef.current) {
        const dest = audioContextRef.current.createMediaStreamDestination();
        gainNodeRef.current.connect(dest);
        stream = dest.stream;
      } else if ('captureStream' in audioRef.current) {
        stream = (audioRef.current as HTMLAudioElement & { captureStream: () => MediaStream }).captureStream();
      } else {
        return;
      }

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      recordedChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
        const blobUrl = URL.createObjectURL(blob);
        const newRec: RadioRecording = {
          id: `rec-${Date.now()}`,
          stationName: currentStation.name,
          timestamp: Date.now(),
          durationSec: recordingDurationSec,
          blobUrl,
          sizeBytes: blob.size
        };
        setRecordings(prev => [newRec, ...prev]);
        setIsRecording(false);
        setRecordingDurationSec(0);
      };

      recorder.start(1000);
      setIsRecording(true);
      setRecordingDurationSec(0);

      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = window.setInterval(() => {
        setRecordingDurationSec(sec => sec + 1);
      }, 1000);
    } catch {
      setIsRecording(false);
    }
  }, [playbackStatus, currentStation, recordingDurationSec]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  }, []);

  const deleteRecording = useCallback((id: string) => {
    setRecordings(prev => {
      const rec = prev.find(r => r.id === id);
      if (rec) URL.revokeObjectURL(rec.blobUrl);
      return prev.filter(r => r.id !== id);
    });
  }, []);

  // Quick stream tester
  const testStreamUrl = useCallback(async (url: string): Promise<{ success: boolean; message?: string }> => {
    return new Promise((resolve) => {
      const testAudio = new Audio();
      testAudio.crossOrigin = 'anonymous';
      testAudio.preload = 'auto';

      let resolved = false;
      const timer = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          testAudio.src = '';
          resolve({ success: false, message: 'Connection timed out after 7s. Stream may be inactive or geo-restricted.' });
        }
      }, 7000);

      testAudio.oncanplay = () => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timer);
          testAudio.src = '';
          resolve({ success: true, message: 'Stream loaded successfully and is ready to broadcast!' });
        }
      };

      testAudio.onerror = () => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timer);
          testAudio.src = '';
          resolve({ success: false, message: 'Stream failed to decode. Check URL or CORS settings.' });
        }
      };

      testAudio.src = url;
      testAudio.load();
    });
  }, []);

  return (
    <RadioContext.Provider
      value={{
        currentStation,
        playbackStatus,
        errorMessage,
        volume,
        isMuted,
        isBoosted,
        favorites,
        customStations,
        allStations,
        filteredStations,
        recentStations,
        recordings,
        activeCategory,
        searchQuery,
        sleepTimerMinutes,
        sleepTimerRemainingSec,
        selectedPresetName,
        equalizerGains,
        analyserNode: analyserNodeRef.current,
        isRecording,
        recordingDurationSec,
        activeStreamIndex,
        playStation,
        togglePlayPause,
        stopPlayback,
        setVolume,
        toggleMute,
        toggleBoost,
        toggleFavorite,
        addCustomStation,
        editCustomStation,
        deleteCustomStation,
        importStations,
        exportStationsJson,
        exportStationsM3U,
        setActiveCategory,
        setSearchQuery,
        setSleepTimer,
        setEqualizerPreset,
        setBandGain,
        startRecording,
        stopRecording,
        deleteRecording,
        playNextStation,
        playPreviousStation,
        testStreamUrl,
        resetToDefaultStations
      }}
    >
      {children}
    </RadioContext.Provider>
  );
};

export const useRadio = () => {
  const context = useContext(RadioContext);
  if (!context) {
    throw new Error('useRadio must be used within a RadioProvider');
  }
  return context;
};
