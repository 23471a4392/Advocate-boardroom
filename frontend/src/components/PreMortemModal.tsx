import React, { useState } from 'react';
import type { PreMortemReport } from '../types';
import { X, Check, Copy, Printer, ShieldAlert, AlertTriangle, ArrowUpRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PreMortemModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: PreMortemReport | null;
}

export const PreMortemModal: React.FC<PreMortemModalProps> = ({ isOpen, onClose, report }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !report) return null;

  // Trigger celebration confetti if survival score is good
  const handleConfetti = () => {
    if (report.survivalScore >= 60) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  const handleCopyMarkdown = () => {
    const md = `
# 📑 Executive Pre-Mortem Report: ${report.proposalTitle}
**Generated Date:** ${report.generatedAt}
**Survival Probability Index:** ${report.survivalScore}%

---

### 🏛️ Executive Verdict
> ${report.executiveVerdict}

---

### ⚠️ Top Fatal Flaws Identified
${report.fatalFlaws
  .map(
    (f, idx) => `
#### ${idx + 1}. [${f.severity}] ${f.title} (${f.domain})
- **Explanation:** ${f.explanation}
- **Failure Mode:** ${f.failureScenario}
`
  )
  .join('')}

---

### 🛡️ Recommended Defensive Pivots
${report.recommendedPivots
  .map(
    (p, idx) => `
#### ${idx + 1}. [${p.priority}] ${p.title}
- **Action Plan:** ${p.action}
- **Expected Impact:** ${p.expectedRiskReduction}
`
  )
  .join('')}

---
*Report synthesized by ContraBoard Adversarial AI Studio.*
    `.trim();

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0f111c] border border-slate-800 rounded-2xl w-full max-w-3xl my-auto shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#131726] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-950">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-white text-base">Executive Pre-Mortem Report</h2>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800">
                  Classified Brief
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-md">{report.proposalTitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied MD' : 'Copy Markdown'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title="Print to PDF"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Report Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Top Scorecard & Verdict */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Survival Meter */}
            <div
              onClick={handleConfetti}
              className="bg-[#141829] border border-slate-800 p-4 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer group"
            >
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Survival Probability Index
              </span>
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={
                      report.survivalScore >= 65
                        ? 'text-emerald-500'
                        : report.survivalScore >= 45
                        ? 'text-amber-500'
                        : 'text-rose-500'
                    }
                    strokeDasharray={`${report.survivalScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-white font-mono">{report.survivalScore}%</span>
                </div>
              </div>
              <span className="text-[10px] text-slate-500 mt-2">
                {report.survivalScore < 50 ? 'Critical Vulnerability' : 'Defensible Proposal'}
              </span>
            </div>

            {/* Verdict Box */}
            <div className="md:col-span-2 bg-[#141829] border border-slate-800 p-4 rounded-xl flex flex-col justify-center">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Boardroom Executive Verdict
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {report.executiveVerdict}
              </p>
              <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Evaluated across 4 Adversarial Domains</span>
                <span>Session: {report.sessionId}</span>
              </div>
            </div>
          </div>

          {/* 4-Axis Risk Matrix */}
          <div className="bg-[#121524] border border-slate-800 rounded-xl p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              4-Axis Adversarial Risk Matrix
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Technical & SRE', value: report.riskMatrix.technical, color: 'text-cyan-400 bg-cyan-500' },
                { label: 'Unit Economics', value: report.riskMatrix.financial, color: 'text-emerald-400 bg-emerald-500' },
                { label: 'Security & Legal', value: report.riskMatrix.security, color: 'text-purple-400 bg-purple-500' },
                { label: 'Product & UX', value: report.riskMatrix.market, color: 'text-amber-400 bg-amber-500' }
              ].map((domain, i) => (
                <div key={i} className="bg-[#0b0d16] p-3 rounded-lg border border-slate-800/80">
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span className="text-slate-400">{domain.label}</span>
                    <span className="font-mono font-bold text-white">{domain.value}%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                    <div className={`h-full ${domain.color}`} style={{ width: `${domain.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top 3 Fatal Flaws */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-3 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" /> Top Fatal Failure Modes (Pre-Mortem Blindspots)
            </h3>
            <div className="space-y-3">
              {report.fatalFlaws.map((flaw, idx) => (
                <div key={flaw.id} className="bg-[#121626] border border-rose-950/60 rounded-xl p-3.5">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-rose-950 text-rose-400 border border-rose-800 font-mono text-[10px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h4 className="font-semibold text-xs sm:text-sm text-white">{flaw.title}</h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-900">
                      {flaw.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mb-2 leading-relaxed">{flaw.explanation}</p>
                  <div className="bg-[#0b0e18] p-2 rounded-lg border border-slate-800/80 text-[11px] text-slate-400">
                    <span className="text-rose-400 font-medium mr-1">Failure Scenario:</span>
                    {flaw.failureScenario}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Defensive Pivots */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-1.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> Recommended Defensive Action Plan
            </h3>
            <div className="space-y-3">
              {report.recommendedPivots.map((pivot, idx) => (
                <div key={idx} className="bg-[#121626] border border-emerald-950/60 rounded-xl p-3.5">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="font-semibold text-xs sm:text-sm text-white">{pivot.title}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-900">
                      {pivot.expectedRiskReduction}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{pivot.action}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
