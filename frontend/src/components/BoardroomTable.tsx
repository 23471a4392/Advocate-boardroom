import React from 'react';
import type { Persona, PersonaId } from '../types';
import { Shield, TrendingDown, Server, UserCheck, MessageSquare } from 'lucide-react';

interface BoardroomTableProps {
  personas: Persona[];
  activeSpeakerId: PersonaId | 'user' | null;
  selectedTargetId: PersonaId | null;
  onSelectTarget: (id: PersonaId) => void;
  proposalTitle: string;
}

export const BoardroomTable: React.FC<BoardroomTableProps> = ({
  personas,
  activeSpeakerId,
  selectedTargetId,
  onSelectTarget,
  proposalTitle
}) => {
  const getPersonaIcon = (id: PersonaId) => {
    switch (id) {
      case 'sre':
        return <Server className="w-3.5 h-3.5" />;
      case 'cfo':
        return <TrendingDown className="w-3.5 h-3.5" />;
      case 'cso':
        return <Shield className="w-3.5 h-3.5" />;
      case 'ux':
        return <UserCheck className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="relative w-full py-4">
      {/* Background glow behind boardroom */}
      <div className="absolute inset-0 bg-radial from-rose-950/20 via-transparent to-transparent blur-2xl pointer-events-none" />

      {/* Grid of Board Members */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-4">
        {personas.map((persona) => {
          const isSpeaking = activeSpeakerId === persona.id;
          const isTargeted = selectedTargetId === persona.id;
          const score = persona.skepticismScore;

          // Color tier for skepticism
          const scoreColor =
            score >= 80
              ? 'text-rose-400 bg-rose-950/60 border-rose-800'
              : score >= 60
              ? 'text-amber-400 bg-amber-950/60 border-amber-800'
              : 'text-emerald-400 bg-emerald-950/60 border-emerald-800';

          return (
            <div
              key={persona.id}
              onClick={() => onSelectTarget(persona.id)}
              className={`relative group rounded-xl p-3.5 transition-all duration-300 cursor-pointer border ${
                isSpeaking
                  ? 'bg-slate-900/90 ring-2 ring-rose-500 shadow-lg shadow-rose-950/50 scale-[1.02]'
                  : isTargeted
                  ? 'bg-slate-900/90 border-slate-600 ring-2 ring-slate-400 shadow-md'
                  : 'bg-[#10131e]/80 hover:bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Active Speaking Indicator Banner */}
              {isSpeaking && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-md shadow-rose-950">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  Speaking Now
                </div>
              )}

              {/* Persona Header: Avatar & Details */}
              <div className="flex items-start gap-3 mb-2.5">
                <div className="relative shrink-0">
                  <img
                    src={persona.avatar}
                    alt={persona.name}
                    className={`w-12 h-12 rounded-xl object-cover border-2 transition-all ${
                      isSpeaking ? 'border-rose-400 shadow-md shadow-rose-500/40' : 'border-slate-700'
                    }`}
                  />
                  {/* Real-time Voice Wave Animation when speaking */}
                  {isSpeaking && (
                    <div className="absolute -bottom-1.5 -right-1 flex items-end gap-0.5 bg-slate-950 px-1.5 py-0.5 rounded-full border border-rose-500">
                      <span className="w-1 bg-rose-400 rounded animate-audio-1" />
                      <span className="w-1 bg-rose-400 rounded animate-audio-2" />
                      <span className="w-1 bg-rose-400 rounded animate-audio-3" />
                      <span className="w-1 bg-rose-400 rounded animate-audio-4" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-semibold text-xs sm:text-sm text-white truncate">
                      {persona.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400 mt-0.5 truncate">
                    <span style={{ color: persona.accentColor }}>{getPersonaIcon(persona.id)}</span>
                    <span className="truncate">{persona.role}</span>
                  </div>
                </div>
              </div>

              {/* Skepticism Meter */}
              <div className="space-y-1 mt-2 pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-medium">Skepticism</span>
                  <span className={`font-mono font-bold px-1.5 py-0.2 rounded text-[10px] border ${scoreColor}`}>
                    {Math.round(score)}% Skeptical
                  </span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      score >= 80 ? 'bg-rose-500' : score >= 60 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>

              {/* Persona Bio / Quote snippet */}
              <p className="mt-2.5 text-[11px] text-slate-400 italic line-clamp-2 leading-relaxed bg-slate-950/40 p-1.5 rounded-lg border border-slate-900">
                "{persona.signatureCatchphrase}"
              </p>

              {/* Hot Seat Direct Target Button */}
              <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                <span className="text-[10px] text-slate-500">
                  {isTargeted ? 'Targeted in Defense' : 'Click to interrogate'}
                </span>
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded transition-colors ${
                    isTargeted
                      ? 'bg-slate-200 text-slate-950 font-semibold'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  <MessageSquare className="w-2.5 h-2.5 inline mr-1" />
                  {isTargeted ? 'Targeted' : 'Address'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* The Central Conference Table / Floor Hub */}
      <div className="relative bg-gradient-to-b from-[#131726] to-[#0c0e18] border border-slate-800 rounded-2xl p-4 shadow-2xl overflow-hidden">
        {/* Subtle decorative radial grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e243b_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center justify-center shrink-0 shadow-inner">
              <span className="text-rose-500 font-bold text-sm tracking-wider">HOT</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-rose-400 tracking-wider uppercase">
                  Subject On The Floor
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                  Executive RFC
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-semibold text-white tracking-tight mt-0.5">
                {proposalTitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 text-xs">
            <span className="text-slate-400">Targeting for next counter-argument:</span>
            <span className="font-semibold px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 border border-slate-700">
              {selectedTargetId
                ? personas.find(p => p.id === selectedTargetId)?.name
                : 'Full Board (General Defense)'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
