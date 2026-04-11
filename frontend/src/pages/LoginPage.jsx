import { useState } from 'react';
import { Shield, ExternalLink } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { CONFIG } from '../config';
import { loginWithSteam } from '../lib/api';
import { Button } from '../components/ui/Button';
import { LoginCodeForm } from '../components/auth/LoginCodeForm';

export function LoginPage() {
  const { t } = useTranslation();
  const [showSecurity, setShowSecurity] = useState(false);
  const [showCodeForm, setShowCodeForm] = useState(false);

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-elevated border border-subtle rounded-xl shadow-elevated p-8 text-center">
        <div className="w-16 h-16 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center mx-auto mb-6">
          <span className="font-display font-bold text-accent text-2xl">CS</span>
        </div>
        <h1 className="font-display font-bold text-3xl tracking-tight mb-2">
          {CONFIG.serverName}
        </h1>
        <p className="text-sm text-muted mb-8">{t('login.subtitle')}</p>

        {showCodeForm ? (
          <LoginCodeForm onBack={() => setShowCodeForm(false)} />
        ) : (
          <>
            <Button variant="primary" size="lg" onClick={loginWithSteam} className="w-full">
              {t('login.button')}
            </Button>

            <button
              type="button"
              onClick={() => setShowCodeForm(true)}
              className="mt-3 inline-flex items-center justify-center w-full text-xs text-muted hover:text-fg transition-colors"
            >
              {t('login.code_toggle')}
            </button>

            {(CONFIG.serverUrl || CONFIG.discordUrl) && (
              <div className="flex justify-center gap-4 mt-6">
                {CONFIG.serverUrl && (
                  <a
                    href={CONFIG.serverUrl}
                    className="inline-flex items-center gap-1.5 text-xs text-accent2 hover:underline"
                  >
                    <ExternalLink size={12} />
                    Connect to server
                  </a>
                )}
                {CONFIG.discordUrl && (
                  <a
                    href={CONFIG.discordUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-accent2 hover:underline"
                  >
                    <ExternalLink size={12} />
                    Discord
                  </a>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowSecurity(true)}
              className="mt-6 inline-flex items-center gap-1.5 text-xs text-faint hover:text-muted"
            >
              <Shield size={12} />
              {t('login.security_info')}
            </button>
          </>
        )}
      </div>

      {showSecurity && (
        <div className="fixed inset-0 bg-bg/80 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => setShowSecurity(false)}>
          <div className="max-w-md bg-elevated border border-subtle rounded-xl p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display font-bold text-lg mb-4">{t('login.security_title')}</h3>
            <ul className="space-y-2 text-xs text-muted mb-6 list-disc list-inside">
              <li>{t('login.security_list.1')}</li>
              <li>{t('login.security_list.2')}</li>
              <li>{t('login.security_list.3')}</li>
              <li>{t('login.security_list.4')}</li>
              <li>{t('login.security_list.5')}</li>
            </ul>
            <Button variant="secondary" size="md" className="w-full" onClick={() => setShowSecurity(false)}>
              {t('login.security_close')}
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}
