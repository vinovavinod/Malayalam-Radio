import React, { useState } from 'react';
import { 
  Radio, 
  Heart, 
  Sparkles, 
  SlidersHorizontal,
  RotateCcw,
  Users,
  TowerControl,
  Globe,
  ListMusic,
  AlertCircle,
  Mail,
  Info
} from 'lucide-react';
import { RadioProvider, useRadio } from './context/RadioContext';
import { Header } from './components/Header';
import { StationCard } from './components/StationCard';
import { RetroRadioTuner } from './components/RetroRadioTuner';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { EqualizerModal } from './components/EqualizerModal';
import { SleepTimerModal } from './components/SleepTimerModal';
import { VisualizerModal } from './components/VisualizerModal';
import { RecordingsModal } from './components/RecordingsModal';
import { OnlineDirectoryModal } from './components/OnlineDirectoryModal';
import { ContactModal } from './components/ContactModal';
import { RadioCategory } from './types/radio';

function RadioAppContent() {
  const {
    filteredStations,
    allStations,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    currentStation,
    favorites,
    onamTheme
  } = useRadio();

  const [viewMode, setViewMode] = useState<'grid' | 'tuner'>('grid');
  
  // Modals state
  const [isEqModalOpen, setIsEqModalOpen] = useState(false);
  const [isSleepModalOpen, setIsSleepModalOpen] = useState(false);
  const [isVisualizerModalOpen, setIsVisualizerModalOpen] = useState(false);
  const [isRecordingsModalOpen, setIsRecordingsModalOpen] = useState(false);
  const [isOnlineSearchModalOpen, setIsOnlineSearchModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Category counts
  const categoryCounts = React.useMemo(() => {
    return {
      all: allStations.length,
      community: allStations.filter(s => s.category === 'community').length,
      air: allStations.filter(s => s.category === 'air').length,
      online: allStations.filter(s => s.category === 'online').length,
      devotional: allStations.filter(s => s.category === 'devotional').length,
      favorites: favorites.length
    };
  }, [allStations, favorites]);

  const categoriesList: { id: RadioCategory; label: string; malayalam: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Stations', malayalam: 'എല്ലാം', icon: <ListMusic className="w-3.5 h-3.5" /> },
    { id: 'community', label: 'Community Radios', malayalam: 'കമ്മ്യൂണിറ്റി', icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'air', label: 'AIR (Akashvani)', malayalam: 'ആകാശവാണി', icon: <TowerControl className="w-3.5 h-3.5" /> },
    { id: 'online', label: 'Online Radios', malayalam: 'ഓൺലൈൻ', icon: <Globe className="w-3.5 h-3.5" /> },
    { id: 'devotional', label: 'Devotional', malayalam: 'ഭക്തിഗാനങ്ങൾ', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'favorites', label: 'Favorites', malayalam: 'ഇഷ്ടപ്പെട്ടവ', icon: <Heart className="w-3.5 h-3.5" /> },
  ];

  const themeClass = onamTheme === 'kasavu' 
    ? 'theme-kasavu bg-[#110F0C]' 
    : onamTheme === 'temple' 
    ? 'theme-temple bg-[#140A0A]' 
    : 'theme-ponnonam bg-[#0E0C0A]';

  return (
    <div className={`min-h-screen ${themeClass} text-[#FAF7F0] flex flex-col pb-36 transition-colors duration-300 selection:bg-amber-500 selection:text-black`}>
      {/* Festive Background Glow & Golden Motifs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-amber-500/10 via-yellow-600/5 to-transparent blur-3xl"></div>
        <div className="absolute top-1/3 -right-24 w-80 h-80 bg-orange-600/5 blur-3xl rounded-full"></div>
        <div className="absolute bottom-1/4 -left-24 w-80 h-80 bg-amber-500/5 blur-3xl rounded-full"></div>
      </div>

      {/* Header */}
      <Header
        onOpenEqModal={() => setIsEqModalOpen(true)}
        onOpenSleepModal={() => setIsSleepModalOpen(true)}
        onOpenVisualizerModal={() => setIsVisualizerModalOpen(true)}
        onOpenRecordingsModal={() => setIsRecordingsModalOpen(true)}
        onOpenOnlineSearchModal={() => setIsOnlineSearchModalOpen(true)}
        onOpenContactModal={() => setIsContactModalOpen(true)}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <main className="max-w-5xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-5 flex-1 flex flex-col relative z-10">
        
        {/* Now Playing Status Banner Display (if playing) */}
        {currentStation && (
          <div className="mb-4 p-4 sm:p-5 rounded-2xl bg-[#1A150F] border border-amber-500/35 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden shadow-lg shadow-black/50">
            <div className="flex items-center gap-3 relative z-10">
              <span className="h-[2px] w-8 bg-amber-400 hidden sm:inline-block rounded-full"></span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-amber-400 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block"></span>
                    Now Live
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

        {/* View Mode: Retro Analog Tuner */}
        {viewMode === 'tuner' ? (
          <div className="py-2">
            <RetroRadioTuner />
          </div>
        ) : (
          /* View Mode: Single Vertical Scrolling List */
          <div className="flex-1">
            {/* Category Navigation Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-amber-500/20">
                <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1 w-full">
                  {categoriesList.map(cat => {
                    const isActive = activeCategory === cat.id;
                    const count = categoryCounts[cat.id as keyof typeof categoryCounts] ?? 0;

                    return (
                      <button
                        key={cat.id}
                        id={`category-tab-${cat.id}`}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`flex-shrink-0 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 border ${
                          isActive
                            ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-black border-amber-300 font-extrabold shadow-md shadow-amber-500/25 scale-[1.02]'
                            : 'bg-[#1A140E] text-amber-100/75 hover:text-white border-amber-500/20 hover:border-amber-400/50 hover:bg-[#241B12]'
                        }`}
                      >
                        <span className={isActive ? 'text-black' : cat.id === 'favorites' ? 'text-rose-400' : 'text-amber-400'}>
                          {cat.icon}
                        </span>
                        <span className="whitespace-nowrap">{cat.label}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                            isActive
                              ? 'bg-black text-amber-300'
                              : 'bg-[#281F15] text-amber-300/80'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="flex-shrink-0 text-xs text-amber-400 hover:text-amber-200 flex items-center gap-1 font-bold pl-2"
                  >
                    <RotateCcw className="w-3 h-3" /> Clear
                  </button>
                )}
              </div>
            </div>

            {/* AIR (Akashvani) Dynamic Stream Notice Banner */}
            {activeCategory === 'air' && (
              <div className="mb-4 p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-amber-950/60 via-[#24170C]/80 to-amber-950/60 border border-amber-500/40 text-amber-200/90 text-xs shadow-md">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <span className="font-bold text-amber-300 uppercase tracking-wider text-[11px] sm:text-xs">
                        Akashvani (AIR) Stream Link Notice
                      </span>
                      <button
                        onClick={() => setIsContactModalOpen(true)}
                        className="text-[10px] text-amber-300 hover:text-white font-bold underline flex items-center gap-1"
                      >
                        <Mail className="w-3 h-3" /> Report Link / Contact Us
                      </button>
                    </div>
                    <p className="mt-1 text-[11px] sm:text-xs text-amber-100/80 leading-relaxed">
                      Notice: Some All India Radio (AIR) stations may occasionally experience playback issues or downtime because Prasar Bharati periodically updates its CDN streaming URLs and access tokens. We regularly refresh and update these live endpoints.
                    </p>
                    <p className="mt-1 text-[11px] text-amber-300/70 font-malayalam">
                      ആകാശവാണി സ്ട്രീമിംഗ് ലിങ്കുകൾ അപ്‌ഡേറ്റ് ചെയ്യപ്പെടുന്നതിനാൽ ചില സ്റ്റേഷനുകൾ താൽക്കാലികമായി ലഭിച്ചേക്കില്ല. പുതിയ ലിങ്കുകൾ ശ്രദ്ധയിൽപ്പെട്ടാൽ ദയവായി അറിയിക്കുക.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Vertical Scrolling List of Cards */}
            {filteredStations.length === 0 ? (
              <div className="py-16 text-center text-neutral-400 space-y-4 max-w-md mx-auto">
                <Radio className="w-12 h-12 text-amber-500/40 mx-auto stroke-1" />
                <div>
                  <h3 className="text-base font-bold text-amber-100">No stations found</h3>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    {searchQuery 
                      ? `No stations found for "${searchQuery}". Try searching by station name, frequency, or city.`
                      : activeCategory === 'favorites'
                      ? 'No favorite stations saved yet. Click the heart icon on any station to pin it to your favorites.'
                      : 'No radio stations currently available in this category.'}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
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
              <div className="flex flex-col gap-3.5">
                {filteredStations.map(station => (
                  <StationCard
                    key={station.id}
                    station={station}
                  />
                ))}
              </div>
            )}

            {/* Quick Footer Contact Bar */}
            <div className="mt-8 pt-4 pb-2 border-t border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-amber-200/60">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400/80"></span>
                <span>Kerala Radio • Live Malayalam Broadcasts</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="hover:text-amber-200 text-amber-300/80 font-medium flex items-center gap-1 transition"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Contact: puthenpura9997@gmail.com</span>
                </button>
              </div>
            </div>
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

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
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
