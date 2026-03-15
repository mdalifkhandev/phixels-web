const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api.phixels.agency/api/v1";

interface AnalyticsEvent {
  eventType: string;
  pagePath: string;
  sessionId: string;
  deviceType: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  metadata?: Record<string, any>;
}

const getSessionId = () => {
  let sessionId = localStorage.getItem('phixels_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('phixels_session_id', sessionId);
  }
  return sessionId;
};

const getDeviceType = () => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "tablet";
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return "mobile";
  }
  return "desktop";
};

export const trackEvent = async (eventType: string, metadata?: Record<string, any>) => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const event: AnalyticsEvent = {
      eventType,
      pagePath: window.location.pathname,
      sessionId: getSessionId(),
      deviceType: getDeviceType(),
      referrer: document.referrer || undefined,
      utmSource: urlParams.get('utm_source') || undefined,
      utmMedium: urlParams.get('utm_medium') || undefined,
      utmCampaign: urlParams.get('utm_campaign') || undefined,
      metadata
    };

    await fetch(`${BASE_URL}/analytics/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });
  } catch (error) {
    console.error('Failed to send analytics event:', error);
  }
};

export const startHeartbeat = () => {
  // Track initial page view
  trackEvent('page_view');

  // Send heartbeat every 30 seconds to keep session active
  const interval = setInterval(() => {
    trackEvent('heartbeat');
  }, 30000);

  return () => clearInterval(interval);
};
