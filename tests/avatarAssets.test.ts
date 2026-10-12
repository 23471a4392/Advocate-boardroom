import { describe, it, expect } from 'vitest';
import { AvatarProvider } from '../src/services/personas/avatarProvider';

describe('Local Vector Avatar Provider', () => {
  it('should generate valid SVG string representation', () => {
    const svg = AvatarProvider.getSvgAvatar('SRE');
    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
  });
});
