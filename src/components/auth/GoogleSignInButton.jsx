import { useEffect, useRef } from "react";
import {
  GoogleSignInError,
  initializeGoogleIdentity,
  renderGoogleSignInButton,
} from "../../services/googleIdentityService";

const GOOGLE_BUTTON_TEXT = {
  login: "continue_with",
  register: "signup_with",
};

const GoogleSignInButton = ({
  clientId,
  mode = "login",
  disabled = false,
  onCredential,
  onError,
}) => {
  const buttonRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    let resizeObserver;

    const setupGoogleButton = async () => {
      if (!buttonRef.current || disabled) {
        return;
      }

      try {
        const googleIdentityClient = await initializeGoogleIdentity({
          clientId,
          onCredential: (credential) => {
            if (isMounted) {
              onCredential(credential);
            }
          },
          onError: (error) => {
            if (isMounted) {
              onError?.(error);
            }
          },
        });

        if (!isMounted || !buttonRef.current) {
          return;
        }

        const render = () => {
          if (!buttonRef.current) return;
          buttonRef.current.innerHTML = "";
          renderGoogleSignInButton(
            googleIdentityClient,
            buttonRef.current,
            GOOGLE_BUTTON_TEXT[mode] || GOOGLE_BUTTON_TEXT.login,
          );
        };

        render();

        if (typeof ResizeObserver !== "undefined") {
          resizeObserver = new ResizeObserver(() => {
            render();
          });
          resizeObserver.observe(buttonRef.current);
        }
      } catch (error) {
        if (isMounted) {
          onError?.(
            error instanceof GoogleSignInError
              ? error
              : new GoogleSignInError(
                  "Google sign-in could not be started.",
                  "unavailable",
                ),
          );
        }
      }
    };

    setupGoogleButton();

    return () => {
      isMounted = false;
      resizeObserver?.disconnect();
    };
  }, [clientId, disabled, mode, onCredential, onError]);

  return (
    <div className={disabled ? "google-signin-wrapper is-disabled" : "google-signin-wrapper"}>
      <div ref={buttonRef} className="google-signin-button-slot" />
      {disabled ? <div className="google-signin-overlay" aria-hidden="true" /> : null}
    </div>
  );
};

export default GoogleSignInButton;
