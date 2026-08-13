import React, { useState } from 'react';
import { ShieldCheck, Bell, BarChart2, CreditCard, Lock, Check, X } from 'lucide-react';
import { UserProfile } from '../types';
import { translations } from '../utils/i18n';

interface ConsentModalProps {
  user: UserProfile;
  onAccept: (consent: {
    dataConsentAccepted: boolean;
    notificationsEnabled: boolean;
    analyticsConsentAccepted: boolean;
  }) => void;
  onClose?: () => void;
}

export const ConsentModal: React.FC<ConsentModalProps> = ({
  user,
  onAccept,
  onClose,
}) => {
  const lang = user.language || 'pt';
  const t = translations[lang];

  const [dataConsent, setDataConsent] = useState(user.dataConsentAccepted ?? true);
  const [notifications, setNotifications] = useState(user.notificationsEnabled ?? true);
  const [analytics, setAnalytics] = useState(user.analyticsConsentAccepted ?? true);

  const handleConfirm = () => {
    onAccept({
      dataConsentAccepted: dataConsent,
      notificationsEnabled: notifications,
      analyticsConsentAccepted: analytics,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-slate-100 shadow-2xl space-y-5 relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest block">
              {t.consentSubtitle}
            </span>
            <h2 className="text-lg font-black text-white">
              {t.consentTitle}
            </h2>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {t.consentDesc}
        </p>

        {/* Toggles */}
        <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
          
          {/* Item 1: Payment & Transaction Data */}
          <label className="flex items-start justify-between gap-3 cursor-pointer group">
            <div className="flex items-start gap-2.5">
              <CreditCard className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-white block">{t.consentPayment}</span>
                <span className="text-[10px] text-slate-400 block leading-tight">
                  {t.consentPaymentDesc}
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={dataConsent}
              onChange={(e) => setDataConsent(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-slate-700 text-teal-500 focus:ring-teal-500 bg-slate-900"
            />
          </label>

          <hr className="border-slate-800" />

          {/* Item 2: Notifications */}
          <label className="flex items-start justify-between gap-3 cursor-pointer group">
            <div className="flex items-start gap-2.5">
              <Bell className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-white block">{t.consentNotif}</span>
                <span className="text-[10px] text-slate-400 block leading-tight">
                  {t.consentNotifDesc}
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-slate-700 text-teal-500 focus:ring-teal-500 bg-slate-900"
            />
          </label>

          <hr className="border-slate-800" />

          {/* Item 3: GA4 Analytics */}
          <label className="flex items-start justify-between gap-3 cursor-pointer group">
            <div className="flex items-start gap-2.5">
              <BarChart2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-white block">{t.consentAnalytics}</span>
                <span className="text-[10px] text-slate-400 block leading-tight">
                  {t.consentAnalyticsDesc}
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-slate-700 text-teal-500 focus:ring-teal-500 bg-slate-900"
            />
          </label>

        </div>

        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={handleConfirm}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:brightness-110 text-slate-950 font-black text-xs shadow-lg shadow-teal-500/20 transition flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{t.confirmAndContinue}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
