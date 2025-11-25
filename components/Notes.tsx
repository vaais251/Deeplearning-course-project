import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { summarizeNotes } from '../services/geminiService';

interface NotesProps {
  lessonTitle: string;
}

export const Notes: React.FC<NotesProps> = ({ lessonTitle }) => {
  const [notes, setNotes] = useState('');
  const [summary, setSummary] = useState('');
  const [loadingSummary, setLoadingSummary] = useState(false);

  const handleSummarize = async () => {
    setLoadingSummary(true);
    try {
      const result = await summarizeNotes(notes);
      setSummary(result);
    } finally {
      setLoadingSummary(false);
    }
  };

  return (
    <div className="p-4 bg-[#1a1a1a] rounded-xl border border-[#2d2d2d] h-full flex flex-col">
      <h3 className="text-lg font-bold text-white mb-4">My Personal Notes</h3>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Jot down your key takeaways from the lesson here..."
        className="w-full flex-1 bg-[#0f0f0f] border border-[#333] rounded-lg p-3 text-white focus:outline-none focus:border-rose-500 transition-colors custom-scrollbar"
        rows={10}
      />
      <button
        onClick={handleSummarize}
        disabled={!notes || loadingSummary}
        className="mt-4 w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900/50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-lg"
      >
        {loadingSummary ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            <span>Generating...</span>
          </>
        ) : (
          <>
            <Sparkles size={18} />
            <span>AI Summary</span>
          </>
        )}
      </button>
      {summary && (
        <div className="mt-4 p-4 bg-indigo-950/30 border border-indigo-500/20 rounded-lg animate-fade-in">
           <div className="flex gap-3">
                <div className="mt-1">
                    <Sparkles size={18} className="text-indigo-400" />
                </div>
                <div className="text-sm text-indigo-100 leading-relaxed">
                    <span className="font-bold text-white block mb-1">Summary:</span>
                    {summary}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
