export class BoardroomSeeder {
  public static generateSampleSession(idx = 1) {
    return {
      sessionId: `sample-session-${idx}`,
      proposalTitle: `Sample Pitch #${idx}`,
      overallTension: 75,
      status: 'concluded',
    };
  }
}
