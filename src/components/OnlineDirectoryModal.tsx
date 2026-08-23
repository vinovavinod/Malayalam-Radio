import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Sparkles, 
  Play, 
  Pause, 
  Plus, 
  Check, 
  Radio, 
  Globe2, 
  Wifi, 
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';
import { fetchMalayalamOnlineStations } from '../services/radioBrowserApi';
import { RadioStation } from '../types/radio';
import { useRadio } from '../context/RadioContext';
import { StationIcon } from './StationIcon';

interface OnlineDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnlineDirectoryModal: React.FC<OnlineDirectoryModalProps> = ({ isOpen, onClose }) => {
  const { playStation, currentStation, playbackStatus, addCustomStation, allStations } = useRadio();

  const [search, setSearch] = useState('');
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [loading, setLoading] = useState(false);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const loadStations = async (query = '') => {
    setLoading(true);
    const results = await fetchMalayalamOnlineStations(query);
    setStations(results);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      loadStations('');
    }
  }, [isOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadStations(search);
  };

  const handleAddStation = (st: RadioStation) => {
    addCustomStation({
      name: st.name,
      malayalamName: st.malayalamName,
      streamUrl: st.streamUrl,
      fallbackUrls: st.fallbackUrls,
      category: st.category,
      frequency: st.frequency,
      location: st.location,
      bitrate: st.bitrate,
      description: st.description,
      gradient: st.gradient
    });
    setAddedIds(prev => new Set(prev).add(st.id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden p-6 max-h-[88vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                Online Malayalam Directory
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300">
                  Live Database
                </span>
              </h3>
              <p className="text-xs text-slate-500 font-malayalam">
                ഇന്റർനെറ്റിലെ പുതിയ മലയാളം റേഡിയോ ചാനലുകൾ കണ്ടെത്താം
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="my-4 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search global Malayalam directory (e.g. Kozhikode, Gulf, Hits)..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500 transition"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:brightness-110 text-white font-bold uppercase tracking-wider text-xs shadow-xs transition flex items-center gap-1.5 disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            <span>Search</span>
          </button>
        </form>

        {/* Stations Results List */}
        <div className="overflow-y-auto flex-1 space-y-2.5 pr-1 my-2">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-sky-600 animate-spin mx-auto" />
              <p className="text-xs text-slate-500">Discovering active Malayalam radio streams...</p>
            </div>
          ) : stations.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <Radio className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
              <p className="text-sm font-semibold text-slate-700">No additional online stations found</p>
              <p className="text-xs max-w-sm mx-auto text-slate-500">
                Try searching for specific city keywords like Kochi, Kozhikode, Thrissur, or Pravasi.
              </p>
            </div>
          ) : (
            stations.map(st => {
              const isCurrent = currentStation?.id === st.id;
              const isPlaying = isCurrent && playbackStatus === 'playing';
              const isAlreadyAdded = addedIds.has(st.id) || allStations.some(s => s.streamUrl === st.streamUrl);

              return (
                <div
                  key={st.id}
                  className={`p-3.5 rounded-xl transition flex items-center justify-between gap-3 ${
                    isPlaying 
                      ? 'station-tile-cream-active ring-1 ring-[#D4AF37]/50'
                      : 'station-tile-cream'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <StationIcon
                      station={st}
                      size="sm"
                      isPlaying={isPlaying}
                    />

                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900 truncate uppercase tracking-wide">
                        {st.name}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-[#7A4513] mt-0.5 flex-wrap">
                        <span>{st.location || 'Malayalam'}</span>
                        <span>•</span>
                        <span className="font-mono text-amber-800 font-bold">{st.bitrate || '128 kbps'}</span>
                        {st.category && (
                          <>
                            <span>•</span>
                            <span className="uppercase text-[9px] px-1.5 py-0.2 rounded bg-[#EFE8DC] text-[#6A5A4A] border border-[#DFD3C0]">
                              {st.category}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Play Button */}
                    <button
                      onClick={() => playStation(st)}
                      className={`p-2 rounded-lg transition flex items-center gap-1 text-xs font-bold uppercase tracking-wider ${
                        isPlaying
                          ? 'bg-gradient-to-r from-[#D97706] via-[#D4AF37] to-[#B45309] text-white shadow-xs'
                          : 'bg-[#EFE5D4] hover:bg-[#E2D4BF] text-[#4A3828] border border-[#DDCFBA]'
                      }`}
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5 fill-white text-white" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                      <span className="hidden sm:inline">{isPlaying ? 'Playing' : 'Listen'}</span>
                    </button>

                    {/* Add Button */}
                    <button
                      onClick={() => handleAddStation(st)}
                      disabled={isAlreadyAdded}
                      className={`p-2 rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center gap-1 ${
                        isAlreadyAdded
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                          : 'bg-[#EFE5D4] hover:bg-[#E2D4BF] text-[#7A4513] border border-[#DDCFBA]'
                      }`}
                      title={isAlreadyAdded ? 'Already in your list' : 'Add to Stations'}
                    >
                      {isAlreadyAdded ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Plus className="w-3.5 h-3.5 text-[#7A4513]" />}
                      <span className="hidden sm:inline">{isAlreadyAdded ? 'Added' : 'Save'}</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Found {stations.length} online station streams</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold uppercase tracking-wider text-xs border border-slate-200 transition"
          >
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
};
