
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
    if (typeof window === 'undefined' || !('Notification' in window)) return false;
    
    if (Notification.permission === 'granted') return true;
    
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }, []);

  const sendLocalNotification = useCallback((titleKey: any, bodyKey: any) => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    
    if (Notification.permission === 'granted') {
      new Notification(t(titleKey), {
        body: t(bodyKey),
        icon: '/favicon.svg',
      });
    }
  }, [t]);

  /**
   * Specifically check if the user has missed today's pain mantra
   * and send a reminder if so.
   */
  const checkAndNotifyPainMantraReminder = useCallback(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;

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
    if (user && firestore && Notification.permission === 'granted') {
      // Logic to store token would go here if Messaging SDK was fully configured with a VAPID key
    }
  }, [user, firestore]);

  return { requestPermission, sendLocalNotification, checkAndNotifyPainMantraReminder };
}
