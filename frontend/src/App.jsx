import { useUser } from './hooks/useUser';
import { LoginPage } from './pages/LoginPage';
import { LoadoutPage } from './pages/LoadoutPage';
import { useTranslation } from './hooks/useTranslation';

export default function App() {
  const { user, loading } = useUser();
  const { t } = useTranslation();

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-muted font-display text-lg">{t('common.loading')}</p>
      </main>
    );
  }

  return user ? <LoadoutPage user={user} /> : <LoginPage />;
}
