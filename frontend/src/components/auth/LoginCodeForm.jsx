import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { loginWithCode } from '../../lib/api';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export function LoginCodeForm({ onBack }) {
  const { t } = useTranslation();
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const normalized = code.trim().toUpperCase();
    if (!/^[A-Z0-9]{6}$/.test(normalized)) {
      setError(t('login.code_error_invalid'));
      return;
    }

    setIsSubmitting(true);
    try {
      await loginWithCode(normalized);
      // Success — reload to let useUser pick up the new session.
      window.location.reload();
    } catch (err) {
      // Map server error strings to localized messages.
      const msg = err.message || '';
      if (msg.includes('not found')) setError(t('login.code_error_not_found'));
      else if (msg.includes('expired')) setError(t('login.code_error_expired'));
      else if (msg.includes('already used')) setError(t('login.code_error_used'));
      else setError(t('login.code_error_invalid'));
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-fg transition-colors"
      >
        <ArrowLeft size={14} />
        {t('login.code_back')}
      </button>

      <div className="text-left">
        <h2 className="font-display font-bold text-xl mb-1">{t('login.code_title')}</h2>
        <p className="text-xs text-faint">{t('login.code_help')}</p>
      </div>

      <Input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 6))}
        placeholder={t('login.code_placeholder')}
        maxLength={6}
        autoFocus
        className="font-mono text-center text-lg tracking-[0.5em] tabular"
        aria-label={t('login.code_title')}
      />

      {error && (
        <p className="text-xs text-danger text-left">{error}</p>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        disabled={isSubmitting || code.length !== 6}
      >
        {t('login.code_submit')}
      </Button>
    </form>
  );
}
