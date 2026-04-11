import { LogOut, Search } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { CONFIG } from '../../config';
import { logout } from '../../lib/api';
import { LanguageSwitch } from './LanguageSwitch';
import { TeamHighlightSwitch } from './TeamHighlight';
import { Input } from '../ui/Input';

export function Header({ user, search, onSearchChange }) {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-40 h-[60px] bg-bg/80 backdrop-blur-md border-b border-subtle">
      <div className="h-full max-w-[1600px] mx-auto px-6 flex items-center gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 mr-4">
          <div className="w-8 h-8 rounded bg-accent/20 border border-accent/40 flex items-center justify-center">
            <span className="font-display font-bold text-accent text-sm">CS</span>
          </div>
          <span className="font-display font-bold text-lg tracking-tight hidden md:inline">
            {CONFIG.serverName}
          </span>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('header.search_placeholder')}
            className="pl-9 h-9 text-sm"
            aria-label={t('header.search_placeholder')}
          />
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <TeamHighlightSwitch />
          <LanguageSwitch />

          {user && (
            <>
              <a
                href={user.profileurl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:bg-surface rounded-md px-2 py-1 transition-colors"
              >
                <img
                  src={user.avatar}
                  alt="avatar"
                  width={28}
                  height={28}
                  className="rounded-full border border-subtle"
                />
                <span className="text-sm font-medium hidden md:inline">{user.personaname}</span>
              </a>
              <button
                type="button"
                onClick={logout}
                className="h-9 w-9 flex items-center justify-center rounded-md text-muted hover:text-danger hover:bg-danger/10 transition-colors"
                aria-label={t('header.logout')}
              >
                <LogOut size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
