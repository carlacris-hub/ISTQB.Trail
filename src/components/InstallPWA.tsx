import React, { useState, useEffect } from 'react';
import { Download, Share, X } from 'lucide-react';

export default function InstallPWA() {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if it's already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true) {
      setIsStandalone(true);
      return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    if (isIosDevice) {
      // iOS doesn't support beforeinstallprompt, we just show the tooltip manually if we want
      const hasDismissed = localStorage.getItem('pwa_prompt_dismissed');
      if (!hasDismissed) {
        setShowPrompt(true);
      }
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setSupportsPWA(true);
      setPromptInstall(e);
      
      const hasDismissed = localStorage.getItem('pwa_prompt_dismissed');
      if (!hasDismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const onClick = (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    if (!promptInstall) return;
    promptInstall.prompt();
    promptInstall.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === 'accepted') {
        setShowPrompt(false);
      }
    });
  };

  const dismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  if (isStandalone) {
    return null; // Already installed
  }

  if (!showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 md:bottom-6 md:left-auto md:right-6 md:w-96 bg-slate-800 border border-slate-700 p-4 rounded-xl shadow-2xl z-50 flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-white font-bold text-sm">Instalar o App</h3>
          <p className="text-slate-400 text-xs mt-1">
            Instale o ISTQB Trail na sua tela inicial para estudar offline, em tela cheia e sem distrações.
          </p>
        </div>
        <button onClick={dismiss} className="text-slate-400 hover:text-white p-1">
          <X className="w-4 h-4" />
        </button>
      </div>

      {isIOS ? (
        <div className="bg-slate-900 rounded-lg p-3 text-xs text-slate-300 flex items-center gap-2">
          <span>Para instalar no iOS: toque em </span>
          <Share className="w-4 h-4 text-blue-400 inline mx-1" />
          <span><b>Compartilhar</b> e depois <b>Adicionar à Tela de Início</b>.</span>
        </div>
      ) : supportsPWA ? (
        <button
          onClick={onClick}
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Download className="w-4 h-4" />
          Adicionar à Tela Inicial
        </button>
      ) : (
        <div className="text-xs text-slate-500">
          A instalação não está disponível no seu navegador atual. Acesse pelo Chrome ou Safari.
        </div>
      )}
    </div>
  );
}
