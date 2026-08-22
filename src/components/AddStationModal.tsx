import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Play, 
  Check, 
  AlertCircle, 
  FileText, 
  Download, 
  Upload, 
  RefreshCw, 
  Sparkles,
  Link,
  Radio,
  Music
} from 'lucide-react';
import { useRadio } from '../context/RadioContext';
import { RadioStation } from '../types/radio';

interface AddStationModalProps {
  isOpen: boolean;
  onClose: () => void;
  stationToEdit?: RadioStation | null;
}

export const AddStationModal: React.FC<AddStationModalProps> = ({
  isOpen,
  onClose,
  stationToEdit
}) => {
  const { 
    addCustomStation, 
    editCustomStation, 
    testStreamUrl, 
    importStations, 
    exportStationsJson,
    exportStationsM3U,
    resetToDefaultStations
  } = useRadio();

  const [activeTab, setActiveTab] = useState<'single' | 'batch' | 'backup'>('single');

  // Single Station Form state
  const [name, setName] = useState('');
  const [malayalamName, setMalayalamName] = useState('');
  const [streamUrl, setStreamUrl] = useState('');
  const [fallbackUrl, setFallbackUrl] = useState('');
  const [category, setCategory] = useState<RadioStation['category']>('custom');
  const [frequency, setFrequency] = useState('');
  const [location, setLocation] = useState('');
  const [bitrate, setBitrate] = useState('128 kbps MP3');
  const [description, setDescription] = useState('');

  // Stream tester state
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message?: string } | null>(null);

  // Batch import text state
  const [batchText, setBatchText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Prefill if editing
  React.useEffect(() => {
    if (stationToEdit) {
      setName(stationToEdit.name || '');
      setMalayalamName(stationToEdit.malayalamName || '');
      setStreamUrl(stationToEdit.streamUrl || '');
      setFallbackUrl(stationToEdit.fallbackUrls?.[0] || '');
      setCategory(stationToEdit.category || 'custom');
      setFrequency(stationToEdit.frequency || '');
      setLocation(stationToEdit.location || '');
      setBitrate(stationToEdit.bitrate || '128 kbps MP3');
      setDescription(stationToEdit.description || '');
      setActiveTab('single');
    } else {
      setName('');
      setMalayalamName('');
      setStreamUrl('');
      setFallbackUrl('');
      setCategory('custom');
      setFrequency('');
      setLocation('Kerala');
      setBitrate('128 kbps MP3');
      setDescription('');
    }
    setTestResult(null);
    setImportStatus(null);
  }, [stationToEdit, isOpen]);

  if (!isOpen) return null;

  const handleTestStream = async () => {
    if (!streamUrl.trim()) return;
    setIsTesting(true);
    setTestResult(null);
    const result = await testStreamUrl(streamUrl.trim());
    setTestResult(result);
    setIsTesting(false);
  };

  const handleSaveSingle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !streamUrl.trim()) return;

    const stationData: Omit<RadioStation, 'id' | 'isCustom'> & { id?: string } = {
      name: name.trim(),
      malayalamName: malayalamName.trim() || undefined,
      streamUrl: streamUrl.trim(),
      fallbackUrls: fallbackUrl.trim() ? [fallbackUrl.trim()] : [],
      category,
      frequency: frequency.trim() || 'Online HD',
      location: location.trim() || 'Kerala',
      bitrate: bitrate.trim() || '128 kbps MP3',
      description: description.trim() || undefined,
      gradient: 'from-amber-600 to-red-700',
      tags: ['Custom', category]
    };

    if (stationToEdit) {
      editCustomStation({
        ...stationData,
        id: stationToEdit.id,
        isCustom: true
      });
    } else {
      addCustomStation(stationData);
    }

    onClose();
  };

  const handleBatchImport = () => {
    if (!batchText.trim()) return;

    try {
      // 1. Try JSON import
      if (batchText.trim().startsWith('[') || batchText.trim().startsWith('{')) {
        const parsed = JSON.parse(batchText);
        const list: RadioStation[] = Array.isArray(parsed) ? parsed : [parsed];
        const count = importStations(list);
        setImportStatus(`Successfully imported ${count} station(s)!`);
        setTimeout(() => onClose(), 1200);
        return;
      }

      // 2. Try M3U / Plain URL line-by-line format
      const lines = batchText.split('\n').map(l => l.trim()).filter(Boolean);
      const parsedStations: RadioStation[] = [];
      let currentExtName = '';

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith('#EXTINF:')) {
          const namePart = line.split(',')[1] || 'Malayalam Radio';
          currentExtName = namePart.trim();
        } else if (line.startsWith('http://') || line.startsWith('https://')) {
          parsedStations.push({
            id: `custom-import-${Date.now()}-${i}`,
            name: currentExtName || `Malayalam Station ${parsedStations.length + 1}`,
            streamUrl: line,
            category: 'custom',
            frequency: 'Live Stream',
            location: 'Custom Stream Link',
            bitrate: '128 kbps',
            isCustom: true
          });
          currentExtName = '';
        }
      }

      if (parsedStations.length > 0) {
        const count = importStations(parsedStations);
        setImportStatus(`Successfully imported ${count} station(s) from playlist links!`);
        setTimeout(() => onClose(), 1200);
      } else {
        setImportStatus('No valid stream URLs found. Please provide http(s) links or valid JSON/M3U.');
      }
    } catch (err) {
      setImportStatus('Import failed. Invalid JSON or playlist format.');
    }
  };

  const handleDownloadBackup = (format: 'json' | 'm3u') => {
    const data = format === 'json' ? exportStationsJson() : exportStationsM3U();
    const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `malayalam-radio-stations.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-[#0F0F0F] border border-[#262626] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#262626] bg-[#0A0A0A]/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#181818] border border-[#333333] flex items-center justify-center text-[#FF3D00]">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                {stationToEdit ? 'Edit Custom Radio Station' : 'Add Custom Radio Link'}
              </h3>
              <p className="text-xs text-[#888888] font-malayalam">
                സ്വന്തം റേഡിയോ സ്ട്രീം ലിങ്ക് ചേർക്കുക അല്ലെങ്കിൽ ഇറക്കുമതി ചെയ്യുക
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#888888] hover:text-white rounded-lg hover:bg-[#1A1A1A] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#262626] bg-[#0A0A0A]/50 px-6 pt-2">
          <button
            onClick={() => setActiveTab('single')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'single'
                ? 'border-[#FF3D00] text-[#FF3D00] bg-[#FF3D00]/10'
                : 'border-transparent text-[#888888] hover:text-[#CCCCCC]'
            }`}
          >
            <Link className="w-3.5 h-3.5" />
            <span>Single URL</span>
          </button>

          <button
            onClick={() => setActiveTab('batch')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'batch'
                ? 'border-[#FF3D00] text-[#FF3D00] bg-[#FF3D00]/10'
                : 'border-transparent text-[#888888] hover:text-[#CCCCCC]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Batch (M3U / JSON)</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'backup'
                ? 'border-[#FF3D00] text-[#FF3D00] bg-[#FF3D00]/10'
                : 'border-transparent text-[#888888] hover:text-[#CCCCCC]'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Backup & Export</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'single' && (
            <form onSubmit={handleSaveSingle} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Station Name */}
                <div>
                  <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-1">
                    Station Name <span className="text-[#FF3D00]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. My Malayalam FM, Pravasi Radio"
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#FF3D00] transition"
                  />
                </div>

                {/* Malayalam Name (Optional) */}
                <div>
                  <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-1">
                    Malayalam Name (ഓപ്ഷണൽ)
                  </label>
                  <input
                    type="text"
                    value={malayalamName}
                    onChange={(e) => setMalayalamName(e.target.value)}
                    placeholder="e.g. പ്രവാസി റേഡിയോ"
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-3.5 py-2 text-sm text-white font-malayalam focus:outline-none focus:border-[#FF3D00] transition"
                  />
                </div>
              </div>

              {/* Stream URL */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider">
                    Direct Stream URL (.mp3, .aac, .m3u8, shoutcast) <span className="text-[#FF3D00]">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleTestStream}
                    disabled={!streamUrl.trim() || isTesting}
                    className="text-[11px] font-bold uppercase tracking-wider text-[#FF3D00] hover:text-white flex items-center gap-1 disabled:opacity-40"
                  >
                    {isTesting ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                    <span>Test Stream</span>
                  </button>
                </div>
                <input
                  type="url"
                  required
                  value={streamUrl}
                  onChange={(e) => {
                    setStreamUrl(e.target.value);
                    setTestResult(null);
                  }}
                  placeholder="https://stream.zeno.fm/... or http://...:8000/stream"
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-[#FF3D00] transition"
                />

                {/* Stream Test Feedback */}
                {testResult && (
                  <div className={`mt-2 p-2.5 rounded-lg text-xs flex items-center gap-2 ${
                    testResult.success 
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' 
                      : 'bg-red-500/15 text-red-300 border border-red-500/30'
                  }`}>
                    {testResult.success ? <Check className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
                    <span>{testResult.message}</span>
                  </div>
                )}
              </div>

              {/* Fallback Stream URL (Optional) */}
              <div>
                <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-1">
                  Secondary Fallback URL (Optional)
                </label>
                <input
                  type="url"
                  value={fallbackUrl}
                  onChange={(e) => setFallbackUrl(e.target.value)}
                  placeholder="https://secondary-stream-url..."
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-[#FF3D00] transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as RadioStation['category'])}
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF3D00] transition"
                  >
                    <option value="custom">My Links (Custom)</option>
                    <option value="top-fm">Top FM Hits</option>
                    <option value="akashvani">Akashvani AIR</option>
                    <option value="hits-retro">Retro & Melodies</option>
                    <option value="gulf-pravasi">Gulf Pravasi</option>
                    <option value="news-talk">News & Talk</option>
                    <option value="devotional">Devotional</option>
                  </select>
                </div>

                {/* Frequency / Dial */}
                <div>
                  <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-1">
                    Frequency / Tag
                  </label>
                  <input
                    type="text"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    placeholder="e.g. 104.4 FM, Online"
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF3D00] transition"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-1">
                    Location / Region
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Dubai, UAE / Kerala"
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF3D00] transition"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-1">
                  Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A brief note about this station..."
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#FF3D00] transition resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#262626]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-[#888888] hover:text-white hover:bg-[#1A1A1A] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#FF3D00] hover:bg-white text-black shadow-md shadow-[#FF3D00]/20 transition active:scale-95 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{stationToEdit ? 'Save Changes' : 'Add Station Link'}</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'batch' && (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-[#888888] mb-2">
                  Paste your Malayalam radio stream URLs (one URL per line, M3U playlist content, or JSON array of stations).
                </p>
                <textarea
                  rows={8}
                  value={batchText}
                  onChange={(e) => setBatchText(e.target.value)}
                  placeholder={`# Example M3U or plain URLs:
https://playerservices.streamtheworld.com/api/livestream-redirect/CLUBFMUAEAAC.aac
https://stream.zeno.fm/s3d1k8q9u7zuv

# Or JSON format:
[
  { "name": "My Kerala Radio", "streamUrl": "https://...", "frequency": "104.2 FM" }
]`}
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-3.5 text-xs text-white font-mono focus:outline-none focus:border-[#FF3D00] transition"
                />
              </div>

              {importStatus && (
                <div className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                  importStatus.includes('Successfully')
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : 'bg-[#FF3D00]/15 text-[#FF3D00] border border-[#FF3D00]/30'
                }`}>
                  <Sparkles className="w-4 h-4" />
                  <span>{importStatus}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-[#888888] hover:text-white hover:bg-[#1A1A1A] transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleBatchImport}
                  disabled={!batchText.trim()}
                  className="px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#FF3D00] hover:bg-white text-black transition disabled:opacity-40 flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Import Stream Links</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-[#0A0A0A] border border-[#262626] space-y-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Download className="w-4 h-4 text-[#FF3D00]" />
                  <span>Download Radio Stations List</span>
                </h4>
                <p className="text-xs text-[#888888]">
                  Export all your curated and custom Malayalam radio station stream links to a file so you can restore them on any device.
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => handleDownloadBackup('json')}
                    className="px-4 py-2 rounded-lg bg-[#141414] hover:bg-[#202020] text-xs font-bold uppercase tracking-wider text-white border border-[#333333] transition flex items-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5 text-[#FF3D00]" />
                    <span>Download JSON Backup</span>
                  </button>
                  <button
                    onClick={() => handleDownloadBackup('m3u')}
                    className="px-4 py-2 rounded-lg bg-[#141414] hover:bg-[#202020] text-xs font-bold uppercase tracking-wider text-white border border-[#333333] transition flex items-center gap-2"
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Download M3U Playlist</span>
                  </button>
                </div>
              </div>

              {/* Reset to Factory Defaults */}
              <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/30 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-400">Reset Custom Links</h4>
                <p className="text-xs text-[#888888]">
                  Clear custom added radio stations and restore standard Kerala preset stations.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Reset custom stations to default presets?')) {
                      resetToDefaultStations();
                      onClose();
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-red-900/40 hover:bg-red-900/60 text-red-300 text-xs font-bold uppercase tracking-wider border border-red-800/50 transition"
                >
                  Reset to Default Presets
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
