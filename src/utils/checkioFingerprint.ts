// Lightweight helper to embed Checkio device script and capture sessionId
// Uses the documented pattern and stores sessionId in sessionStorage

const SESSION_KEY = 'checkio_session_id';

export const getCheckioSessionId = (): string | null => {
  return sessionStorage.getItem(SESSION_KEY);
};

export const clearCheckioSessionId = (): void => {
  sessionStorage.removeItem(SESSION_KEY);
};

export const ensureCheckioScript = (maxWaitMs = 8000): Promise<string> => {
  return new Promise((resolve, reject) => {
    // If we already have a session, return it
    const existing = getCheckioSessionId();
    if (existing) return resolve(existing);

    // Prevent double injection
    const alreadyInjected = document.querySelector('script[data-checkio="true"]')
      || document.querySelector('script[src*="api.checkio.co.uk/v1/fingerprints/device"]');

    // Setup global callback per docs
    (window as any).checkio = {
      deviceFingerprint: (params: { sessionId: string }) => {
        try {
          if (params?.sessionId) {
            sessionStorage.setItem(SESSION_KEY, params.sessionId);
            resolve(params.sessionId);
          } else {
            reject(new Error('No sessionId received from Checkio'));
          }
        } catch (e) {
          reject(e as Error);
        }
      },
    };

    const inject = () => {
      const loader = document.createElement('script');
      loader.type = 'text/javascript';
      loader.setAttribute('data-checkio', 'true');
      loader.text = `!(function (w,d,s){s=d.createElement("script");s.src="https://api.checkio.co.uk/v1/fingerprints/device";s.async=true;d.head.appendChild(s);})(window, document);`;
      document.head.appendChild(loader);
    };

    if (!alreadyInjected) inject();

    const timeout = setTimeout(() => {
      reject(new Error('Timed out waiting for Checkio sessionId'));
    }, maxWaitMs);

    // Also resolve if sessionId appears via other means
    const poll = setInterval(() => {
      const sid = getCheckioSessionId();
      if (sid) {
        clearInterval(poll);
        clearTimeout(timeout);
        resolve(sid);
      }
    }, 250);
  });
};


