"use client";

import { useEffect, useRef, useCallback } from "react";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: string;
              size?: string;
              theme?: string;
              width?: number;
            }
          ) => void;
          prompt: () => void;
        };
      };
    };
  }
}

/**
 * Hook that loads the Google Identity Services script and exposes
 * a `triggerGoogleSignIn` function for custom-styled buttons.
 *
 * When the user completes Google sign-in, `onCredential` is called
 * with the Google ID token string.
 */
export function useGoogleSignIn(onCredential: (credential: string) => void) {
  const hiddenBtnRef = useRef<HTMLDivElement | null>(null);
  const callbackRef = useRef(onCredential);
  callbackRef.current = onCredential;

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    // Create hidden container for Google's button
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.top = "-9999px";
    container.style.left = "-9999px";
    container.style.opacity = "0";
    container.style.pointerEvents = "none";
    document.body.appendChild(container);
    hiddenBtnRef.current = container;

    function initializeGoogle() {
      if (!window.google?.accounts?.id) return;

      window.google.accounts.id.initialize({
        client_id: clientId!,
        callback: (response: { credential: string }) => {
          callbackRef.current(response.credential);
        },
        auto_select: false,
      });

      window.google.accounts.id.renderButton(container, {
        type: "standard",
        size: "large",
        theme: "outline",
        width: 300,
      });
    }

    // Load GSI script if not already loaded
    if (window.google?.accounts?.id) {
      initializeGoogle();
    } else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogle;
      document.head.appendChild(script);
    }

    return () => {
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    };
  }, []);

  const triggerGoogleSignIn = useCallback(() => {
    const container = hiddenBtnRef.current;
    if (!container) return;

    // Find and click the actual Google button inside the hidden container
    const googleBtn =
      container.querySelector<HTMLElement>('[role="button"]') ||
      container.querySelector<HTMLElement>("div[style]") ||
      container.querySelector<HTMLElement>("iframe");

    if (googleBtn) {
      googleBtn.click();
    } else {
      // Fallback: try the One Tap prompt
      window.google?.accounts?.id?.prompt();
    }
  }, []);

  return { triggerGoogleSignIn };
}
