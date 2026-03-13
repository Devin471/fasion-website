let googleScriptPromise;
const GOOGLE_CLIENT_ID_STORAGE_KEY = 'googleClientId';

function isValidClientId(value) {
  return Boolean(value && value.includes('.apps.googleusercontent.com') && !value.includes('YOUR_GOOGLE_CLIENT_ID'));
}

function resolveGoogleClientId() {
  const envClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID?.trim();
  if (isValidClientId(envClientId)) return envClientId;

  const storedClientId = localStorage.getItem(GOOGLE_CLIENT_ID_STORAGE_KEY)?.trim();
  if (isValidClientId(storedClientId)) return storedClientId;

  const entered = window.prompt('Enter your Google OAuth Client ID (ends with .apps.googleusercontent.com)');
  const enteredClientId = entered?.trim();
  if (!isValidClientId(enteredClientId)) {
    throw new Error('Google login needs a valid Google OAuth Client ID.');
  }

  localStorage.setItem(GOOGLE_CLIENT_ID_STORAGE_KEY, enteredClientId);
  return enteredClientId;
}

function loadGoogleScript() {
  if (window.google?.accounts?.oauth2) return Promise.resolve();
  if (googleScriptPromise) return googleScriptPromise;

  googleScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-google-gsi="true"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Failed to load Google script')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.dataset.googleGsi = 'true';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google script'));
    document.head.appendChild(script);
  });

  return googleScriptPromise;
}

export async function getGoogleAccessToken() {
  const clientId = resolveGoogleClientId();

  await loadGoogleScript();

  return new Promise((resolve, reject) => {
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'openid email profile',
      callback: (response) => {
        if (response?.access_token) resolve(response.access_token);
        else reject(new Error('Google sign-in failed'));
      },
      error_callback: () => reject(new Error('Google popup was closed or blocked'))
    });

    tokenClient.requestAccessToken({ prompt: 'select_account' });
  });
}
