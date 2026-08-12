const GOOGLE_IDENTITY_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

let googleIdentityScriptPromise;

export class GoogleSignInError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "GoogleSignInError";
    this.code = code;
  }
}

const getGoogleIdentityClient = () => window.google?.accounts?.id;

export const loadGoogleIdentityServices = () => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return Promise.reject(
      new GoogleSignInError("Google sign-in is unavailable.", "unavailable"),
    );
  }

  const loadedClient = getGoogleIdentityClient();

  if (loadedClient) {
    return Promise.resolve(loadedClient);
  }

  if (googleIdentityScriptPromise) {
    return googleIdentityScriptPromise;
  }

  googleIdentityScriptPromise = new Promise((resolve, reject) => {
    const resolveWhenReady = () => {
      const client = getGoogleIdentityClient();

      if (client) {
        resolve(client);
        return;
      }

      reject(
        new GoogleSignInError(
          "Google sign-in could not be loaded.",
          "script_unavailable",
        ),
      );
    };

    const existingScript = document.querySelector(
      `script[src="${GOOGLE_IDENTITY_SCRIPT_SRC}"]`,
    );

    if (existingScript) {
      existingScript.addEventListener("load", resolveWhenReady, { once: true });
      existingScript.addEventListener(
        "error",
        () => {
          googleIdentityScriptPromise = null;
          reject(
            new GoogleSignInError(
              "Google sign-in could not be loaded.",
              "script_unavailable",
            ),
          );
        },
        { once: true },
      );
      window.setTimeout(resolveWhenReady, 0);
      return;
    }

    const script = document.createElement("script");
    script.src = GOOGLE_IDENTITY_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = resolveWhenReady;
    script.onerror = () => {
      googleIdentityScriptPromise = null;
      reject(
        new GoogleSignInError(
          "Google sign-in could not be loaded.",
          "script_unavailable",
        ),
      );
    };

    document.head.appendChild(script);
  });

  return googleIdentityScriptPromise;
};

export const initializeGoogleIdentity = async ({
  clientId,
  onCredential,
  onError,
}) => {
  if (!clientId) {
    throw new GoogleSignInError(
      "Google sign-in is not configured.",
      "missing_client_id",
    );
  }

  const googleIdentityClient = await loadGoogleIdentityServices();

  googleIdentityClient.initialize({
    client_id: clientId,
    callback: (response) => {
      if (response?.credential) {
        onCredential(response.credential);
        return;
      }

      onError?.(
        new GoogleSignInError(
          "Google sign-in did not return a credential.",
          "missing_credential",
        ),
      );
    },
    use_fedcm_for_button: true,
  });

  return googleIdentityClient;
};

export const renderGoogleSignInButton = (googleIdentityClient, element, text) => {
  googleIdentityClient.renderButton(element, {
    theme: "outline",
    size: "large",
    shape: "pill",
    width: Math.max(Math.floor(element.clientWidth || 320), 240),
    text,
    logo_alignment: "left",
  });
};
