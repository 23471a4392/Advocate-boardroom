import React from 'react';
import { 
  ShieldAlert, 
  ArrowRight, 
  QrCode, 
  Flame, 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  Play, 
  FileText,
  Volume2,
  Zap
} from 'lucide-react';
import { INITIAL_PERSONAS } from '../data/defaultData';

interface LandingPageProps {
  onOpenSignIn: () => void;
  onOpenQrUpload: () => void;
  onEnterAsGuest: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenSignIn,
  onOpenQrUpload,
  onEnterAsGuest
}) => {
  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 selection:bg-rose-500/20 selection:text-rose-200 flex flex-col font-sans">
      {/* Top Floating Glass Navigation */}
      <header className="sticky top-0 z-40 bg-[#090a0f]/85 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 via-rose-700 to-amber-600 flex items-center justify-center shadow-lg shadow-rose-950/50 border border-rose-500/30">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  ContraBoard
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30">
                  Devil's Advocate
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Adversarial AI Boardroom & Executive Pre-Mortem Studio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Workable QR Scan Action */}
            <button
              onClick={onOpenQrUpload}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-rose-500/40 text-xs font-semibold text-slate-200 hover:text-white transition-all shadow-sm"
            >
              <QrCode className="w-4 h-4 text-rose-400" />
              <span>Scan Idea QR</span>
            </button>

            {/* Sign In CTA */}
            <button
              onClick={onOpenSignIn}
              className="flex items-center gap-1.5 px-4 sm:px-5 py-1.5 rounded-lg bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-xs font-bold text-white shadow-md shadow-rose-950/40 transition-all border border-rose-500/30"
            >
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center space-y-8">
        {/* Glow ambient background elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-rose-600/10 blur-[130px] rounded-full pointer-events-none -z-10" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold tracking-wide animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>THE WORLD'S FIRST ADVERSARIAL AI BOARDROOM</span>
        </div>

        {/* Main Headline */}
        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white">
            Stress-Test Your <span className="bg-gradient-to-r from-rose-500 via-amber-400 to-rose-400 bg-clip-text text-transparent">Billion-Dollar Ideas</span> Before Reality Crushes Them.
          </h1>
          <p className="text-sm sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Stop relying on polite yes-men. Enter the Hot Seat against a ruthless gauntlet of 4 specialized AI critics: Infrastructure SRE, Venture CFO, Enterprise CISO, and Product GTM.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto pt-2">
          <button
            onClick={onOpenSignIn}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 via-rose-700 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-sm shadow-xl shadow-rose-950/60 flex items-center justify-center gap-2 transition-all group"
          >
            <span>Enter Boardroom (Sign In)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onOpenQrUpload}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-rose-500/50 text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <QrCode className="w-4 h-4 text-rose-400" />
            <span>Scan Idea via QR Code</span>
          </button>

          <button
            onClick={onEnterAsGuest}
            className="w-full sm:w-auto px-4 py-3 rounded-xl text-slate-400 hover:text-slate-200 text-xs font-semibold hover:underline flex items-center justify-center gap-1 transition-colors"
          >
            <Play className="w-3.5 h-3.5 text-slate-400" />
            <span>Quick Demo</span>
          </button>
        </div>

        {/* Live Metrics Proof Ticker */}
        <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center space-y-1">
            <div className="text-xl sm:text-2xl font-black text-rose-400 font-mono">$48.5M+</div>
            <div className="text-[11px] text-slate-400 font-medium">Capital Burn Prevented</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center space-y-1">
            <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">14,800+</div>
            <div className="text-[11px] text-slate-400 font-medium">Pitches & RFCs Tested</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center space-y-1">
            <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">98.4%</div>
            <div className="text-[11px] text-slate-400 font-medium">Fatal Flaws Exposed Early</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center space-y-1">
            <div className="text-xl sm:text-2xl font-black text-indigo-400 font-mono">4 Critics</div>
            <div className="text-[11px] text-slate-400 font-medium">Adversarial AI Personas</div>
          </div>
        </div>
      </section>

      {/* High Advantages & Core Value Proposition Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-800/80 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="text-xs uppercase font-extrabold tracking-widest text-rose-400">
            Why ContraBoard Outperforms Traditional Advice
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            High Advantages That Protect Your Runway
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Most startups fail not from bad execution, but from unchecked flawed assumptions. Here is how our adversarial boardroom flips the odds in your favor.
          </p>
        </div>

        {/* 6 Key Advantages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Advantage 1 */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#111422] to-[#0c0e18] border border-slate-800 hover:border-rose-500/40 transition-all space-y-3 shadow-lg group">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-rose-300 transition-colors">
              Zero-BS Adversarial Crossfire
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No ego-stroking feedback. Our critics actively attack hidden technical bottlenecks, leaky margins, and naive go-to-market assumptions before you write code.
            </p>
          </div>

          {/* Advantage 2 */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#111422] to-[#0c0e18] border border-slate-800 hover:border-amber-500/40 transition-all space-y-3 shadow-lg group">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
              Workable Mobile QR Idea Sync
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generate real scannable QR codes or scan pitch decks directly with your smartphone camera. Wirelessly beam custom RFCs to the Hot Seat in seconds.
            </p>
          </div>

          {/* Advantage 3 */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#111422] to-[#0c0e18] border border-slate-800 hover:border-emerald-500/40 transition-all space-y-3 shadow-lg group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
              Automated Executive Pre-Mortem
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Get an instant survival score, prioritized fatal flaws matrix, and concrete defensive pivots formatted for 1-click PDF and Markdown export.
            </p>
          </div>

          {/* Advantage 4 */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#111422] to-[#0c0e18] border border-slate-800 hover:border-indigo-500/40 transition-all space-y-3 shadow-lg group">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
              Live Hot Seat Interactive Defense
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Target individual critics directly with rebuttal evidence. Watch persona skepticism meters and room tension dynamically recalibrate in real-time.
            </p>
          </div>

          {/* Advantage 5 */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#111422] to-[#0c0e18] border border-slate-800 hover:border-rose-500/40 transition-all space-y-3 shadow-lg group">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Volume2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-rose-300 transition-colors">
              Procedural Audio War Room
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Synthesized gavel strikes, speech telemetry pings, and rising tension alarms create an immersive psychological pressure cooker experience.
            </p>
          </div>

          {/* Advantage 6 */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#111422] to-[#0c0e18] border border-slate-800 hover:border-teal-500/40 transition-all space-y-3 shadow-lg group">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors">
              Zero IP Retention Sandbox
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your trade secrets, financial models, and patent proposals remain confidential. Ephemeral sessions guarantee zero unapproved AI model training.
            </p>
          </div>
        </div>
      </section>

      {/* The 4 Adversarial AI Personas Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-800/80 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs uppercase font-extrabold tracking-widest text-amber-400">
            Meet Your Board of Inquisitors
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            4 Ruthless Specialist AI Personas
          </h2>
          <p className="text-xs text-slate-400">
            Each persona is calibrated with deep real-world domain heuristics to find structural weaknesses.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {INITIAL_PERSONAS.map((p) => (
            <div 
              key={p.id}
              className="p-5 rounded-2xl bg-[#0f121d] border border-slate-800 hover:border-slate-700 transition-all space-y-3 shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 text-2xl flex items-center justify-center border border-slate-700">
                    {p.avatar}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{p.name}</h4>
                    <p className="text-[11px] text-rose-400 font-medium">{p.title}</p>
                  </div>
                </div>

                <div className="text-xs text-slate-300 font-serif italic border-l-2 border-rose-500/40 pl-2.5 py-0.5">
                  "{p.signatureCatchphrase}"
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {p.personalityBio}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Initial Skepticism:</span>
                <span className="font-mono font-bold text-rose-400">{p.initialSkepticism}%</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison: Polite Advisors vs ContraBoard */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full border-t border-slate-800/80 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Polite Feedback vs Adversarial Stress-Testing
          </h2>
          <p className="text-xs text-slate-400">
            See the difference between vanity validation and cold boardroom reality.
          </p>
        </div>

        <div className="rounded-2xl bg-[#0c0e18] border border-slate-800 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-2 bg-slate-900/80 p-3.5 border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400">
            <div>Traditional Pitch Feedback</div>
            <div className="text-rose-400">ContraBoard Devil's Advocate</div>
          </div>
          <div className="divide-y divide-slate-800/80 text-xs">
            <div className="grid grid-cols-2 p-3.5 items-center">
              <span className="text-slate-400">"Great idea! Have you thought about marketing?"</span>
              <span className="text-slate-200 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                "Your CAC/LTV curve inverts at month 4. You burn out in Q3."
              </span>
            </div>
            <div className="grid grid-cols-2 p-3.5 items-center">
              <span className="text-slate-400">Vague pats on the back from friends & mentors</span>
              <span className="text-slate-200 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                Microservices cascade latency & single-point-of-failure audits
              </span>
            </div>
            <div className="grid grid-cols-2 p-3.5 items-center">
              <span className="text-slate-400">No structured pre-mortem or survival metrics</span>
              <span className="text-slate-200 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                Quantitative survival score & automated defensive pivot roadmap
              </span>
            </div>
            <div className="grid grid-cols-2 p-3.5 items-center">
              <span className="text-slate-400">Manual slides and passive presentation</span>
              <span className="text-slate-200 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                Workable QR instant idea transfer & live hot-seat sparring
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-rose-950/40 via-slate-900 to-[#0c0e18] border border-rose-500/30 shadow-2xl shadow-rose-950/40 space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            Are You Ready to Defend Your Strategy?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Don't let market reality be your first critic. Sign in now or scan your idea via QR code to convene the Devil's Advocate Board.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenSignIn}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 via-rose-700 to-amber-600 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm shadow-xl flex items-center gap-2"
            >
              <span>Sign In to War Room</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenQrUpload}
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-rose-500/40 text-slate-200 font-semibold text-xs flex items-center gap-2"
            >
              <QrCode className="w-4 h-4 text-rose-400" />
              <span>Scan Idea QR Code</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-[#07080c] py-6 px-4 text-center text-xs text-slate-500 space-y-2">
        <div className="flex items-center justify-center gap-2 font-semibold text-slate-400">
          <ShieldAlert className="w-4 h-4 text-rose-500" />
          <span>ContraBoard &bull; Adversarial AI Decision Studio</span>
        </div>
        <p className="text-[11px] text-slate-600">
          Designed for high-conviction founders, enterprise architects, and venture partners.
        </p>
      </footer>
    </div>
  );
};
