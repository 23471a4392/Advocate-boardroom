export class DefenseHintsEngine {
  public static getHints(highestSkepticId: string): string[] {
    switch (highestSkepticId) {
      case 'victor_vance':
        return ['Cite chaos engineering test results', 'Detail circuit breaker timeouts', 'Specify p99 latency bounds under load'];
      case 'elena_rostova':
        return ['Quantify CAC payback period', 'Demonstrate positive unit gross margin', 'Set hard cloud compute spending limits'];
      case 'marcus_chen':
        return ['Reference SOC 2 Type II controls', 'Document field-level encryption', 'Explain least-privilege IAM scoping'];
      case 'sasha_morales':
        return ['Present user onboarding completion rates', 'Demonstrate 30-day cohort retention', 'Show reduced configuration steps'];
      default:
        return ['Provide quantitative metrics rather than assertions'];
    }
  }
}
