/**
 * Centralized Marketing & Conversion Tracking Service
 * Safely controls and fires Meta/Facebook Pixel events based on dynamic database configuration.
 * Fully decoupled and resilient: tracking issues will never break application functionality.
 */

export interface MetaTrackingEvents {
  pageView: boolean;
  viewContent: boolean;
  lead: boolean;
  registration: boolean;
  contact: boolean;
  booking: boolean;
  checkout: boolean;
  purchase: boolean;
}

export interface PublicTrackingConfig {
  meta: {
    enabled: boolean;
    pixelId: string;
    events: MetaTrackingEvents;
  };
}

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
    __fbq_initialized?: boolean;
    __fbq_last_pageview?: string;
  }
}

class TrackingService {
  private config: PublicTrackingConfig = {
    meta: {
      enabled: true,
      pixelId: "1765233411475851",
      events: {
        pageView: true,
        viewContent: true,
        lead: true,
        registration: true,
        contact: true,
        booking: true,
        checkout: true,
        purchase: true,
      },
    },
  };

  private initialized = false;

  /**
   * Update internal configuration loaded from public API
   */
  public setConfig(newConfig: PublicTrackingConfig) {
    if (newConfig && newConfig.meta) {
      this.config = {
        meta: {
          enabled: Boolean(newConfig.meta.enabled),
          pixelId: (newConfig.meta.pixelId || "").trim(),
          events: {
            pageView: newConfig.meta.events?.pageView !== false,
            viewContent: newConfig.meta.events?.viewContent !== false,
            lead: newConfig.meta.events?.lead !== false,
            registration: newConfig.meta.events?.registration !== false,
            contact: newConfig.meta.events?.contact !== false,
            booking: newConfig.meta.events?.booking !== false,
            checkout: newConfig.meta.events?.checkout !== false,
            purchase: newConfig.meta.events?.purchase !== false,
          },
        },
      };
      this.initialized = true;
    }
  }

  public getConfig(): PublicTrackingConfig {
    return this.config;
  }

  public isMetaEnabled(): boolean {
    return Boolean(this.config.meta.enabled && this.config.meta.pixelId);
  }

  /**
   * Helper to execute fbq safely with event check
   */
  private fireMetaEvent(eventName: string, eventFlag: keyof MetaTrackingEvents, data?: Record<string, any>) {
    try {
      if (!this.isMetaEnabled()) return;
      if (!this.config.meta.events[eventFlag]) return;

      if (typeof window !== "undefined" && typeof window.fbq === "function") {
        if (data && Object.keys(data).length > 0) {
          window.fbq("track", eventName, data);
        } else {
          window.fbq("track", eventName);
        }
      }
    } catch (err) {
      // Fail silently to never impact user experience
    }
  }

  /**
   * Track PageView on initial load or SPA route transition
   */
  public trackPageView(url?: string, title?: string) {
    try {
      if (!this.isMetaEnabled()) return;
      if (!this.config.meta.events.pageView) return;

      const currentPath = url || (typeof window !== "undefined" ? window.location.pathname + window.location.search : "");
      
      // Avoid duplicate instantaneous PageViews for the exact same URL
      if (typeof window !== "undefined" && window.__fbq_last_pageview === currentPath) {
        return;
      }
      if (typeof window !== "undefined") {
        window.__fbq_last_pageview = currentPath;
      }

      this.fireMetaEvent("PageView", "pageView", {
        page_path: currentPath,
        page_title: title || (typeof document !== "undefined" ? document.title : ""),
      });
    } catch (_) {}
  }

  /**
   * Track ViewContent (e.g. Viewing course details, curriculum, subscription tiers)
   */
  public trackViewContent(data: {
    id?: string;
    name?: string;
    category?: string;
    value?: number;
    currency?: string;
  }) {
    this.fireMetaEvent("ViewContent", "viewContent", {
      content_ids: data.id ? [data.id] : undefined,
      content_name: data.name,
      content_category: data.category || "Online Course",
      value: data.value,
      currency: data.currency || "INR",
    });
  }

  /**
   * Track Lead (e.g. Free webinar signup, inquiries, consultation bookings)
   */
  public trackLead(data?: { source?: string; value?: number; currency?: string }) {
    this.fireMetaEvent("Lead", "lead", {
      content_name: data?.source || "Lead Form",
      value: data?.value,
      currency: data?.currency || "INR",
    });
  }

  /**
   * Track CompleteRegistration (e.g. New student account created)
   */
  public trackRegistration(data?: { method?: string }) {
    this.fireMetaEvent("CompleteRegistration", "registration", {
      status: "completed",
      registration_method: data?.method || "email",
    });
  }

  /**
   * Track Contact / Form submission
   */
  public trackContact(data?: { form?: string }) {
    this.fireMetaEvent("Contact", "contact", {
      content_name: data?.form || "Contact Form",
    });
  }

  /**
   * Track Booking (e.g. Masterclass or 1-on-1 session booked)
   */
  public trackBooking(data?: { service?: string; date?: string; value?: number; currency?: string }) {
    this.fireMetaEvent("Schedule", "booking", {
      content_name: data?.service || "Masterclass Booking",
      scheduled_date: data?.date,
      value: data?.value,
      currency: data?.currency || "INR",
    });
  }

  /**
   * Track InitiateCheckout (e.g. Opened Tier or Course checkout modal)
   */
  public trackInitiateCheckout(data: {
    id?: string;
    name?: string;
    value: number;
    currency?: string;
  }) {
    this.fireMetaEvent("InitiateCheckout", "checkout", {
      content_ids: data.id ? [data.id] : undefined,
      content_name: data.name,
      value: data.value,
      currency: data.currency || "INR",
    });
  }

  /**
   * Track Purchase / Successful Conversion
   * ONLY fired after successful payment confirmation from Razorpay!
   */
  public trackPurchase(data: {
    transactionId?: string;
    value: number;
    currency?: string;
    items?: any[];
  }) {
    this.fireMetaEvent("Purchase", "purchase", {
      order_id: data.transactionId,
      value: data.value,
      currency: data.currency || "INR",
      num_items: data.items ? data.items.length : 1,
    });
  }
}

export const trackingService = new TrackingService();
