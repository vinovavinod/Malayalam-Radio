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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-3xl bg-[#0F0F0F] border border-[#262626] rounded-2xl shadow-2xl overflow-hidden p-6 max-h-[88vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#181818] border border-[#333333] flex items-center justify-center text-[#FF3D00]">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                Online Directory
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Live Global Database
                </span>
              </h3>
              <p className="text-xs text-[#888888] font-malayalam">
                ഇന്റർനെറ്റിലെ പുതിയ മലയാളം റേഡിയോ ചാനലുകൾ കണ്ടെത്താം
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

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="my-4 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888888]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search global Malayalam directory (e.g. Kozhikode, Gulf, Hits)..."
              className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF3D00] transition"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2.5 rounded-lg bg-[#FF3D00] hover:bg-white text-black font-bold uppercase tracking-wider text-xs shadow transition flex items-center gap-1.5 disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            <span>Search</span>
          </button>
        </form>

        {/* Stations Results List */}
        <div className="overflow-y-auto flex-1 space-y-2.5 pr-1 my-2">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-[#FF3D00] animate-spin mx-auto" />
              <p className="text-xs text-[#888888]">Discovering active Malayalam radio streams...</p>
            </div>
          ) : stations.length === 0 ? (
            <div className="py-16 text-center text-[#888888] space-y-2">
              <Radio className="w-10 h-10 mx-auto text-[#444444] stroke-1" />
              <p className="text-sm font-semibold text-[#CCCCCC]">No additional online stations found</p>
              <p className="text-xs max-w-sm mx-auto text-[#666666]">
                You can add your own custom radio link directly using the "Add Radio Link" button on top!
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
                  className="p-3.5 rounded-xl bg-[#0A0A0A] border border-[#262626] hover:border-[#444444] transition flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#181818] border border-[#333333] text-[#FF3D00] font-bold flex-shrink-0 shadow">
                      <Radio className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate uppercase tracking-wide">
                        {st.name}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-[#888888] mt-0.5">
                        <span>{st.location}</span>
                        <span>•</span>
                        <span className="font-mono text-[#FF3D00]">{st.bitrate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Play Button */}
                    <button
                      onClick={() => playStation(st)}
                      className={`p-2 rounded-lg transition flex items-center gap-1 text-xs font-bold uppercase tracking-wider ${
                        isPlaying
                          ? 'bg-[#FF3D00] text-black shadow-md shadow-[#FF3D00]/20'
                          : 'bg-[#181818] hover:bg-[#252525] text-white border border-[#333333]'
                      }`}
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span className="hidden sm:inline">{isPlaying ? 'Playing' : 'Listen'}</span>
                    </button>

                    {/* Add to My Links Button */}
                    <button
                      onClick={() => handleAddStation(st)}
                      disabled={isAlreadyAdded}
                      className={`p-2 rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center gap-1 ${
                        isAlreadyAdded
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : 'bg-[#181818] hover:bg-[#252525] text-[#FF3D00] border border-[#333333]'
                      }`}
                      title={isAlreadyAdded ? 'Already in your list' : 'Add to My Stations'}
                    >
                      {isAlreadyAdded ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Plus className="w-3.5 h-3.5" />}
                      <span className="hidden sm:inline">{isAlreadyAdded ? 'Added' : 'Save'}</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#262626] flex items-center justify-between text-xs text-[#888888]">
          <span>Found {stations.length} online station streams</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#141414] hover:bg-[#202020] text-white font-bold uppercase tracking-wider text-xs border border-[#333333] transition"
          >
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
};
