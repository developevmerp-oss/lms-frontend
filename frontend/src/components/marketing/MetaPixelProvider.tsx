"use client";

import React, { useEffect, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { API_BASE_URL } from "@/config/api";
import { trackingService, PublicTrackingConfig } from "@/services/trackingService";

function PixelRouteWatcher() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Whenever route or query parameters change in Next.js SPA, fire PageView
    const fullUrl = `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ""}`;
    trackingService.trackPageView(fullUrl);
  }, [pathname, searchParams]);

  return null;
}

export function MetaPixelProvider() {
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    // Fetch safe public tracking configuration from backend
    fetch(`${API_BASE_URL}/marketing-tracking/config`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: PublicTrackingConfig | null) => {
        if (!data || !data.meta) return;

        trackingService.setConfig(data);

        // Only inject script if Meta Pixel is enabled and has a valid ID
        if (data.meta.enabled && data.meta.pixelId) {
          initializeMetaPixelScript(data.meta.pixelId);
          trackingService.trackPageView();
        }
      })
      .catch((err) => {
        // Silently fail: tracking issues must NEVER break application
        console.warn("Marketing tracking config unavailable:", err?.message);
      });
  }, []);

  return (
    <Suspense fallback={null}>
      <PixelRouteWatcher />
    </Suspense>
  );
}

/**
 * Dynamically injects the official Meta Pixel snippet safely without blocking hydration
 */
function initializeMetaPixelScript(pixelId: string) {
  if (typeof window === "undefined") return;

  // Check if already injected
  if (window.__fbq_initialized && window.fbq) {
    window.fbq("init", pixelId);
    return;
  }

  try {
    /* eslint-disable */
    (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      if (s && s.parentNode) {
        s.parentNode.insertBefore(t, s);
      } else {
        b.head.appendChild(t);
      }
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    /* eslint-enable */

    if (window.fbq) {
      window.fbq("init", pixelId);
      window.__fbq_initialized = true;
    }
  } catch (err) {
    // Ignore script injection errors (e.g. adblocker)
  }
}
