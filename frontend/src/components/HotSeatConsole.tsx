import React, { useState } from 'react';
import { Send, Mic, Sparkles, UserCheck } from 'lucide-react';
import type { Persona, PersonaId } from '../types';
import { soundEngine } from '../utils/audio';

interface HotSeatConsoleProps {
  personas: Persona[];
  selectedTargetId: PersonaId | null;
  onSelectTarget: (id: PersonaId | null) => void;
  onSubmitDefense: (defenseText: string, targetId?: PersonaId) => void;
  isSubmitting: boolean;
}

export const HotSeatConsole: React.FC<HotSeatConsoleProps> = ({
  personas,
  selectedTargetId,
  onSelectTarget,
  onSubmitDefense,
  isSubmitting
}) => {
  const [defenseText, setDefenseText] = useState('');

  const quickTactics = [
    { label: 'Canary Rollout with Auto-Rollback', text: 'We will enforce a 5% canary deployment with automated latency and error rate telemetry rollbacks before routing general traffic.' },
    { label: 'Grandfathered 60-Day Grace Period', text: 'Existing active users will receive a 60-day grandfathered tier to prevent viral backlash and maintain brand retention.' },
    { label: 'Human-in-the-loop for Mutations', text: 'All destructive database writes and financial refunds require deterministic human approval gates with immutable audit logs.' },
    { label: 'Air-Gapped Sandbox Environment', text: 'All third-party tools run inside an isolated zero-trust sandbox with scoped read-only credentials.' }
  ];

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!defenseText.trim() || isSubmitting) return;

    soundEngine.playGavel();
    onSubmitDefense(defenseText, selectedTargetId || undefined);
    setDefenseText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="bg-[#121524] border border-slate-800 rounded-xl p-4 shadow-2xl space-y-3">
      {/* Console Top Bar: Targeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
            <Mic className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-white">
            The Hot Seat Defense Console
          </span>
        </div>

        {/* Member Selector Dropdown */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5" /> Direct Rebuttal To:
          </span>
          <select
            value={selectedTargetId || 'all'}
            onChange={(e) => onSelectTarget(e.target.value === 'all' ? null : (e.target.value as PersonaId))}
            className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:ring-1 focus:ring-rose-500 focus:outline-none"
          >
            <option value="all">Full Board (General Defense)</option>
            {personas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.role.split('&')[0]})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Tactical Defense Chips */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] text-slate-400 flex items-center gap-1 mr-1">
          <Sparkles className="w-3 h-3 text-amber-400" /> Tactical Rebuttals:
        </span>
        {quickTactics.map((tactic, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setDefenseText(tactic.text)}
            className="text-[11px] px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition-colors"
          >
            {tactic.label}
          </button>
        ))}
      </div>

      {/* Input Textarea & Submit */}
      <form onSubmit={handleSubmit} className="relative">
        <textarea
          rows={3}
          value={defenseText}
          onChange={(e) => setDefenseText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Mount your defense here (e.g. explain your rollback guardrails, phased monetization, or latency mitigations)... Press Enter to submit."
          className="w-full bg-[#0a0c14] border border-slate-700/90 rounded-xl p-3 pr-24 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 resize-none transition-all"
        />

        <div className="absolute right-2.5 bottom-3.5 flex items-center gap-2">
          <button
            type="submit"
            disabled={!defenseText.trim() || isSubmitting}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 text-white disabled:text-slate-500 transition-all shadow-md shadow-rose-950/60 disabled:shadow-none"
          >
            {isSubmitting ? (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>Defend</span>
          </button>
        </div>
      </form>
    </div>
  );
};
