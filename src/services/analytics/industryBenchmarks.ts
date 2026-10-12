export const INDUSTRY_BENCHMARKS = {
  fintech: { technical: 65, financial: 70, security: 85, market: 55 },
  devtools: { technical: 75, financial: 60, security: 65, market: 70 },
  healthtech: { technical: 60, financial: 65, security: 90, market: 60 },
};

export class IndustryBenchmarkService {
  public static getBenchmark(industry: 'fintech' | 'devtools' | 'healthtech') {
    return INDUSTRY_BENCHMARKS[industry] || INDUSTRY_BENCHMARKS.devtools;
  }
}
