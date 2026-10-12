export class CounterProposalService {
  public static generateAmendment(personaId: string): string {
    switch (personaId) {
      case 'victor_vance':
        return 'Mandate automated canary gating and 10% max load shedding before multi-region promotion.';
      case 'elena_rostova':
        return 'Cap maximum monthly cloud GPU spend at $12,000 until first enterprise customer signs.';
      case 'marcus_chen':
        return 'Require field-level customer data encryption with automated SOC 2 audit logging.';
      case 'sasha_morales':
        return 'Remove 3 configuration steps from onboarding flow to prioritize time-to-first-value.';
      default:
        return 'Incorporate progressive milestone reviews prior to production rollout.';
    }
  }
}
