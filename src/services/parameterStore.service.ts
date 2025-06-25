export async function getparametersFromAWS(keys: string[]): Promise<Record<string, string>> {
    const fakeSecrets: Record<string, string> = {
      'dev-heroes-backend-client': 'mock-secret-123',
      'dev-kc-url': 'http://localhost:8080',
    };
  
    const result: Record<string, string> = {};
    for (const key of keys) {
      result[key] = fakeSecrets[key];
    }
    return result;
  }
  