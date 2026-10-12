export class AvatarProvider {
  public static getSvgAvatar(role: string): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#1e293b"/><text x="12" y="16" font-size="12" text-anchor="middle" fill="#f87171">${role[0]}</text></svg>`;
  }
}
