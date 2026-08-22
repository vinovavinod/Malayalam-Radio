import React, { useState } from 'react';
import { 
  Mail, 
  X, 
  Copy, 
  Check, 
  Send, 
  Radio, 
  AlertCircle, 
  Info, 
  MessageSquare,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [subjectType, setSubjectType] = useState<'stream_issue' | 'air_update' | 'new_station' | 'feedback'>('air_update');
  const [stationName, setStationName] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const contactEmail = 'puthenpura9997@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contactEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getSubjectText = () => {
    switch (subjectType) {
      case 'air_update':
        return `[Kerala Radio] AIR Streaming Link Update: ${stationName || 'Akashvani Stream'}`;
      case 'stream_issue':
        return `[Kerala Radio] Broken Stream Report: ${stationName || 'Station'}`;
      case 'new_station':
        return `[Kerala Radio] New Malayalam Station Request: ${stationName || 'New FM'}`;
      case 'feedback':
      default:
        return `[Kerala Radio] App Feedback & Suggestions`;
    }
  };

  const handleSendMail = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(getSubjectText());
    const body = encodeURIComponent(
      `Hello,\n\n${userMessage || 'I would like to get in touch regarding Kerala Radio.'}\n\nStation: ${stationName || 'N/A'}\nType: ${subjectType}\n\nBest regards.`
    );
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-[#17120C] border border-amber-500/40 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-500/25 bg-[#1F1810]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Mail className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#FAF7F0] flex items-center gap-2">
                <span>Contact Us</span>
                <span className="text-xs font-malayalam text-amber-300/80 font-normal">ബന്ധപ്പെടുക</span>
              </h2>
              <p className="text-xs text-amber-200/60 font-medium">
                Feedback, Stream link updates & Station requests
              </p>
            </div>
          </div>

          <button
            id="close-contact-modal-btn"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-[#2A2016] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-neutral-200 text-xs sm:text-sm">
          
          {/* Email Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#241A10] to-[#1F160E] border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300/80 flex items-center gap-1.5 mb-1">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>Official Contact Email</span>
              </div>
              <a 
                href={`mailto:${contactEmail}`}
                className="text-base font-bold text-amber-300 hover:text-amber-100 hover:underline font-mono select-all transition"
              >
                {contactEmail}
              </a>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="copy-contact-email-btn"
                type="button"
                onClick={handleCopyEmail}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border ${
                  copied 
                    ? 'bg-emerald-600 text-white border-emerald-500' 
                    : 'bg-[#2F2316] text-amber-200 hover:text-white border-amber-500/30 hover:border-amber-400'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Email</span>
                  </>
                )}
              </button>

              <a
                href={`mailto:${contactEmail}?subject=${encodeURIComponent('[Kerala Radio] Feedback / Inquiries')}`}
                className="px-3.5 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-400 to-yellow-500 text-black hover:from-amber-300 hover:to-yellow-400 border border-amber-300 shadow-sm flex items-center gap-1.5 transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Compose</span>
              </a>
            </div>
          </div>

          {/* Important Streaming Notice for AIR Stations */}
          <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 space-y-2">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-200 uppercase tracking-wide">
                  Information regarding AIR (Akashvani) Streaming Links
                </h4>
                <p className="text-xs text-amber-100/80 mt-1 leading-relaxed">
                  Some All India Radio (AIR / ആകാശവാണി) stations might occasionally be unavailable because Prasar Bharati periodically updates its CDN streaming URLs, access keys, or IP endpoints.
                </p>
                <p className="text-xs text-amber-200/70 mt-1.5 leading-relaxed font-malayalam">
                  ആകാശവാണി സ്ട്രീമിംഗ് ലിങ്കുകൾ ഇടയ്ക്കിടെ മാറുന്നതിനാൽ ചില സ്റ്റേഷനുകൾ താൽക്കാലികമായി ലഭിച്ചേക്കില്ല. പുതിയ വർക്കിംഗ് ലിങ്കുകൾ ലഭിക്കുകയാണെങ്കിൽ താഴെയുള്ള ഫോം വഴിയോ ഇമെയിൽ വഴിയോ ഞങ്ങളെ അറിയിക്കുക.
                </p>
              </div>
            </div>
          </div>

          {/* Send Quick Note Form */}
          <form onSubmit={handleSendMail} className="space-y-3.5 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-200/90 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                <span>Send Quick Note / Report</span>
              </label>
              <span className="text-[11px] text-neutral-400">Directly opens in your email</span>
            </div>

            {/* Subject Selector Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {[
                { id: 'air_update', label: 'AIR Stream Link', icon: 'Tower' },
                { id: 'stream_issue', label: 'Broken Stream', icon: 'Alert' },
                { id: 'new_station', label: 'New Station', icon: 'Plus' },
                { id: 'feedback', label: 'App Feedback', icon: 'Star' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSubjectType(opt.id as any)}
                  className={`px-2.5 py-2 rounded-lg text-xs font-medium border text-center transition ${
                    subjectType === opt.id
                      ? 'bg-amber-500/25 text-amber-200 border-amber-400 font-bold shadow-sm'
                      : 'bg-[#1C150E] text-neutral-400 border-amber-500/20 hover:text-neutral-200 hover:border-amber-500/40'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Station Name (optional) */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                Station Name or Frequency (Optional)
              </label>
              <input
                type="text"
                value={stationName}
                onChange={(e) => setStationName(e.target.value)}
                placeholder="e.g. Akashvani Kozhikode / 103.6 FM / New Community Radio"
                className="w-full bg-[#1A130C] border border-amber-500/30 focus:border-amber-400 rounded-lg px-3.5 py-2 text-xs text-[#FAF7F0] placeholder:text-neutral-500 focus:outline-none transition"
              />
            </div>

            {/* Message Box */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                Your Message / Working Stream URL
              </label>
              <textarea
                rows={3}
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Provide details, working stream link (HLS/m3u8/mp3), or feedback..."
                className="w-full bg-[#1A130C] border border-amber-500/30 focus:border-amber-400 rounded-lg px-3.5 py-2 text-xs text-[#FAF7F0] placeholder:text-neutral-500 focus:outline-none transition resize-none"
              />
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-amber-200/60 font-mono">
                To: {contactEmail}
              </span>

              <button
                id="submit-contact-email-btn"
                type="submit"
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-black hover:from-amber-300 hover:to-yellow-400 border border-amber-300 shadow-md shadow-amber-500/20 flex items-center gap-2 transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send via Email Client</span>
              </button>
            </div>

            {submitted && (
              <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs text-center animate-in fade-in">
                ✓ Email composer triggered. Thank you for helping keep Kerala Radio updated!
              </div>
            )}
          </form>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-amber-500/20 bg-[#1A130D] flex items-center justify-between text-[11px] text-amber-200/60">
          <span>Kerala Radio Web App</span>
          <button
            onClick={onClose}
            className="text-amber-300 hover:text-white font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
