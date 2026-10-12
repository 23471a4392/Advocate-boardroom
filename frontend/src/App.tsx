import { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { TensionMeter } from './components/TensionMeter';
import { BoardroomTable } from './components/BoardroomTable';
import { HearingFeed } from './components/HearingFeed';
import { HotSeatConsole } from './components/HotSeatConsole';
import { ProposalDrawer } from './components/ProposalDrawer';
import { PreMortemModal } from './components/PreMortemModal';
import { INITIAL_PERSONAS, PRESET_PROPOSALS } from './data/defaultData';
import type { HearingMessage, Persona, PersonaId, PreMortemReport, Proposal, SessionStatus } from './types';
import { boardApi } from './services/api';
import { soundEngine } from './utils/audio';

export function App() {
  const [proposal, setProposal] = useState<Proposal>(PRESET_PROPOSALS[0]);
  const [personas, setPersonas] = useState<Persona[]>(INITIAL_PERSONAS);
  const [messages, setMessages] = useState<HearingMessage[]>([]);
  const [round, setRound] = useState<number>(1);
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>('in_session');
  const [activeSpeakerId, setActiveSpeakerId] = useState<PersonaId | 'user' | null>(null);
  const [selectedTargetId, setSelectedTargetId] = useState<PersonaId | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [preMortemReport, setPreMortemReport] = useState<PreMortemReport | null>(null);
  const [isPreMortemOpen, setIsPreMortemOpen] = useState<boolean>(false);
  const [isProposalDrawerOpen, setIsProposalDrawerOpen] = useState<boolean>(false);

  // Compute live room tension from persona skepticism scores
  const roomTension = Math.round(
    personas.reduce((acc, p) => acc + p.skepticismScore, 0) / personas.length
  );

  // Start / restart hearing session
  const startHearingSession = useCallback(async (activeProposal: Proposal) => {
    setIsLoading(true);
    setSessionStatus('in_session');
    setRound(1);
    setMessages([]);
    setPersonas(INITIAL_PERSONAS);
    setActiveSpeakerId(null);
    setSelectedTargetId(null);

    soundEngine.playGavel();

    // Initialize session in API / mock engine
    await boardApi.initSession(activeProposal, INITIAL_PERSONAS);

    // Fetch Round 1 Opening Salvos
    const round1Messages = await boardApi.getRound1Critiques();

    // Playback messages sequentially with speaking animations & sound pings
    for (let i = 0; i < round1Messages.length; i++) {
      const msg = round1Messages[i];
      setActiveSpeakerId(msg.speakerId as PersonaId);
      soundEngine.playSpeechPing(400 + i * 80);

      // Add message to feed
      setMessages(prev => [...prev, msg]);

      // Small delay between speakers
      await new Promise(r => setTimeout(r, 900));
    }

    setActiveSpeakerId(null);
    setIsLoading(false);
    setSessionStatus('defending');

    // Pre-generate pre-mortem report
    const report = await boardApi.generatePreMortem();
    setPreMortemReport(report);
  }, []);

  // Initial load
  useEffect(() => {
    startHearingSession(proposal);
  }, [proposal, startHearingSession]);

  // Advance to Round 2 (Crossfire between personas)
  const handleTriggerRound2 = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setRound(2);
    soundEngine.playTensionAlert();

    const crossfireMessages = await boardApi.getRound2Crossfire();

    for (let i = 0; i < crossfireMessages.length; i++) {
      const msg = crossfireMessages[i];
      setActiveSpeakerId(msg.speakerId as PersonaId);
      soundEngine.playSpeechPing(350 + i * 60);

      setMessages(prev => [...prev, msg]);
      await new Promise(r => setTimeout(r, 850));
    }

    setActiveSpeakerId(null);
    setIsLoading(false);

    // Refresh pre-mortem report
    const report = await boardApi.generatePreMortem();
    setPreMortemReport(report);
  };

  // Submit user counter-argument in the Hot Seat
  const handleSubmitDefense = async (defenseText: string, targetId?: PersonaId) => {
    setIsLoading(true);
    setSessionStatus('defending');

    // 1. Add user message to feed
    const userMsg: HearingMessage = {
      id: `usr-${Date.now()}`,
      speakerId: 'user',
      speakerName: 'You (The Hot Seat)',
      speakerRole: 'Proposal Author',
      content: defenseText,
      targetId: targetId,
      round: round,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      critiqueType: 'defense'
    };
    setMessages(prev => [...prev, userMsg]);

    // 2. Call API to evaluate defense
    const result = await boardApi.submitDefense(defenseText, targetId);

    // 3. Highlight targeted speaker and append rebuttal
    setActiveSpeakerId(result.rebuttalMessage.speakerId as PersonaId);
    soundEngine.playSpeechPing(480);
    setPersonas(result.updatedPersonas);
    setMessages(prev => [...prev, result.rebuttalMessage]);

    // Refresh pre-mortem report with new scores
    const updatedReport = await boardApi.generatePreMortem();
    setPreMortemReport(updatedReport);

    setTimeout(() => {
      setActiveSpeakerId(null);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col antialiased">
      {/* Top Navbar */}
      <Navbar
        proposal={proposal}
        sessionStatus={sessionStatus}
        onOpenProposalModal={() => setIsProposalDrawerOpen(true)}
        onOpenPreMortem={() => setIsPreMortemOpen(true)}
        onResetSession={() => startHearingSession(proposal)}
        hasReport={!!preMortemReport}
      />

      {/* Main War Room Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
        {/* Tension Meter Banner */}
        <TensionMeter
          tension={roomTension}
          round={round}
          sessionStatus={sessionStatus}
        />

        {/* Boardroom Seating Layout (Visual Centerpiece) */}
        <BoardroomTable
          personas={personas}
          activeSpeakerId={activeSpeakerId}
          selectedTargetId={selectedTargetId}
          onSelectTarget={(id) => setSelectedTargetId(prev => (prev === id ? null : id))}
          proposalTitle={proposal.title}
        />

        {/* Lower War Room: Live Feed & Hot Seat Defense */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Live Hearing Transcript (7 cols on desktop) */}
          <div className="lg:col-span-7">
            <HearingFeed
              messages={messages}
              isLoading={isLoading}
              onNextRound={handleTriggerRound2}
              canAdvanceRound={round === 1 && !isLoading}
              round={round}
            />
          </div>

          {/* Interactive Defense Dock & Summary (5 cols on desktop) */}
          <div className="lg:col-span-5 space-y-4">
            <HotSeatConsole
              personas={personas}
              selectedTargetId={selectedTargetId}
              onSelectTarget={setSelectedTargetId}
              onSubmitDefense={handleSubmitDefense}
              isSubmitting={isLoading}
            />

            {/* Quick Proposal Intel Card */}
            <div className="bg-[#0f121d] border border-slate-800 rounded-xl p-4 shadow-lg text-xs space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
                  Proposal Assumptions Under Fire
                </span>
                <span className="text-[10px] text-rose-400 font-mono">
                  {proposal.keyAssumptions.length} Hypotheses
                </span>
              </div>
              <ul className="space-y-1.5 text-slate-400">
                {proposal.keyAssumptions.map((hyp, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{hyp}</span>
                  </li>
                ))}
              </ul>
              {proposal.budgetOrRunway && (
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Declared Runway / Budget:</span>
                  <span className="font-mono text-slate-200 font-semibold">{proposal.budgetOrRunway}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#07080c] py-4 text-center text-xs text-slate-600">
        <p>ContraBoard &bull; Adversarial AI Decision Studio &bull; Ready for Backend Integration</p>
      </footer>

      {/* Modals & Drawers */}
      <ProposalDrawer
        isOpen={isProposalDrawerOpen}
        onClose={() => setIsProposalDrawerOpen(false)}
        currentProposal={proposal}
        onSelectProposal={(newProposal) => {
          setProposal(newProposal);
          startHearingSession(newProposal);
        }}
      />

      <PreMortemModal
        isOpen={isPreMortemOpen}
        onClose={() => setIsPreMortemOpen(false)}
        report={preMortemReport}
      />
    </div>
  );
}

export default App;
