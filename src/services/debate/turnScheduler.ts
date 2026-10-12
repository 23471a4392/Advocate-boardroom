export class TurnScheduler {
  public static scheduleRoundOne(personaIds: string[]): string[] {
    return [...personaIds];
  }

  public static scheduleCrossfirePairs(): Array<{ speaker: string; target: string }> {
    return [
      { speaker: 'elena_rostova', target: 'marcus_chen' },
      { speaker: 'victor_vance', target: 'sasha_morales' },
      { speaker: 'marcus_chen', target: 'elena_rostova' },
      { speaker: 'sasha_morales', target: 'victor_vance' },
    ];
  }
}
