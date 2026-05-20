
'use client';

import { useEffect, useCallback } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useLanguage } from '@/context/language-context';
import { isToday } from 'date-fns';

export function useNotifications() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { t } = useLanguage();

  const requestPermission = useCallback(async () => {
    if (typeof window === 'undefined') return false;
    
    // Check for native Capacitor context first
    const isCapacitor = (window as any).Capacitor !== undefined;
    if (isCapacitor) {
        // Native notification permissions are handled via Capacitor plugins
        // For now, we return true to allow the UI to proceed
        return true;
    }

    if (!('Notification' in window)) return false;
    
    try {
      if (Notification.permission === 'granted') return true;
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (e) {
      console.warn("Notification permission request failed:", e);
      return false;
    }
  }, []);

  const sendLocalNotification = useCallback((titleKey: any, bodyKey: any) => {
    if (typeof window === 'undefined') return;
    
    const isCapacitor = (window as any).Capacitor !== undefined;
    
    // Web Notification implementation
    if (!isCapacitor && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(t(titleKey), {
          body: t(bodyKey),
          icon: '/favicon.svg',
        });
      } catch (e) {
        console.warn("Standard Notification constructor failed. This is expected on most mobile browsers:", e);
      }
    }
    
    // If in Capacitor, a plugin like @capacitor/local-notifications should be used here
    // For the webview shell, we can fallback to a silent log or standard alert if critical
  }, [t]);

  /**
   * Specifically check if the user has missed today's pain mantra
   * and send a reminder if so.
   */
  const checkAndNotifyPainMantraReminder = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const isCapacitor = (window as any).Capacitor !== undefined;
    if (!isCapacitor && Notification.permission !== 'granted') return;

    const lastPlayedStr = localStorage.getItem("painMantraLastPlayed");
    const lastReminderStr = localStorage.getItem("painMantraLastReminder");

    const needsMantra = !lastPlayedStr || !isToday(new Date(lastPlayedStr));
    const alreadyRemindedToday = lastReminderStr && isToday(new Date(lastReminderStr));

    if (needsMantra && !alreadyRemindedToday) {
      sendLocalNotification('notificationPainMantraReminderTitle', 'notificationPainMantraReminderBody');
      localStorage.setItem("painMantraLastReminder", new Date().toISOString());
    }
  }, [sendLocalNotification]);

  // Scaffolding for real push tokens (FCM)
  useEffect(() => {
    if (user && firestore && typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      // Logic to store token would go here if Messaging SDK was fully configured
    }
  }, [user, firestore]);

  return { requestPermission, sendLocalNotification, checkAndNotifyPainMantraReminder };
}
