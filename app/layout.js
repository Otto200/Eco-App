"use client";
import { useEffect } from "react";

export function NotificationInitializer() {
  useEffect(() => {
    window.OneSignal = window.OneSignal || [];
    window.OneSignal.push(() => {
      window.OneSignal.init({
        appId: "YOUR_ONESIGNAL_APP_ID_HERE",
        safari_web_id: "YOUR_SAFARI_WEB_ID_IF_ANY",
        notifyButton: { enable: false },
      });
    });
  }, []);

  return null;
}
