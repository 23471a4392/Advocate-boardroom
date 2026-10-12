import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import { QrCode, Camera, Upload, CheckCircle2, Sparkles, FileText, ArrowRight, X, RefreshCw, Smartphone } from 'lucide-react';
import type { Proposal } from '../types';
import { soundEngine } from '../utils/audio';

interface IdeaQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProposal: (proposal: Proposal) => void;
  currentProposal?: Proposal;
}

// Built-in curated proposal payloads for instant testing & QR encoding
const SAMPLE_IDEAS: Proposal[] = [
  {
    id: 'qr-edge-robotics',
    title: 'Autonomous Edge AI Robotics Fleet for Dark Warehouses',
    summary: 'Deploying swarm-coordinated autonomous mobile robots (AMRs) using on-device neuromorphic vision chips to eliminate central server latency in 500,000 sq ft logistics hubs.',
    category: 'AI & Automation',
    keyAssumptions: [
      'Neuromorphic on-chip inference can maintain < 5ms reaction times during high-velocity carton picking',
      'Swarm mesh protocol will not experience RF dead zones in heavy steel rack environments',
      'Hardware unit economics achieve payback within 9 months at $18,000 per robot unit',
      'Warehouse operators accept fully autonomous pallet shifts without human spotters'
    ],
    budgetOrRunway: '$4,200,000 Seed-A Runway (18 Months)',
    timeline: 'Q1 Hardware Tape-Out, Q3 Beta Deployment in 3 Logistics Hubs'
  },
  {
    id: 'qr-zk-health-vault',
    title: 'Zero-Knowledge Biometric Health Vault & Clinical Trial Exchange',
    summary: 'A HIPAA & GDPR compliant health data clearinghouse allowing cancer patients to monetize de-identified genomic sequencing for clinical trials via zero-knowledge proofs.',
    category: 'Infrastructure & Tech',
    keyAssumptions: [
      'ZK-SNARK generation on consumer smartphone hardware is fast enough (< 8s) for patient onboarding',
      'Pharmaceutical sponsors will pay $4,500 per verified genomic patient profile',
      'Homomorphic query engine prevents adversarial reconstruction of patient identity from secondary attributes',
      'FDA clinical trial coordinators will certify ZK-verified real-world evidence (RWE)'
    ],
    budgetOrRunway: '$2,800,000 Pre-Series A Runway (14 Months)',
    timeline: 'Q2 IRB Approval, Q4 Initial Trial Phase with 1,200 Cohort Members'
  },
  {
    id: 'qr-carbon-credit-dex',
    title: 'Algorithmic High-Frequency Carbon Credit Arbitrage Protocol',
    summary: 'Real-time satellite-verified telemetry linked to automated smart-contract retirement of voluntary carbon offsets, removing double-counting across global registries.',
    category: 'Pricing & Monetization',
    keyAssumptions: [
      'Multispectral satellite synthetic aperture radar can verify reforestation canopy biomass at 10m resolution',
      'Market makers will commit $50M in liquidity pool depth to maintain tight 5 bps spreads',
      'Regulatory compliance harmonizes with upcoming EU Article 6 cross-border carbon border tax tariffs',
      'Enterprise buyers will switch from legacy Verra brokers to automated on-chain settlement'
    ],
    budgetOrRunway: '$6,500,000 Series A Runway (24 Months)',
    timeline: 'Q1 Protocol Testnet, Q3 Regulatory Sandboxing in Zurich & London'
  }
];

export const IdeaQrModal: React.FC<IdeaQrModalProps> = ({
  isOpen,
  onClose,
  onSelectProposal
}) => {
  const [activeTab, setActiveTab] = useState<'scan' | 'generate' | 'upload'>('generate');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [selectedSampleIdea, setSelectedSampleIdea] = useState<Proposal>(SAMPLE_IDEAS[0]);
  const [decodedProposal, setDecodedProposal] = useState<Proposal | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [scanStatus, setScanStatus] = useState<string>('');
  const [rawPastedIdea, setRawPastedIdea] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Generate genuine scannable QR Code on canvas / data URL
  useEffect(() => {
    if (!isOpen) return;

    const generateQr = async () => {
      try {
        const payload = JSON.stringify({
          type: 'contraboard_proposal',
          id: selectedSampleIdea.id,
          title: selectedSampleIdea.title,
          summary: selectedSampleIdea.summary,
          category: selectedSampleIdea.category,
          keyAssumptions: selectedSampleIdea.keyAssumptions,
          budgetOrRunway: selectedSampleIdea.budgetOrRunway,
          url: `${window.location.origin}/#proposal=${selectedSampleIdea.id}`
        });

        const url = await QRCode.toDataURL(payload, {
          width: 320,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff'
          },
          errorCorrectionLevel: 'M'
        });
        setQrCodeDataUrl(url);
      } catch (err) {
        console.error('Error generating QR code:', err);
      }
    };

    generateQr();
  }, [isOpen, selectedSampleIdea]);

  // Handle live camera stream & scanning with jsQR
  useEffect(() => {
    if (!isCameraActive) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(t => t.stop());
        videoRef.current.srcObject = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        setScanStatus('Requesting camera access...');
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute('playsinline', 'true');
          await videoRef.current.play();
          setScanStatus('Camera active. Align QR code inside frame...');
          scanVideoFrame();
        }
      } catch (err) {
        console.warn('Camera access error:', err);
        setScanStatus('Camera access unavailable. Please upload a QR image or select a sample idea.');
        setIsCameraActive(false);
      }
    };

    const scanVideoFrame = () => {
      if (!videoRef.current || !canvasRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
        animationFrameRef.current = requestAnimationFrame(scanVideoFrame);
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert'
        });

        if (code && code.data) {
          handleQrContentDecoded(code.data);
          setIsCameraActive(false);
          return;
        }
      }

      animationFrameRef.current = requestAnimationFrame(scanVideoFrame);
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isCameraActive]);

  // Decode QR content string into a Proposal
  const handleQrContentDecoded = (content: string) => {
    soundEngine.playSpeechPing(600);

    try {
      // Try parsing JSON payload
      const data = JSON.parse(content);
      if (data.title && data.keyAssumptions) {
        const proposal: Proposal = {
          id: data.id || `qr-${Date.now()}`,
          title: data.title,
          summary: data.summary || 'Imported via QR scan',
          category: data.category || 'AI & Automation',
          keyAssumptions: Array.isArray(data.keyAssumptions) ? data.keyAssumptions : [data.keyAssumptions],
          budgetOrRunway: data.budgetOrRunway || '$2,500,000 Seed Stage',
          timeline: data.timeline || 'Immediate Boardroom Review'
        };
        setDecodedProposal(proposal);
        setScanStatus('✓ QR Code scanned and validated successfully!');
        return;
      }
    } catch {
      // Not JSON, treat as raw idea title/content
    }

    // Match sample or fallback
    const matched = SAMPLE_IDEAS.find(s => content.includes(s.id) || content.includes(s.title)) || {
      id: `qr-${Date.now()}`,
      title: content.slice(0, 60),
      summary: content,
      category: 'Infrastructure & Tech' as const,
      keyAssumptions: [
        'Assumption 1: Technical feasibility validated at prototype phase',
        'Assumption 2: Unit economics hold under scale load',
        'Assumption 3: Defensible IP and customer acquisition channel'
      ],
      budgetOrRunway: '$2,000,000 Seed Runway'
    };

    setDecodedProposal(matched);
    setScanStatus('✓ QR Code decoded successfully!');
  };

  // Handle uploaded QR image file
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code && code.data) {
          handleQrContentDecoded(code.data);
        } else {
          // If no QR detected in image, allow using as text/sample
          setScanStatus('No valid QR matrix found in this image. Pick a sample idea or paste text directly.');
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Convert raw pasted idea text into proposal
  const handlePastedIdeaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawPastedIdea.trim()) return;

    const lines = rawPastedIdea.split('\n').filter(l => l.trim().length > 0);
    const title = lines[0] || 'Custom Uploaded Strategy Proposal';
    const summary = lines.slice(1, 3).join(' ') || title;
    const assumptions = lines.slice(3).length > 0 
      ? lines.slice(3) 
      : [
          'Assumption 1: Product-market fit is achievable within 6 months',
          'Assumption 2: CAC to LTV ratio exceeds 1:3',
          'Assumption 3: Architecture can sustain 10x traffic growth without rewrite'
        ];

    const newProposal: Proposal = {
      id: `custom-${Date.now()}`,
      title,
      summary,
      category: 'AI & Automation',
      keyAssumptions: assumptions,
      budgetOrRunway: '$3,000,000 Series Seed'
    };

    setDecodedProposal(newProposal);
    setScanStatus('✓ Proposal created from text input!');
  };

  const handleLaunchHearing = () => {
    if (decodedProposal) {
      soundEngine.playGavel();
      onSelectProposal(decodedProposal);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#0f121d] border border-slate-800 rounded-2xl shadow-2xl shadow-rose-950/30 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Top Accent */}
        <div className="h-1 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-600 shrink-0" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 via-rose-700 to-amber-600 flex items-center justify-center shadow-md shadow-rose-950/40 border border-rose-500/30">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <span>Workable Idea QR Scanner & Sync</span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Live Sync
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Scan with mobile camera or upload RFC pitch deck to enter the Hot Seat
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 p-2 gap-2 shrink-0 text-xs font-medium">
          <button
            onClick={() => { setActiveTab('generate'); setIsCameraActive(false); }}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
              activeTab === 'generate'
                ? 'bg-rose-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Scan With Phone (Live QR)</span>
          </button>
          <button
            onClick={() => { setActiveTab('scan'); setIsCameraActive(true); }}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
              activeTab === 'scan'
                ? 'bg-rose-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Camera Scanner / QR File</span>
          </button>
          <button
            onClick={() => { setActiveTab('upload'); setIsCameraActive(false); }}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
              activeTab === 'upload'
                ? 'bg-rose-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Paste / Upload RFC</span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          {/* TAB 1: Real Scannable Phone QR Code */}
          {activeTab === 'generate' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Genuine Scannable QR Code Canvas */}
                <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-xl shadow-black/40 border-4 border-slate-800">
                  {qrCodeDataUrl ? (
                    <img 
                      src={qrCodeDataUrl} 
                      alt="Workable Idea QR Code" 
                      className="w-56 h-56 object-contain rounded-lg"
                    />
                  ) : (
                    <div className="w-56 h-56 flex items-center justify-center text-slate-500">
                      <RefreshCw className="w-8 h-8 animate-spin" />
                    </div>
                  )}
                  <div className="mt-2 text-center text-slate-900 font-mono text-[11px] font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>Point phone camera to scan</span>
                  </div>
                </div>

                {/* Explanation and Selection */}
                <div className="space-y-3.5 text-left">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>100% Workable QR Matrix</span>
                  </div>
                  <h3 className="text-base font-bold text-white leading-snug">
                    {selectedSampleIdea.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {selectedSampleIdea.summary}
                  </p>

                  <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-xs">
                    <div className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                      Select Idea to Encode into QR:
                    </div>
                    <div className="space-y-1.5">
                      {SAMPLE_IDEAS.map((idea) => (
                        <button
                          key={idea.id}
                          onClick={() => {
                            setSelectedSampleIdea(idea);
                            setDecodedProposal(idea);
                            soundEngine.playSpeechPing(450);
                          }}
                          className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all flex items-center justify-between ${
                            selectedSampleIdea.id === idea.id
                              ? 'bg-rose-500/15 border-rose-500 text-rose-200'
                              : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                          }`}
                        >
                          <span className="font-medium truncate max-w-[220px]">{idea.title}</span>
                          <span className="text-[10px] text-slate-500 font-mono shrink-0 ml-2">{idea.category}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick load button */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-200">Want to load this into the Hot Seat now?</div>
                  <div className="text-[11px] text-slate-400">Skip mobile scanning and directly load proposal</div>
                </div>
                <button
                  onClick={() => {
                    setDecodedProposal(selectedSampleIdea);
                    soundEngine.playSpeechPing(500);
                  }}
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-all shadow-md flex items-center gap-1.5"
                >
                  <span>Select Idea</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Live Camera Scanner / Image File Scan */}
          {activeTab === 'scan' && (
            <div className="space-y-4">
              <div className="relative rounded-2xl bg-black border border-slate-800 overflow-hidden flex flex-col items-center justify-center min-h-[260px] p-4 text-center">
                {isCameraActive ? (
                  <div className="relative w-full max-w-sm aspect-video rounded-xl overflow-hidden bg-slate-950 border border-rose-500/40">
                    <video ref={videoRef} className="w-full h-full object-cover" />
                    <canvas ref={canvasRef} className="hidden" />
                    {/* Laser scan animation overlay */}
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent animate-pulse shadow-lg shadow-rose-500/50" />
                  </div>
                ) : (
                  <div className="space-y-3 py-6">
                    <Camera className="w-12 h-12 text-slate-600 mx-auto" />
                    <p className="text-xs text-slate-400 max-w-xs mx-auto">
                      Camera inactive. Click below to launch video scanner, or drop an image containing a QR code.
                    </p>
                    <button
                      onClick={() => setIsCameraActive(true)}
                      className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md inline-flex items-center gap-2"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Start Camera Stream</span>
                    </button>
                  </div>
                )}

                {scanStatus && (
                  <div className="mt-3 text-xs font-mono text-amber-400 px-3 py-1 rounded bg-slate-900/80 border border-slate-800">
                    {scanStatus}
                  </div>
                )}
              </div>

              {/* Or Upload Image File */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-dashed border-slate-700 hover:border-rose-500/50 text-center transition-colors">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-colors">
                  <span>Upload QR Code Image File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  PNG, JPG, or WEBP containing a standard QR matrix
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: Paste / Upload RFC Pitch */}
          {activeTab === 'upload' && (
            <form onSubmit={handlePastedIdeaSubmit} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Pitch Title & Hypothesis Content (RFC / Pitch Deck)</span>
                  <span className="text-[10px] text-slate-500">First line = Title, subsequent lines = assumptions</span>
                </label>
                <textarea
                  rows={6}
                  value={rawPastedIdea}
                  onChange={(e) => setRawPastedIdea(e.target.value)}
                  placeholder={`Quantum Mesh Architecture for Real-Time Defense Telemetry\nDecentralized zero-trust sensor fabric for orbital satellite constellations.\nAssumption 1: Laser inter-satellite links achieve < 2ms jitter.\nAssumption 2: Quantum key distribution prevents adversary MITM interception.\nAssumption 3: Launch payload costs under $1,200/kg via reusable rockets.`}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setRawPastedIdea(
                    `AI Code Verification Studio & Static Proof Synthesizer\nAutonomous formal verification engine guaranteeing zero runtime panic vulnerabilities in smart contract protocols.\nAssumption 1: Symbolic execution finishes within 4 minutes on 100k LOC codebases.\nAssumption 2: Web3 auditing firms will license the engine at $12,000/month.\nAssumption 3: False positive rates remain below 1.2% on EVM bytecode.`
                  )}
                  className="text-xs text-rose-400 hover:text-rose-300 font-medium"
                >
                  Insert Sample Pitch
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <FileText className="w-4 h-4" />
                  <span>Parse & Preview Idea</span>
                </button>
              </div>
            </form>
          )}

          {/* Decoded Idea Preview Confirmation Banner */}
          {decodedProposal && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/40 shadow-xl space-y-3 text-left animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Idea Ready for Boardroom Hearing</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {decodedProposal.category}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white">{decodedProposal.title}</h4>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2">{decodedProposal.summary}</p>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
                <span>Declared Budget: <strong className="text-slate-200">{decodedProposal.budgetOrRunway}</strong></span>
                <span>Assumptions: <strong className="text-rose-400">{decodedProposal.keyAssumptions.length} Hypotheses</strong></span>
              </div>

              <button
                onClick={handleLaunchHearing}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-600 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all"
              >
                <span>Launch Boardroom Hearing with this Idea</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
