export type RadioCategory = 
  | 'all'
  | 'community'
  | 'air'
  | 'online'
  | 'devotional'
  | 'favorites'
  | 'custom';

export type OnamThemeMode = 'frost' | 'azure' | 'nordic' | 'ponnonam' | 'kasavu' | 'temple';

export interface RadioStation {
  id: string;
  name: string;
  malayalamName?: string;
  streamUrl: string;
  fallbackUrls?: string[];
  category: 'community' | 'air' | 'online' | 'devotional' | 'custom';
  frequency?: string;
  location?: string;
  bitrate?: string;
  logo?: string;
  gradient?: string;
  isCustom?: boolean;
  description?: string;
  tags?: string[];
  codec?: 'mp3' | 'aac' | 'hls' | 'auto';
  addedAt?: number;
}

export type PlaybackStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

export interface StreamQuality {
  label: string;
  bitrate: string;
  url: string;
}

export interface EqualizerPreset {
  name: string;
  bands: number[]; // 5 bands: 60Hz, 230Hz, 910Hz, 4kHz, 14kHz (values in dB: -12 to +12)
}

export interface RadioRecording {
  id: string;
  stationName: string;
  timestamp: number;
  durationSec: number;
  blobUrl: string;
  sizeBytes: number;
}
