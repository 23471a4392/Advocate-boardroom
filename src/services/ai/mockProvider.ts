import { Persona, BoardSession, DefenseEvaluationResult, PreMortemReport } from '../../models/board.types';

export class MockProvider {
  /**
   * Generates opening salvos tailored to the user's proposal title and content
   */
  public static generateOpeningSalvo(
    persona: Persona,
    proposalTitle: string,
    proposalContent: string
  ): string {
    const title = proposalTitle.trim();
    const contentLower = proposalContent.toLowerCase();

    switch (persona.id) {
      case 'victor_vance': {
        if (contentLower.includes('microservice') || contentLower.includes('distributed') || contentLower.includes('cloud')) {
          return `Your design for "${title}" creates a distributed nightmare where network partitions will cascade into total service blackout. With no partition isolation or backpressure controls in place, your p99 latencies will breach 4,000ms the second traffic spikes. Who is holding the pager when your synchronous RPC chains dead-lock at 3 AM?`;
        }
        if (contentLower.includes('ai') || contentLower.includes('llm') || contentLower.includes('model')) {
          return `Tying "${title}" directly to unpredictable GPU inference latencies with zero fallback caching is an operational disaster waiting to strike. A single upstream rate-limit or GPU cold start will freeze your entire pipeline. You haven't built an architecture; you've built an uncontrolled queue of pending crashes.`;
        }
        return `I've inspected the architectural blueprint for "${title}", and it's riddled with unhedged single points of failure. You are presuming 99.99% availability on downstream dependencies with zero circuit-breaking or graceful degradation. When the primary node suffers a memory leak under load, your entire system will fold like a house of cards.`;
      }

      case 'elena_rostova': {
        if (contentLower.includes('ai') || contentLower.includes('llm') || contentLower.includes('token') || contentLower.includes('api')) {
          return `The unit economics behind "${title}" are completely upside down. Between per-token inference charges, high GPU compute overhead, and unhedged cloud egress fees, your gross margin will be negative on every single active user. What is your plan—subsidizing enterprise customers until our bank balance hits zero?`;
        }
        if (contentLower.includes('free') || contentLower.includes('freemium') || contentLower.includes('b2c')) {
          return `Your customer acquisition funnel for "${title}" projects an astronomical CAC with a nebulous LTV that won't break even within 24 months. Burning capital on vanity signups without a proven willingness-to-pay is venture suicide. Show me cold cash flow positive unit margins, or this pitch belongs in the shredder.`;
        }
        return `"${title}" has no defensible margin profile; your cost-of-goods-sold is dangerously front-loaded while your monetization timeline spans quarters of speculative runway. You are pricing this like a commodity utility while incurring the burn rate of an enterprise lab. At this trajectory, you will be insolvent before reaching product-market fit.`;
      }

      case 'marcus_chen': {
        if (contentLower.includes('data') || contentLower.includes('database') || contentLower.includes('user') || contentLower.includes('auth')) {
          return `The attack surface exposed by "${title}" is an absolute dream for threat actors and a nightmare for compliance. Storing and shuttling user data without zero-trust segmentation or cryptographic field-level encryption is practically inviting a mandatory SEC breach disclosure. You are one credential leak away from a catastrophic $20M regulatory fine.`;
        }
        if (contentLower.includes('ai') || contentLower.includes('prompt') || contentLower.includes('agent')) {
          return `"${title}" has zero perimeter defenses against prompt injection, malicious supply-chain dependencies, and model poisoning. Any rogue prompt can trigger unauthorized data exfiltration from your underlying datastore. In a hostile threat environment, optimism is gross negligence.`;
        }
        return `Your proposal for "${title}" completely sidesteps zero-trust isolation and regulatory compliance posture. You are granting broad IAM privileges and passing unverified payloads across trust boundaries. When an attacker pivots laterally through this unprotected ingress, will you explain that to the FTC or should I?`;
      }

      case 'sasha_morales': {
        if (contentLower.includes('feature') || contentLower.includes('platform') || contentLower.includes('dashboard') || contentLower.includes('all-in-one')) {
          return `"${title}" suffers from acute cognitive overload. You are trying to boil the ocean with an all-in-one kitchen-sink tool that forces users through a maze of configuration before showing an ounce of value. Real users will bounce during onboarding within 90 seconds, leaving you with an 85% day-30 churn rate.`;
        }
        if (contentLower.includes('ai') || contentLower.includes('automated') || contentLower.includes('smart')) {
          return `You've slapped an AI badge onto a workflow that users could already accomplish faster with a simple hotkey. Users do not want to prompt an opaque black box to get their job done; they want frictionless predictability. When novelty wears off after day one, nobody will renew this subscription.`;
        }
        return `The friction in "${title}" is intolerable. You are demanding that customers fundamentally disrupt their daily habits to adopt your convoluted workflow without offering a 10x breakthrough in return. This is textbook shelfware: bought with enthusiasm, abandoned within three weeks.`;
      }

      default:
        return `"${title}" fails to withstand rigorous scrutiny. The assumptions regarding scalability, cost structure, and user retention are fundamentally unverified.`;
    }
  }

  /**
   * Generates Round 2 crossfire debate attacks between board personas
   */
  public static generateCrossfire(
    speaker: Persona,
    target: Persona,
    proposalTitle: string
  ): string {
    const key = `${speaker.id}->${target.id}`;

    switch (key) {
      case 'elena_rostova->marcus_chen':
        return `Marcus wants to mandate enterprise HSMs and four redundant compliance monitoring vendors that will double our burn rate before we even book $10k in revenue! If we spend every cent on your zero-trust paranoia for "${proposalTitle}", we won't need security because the company will already be bankrupt!`;

      case 'marcus_chen->elena_rostova':
        return `Elena is looking at monthly SaaS line items while ignoring that a single unencrypted breach under GDPR carries a 4% global turnover penalty! Skimping on zero-trust controls for "${proposalTitle}" to protect your quarterly EBITDA is penny-wise and corporate suicide.`;

      case 'victor_vance->sasha_morales':
        return `Sasha is demanding animated real-time micro-interactions and zero onboarding barriers, completely oblivious to the fact that supporting client-side websockets at scale will saturate our connection pools! You can't UX your way out of a deadlocked database, Sasha.`;

      case 'sasha_morales->victor_vance':
        return `Victor would have us ship a raw CLI command with five-nines uptime that nobody on earth can actually use! What is the value of your pristine 99.999% SLA if the customer abandons the onboarding flow because your engineering architecture is unreadable garbage?`;

      case 'victor_vance->marcus_chen':
        return `Marcus's zero-trust mandate insists on mTLS renegotiation and token verification at every hop, which adds 85ms of artificial overhead to our p99 latency budget! Security cannot mean ground-zero performance paralysis.`;

      case 'marcus_chen->victor_vance':
        return `Victor treats perimeter boundaries as an optional annoyance just to shave 10 milliseconds off internal queries. High throughput means nothing if an unauthenticated insider can siphon our entire datastore in three minutes!`;

      case 'elena_rostova->victor_vance':
        return `Victor is proposing multi-region active-active clusters with redundant hot-standbys for "${proposalTitle}". That infrastructure alone will cost $45,000 a month in idle cloud spend before our first paying enterprise contract signs!`;

      case 'sasha_morales->elena_rostova':
        return `Elena cuts pricing experiments to the bone before we even understand user willingness-to-pay. Choking customer support and onboarding assistance to optimize margins will cause a churn death spiral.`;

      default:
        return `${target.name}'s priorities completely overlook the systemic failure modes of this initiative. We cannot execute on this proposal while ignoring critical tradeoffs.`;
    }
  }

  /**
   * Evaluates user defense for concrete vs hand-wavy argumentation
   */
  public static evaluateDefense(
    persona: Persona,
    userArgument: string,
    proposalTitle: string,
    currentScore: number
  ): DefenseEvaluationResult {
    const argumentLower = userArgument.toLowerCase();

    // Concrete indicators: metrics, specific architectures, test evidence, economic constraints
    const concreteKeywords = [
      'metric', 'latency', 'p99', 'benchmark', 'cache', 'redis', 'circuit breaker',
      'unit economics', 'cac', 'ltv', 'margin', 'gross margin', 'payback',
      'soc 2', 'gdpr', 'encryption', 'zero trust', 'iam', 'least privilege', 'audit',
      'churn', 'cohort', 'ab test', 'a/b', 'retention', 'onboarding', 'job to be done',
      'canary', 'fallback', 'slo', 'sli', 'sla', 'rate limit', 'sharding', 'postgres',
      'percent', '%', 'evidence', 'proven', 'pilot', 'contract', 'customer interview'
    ];

    // Hand-wavy / defensive indicators: vague assertions, dismissal, defensive rhetoric
    const handWavyKeywords = [
      'trust us', 'obviously', 'easy', 'simple', 'later', 'phase 2', 'soon',
      'users will love', 'not an issue', 'don\'t worry', 'we believe', 'we feel',
      'should be fine', 'everyone does it', 'next quarter', 'eventually', 'magic',
      'disrupt', 'revolutionary', 'no problem', 'you don\'t understand'
    ];

    let concreteHits = 0;
    concreteKeywords.forEach((k) => {
      if (argumentLower.includes(k)) concreteHits++;
    });

    let handWavyHits = 0;
    handWavyKeywords.forEach((k) => {
      if (argumentLower.includes(k)) handWavyHits++;
    });

    // Determine defense outcome
    const isConcrete = concreteHits >= 2 && userArgument.trim().length > 60 && concreteHits > handWavyHits;
    const isHandWavy = handWavyHits >= 1 || concreteHits === 0 || userArgument.trim().length < 40;

    let delta: number;
    let quality: DefenseEvaluationResult['argumentQuality'];
    let rebuttal: string;
    let rationale: string;

    if (isConcrete) {
      // Concrete defense reduces skepticism by -10 to -25
      const bonus = Math.min(25, 10 + concreteHits * 3);
      delta = -bonus;
      quality = 'concrete';
      rationale = `Provided verifiable constraints and domain metrics (${concreteHits} concrete architectural/financial levers identified).`;

      switch (persona.id) {
        case 'victor_vance':
          rebuttal = `Acknowledged. Introducing explicit circuit breakers, decoupled fallbacks, and telemetry-backed p99 budgets addresses my primary outage concerns. While I will scrutinize your load test benchmarks in staging, this is a defensible engineering plan.`;
          break;
        case 'elena_rostova':
          rebuttal = `Fair. Your quantified unit margin breakdown and bounded CAC payback targets demonstrate you are actually watching the burn multiple. Stick strictly to these spending guardrails and we won't end up insolvent.`;
          break;
        case 'marcus_chen':
          rebuttal = `Noted. Binding zero-trust token scopes with cryptographic field-level encryption and automated compliance audits significantly shrinks the blast radius. Maintain continuous monitoring, and this passes minimum security thresholds.`;
          break;
        case 'sasha_morales':
          rebuttal = `Valid point. Your user cohort retention experiments and simplified zero-friction flow show you respect customer cognitive load. Keep the core loop lean and don't dilute it with non-essential features.`;
          break;
        default:
          rebuttal = `Your evidence-backed argument resolves several critical vulnerabilities. Skepticism reduced.`;
      }
    } else {
      // Hand-wavy or defensive defense increases skepticism by +10 to +20
      const penalty = Math.min(20, 10 + (isHandWavy ? 5 : 0) + (userArgument.trim().length < 30 ? 5 : 0));
      delta = penalty;
      quality = userArgument.trim().length < 40 ? 'superficial' : 'hand_wavy';
      rationale = `Lacked quantifiable evidence and relied on unsubstantiated assertions or defensive hand-waving.`;

      switch (persona.id) {
        case 'victor_vance':
          rebuttal = `That is pure hand-waving. Telling me it will "scale easily" without concrete partition keys, connection pool limits, or SLA degradation models only confirms you have never debugged a production outage at scale.`;
          break;
        case 'elena_rostova':
          rebuttal = `Unacceptable optimism. Vagueness about pricing tiers and unit economics is how companies burn through eight-figure seed rounds in nine months. You gave me hopes, not balance sheet arithmetic.`;
          break;
        case 'marcus_chen':
          rebuttal = `Defensive deflection. Pushing compliance and threat modeling to "Phase 2" is the exact excuse written in every breach notification report I've ever reviewed. Your attack surface remains dangerously wide open.`;
          break;
        case 'sasha_morales':
          rebuttal = `Classic developer blind spot. Assuming users will just "read the documentation" or "intuitively get it" guarantees high churn. You haven't solved the friction; you've just normalized it.`;
          break;
        default:
          rebuttal = `Unsubstantiated justification. Skepticism heightened due to lack of verifiable data.`;
      }
    }

    const newScore = Math.max(5, Math.min(100, currentScore + delta));

    return {
      rebuttal,
      updatedScores: { [persona.id]: newScore },
      skepticismDelta: delta,
      targetedPersona: persona.id,
      argumentQuality: quality,
      rationale,
    };
  }

  /**
   * Generates a structured Pre-Mortem report synthesizing the boardroom hearing
   */
  public static generatePreMortem(session: BoardSession): PreMortemReport {
    const title = session.proposalTitle;
    const personaScores = Object.values(session.personas).map((p) => p.skepticismScore);
    const avgSkepticism = personaScores.length > 0
      ? personaScores.reduce((a, b) => a + b, 0) / personaScores.length
      : 75;

    // Survival score is inverse of average skepticism, adjusted for tension
    const baseSurvival = Math.max(5, Math.min(95, Math.round(100 - avgSkepticism)));

    // Calculate domain risks
    const victorScore = session.personas['victor_vance']?.skepticismScore ?? 75;
    const elenaScore = session.personas['elena_rostova']?.skepticismScore ?? 75;
    const marcusScore = session.personas['marcus_chen']?.skepticismScore ?? 75;
    const sashaScore = session.personas['sasha_morales']?.skepticismScore ?? 75;

    const fatalFlaws: string[] = [
      `Unhedged distributed cascading failure risks and undefined p99 tail latency fallback boundaries (SRE Severity: High).`,
      `Gross margin decay under customer scaling caused by unoptimized per-unit cloud and API compute expenses.`,
      `Zero-trust perimeter gaps creating critical regulatory liabilities and data exfiltration pathways.`,
    ];

    const recommendedPivots: string[] = [
      `Implement asynchronous task decoupling with strict circuit breakers and client-side graceful degradation.`,
      `Restructure pricing to incorporate consumption-based tiering that locks in positive gross margins per user.`,
      `Enforce field-level encryption and least-privilege IAM roles prior to production rollout.`,
      `Strip 40% of secondary features from the MVP to eliminate onboarding friction and curb churn.`,
    ];

    const executiveSummary =
      `The board has stress-tested "${title}" through adversarial cross-examination. ` +
      `While the underlying concept demonstrates market ambition, the current operational architecture and commercial assumptions ` +
      `face existential threats from uncontrolled tail latency, fragile unit economics, and unmitigated zero-trust compliance exposures. ` +
      `Executing the recommended architectural decoupling and financial guardrails is mandatory before deploying capital or advancing to production release.`;

    return {
      sessionId: session.sessionId,
      proposalTitle: title,
      survivalScore: baseSurvival,
      fatalFlaws,
      riskMatrix: {
        technicalRisk: Math.round(victorScore),
        financialRisk: Math.round(elenaScore),
        securityRisk: Math.round(marcusScore),
        marketRisk: Math.round(sashaScore),
      },
      recommendedPivots,
      executiveSummary,
      generatedAt: new Date().toISOString(),
    };
  }
}
