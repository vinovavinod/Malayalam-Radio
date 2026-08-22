import React, { useState } from 'react';
import { 
  Radio, 
  Heart, 
  PlusCircle, 
  Sparkles, 
  TowerControl, 
  Music, 
  Globe, 
  Newspaper, 
  Flame, 
  SlidersHorizontal,
  History,
  RotateCcw,
  Volume2
} from 'lucide-react';
import { RadioProvider, useRadio } from './context/RadioContext';
import { Header } from './components/Header';
import { StationCard } from './components/StationCard';
import { RetroRadioTuner } from './components/RetroRadioTuner';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { AddStationModal } from './components/AddStationModal';
import { EqualizerModal } from './components/EqualizerModal';
import { SleepTimerModal } from './components/SleepTimerModal';
import { VisualizerModal } from './components/VisualizerModal';
import { RecordingsModal } from './components/RecordingsModal';
import { OnlineDirectoryModal } from './components/OnlineDirectoryModal';
import { CATEGORIES_CONFIG } from './data/defaultStations';
import { RadioStation, RadioCategory } from './types/radio';

function RadioAppContent() {
  const {
    filteredStations,
    allStations,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    recentStations,
    playStation,
    currentStation,
    favorites,
    onamTheme
  } = useRadio();

  const [viewMode, setViewMode] = useState<'grid' | 'tuner'>('grid');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [stationToEdit, setStationToEdit] = useState<RadioStation | null>(null);
  const [isEqModalOpen, setIsEqModalOpen] = useState(false);
  const [isSleepModalOpen, setIsSleepModalOpen] = useState(false);
  const [isVisualizerModalOpen, setIsVisualizerModalOpen] = useState(false);
  const [isRecordingsModalOpen, setIsRecordingsModalOpen] = useState(false);
  const [isOnlineSearchModalOpen, setIsOnlineSearchModalOpen] = useState(false);

  const handleEditStation = (station: RadioStation) => {
    setStationToEdit(station);
    setIsAddModalOpen(true);
  };

  const handleOpenNewAddModal = () => {
    setStationToEdit(null);
    setIsAddModalOpen(true);
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Radio': return <Radio className="w-3.5 h-3.5" />;
      case 'Heart': return <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/30" />;
      case 'PlusCircle': return <PlusCircle className="w-3.5 h-3.5 text-amber-400" />;
      case 'Sparkles': return <Sparkles className="w-3.5 h-3.5 text-yellow-400" />;
      case 'TowerControl': return <TowerControl className="w-3.5 h-3.5 text-amber-300" />;
      case 'Music': return <Music className="w-3.5 h-3.5 text-amber-400" />;
      case 'Globe': return <Globe className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Newspaper': return <Newspaper className="w-3.5 h-3.5 text-orange-400" />;
      case 'Flame': return <Flame className="w-3.5 h-3.5 text-amber-400" />;
      default: return <Radio className="w-3.5 h-3.5" />;
    }
  };

  const themeClass = onamTheme === 'kasavu' 
    ? 'theme-kasavu bg-[#110F0C]' 
    : onamTheme === 'temple' 
    ? 'theme-temple bg-[#140A0A]' 
    : 'theme-ponnonam bg-[#0E0C0A]';

  return (
    <div className={`min-h-screen ${themeClass} text-[#FAF7F0] flex flex-col pb-32 transition-colors duration-300 selection:bg-amber-500 selection:text-black`}>
      {/* Festive Background Glow & Floral Motifs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-amber-500/10 via-yellow-600/5 to-transparent blur-3xl"></div>
        <div className="absolute top-1/3 -right-24 w-80 h-80 bg-orange-600/5 blur-3xl rounded-full"></div>
        <div className="absolute bottom-1/4 -left-24 w-80 h-80 bg-amber-500/5 blur-3xl rounded-full"></div>
      </div>

      {/* Header */}
      <Header
        onOpenAddModal={handleOpenNewAddModal}
        onOpenEqModal={() => setIsEqModalOpen(true)}
        onOpenSleepModal={() => setIsSleepModalOpen(true)}
        onOpenVisualizerModal={() => setIsVisualizerModalOpen(true)}
        onOpenRecordingsModal={() => setIsRecordingsModalOpen(true)}
        onOpenOnlineSearchModal={() => setIsOnlineSearchModalOpen(true)}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <main className="max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-5 flex-1 flex flex-col relative z-10">
        
        {/* Onam Festive Ribbon Banner */}
        <div className="mb-4 sm:mb-6 rounded-2xl bg-gradient-to-r from-[#211A10] via-[#2A2014] to-[#211A10] border border-amber-500/35 p-3.5 sm:p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-28 h-28 bg-amber-400/10 rounded-full blur-xl pointer-events-none"></div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-inner">
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-amber-300">
                  പൊന്നോണം സന്ധ്യ & ഓണപ്പാട്ടുകൾ
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-400 text-black font-extrabold uppercase">
                  Onam Special
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-300 font-malayalam mt-0.5">
                മാവേലി നാടുവാണീടും കാലം... മാതൃഭൂമി, ആകാശവാണി, കൊച്ചി 90 FM & പ്രവാസി തത്സമയ പ്രക്ഷേപണം
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => {
                setActiveCategory('onam-special');
                setViewMode('grid');
              }}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-110 text-black text-xs font-bold uppercase tracking-wider transition shadow-md shadow-amber-500/20 whitespace-nowrap"
            >
              Play Onam Tracks
            </button>
          </div>
        </div>

        {/* Artistic Hero / Now Playing Status Display */}
        {currentStation && (
          <div className="mb-5 p-4 sm:p-5 rounded-2xl bg-[#1A150F] border border-amber-500/35 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden shadow-lg shadow-black/50">
            <div className="flex items-center gap-3 relative z-10">
              <span className="h-[2px] w-8 bg-amber-400 hidden sm:inline-block rounded-full"></span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-amber-400 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block"></span>
                    Now Live Broadcast
                  </span>
                  <span className="text-neutral-600">•</span>
                  <span className="text-[11px] font-mono font-medium text-amber-200/70">
                    {currentStation.frequency || 'Kerala FM'}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                  {currentStation.name}
                </h2>
                {currentStation.malayalamName && (
                  <p className="text-xs font-malayalam text-amber-200/80 mt-0.5 font-medium">
                    {currentStation.malayalamName}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 relative z-10 w-full sm:w-auto justify-end">
              <button
                onClick={() => setIsVisualizerModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-[#261E14] hover:bg-[#33281B] border border-amber-500/40 hover:border-amber-400 text-xs font-bold text-amber-200 hover:text-amber-100 flex items-center gap-1.5 transition shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="uppercase text-[10px] tracking-wider">Visualizer</span>
              </button>
              <button
                onClick={() => setIsEqModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-[#261E14] hover:bg-[#33281B] border border-amber-500/40 hover:border-amber-400 text-xs font-bold text-amber-200 hover:text-amber-100 flex items-center gap-1.5 transition shadow-sm"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                <span className="uppercase text-[10px] tracking-wider">EQ Sound</span>
              </button>
            </div>
          </div>
        )}

        {/* Category Navigation Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none border-b border-amber-500/20 mb-5">
          {CATEGORIES_CONFIG.map(cat => {
            const isSelected = activeCategory === cat.id;
            const count = cat.id === 'all' 
              ? allStations.length 
              : cat.id === 'favorites'
              ? favorites.length
              : cat.id === 'custom'
              ? allStations.filter(s => s.isCustom).length
              : allStations.filter(s => s.category === cat.id).length;

            return (
              <button
                key={cat.id}
                id={`cat-tab-${cat.id}`}
                onClick={() => {
                  setActiveCategory(cat.id as RadioCategory);
                  setViewMode('grid');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 flex-shrink-0 border uppercase tracking-wider shadow-sm ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 text-black border-amber-300 font-extrabold shadow-md shadow-amber-500/25'
                    : 'bg-[#1A140E] text-amber-100/70 hover:text-white border-amber-500/20 hover:border-amber-400/50 hover:bg-[#251D14]'
                }`}
              >
                {getCategoryIcon(cat.icon)}
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                  isSelected ? 'bg-black text-amber-300' : 'bg-[#2A2016] text-amber-300/70'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Recently Played Stations Strip */}
        {recentStations.length > 0 && !searchQuery && activeCategory === 'all' && viewMode === 'grid' && (
          <div className="mb-5 bg-[#18130D] border border-amber-500/25 rounded-xl p-3.5 shadow-sm">
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-200 uppercase tracking-wider">
                <History className="w-3.5 h-3.5 text-amber-400" />
                <span>Recently Played</span>
                <span className="text-[11px] font-malayalam text-amber-200/60 font-normal normal-case">
                  (അവസാനം കേട്ടവ)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
              {recentStations.slice(0, 8).map(st => {
                const isPlaying = currentStation?.id === st.id;
                return (
                  <button
                    key={`recent-${st.id}`}
                    onClick={() => playStation(st)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold whitespace-nowrap transition flex-shrink-0 ${
                      isPlaying
                        ? 'bg-amber-500/25 border-amber-400 text-amber-200 font-bold'
                        : 'bg-[#211A11] border-amber-500/20 hover:border-amber-400/50 text-neutral-300 hover:text-white'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-amber-400 animate-ping' : 'bg-neutral-500'}`} />
                    <span className="truncate max-w-[130px]">{st.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* View Mode: Retro Analog Tuner */}
        {viewMode === 'tuner' ? (
          <div className="py-2">
            <RetroRadioTuner />
          </div>
        ) : (
          /* View Mode: Responsive Stations Grid */
          <div className="flex-1">
            {/* Header info & quick search status */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <span>{CATEGORIES_CONFIG.find(c => c.id === activeCategory)?.label || 'Malayalam Stations'}</span>
                  <span className="text-xs font-normal text-amber-300/70 font-mono normal-case">
                    ({filteredStations.length} {filteredStations.length === 1 ? 'station' : 'stations'})
                  </span>
                </h2>
              </div>

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-amber-400 hover:text-amber-200 flex items-center gap-1 font-bold"
                >
                  <RotateCcw className="w-3 h-3" /> Clear search "{searchQuery}"
                </button>
              )}
            </div>

            {/* Grid of Stations */}
            {filteredStations.length === 0 ? (
              <div className="py-16 text-center text-neutral-400 space-y-4 max-w-md mx-auto">
                <Radio className="w-12 h-12 text-amber-500/40 mx-auto stroke-1" />
                <div>
                  <h3 className="text-base font-bold text-amber-100">No stations match your criteria</h3>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    {searchQuery 
                      ? `No stations found for "${searchQuery}". Try searching for Onam, Kochi, Akashvani, or Sargakshetra.`
                      : activeCategory === 'favorites'
                      ? 'You have not added any stations to favorites yet. Click the heart icon on any station to pin it here.'
                      : activeCategory === 'custom'
                      ? 'You have not added any custom radio links yet. Click "Add Stream" at top right to paste any live URL!'
                      : 'No radio stations found in this category.'}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleOpenNewAddModal}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-110 text-black text-xs font-bold uppercase tracking-wider shadow-md transition"
                  >
                    Add Stream Link
                  </button>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('all');
                    }}
                    className="px-4 py-2 rounded-lg bg-[#221B12] hover:bg-[#2F251A] border border-amber-500/30 text-amber-200 hover:text-white text-xs font-semibold uppercase tracking-wider transition"
                  >
                    View All Stations
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredStations.map(station => (
                  <StationCard
                    key={station.id}
                    station={station}
                    onEdit={handleEditStation}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Sticky Bottom Audio Player Bar */}
      <AudioPlayerBar
        onOpenVisualizerModal={() => setIsVisualizerModalOpen(true)}
        onOpenEqModal={() => setIsEqModalOpen(true)}
        onOpenSleepModal={() => setIsSleepModalOpen(true)}
        onOpenRecordingsModal={() => setIsRecordingsModalOpen(true)}
      />

      {/* Interactive Modals */}
      <AddStationModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setStationToEdit(null);
        }}
        stationToEdit={stationToEdit}
      />

      <EqualizerModal
        isOpen={isEqModalOpen}
        onClose={() => setIsEqModalOpen(false)}
      />

      <SleepTimerModal
        isOpen={isSleepModalOpen}
        onClose={() => setIsSleepModalOpen(false)}
      />

      <VisualizerModal
        isOpen={isVisualizerModalOpen}
        onClose={() => setIsVisualizerModalOpen(false)}
      />

      <RecordingsModal
        isOpen={isRecordingsModalOpen}
        onClose={() => setIsRecordingsModalOpen(false)}
      />

      <OnlineDirectoryModal
        isOpen={isOnlineSearchModalOpen}
        onClose={() => setIsOnlineSearchModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <RadioProvider>
      <RadioAppContent />
    </RadioProvider>
  );
}
