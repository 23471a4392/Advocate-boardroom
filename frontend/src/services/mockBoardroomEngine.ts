import type { HearingMessage, Persona, PersonaId, PreMortemReport, Proposal } from '../types';

export class MockBoardroomEngine {
  private proposal: Proposal;
  private personas: Persona[];
  private messages: HearingMessage[] = [];
  private currentRound: number = 1;

  constructor(proposal: Proposal, personas: Persona[]) {
    this.proposal = proposal;
    this.personas = JSON.parse(JSON.stringify(personas));
  }

  // Generate Round 1: Opening Salvos (each persona attacks the proposal directly)
  public generateRound1Critiques(): HearingMessage[] {
    this.currentRound = 1;
    const title = this.proposal.title.toLowerCase();
    const isTech = this.proposal.category === 'Infrastructure & Tech' || title.includes('monolith') || title.includes('microservice');
    const isPricing = this.proposal.category === 'Pricing & Monetization' || title.includes('free tier') || title.includes('pricing');
    const isAI = this.proposal.category === 'AI & Automation' || title.includes('llm') || title.includes('agent');

    const critiques: HearingMessage[] = [
      {
        id: `msg-${Date.now()}-1`,
        speakerId: 'sre',
        speakerName: 'Victor Vance',
        speakerRole: 'Principal Architect & SRE',
        content: isTech
          ? `Let's cut through the buzzwords. You are replacing single-process function calls that executed in 2 microseconds with distributed network hops, schema drift, and Kafka dead-letter queues. Who is debugging the split-brain state at 4:15 AM on a Saturday? Your team doesn't have an architecture problem; they have an unmonitored deployment discipline problem.`
          : isPricing
          ? `Your operational capacity planning assumes paying customers generate identical I/O patterns to free users. If your highest-paying accounts start hitting batch endpoints concurrently because they feel entitled to unlimited throughput, your database will choke while your AWS egress costs spike 4x.`
          : isAI
          ? `Autonomous tool-calling agents connected directly to database write-replicas? That is an unmitigated operational disaster waiting to happen. The moment an LLM loops on a transient timeout, you will witness a self-inflicted Distributed Denial of Service on your own primary database.`
          : `Your technical execution timeline is extraordinarily optimistic. You have factored zero latency overhead for distributed data synchronization, and your rollback strategy is nonexistent. You are betting the entire company's stability on best-case network behavior.`,
        round: 1,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        critiqueType: 'fatal_flaw',
        skepticismDelta: 5
      },
      {
        id: `msg-${Date.now()}-2`,
        speakerId: 'cfo',
        speakerName: 'Elena Rostova',
        speakerRole: 'Ruthless CFO & Unit Economist',
        content: isPricing
          ? `You want to eliminate the free tier overnight? Let's talk unit economics: you're planning on a 3.5% conversion rate, but historical SaaS benchmarks show abrupt free-tier paywalls trigger a net-negative churn of 91% and annihilate organic developer virality. Your Customer Acquisition Cost (CAC) will triple the moment this goes live.`
          : isTech
          ? `The engineering headcount you're dedicating to this migration represents over \$180,000 in direct salary alone, not to mention lost opportunity cost on shipping revenue-generating features. And your cloud budget? Managed Kafka, distributed tracing, and multi-service egress fees will inflate your infrastructure bill by at least 45% before you see a dime in ROI.`
          : isAI
          ? `You claim this saves \$400k in support salaries. Did you calculate token usage during adversarial jailbreak loops or enterprise dispute resolutions? Plus the liability insurance rider when an autonomous agent mistakenly authorizes a fraudulent \$15,000 credit refund? This is an accounting illusion.`
          : `Your capital efficiency here is alarming. You are pouring upfront capital into an initiative where the payback period exceeds 18 months, while your cash runway barely gives you a 9-month safety net. Where is the margin of safety?`,
        round: 1,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        critiqueType: 'financial_burn',
        skepticismDelta: 7
      },
      {
        id: `msg-${Date.now()}-3`,
        speakerId: 'cso',
        speakerName: 'Marcus Chen',
        speakerRole: 'Chief Information Security Officer',
        content: isAI
          ? `Giving LLM agents tool-calling access to billing mutations and database updates without deterministic human-in-the-loop approval violates every principle of Zero-Trust. Indirect prompt injection via customer tickets (e.g., hidden Unicode payloads in support attachments) will trick your agent into exfiltrating PII. We'd fail SOC2 and GDPR audits instantly.`
          : isTech
          ? `Fourteen separate microservices means fourteen distinct attack surfaces, fourteen API gateways to audit for authorization bypass (BOLA), and secrets management sprawl across 14 container images. How are you enforcing mTLS and cryptographic token revocation across all inter-service endpoints?`
          : `Have you considered regulatory and legal liability? The moment you touch customer billing state and data boundaries without audit trails, you expose us to GDPR non-compliance fines up to 4% of global turnover. Your current proposal has zero cryptographic non-repudiation.`,
        round: 1,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        critiqueType: 'security_breach',
        skepticismDelta: 4
      },
      {
        id: `msg-${Date.now()}-4`,
        speakerId: 'ux',
        speakerName: 'Sasha Morales',
        speakerRole: 'Head of Product & UX Purist',
        content: isPricing
          ? `From an emotional UX standpoint, this is suicide. Free-tier users aren't just freeloaders; they are your product evangelists, community contributors, and social proof. Slapping an unforgiving \$49 paywall without a grace period or grandfathering creates immediate community revolt on Reddit and Hacker News. Trust takes 3 years to build and 45 minutes to torch.`
          : isAI
          ? `There is nothing customers despise more than fighting a soulless synthetic bot when their payment failed or their account is locked. If your time-to-human-handoff isn't instantaneous, your Net Promoter Score (NPS) will crater to the negatives. Efficiency at the expense of human empathy destroys lifetime customer retention.`
          : `You have engineered an internal solution for your own team's preference, but how does the actual end user benefit? Does page load drop by 500ms? Do workflows get simpler? No. You are introducing invisible latency and breaking changes to satisfy internal ego.`,
        round: 1,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        critiqueType: 'friction',
        skepticismDelta: 6
      }
    ];

    this.messages.push(...critiques);
    return critiques;
  }

  // Generate Round 2: Crossfire (Personas clashing with each other)
  public generateRound2Crossfire(): HearingMessage[] {
    this.currentRound = 2;
    const crossfires: HearingMessage[] = [
      {
        id: `msg-${Date.now()}-cf1`,
        speakerId: 'cfo',
        speakerName: 'Elena Rostova',
        speakerRole: 'Ruthless CFO',
        targetId: 'sre',
        targetName: 'Victor Vance',
        content: `Victor, stop obsessing purely over distributed chaos theory for one second! If we implement all your multi-region failover clusters and dedicated Kafka brokers, our AWS spend will exceed our gross revenue this quarter. We cannot afford your SRE ivory tower.`,
        round: 2,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        critiqueType: 'crossfire'
      },
      {
        id: `msg-${Date.now()}-cf2`,
        speakerId: 'sre',
        speakerName: 'Victor Vance',
        speakerRole: 'Principal Architect & SRE',
        targetId: 'cfo',
        targetName: 'Elena Rostova',
        content: `Elena, penny-pinching on infrastructure resilience is how companies lose \$2 million during Black Friday downtime. You are saving \$4,000 on cloud bills to gamble the entire business on single-point-of-failure hardware!`,
        round: 2,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        critiqueType: 'crossfire'
      },
      {
        id: `msg-${Date.now()}-cf3`,
        speakerId: 'ux',
        speakerName: 'Sasha Morales',
        speakerRole: 'Head of Product',
        targetId: 'cso',
        targetName: 'Marcus Chen',
        content: `Marcus, your security recommendations would require every customer to complete 2FA hardware key challenges and wait 48 hours for manual ticket review. You're trying to secure a product that no one will use because you've choked onboarding to death!`,
        round: 2,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        critiqueType: 'crossfire'
      },
      {
        id: `msg-${Date.now()}-cf4`,
        speakerId: 'cso',
        speakerName: 'Marcus Chen',
        speakerRole: 'Chief Security Officer',
        targetId: 'ux',
        targetName: 'Sasha Morales',
        content: `Sasha, frictionless onboarding is just another phrase for 'open doors for credential stuffers and automated botnets'. When a threat actor drains customer wallets via your delightful, seamless interface, let's see how high your Net Promoter Score is!`,
        round: 2,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        critiqueType: 'crossfire'
      }
    ];

    this.messages.push(...crossfires);
    return crossfires;
  }

  // Evaluate user defense in the Hot Seat
  public evaluateDefense(userDefense: string, targetPersonaId?: PersonaId): {
    rebuttalMessage: HearingMessage;
    updatedPersonas: Persona[];
    overallTensionChange: number;
    wasEffective: boolean;
  } {
    const text = userDefense.toLowerCase();
    
    // Check if the user used substantive, high-rigor engineering/business terms
    const strongArguments = [
      'canary', 'grandfather', 'phase', 'rollback', 'rate limit', 'circuit breaker',
      'idempoten', 'audit log', 'human in the loop', 'pilot', 'cohort', 'metric',
      'slas', 'grace period', 'contingency', 'sandbox', 'zero-trust', 'mtls'
    ];
    
    const matchedKeywords = strongArguments.filter(kw => text.includes(kw));
    const isEffective = matchedKeywords.length >= 1 || text.length > 80;

    const target = targetPersonaId || 'sre';
    const persona = this.personas.find(p => p.id === target) || this.personas[0];

    let rebuttalText = '';
    let delta = 0;

    if (isEffective) {
      delta = -12; // Skepticism reduced!
      if (target === 'sre') {
        rebuttalText = `Fair point on phased rollouts and circuit breakers. If you enforce strict canary gates with automated telemetry rollbacks, that mitigates about 40% of the cascading blast radius. However, I still want to see synthetic load test benchmarks before I sign off.`;
      } else if (target === 'cfo') {
        rebuttalText = `Grandfathering existing power cohorts and instituting a tiered grace period addresses my immediate panic regarding viral CAC decay. If you can maintain 80%+ gross margin on the new floor, the unit economics become cautiously defensible.`;
      } else if (target === 'cso') {
        rebuttalText = `Having read-only scoped tokens and human approval gates on destructive mutations removes the critical CVE severity. I will downgrade the risk flag from 'CRITICAL' to 'HIGH', provided audit logs are cryptographically immutable.`;
      } else {
        rebuttalText = `I appreciate that you thought through user onboarding friction and communication cadence. Giving users 30 days notice with transparent rationale will soften the backlash significantly.`;
      }
    } else {
      delta = +8; // Skepticism increased due to weak/handwavy argument!
      if (target === 'sre') {
        rebuttalText = `That is pure wishful thinking. 'We will just monitor it carefully' is not an architectural mitigation. Without deterministic circuit breakers and idempotent retry queues, hope is not a strategy!`;
      } else if (target === 'cfo') {
        rebuttalText = `Vague assurances about 'long-term value' won't pay the server invoice in 60 days. You haven't shown me a single spreadsheet cohort or cash buffer model!`;
      } else if (target === 'cso') {
        rebuttalText = `Saying 'we trust our authentication logic' is the exact last sentence spoken before a catastrophic data breach disclosure. Completely unacceptable answer.`;
      } else {
        rebuttalText = `You are dodging the emotional reality of your users. Dismissing user friction as 'they will get used to it' is classic builder arrogance.`;
      }
    }

    // Update persona score
    persona.skepticismScore = Math.max(15, Math.min(99, persona.skepticismScore + delta));

    // Also slightly influence others if argument was strong
    if (isEffective) {
      this.personas.forEach(p => {
        if (p.id !== persona.id) {
          p.skepticismScore = Math.max(20, p.skepticismScore - 4);
        }
      });
    }

    const rebuttalMessage: HearingMessage = {
      id: `msg-${Date.now()}-rebuttal`,
      speakerId: persona.id,
      speakerName: persona.name,
      speakerRole: persona.role,
      targetId: 'user',
      targetName: 'Hot Seat Defender',
      content: rebuttalText,
      round: this.currentRound,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      critiqueType: 'verdict',
      skepticismDelta: delta
    };

    return {
      rebuttalMessage,
      updatedPersonas: [...this.personas],
      overallTensionChange: isEffective ? -15 : +10,
      wasEffective: isEffective
    };
  }

  // Synthesize session into Pre-Mortem Report
  public generatePreMortemReport(): PreMortemReport {
    const avgSkepticism = Math.round(
      this.personas.reduce((acc, p) => acc + p.skepticismScore, 0) / this.personas.length
    );
    const survivalScore = Math.max(12, Math.min(95, 100 - avgSkepticism));

    const sre = this.personas.find(p => p.id === 'sre')?.skepticismScore || 75;
    const cfo = this.personas.find(p => p.id === 'cfo')?.skepticismScore || 80;
    const cso = this.personas.find(p => p.id === 'cso')?.skepticismScore || 85;
    const ux = this.personas.find(p => p.id === 'ux')?.skepticismScore || 70;

    return {
      sessionId: `cb-${Date.now()}`,
      proposalTitle: this.proposal.title,
      survivalScore,
      executiveVerdict: survivalScore < 45
        ? 'HIGH PROBABILITY OF SYSTEMIC FAILURE — Proceeding without radical restructuring will incur severe financial burn and operational deadlock.'
        : survivalScore < 70
        ? 'VIABLE WITH DEFENSIVE PIVOTS — Core thesis has merit, but execution requires strict guardrails, canary cohorts, and rollback safety nets.'
        : 'FAVORABLE DEFENSE — Proposal withstood aggressive cross-examination. Recommended for targeted pilot rollout with strict monitoring.',
      riskMatrix: {
        technical: sre,
        financial: cfo,
        security: cso,
        market: ux
      },
      fatalFlaws: [
        {
          id: 'flaw-1',
          title: 'Unbudgeted Cascading Complexity & Operational Latency',
          severity: 'CRITICAL',
          domain: 'Operations',
          explanation: 'The proposal severely underestimates distributed coordination overhead and MTTR (Mean Time to Resolution) during production anomalies.',
          failureScenario: 'A partial network partition or schema divergence causes silent data corruption that goes undetected until customer reports flood in.'
        },
        {
          id: 'flaw-2',
          title: 'Asymmetric Cash Burn & Churn Shockwave',
          severity: 'HIGH',
          domain: 'Finance',
          explanation: 'Assumed conversion rates lack historical empirical basis. Transition friction will create an immediate revenue trough before new margins take effect.',
          failureScenario: 'Runway drops by 35% in month 2 due to sudden user drop-off before enterprise sales pipeline matures.'
        },
        {
          id: 'flaw-3',
          title: 'Zero-Trust Violation & Surface Area Expansion',
          severity: 'HIGH',
          domain: 'Security',
          explanation: 'Expanded API surface area and asynchronous data pathways introduce unmonitored injection and exfiltration vectors.',
          failureScenario: 'An unauthenticated endpoint or rogue prompt token bypasses role-based access control, leaking sensitive customer records.'
        }
      ],
      recommendedPivots: [
        {
          priority: 'Immediate',
          title: 'Enforce Canary Deployment & 5% Traffic Shadowing',
          action: 'Do not migrate 100% of workload or users simultaneously. Shadow live traffic to a sandboxed environment for 30 days to measure real-world latency and cost variance.',
          expectedRiskReduction: '-35% Operational Risk'
        },
        {
          priority: 'Immediate',
          title: 'Institute Grandfathered Grace Periods',
          action: 'Provide existing power users with a 60-day grandfathered discount or trial extension to preserve viral community goodwill and prevent public brand erosion.',
          expectedRiskReduction: '-40% Churn & CAC Risk'
        },
        {
          priority: 'Defensive Strategy',
          title: 'Cryptographic Non-Repudiation on State Mutations',
          action: 'Mandate deterministic human-in-the-loop approvals for any mutations above a \$500 threshold or affecting core data retention schemas.',
          expectedRiskReduction: '-50% Security & Compliance Risk'
        }
      ],
      generatedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  }
}
