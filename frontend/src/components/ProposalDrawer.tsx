import React, { useState } from 'react';
import type { Proposal } from '../types';
import { PRESET_PROPOSALS } from '../data/defaultData';
import { X, Sparkles, BookOpen, ArrowRight } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface ProposalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentProposal: Proposal;
  onSelectProposal: (proposal: Proposal) => void;
}

export const ProposalDrawer: React.FC<ProposalDrawerProps> = ({
  isOpen,
  onClose,
  currentProposal,
  onSelectProposal
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
  const [customTitle, setCustomTitle] = useState(currentProposal.title);
  const [customSummary, setCustomSummary] = useState(currentProposal.summary);
  const [customCategory, setCustomCategory] = useState(currentProposal.category);

  if (!isOpen) return null;

  const handleApplyPreset = (preset: Proposal) => {
    soundEngine.playGavel();
    onSelectProposal(preset);
    onClose();
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim() || !customSummary.trim()) return;

    const newProposal: Proposal = {
      id: `custom-${Date.now()}`,
      title: customTitle,
      summary: customSummary,
      category: customCategory,
      keyAssumptions: ['Assumes user behavior remains constant', 'Assumes operational stability']
    };

    soundEngine.playGavel();
    onSelectProposal(newProposal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#10131f] border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-[#141829]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base">Select or Author RFC Proposal</h2>
              <p className="text-xs text-slate-400">Choose a high-stakes scenario to stress-test</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800 bg-[#0d0f1a] px-4 pt-2 gap-2">
          <button
            onClick={() => setActiveTab('presets')}
            className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'presets'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Curated High-Risk Presets
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'custom'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Custom Pitch / RFC
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'presets' ? (
            <div className="space-y-3">
              {PRESET_PROPOSALS.map((preset: Proposal) => {
                const isSelected = preset.id === currentProposal.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => handleApplyPreset(preset)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-rose-950/20 border-rose-500/60 ring-1 ring-rose-500/40'
                        : 'bg-[#131625] hover:bg-[#181c30] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                        {preset.category}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] font-semibold text-rose-400">Current Hot Seat</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm text-white mb-1.5">{preset.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{preset.summary}</p>
                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Timeline: {preset.timeline}</span>
                      <span className="text-rose-400 font-medium flex items-center gap-1">
                        Load Proposal <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <form onSubmit={handleApplyCustom} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Proposal Title / Headline
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g. Migrating to Supabase from MongoDB"
                  className="w-full bg-[#0d0f19] border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value as Proposal['category'])}
                  className="w-full bg-[#0d0f19] border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                >
                  <option value="Infrastructure & Tech">Infrastructure & Tech</option>
                  <option value="Pricing & Monetization">Pricing & Monetization</option>
                  <option value="AI & Automation">AI & Automation</option>
                  <option value="Go-To-Market">Go-To-Market</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Executive Summary & Core Thesis
                </label>
                <textarea
                  rows={5}
                  value={customSummary}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCustomSummary(e.target.value)}
                  placeholder="Describe what you are building, the architectural changes, and why you believe it will succeed..."
                  className="w-full bg-[#0d0f19] border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-rose-500 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 font-semibold text-xs text-white transition-colors shadow-lg shadow-rose-950"
              >
                Commence Adversarial Hearing
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
