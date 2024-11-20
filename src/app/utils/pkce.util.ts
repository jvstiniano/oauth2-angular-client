export class PKCEUtil {
    static async generateCodeChallenge(): Promise<{
      codeVerifier: string;
      codeChallenge: string;
    }> {
      const codeVerifier = this.generateCodeVerifier();
      const codeChallenge = await this.generateCodeChallengeFromVerifier(codeVerifier);
      
      return { codeVerifier, codeChallenge };
    }
  
    private static generateCodeVerifier(): string {
      const array = new Uint8Array(32);
      crypto.getRandomValues(array);
      return this.base64URLEncode(array);
    }
  
    private static async generateCodeChallengeFromVerifier(verifier: string): Promise<string> {
      const encoder = new TextEncoder();
      const data = encoder.encode(verifier);
      const hash = await crypto.subtle.digest('SHA-256', data);
      return this.base64URLEncode(new Uint8Array(hash));
    }
  
    private static base64URLEncode(buffer: Uint8Array): string {
      return btoa(String.fromCharCode(...buffer))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    }
  }