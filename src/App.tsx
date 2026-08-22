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
  Search,
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
    favorites
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
      case 'Heart': return <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400/30" />;
      case 'PlusCircle': return <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Sparkles': return <Sparkles className="w-3.5 h-3.5 text-amber-400" />;
      case 'TowerControl': return <TowerControl className="w-3.5 h-3.5 text-sky-400" />;
      case 'Music': return <Music className="w-3.5 h-3.5 text-fuchsia-400" />;
      case 'Globe': return <Globe className="w-3.5 h-3.5 text-teal-400" />;
      case 'Newspaper': return <Newspaper className="w-3.5 h-3.5 text-orange-400" />;
      case 'Flame': return <Flame className="w-3.5 h-3.5 text-rose-400" />;
      default: return <Radio className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F0F0F0] flex flex-col pb-32">
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

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 flex-1 flex flex-col">
        
        {/* Artistic Hero / Now Playing Status Display */}
        {currentStation && (
          <div className="mb-6 p-4 sm:p-5 rounded-xl bg-[#111111] border border-[#262626] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
            <div className="flex items-center gap-3 relative z-10">
              <span className="h-[1px] w-8 bg-[#FF3D00] hidden sm:inline-block"></span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#FF3D00] font-bold">
                    Now Playing
                  </span>
                  <span className="text-[#555555]">•</span>
                  <span className="text-[10px] uppercase font-mono text-[#888888]">
                    {currentStation.frequency || 'Live Web Stream'}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                  {currentStation.name}
                </h2>
                {currentStation.malayalamName && (
                  <p className="text-xs font-malayalam text-[#AAAAAA] mt-0.5">
                    {currentStation.malayalamName}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 relative z-10">
              <button
                onClick={() => setIsVisualizerModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-[#1C1C1C] hover:bg-[#252525] border border-[#333333] hover:border-[#FF3D00]/50 text-xs font-bold text-[#CCCCCC] hover:text-[#FF3D00] flex items-center gap-1.5 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FF3D00]" />
                <span className="uppercase text-[10px] tracking-wider">Visualizer</span>
              </button>
              <button
                onClick={() => setIsEqModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-[#1C1C1C] hover:bg-[#252525] border border-[#333333] hover:border-[#FF3D00]/50 text-xs font-bold text-[#CCCCCC] hover:text-[#FF3D00] flex items-center gap-1.5 transition"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF3D00]" />
                <span className="uppercase text-[10px] tracking-wider">EQ</span>
              </button>
            </div>
          </div>
        )}

        {/* Category Pills Navigation Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none border-b border-[#262626] mb-6">
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
                className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition flex items-center gap-2 flex-shrink-0 border uppercase tracking-wider ${
                  isSelected
                    ? 'bg-[#FF3D00] text-black border-[#FF3D00] shadow-md shadow-[#FF3D00]/20'
                    : 'bg-[#111111] text-[#999999] hover:text-white border-[#2A2A2A] hover:border-[#444444] hover:bg-[#181818]'
                }`}
              >
                {getCategoryIcon(cat.icon)}
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                  isSelected ? 'bg-black text-white' : 'bg-[#222222] text-[#777777]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Recently Played Stations Strip (Only if recents exist and no active search) */}
        {recentStations.length > 0 && !searchQuery && activeCategory === 'all' && viewMode === 'grid' && (
          <div className="mb-6 bg-[#111111] border border-[#262626] rounded-xl p-3.5">
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="flex items-center gap-2 text-xs font-bold text-[#CCCCCC] uppercase tracking-wider">
                <History className="w-3.5 h-3.5 text-[#FF3D00]" />
                <span>Recently Played</span>
                <span className="text-[11px] font-malayalam text-[#777777] font-normal normal-case">
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
                        ? 'bg-[#FF3D00]/20 border-[#FF3D00] text-[#FF3D00]'
                        : 'bg-[#161616] border-[#2A2A2A] hover:border-[#444444] text-[#AAAAAA] hover:text-white'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-[#FF3D00] animate-ping' : 'bg-[#555555]'}`} />
                    <span className="truncate max-w-[120px]">{st.name}</span>
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
                  <span className="text-xs font-normal text-[#666666] font-mono normal-case">
                    ({filteredStations.length} {filteredStations.length === 1 ? 'station' : 'stations'})
                  </span>
                </h2>
              </div>

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-[#FF3D00] hover:text-white flex items-center gap-1 font-bold"
                >
                  <RotateCcw className="w-3 h-3" /> Clear search "{searchQuery}"
                </button>
              )}
            </div>

            {/* Grid of Stations */}
            {filteredStations.length === 0 ? (
              <div className="py-20 text-center text-[#777777] space-y-4 max-w-md mx-auto">
                <Radio className="w-12 h-12 text-[#444444] mx-auto stroke-1" />
                <div>
                  <h3 className="text-base font-bold text-[#CCCCCC]">No stations match your criteria</h3>
                  <p className="text-xs text-[#777777] mt-1 leading-relaxed">
                    {searchQuery 
                      ? `No stations found for "${searchQuery}". Try searching for Club FM, Suno, Asianet, or Yesudas.`
                      : activeCategory === 'favorites'
                      ? 'You have not added any stations to favorites yet. Click the heart icon on any station to pin it here.'
                      : activeCategory === 'custom'
                      ? 'You have not added any custom radio links yet.'
                      : 'No radio stations found in this category.'}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleOpenNewAddModal}
                    className="px-4 py-2 rounded-lg bg-[#FF3D00] hover:bg-white text-black text-xs font-bold uppercase tracking-wider shadow-md transition"
                  >
                    Add Radio Link
                  </button>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('all');
                    }}
                    className="px-4 py-2 rounded-lg bg-[#1A1A1A] hover:bg-[#252525] border border-[#333333] text-[#CCCCCC] hover:text-white text-xs font-semibold uppercase tracking-wider transition"
                  >
                    View All
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
