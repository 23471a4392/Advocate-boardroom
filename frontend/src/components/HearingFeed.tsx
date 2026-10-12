import React, { useEffect, useRef } from 'react';
import type { HearingMessage } from '../types';
import { Swords, User, CornerDownRight, Quote } from 'lucide-react';

interface HearingFeedProps {
  messages: HearingMessage[];
  isLoading: boolean;
  onNextRound: () => void;
  canAdvanceRound: boolean;
  round: number;
}

export const HearingFeed: React.FC<HearingFeedProps> = ({
  messages,
  isLoading,
  onNextRound,
  canAdvanceRound,
  round
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const getPersonaColor = (id: HearingMessage['speakerId']) => {
    switch (id) {
      case 'sre':
        return 'text-cyan-400 border-cyan-500/30 bg-cyan-950/20';
      case 'cfo':
        return 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20';
      case 'cso':
        return 'text-purple-400 border-purple-500/30 bg-purple-950/20';
      case 'ux':
        return 'text-amber-400 border-amber-500/30 bg-amber-950/20';
      case 'user':
        return 'text-rose-400 border-rose-500/40 bg-rose-950/20';
      default:
        return 'text-slate-300 border-slate-700 bg-slate-900';
    }
  };

  return (
    <div className="bg-[#0f111c] border border-slate-800 rounded-xl flex flex-col h-[520px] shadow-xl overflow-hidden">
      {/* Transcript Header */}
      <div className="px-4 py-3 border-b border-slate-800 bg-[#131624] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Quote className="w-4 h-4 text-slate-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Live Hearing Transcript
          </h3>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            {messages.length} exchanges
          </span>
        </div>

        {canAdvanceRound && (
          <button
            onClick={onNextRound}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-colors disabled:opacity-50 shadow-md shadow-rose-950"
          >
            <Swords className="w-3.5 h-3.5" />
            <span>
              {round === 1 ? 'Trigger Round 2: Crossfire' : 'Trigger Cross-Examination'}
            </span>
          </button>
        )}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600">
              <Swords className="w-6 h-6 text-slate-500" />
            </div>
            <div>
              <p className="font-semibold text-slate-300 text-sm">Boardroom is in session</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                The panel of critics is reviewing the proposal. Listen to their opening cross-examination below.
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isUser = msg.speakerId === 'user';
            const isCrossfire = msg.critiqueType === 'crossfire';

            return (
              <div
                key={msg.id || index}
                className={`flex flex-col gap-1.5 ${isUser ? 'items-end' : 'items-start'}`}
              >
                {/* Speaker meta chip */}
                <div className="flex items-center gap-2 text-[11px]">
                  <span
                    className={`font-semibold px-2 py-0.5 rounded border ${getPersonaColor(
                      msg.speakerId
                    )}`}
                  >
                    {isUser ? <User className="w-3 h-3 inline mr-1" /> : null}
                    {msg.speakerName}
                  </span>

                  {/* Crossfire arrow if one member is attacking another */}
                  {isCrossfire && msg.targetName && (
                    <span className="flex items-center gap-1 text-slate-400 font-mono text-[10px]">
                      <CornerDownRight className="w-3 h-3 text-rose-400" />
                      <span>sparring with</span>
                      <span className="text-rose-300 font-semibold">{msg.targetName}</span>
                    </span>
                  )}

                  <span className="text-[10px] text-slate-400 font-mono">{msg.timestamp}</span>

                  {msg.skepticismDelta !== undefined && (
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                        msg.skepticismDelta > 0
                          ? 'bg-rose-950 text-rose-400 border border-rose-900'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-900'
                      }`}
                    >
                      {msg.skepticismDelta > 0 ? `+${msg.skepticismDelta}% Skeptical` : `${msg.skepticismDelta}% Skeptical`}
                    </span>
                  )}
                </div>

                {/* Speech Bubble */}
                <div
                  className={`max-w-[92%] sm:max-w-[80%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-rose-950/30 text-rose-100 border border-rose-800/60 rounded-tr-none'
                      : isCrossfire
                      ? 'bg-slate-900/90 text-slate-200 border border-rose-900/40 rounded-tl-none shadow-md'
                      : 'bg-[#151928] text-slate-200 border border-slate-800 rounded-tl-none shadow-md'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            );
          })
        )}

        {/* Live typing indicator */}
        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 pl-2 py-1">
            <span className="flex gap-1 items-center">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse delay-75" />
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse delay-150" />
            </span>
            <span className="italic">Board member is delivering interrogation...</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
};
