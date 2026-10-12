import React, { useState } from 'react';
import { Volume2, VolumeX, ShieldAlert, FileText, RefreshCw, SlidersHorizontal } from 'lucide-react';
import type { Proposal, SessionStatus } from '../types';
import { soundEngine } from '../utils/audio';

interface NavbarProps {
  proposal: Proposal;
  sessionStatus: SessionStatus;
  onOpenProposalModal: () => void;
  onOpenPreMortem: () => void;
  onResetSession: () => void;
  hasReport: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  proposal,
  sessionStatus,
  onOpenProposalModal,
  onOpenPreMortem,
  onResetSession,
  hasReport
}) => {
  const [muted, setMuted] = useState(soundEngine.isMuted);

  const toggleSound = () => {
    soundEngine.isMuted = !soundEngine.isMuted;
    setMuted(soundEngine.isMuted);
    if (!soundEngine.isMuted) soundEngine.playSpeechPing(520);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#090a0f]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-rose-600 via-rose-700 to-amber-600 flex items-center justify-center shadow-lg shadow-rose-950/40 border border-rose-500/30">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                ContraBoard
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                Devil's Advocate
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Adversarial Decision Stress-Tester
            </p>
          </div>
        </div>

        {/* Current Hot Seat Proposal Title */}
        <div className="hidden md:flex items-center gap-2 max-w-md truncate px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
          <span className="text-slate-500 shrink-0 font-medium">Proposal:</span>
          <span className="truncate text-slate-200 font-medium">{proposal.title}</span>
          <span className="shrink-0 px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-slate-400 uppercase">
            {sessionStatus.replace('_', ' ')}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={muted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            {muted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Edit Proposal Drawer */}
          <button
            onClick={onOpenProposalModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Change Proposal</span>
          </button>

          {/* Reset Session */}
          <button
            onClick={onResetSession}
            title="Restart Hearing"
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* View Pre-Mortem Report Button */}
          <button
            onClick={onOpenPreMortem}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-md transition-all ${
              hasReport
                ? 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white shadow-rose-950/50 border border-rose-500/40 ring-2 ring-rose-500/20'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Pre-Mortem Report</span>
            {hasReport && (
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
