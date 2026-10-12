import React from 'react';
import { Flame, AlertTriangle, ShieldCheck } from 'lucide-react';

interface TensionMeterProps {
  tension: number; // 0 to 100
  round: number;
  sessionStatus: string;
}

export const TensionMeter: React.FC<TensionMeterProps> = ({ tension, round, sessionStatus }) => {
  // Determine tension tier
  const isHostile = tension >= 75;
  const isModerate = tension >= 45 && tension < 75;

  const statusLabel = isHostile
    ? 'CRITICAL HOSTILITY — The Board is unconvinced'
    : isModerate
    ? 'ELEVATED TENSION — Vigorous cross-examination underway'
    : 'CAUTIOUS DEFENSE — Skepticism is declining';

  return (
    <div className="bg-[#10131d] border border-slate-800/80 rounded-xl p-3.5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-2.5">
        <div className="flex items-center gap-2">
          <div
            className={`p-1.5 rounded-md ${
              isHostile
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : isModerate
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}
          >
            {isHostile ? (
              <Flame className="w-4 h-4 animate-bounce" />
            ) : isModerate ? (
              <AlertTriangle className="w-4 h-4" />
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Boardroom Tension
              </span>
              <span
                className={`text-xs font-mono font-bold px-1.5 py-0.2 rounded ${
                  isHostile
                    ? 'bg-rose-950 text-rose-400 border border-rose-800'
                    : isModerate
                    ? 'bg-amber-950 text-amber-400 border border-amber-800'
                    : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                }`}
              >
                {Math.round(tension)}%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">{statusLabel}</p>
          </div>
        </div>

        {/* Round & Hearing Badge */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-[11px] font-semibold text-slate-300">
            {round === 1 ? 'Round 1: Opening Salvos' : round === 2 ? 'Round 2: Crossfire' : 'Hot Seat Defense'}
          </span>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
            <span
              className={`w-2 h-2 rounded-full ${
                sessionStatus === 'in_session'
                  ? 'bg-amber-400 animate-ping'
                  : sessionStatus === 'defending'
                  ? 'bg-emerald-400 animate-pulse'
                  : 'bg-slate-500'
              }`}
            />
            <span className="capitalize">{sessionStatus.replace('_', ' ')}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-800">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${
            isHostile
              ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-rose-600 shadow-sm shadow-rose-500/50'
              : isModerate
              ? 'bg-gradient-to-r from-emerald-500 via-amber-500 to-amber-600'
              : 'bg-gradient-to-r from-emerald-400 to-emerald-600'
          }`}
          style={{ width: `${Math.min(100, Math.max(8, tension))}%` }}
        />
      </div>
    </div>
  );
};
