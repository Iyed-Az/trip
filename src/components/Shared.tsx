import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import {
  BadgeCheck,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  Check,
  ChevronRight,
  Compass,
  Heart,
  House,
  MapPin,
  Menu,
  MessageSquare,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  X,
  Plus,
} from 'lucide-react';
import { agencyById, trips, type Trip } from '../lib/demo-data';

const FAVORITES_KEY = 'tripagency:favorites';
const FAVORITES_EVENT = 'tripagency:favorites-changed';

export function readFavoriteTripIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved: unknown = JSON.parse(window.localStorage.getItem(FAVORITES_KEY) ?? '[]');
    return Array.isArray(saved) ? saved.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

export function useFavoriteTrips() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(readFavoriteTripIds);

  useEffect(() => {
    const sync = () => setFavoriteIds(readFavoriteTripIds());
    window.addEventListener('storage', sync);
    window.addEventListener(FAVORITES_EVENT, sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener(FAVORITES_EVENT, sync);
    };
  }, []);

  const toggleFavorite = (tripId: string) => {
    const current = readFavoriteTripIds();
    const next = current.includes(tripId)
      ? current.filter((id) => id !== tripId)
      : [...current, tripId];
    try {
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
    } catch {
      // Keep the interaction usable for this page even if local storage is unavailable.
    }
    setFavoriteIds(next);
    window.dispatchEvent(new Event(FAVORITES_EVENT));
  };

  return { favoriteIds, toggleFavorite };
}

export function DemoNotice() {
  return (
    <div className="demo-banner px-4 py-2 text-center text-[11px] font-semibold" data-testid="status-demo-notice">
      Mode démonstration <span aria-hidden="true">·</span> Données d’exemple <span aria-hidden="true">·</span> Aucune action n’est transmise ni sauvegardée sur un serveur.
    </div>
  );
}

export function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      className={`brand-mark flex shrink-0 items-center gap-2.5 font-display text-[19px] font-extrabold tracking-tight ${light ? 'text-white' : 'text-[#19375f]'}`}
      data-testid="link-home"
    >
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#e5f3fc] text-[#2679ad]">
        <Compass size={21} aria-hidden="true" />
      </span>
      TripAgency
    </Link>
  );
}

const publicLinks = [
  ['Accueil', '/'],
  ['Explorer', '/explore'],
  ['Agences', '/agences'],
  ['À propos', '/a-propos'],
] as const;

export function PublicHeader({
  menuOpen,
  onMenuToggle,
  onMenuClose,
}: {
  menuOpen: boolean;
  onMenuToggle: () => void;
  onMenuClose: () => void;
}) {
  const [loc, navigate] = useLocation();
  const [query, setQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const search = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate(`/explore?q=${encodeURIComponent(query.trim())}`);
    onMenuClose();
  };

  return (
    <>
      <header className={`public-nav sticky top-0 z-40 flex items-center justify-between gap-4 border-b border-[#edf1f5]/90 bg-white/95 px-4 backdrop-blur-xl transition-all md:px-7 xl:px-10 ${scrolled ? 'is-scrolled' : ''}`}>
        <Brand />
        <nav aria-label="Navigation principale" className="hidden items-center gap-5 lg:flex xl:gap-7">
          {publicLinks.map(([label, path]) => {
            const active = loc === path || (path !== '/' && loc.startsWith(path));
            return (
              <Link
                key={path}
                href={path}
                aria-current={active ? 'page' : undefined}
                className={`nav-link relative py-2 text-sm font-semibold ${active ? 'active' : ''}`}
              >
                {label}
                {active && <span className="absolute inset-x-0 -bottom-[1px] h-0.5 rounded-full bg-[#4d9ec4]" />}
              </Link>
            );
          })}
        </nav>
        <form onSubmit={search} className="header-search hidden max-w-[310px] flex-1 items-center gap-2 rounded-full border border-[#e5ebef] bg-[#f7f9fa] px-3 py-2 xl:flex">
          <Search size={15} className="shrink-0 text-[#7390a4]" aria-hidden="true" />
          <input
            aria-label="Rechercher un voyage ou une destination"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Voyage, destination…"
            className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-[#97a5af]"
          />
          <button className="sr-only">Rechercher</button>
        </form>
        <div className="hidden items-center gap-2 md:flex">
          <Link href="/agency/login" className="rounded-full px-3 py-2 text-xs font-bold text-[#344c69] transition hover:bg-[#f3f7fa]">Connexion agence</Link>
          <Link href="/agency/register" className="btn-primary rounded-full px-4 py-2.5 text-xs font-bold">Devenir une agence</Link>
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <Link href="/explore" aria-label="Explorer les voyages" className="rounded-full bg-[#edf6fb] p-2.5 text-[#246e9b]">
            <Search size={17} aria-hidden="true" />
          </Link>
          <button
            type="button"
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={menuOpen}
            aria-controls="public-mobile-menu"
            onClick={onMenuToggle}
            className="rounded-lg p-2 text-[#19375f]"
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>
      {menuOpen && (
        <div id="public-mobile-menu" className="mobile-drawer absolute inset-x-0 z-50 border-b border-[#e4ebf0] bg-white p-5 shadow-xl md:hidden">
          <form onSubmit={search} className="mb-3 flex items-center gap-2 rounded-xl border border-[#e5ebef] bg-[#f7f9fa] px-3 py-3">
            <Search size={17} className="text-[#7691a5]" aria-hidden="true" />
            <input
              aria-label="Rechercher une destination"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Rechercher un séjour…"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
            />
            <button type="submit" aria-label="Lancer la recherche"><ChevronRight size={17} /></button>
          </form>
          {[...publicLinks, ['Favoris', '/favoris'], ['Espace agence', '/agency/login'], ['Créer un espace agence', '/agency/register']].map(([label, path]) => (
            <Link key={path} href={path} onClick={onMenuClose} className="block border-b border-[#edf1f5] py-3 text-sm font-semibold text-[#354f69]">
              {label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

export function PublicFooter() {
  return (
    <footer className="public-footer mt-16 bg-[#172c4b] px-6 pb-28 pt-12 text-white md:px-12 md:pb-12">
      <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
        <div>
          <Brand light />
          <p className="mt-4 max-w-sm text-sm leading-6 text-[#b7c7d9]">Des voyages choisis avec soin. Découvrez des agences de confiance, sans compte voyageur.</p>
          <p className="mt-4 text-xs text-[#91a8c2]">Version démo · données de démonstration uniquement</p>
        </div>
        <div>
          <p className="mb-4 text-sm font-bold">Découvrir</p>
          <Link href="/explore" className="block py-1.5 text-sm text-[#b7c7d9]">Tous les voyages</Link>
          <Link href="/agences" className="block py-1.5 text-sm text-[#b7c7d9]">Les agences</Link>
          <Link href="/favoris" className="block py-1.5 text-sm text-[#b7c7d9]">Mes favoris locaux</Link>
        </div>
        <div>
          <p className="mb-4 text-sm font-bold">TripAgency</p>
          <Link href="/a-propos" className="block py-1.5 text-sm text-[#b7c7d9]">À propos</Link>
          <Link href="/agency/register" className="block py-1.5 text-sm text-[#b7c7d9]">Devenir agence</Link>
        </div>
        <div>
          <p className="mb-4 text-sm font-bold">Besoin d’aide ?</p>
          <Link href="/contact" className="block py-1.5 text-sm text-[#b7c7d9]">Nous contacter</Link>
          <p className="mt-3 text-xs text-[#91a8c2]">bonjour@tripagency.demo</p>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-5 text-xs text-[#91a8c2]">© 2025 TripAgency · Démonstration d’interface</div>
    </footer>
  );
}

export function PublicLayout({ children }: { children: ReactNode }) {
  const [loc] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { favoriteIds } = useFavoriteTrips();

  useEffect(() => setMenuOpen(false), [loc]);

  return (
    <div className="app-shell">
      <DemoNotice />
      <PublicHeader menuOpen={menuOpen} onMenuToggle={() => setMenuOpen((open) => !open)} onMenuClose={() => setMenuOpen(false)} />
      <main key={loc} className="route-enter">{children}</main>
      <PublicFooter />
      <nav aria-label="Navigation mobile" className="mobile-bottom-nav fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-[#e5ebef] bg-white/95 px-2 pb-[max(.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur md:hidden">
        {[
          [House, 'Accueil', '/'],
          [Search, 'Explorer', '/explore'],
          [BriefcaseBusiness, 'Agences', '/agences'],
          [Heart, 'Favoris', '/favoris'],
        ].map(([Icon, label, path]) => {
          const Component = Icon as typeof House;
          const active = loc === path || (path !== '/' && loc.startsWith(path as string));
          return (
            <Link key={path as string} href={path as string} aria-current={active ? 'page' : undefined} className={`relative flex min-h-12 flex-col items-center justify-center gap-1 text-[10px] font-semibold ${active ? 'text-[#247da8]' : 'text-[#718297]'}`}>
              <Component size={18} aria-hidden="true" />
              {label as string}
              {path === '/favoris' && favoriteIds.length > 0 && <span className="absolute right-[calc(50%-18px)] top-0 grid h-4 min-w-4 place-items-center rounded-full bg-[#1e4b75] px-1 text-[9px] font-bold text-white">{favoriteIds.length}</span>}
            </Link>
          );
        })}
        <button type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} className={`flex min-h-12 flex-col items-center justify-center gap-1 text-[10px] font-semibold ${menuOpen ? 'text-[#247da8]' : 'text-[#718297]'}`}>
          <Menu size={18} aria-hidden="true" />Menu
        </button>
      </nav>
    </div>
  );
}

const agencyLinks = [
  ['Vue d’ensemble', '/agency/dashboard', House],
  ['Mes voyages', '/agency/trips', Compass],
  ['Ajouter un voyage', '/agency/trips/new', Plus],
  ['Demandes clients', '/agency/requests', BriefcaseBusiness],
  ['Mon agence', '/agency/profile', BadgeCheck],
  ['Statistiques', '/agency/statistics', ChartNoAxesColumnIncreasing],
  ['Messages', '/agency/messages', MessageSquare],
  ['Notifications', '/agency/notifications', Bell],
  ['Paramètres', '/agency/settings', Settings],
] as const;

export function AgencyLayout({ children, title, subtitle }: { children: ReactNode; title: string; subtitle?: string }) {
  const [loc] = useLocation();
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  useEffect(() => setMobileMoreOpen(false), [loc]);

  return (
    <div className="agency-layout">
      <DemoNotice />
      <div className="flex min-h-[calc(100dvh-34px)]">
        <aside className="agency-sidebar hidden w-[252px] shrink-0 flex-col px-4 py-6 lg:flex">
          <Brand light />
          <div className="mt-9 flex items-center gap-3 rounded-2xl bg-white/[.07] p-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#d9effb] text-sm font-bold text-[#235982]">DT</span>
            <div><div className="text-sm font-bold text-white">Dream Travel</div><div className="text-[11px] text-[#a9bed3]">Démonstration locale</div></div>
          </div>
          <nav aria-label="Navigation agence" className="mt-7 space-y-1">
            {agencyLinks.map(([label, href, Icon]) => {
              const active = loc === href || (href !== '/agency/dashboard' && href !== '/agency/trips/new' && loc.startsWith(href));
              return <Link key={href} href={href} aria-current={active ? 'page' : undefined} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${active ? 'active' : ''}`}><Icon size={17} aria-hidden="true" />{label}</Link>;
            })}
          </nav>
          <div className="mt-auto rounded-2xl border border-white/10 p-4 text-xs leading-5 text-[#b8c9da]">
            Aucun compte n’est connecté. Les actions restent dans cet aperçu local.
            <Link href="/" className="mt-3 block font-bold text-white">← Retour au site</Link>
          </div>
        </aside>
        <div className="min-w-0 flex-1">
          <header className="agency-topbar flex items-center justify-between border-b border-[#e6edf3] bg-white px-5 py-4 md:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <Brand />
              <span className="hidden text-[#99a9ba] md:inline">/</span>
              <span className="hidden truncate text-sm font-semibold text-[#465a71] md:inline">{title}</span>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/agency/notifications" className="inline-flex items-center gap-2 rounded-full border border-[#e2e9f0] px-3 py-2 text-xs font-semibold text-[#53647a]"><Bell size={14} aria-hidden="true" /> Mode démo</Link>
              <span aria-label="Profil Dream Travel, démonstration" className="grid h-9 w-9 place-items-center rounded-full bg-[#dceef8] text-xs font-bold text-[#235982]">DT</span>
            </div>
          </header>
          <main className="mx-auto max-w-[1440px] p-5 pb-28 md:p-8 lg:pb-8">
            <div className="mb-7">
              <p className="eyebrow">ESPACE AGENCE <span aria-hidden="true">·</span> DÉMONSTRATION</p>
              <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-[#19375f]">{title}</h1>
              {subtitle && <p className="mt-2 text-sm leading-6 text-[#708196]">{subtitle}</p>}
            </div>
            {children}
          </main>
          {mobileMoreOpen && (
            <div className="agency-mobile-more fixed inset-x-3 bottom-[82px] z-40 rounded-2xl border border-[#e1e9ef] bg-white p-3 shadow-[0_18px_48px_rgba(21,48,77,.18)] lg:hidden">
              <p className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[.15em] text-[#8192a3]">Autres outils</p>
              <div className="grid grid-cols-2 gap-1">
                {agencyLinks.slice(4).map(([label, href, Icon]) => <Link key={href} href={href} onClick={() => setMobileMoreOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-3 text-xs font-semibold text-[#435a73] hover:bg-[#f1f6f9]"><Icon size={16} aria-hidden="true" />{label}</Link>)}
                <Link href="/" onClick={() => setMobileMoreOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-3 text-xs font-semibold text-[#435a73] hover:bg-[#f1f6f9]"><House size={16} aria-hidden="true" />Retour au site</Link>
              </div>
            </div>
          )}
          <nav aria-label="Navigation agence mobile" className="agency-mobile-nav fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-[#e5ebef] bg-white px-1 pb-[max(.5rem,env(safe-area-inset-bottom))] pt-2 lg:hidden">
            {agencyLinks.slice(0, 4).map(([label, href, Icon]) => {
              const active = loc === href || (href !== '/agency/dashboard' && href !== '/agency/trips/new' && loc.startsWith(href));
              const compactLabel = label.replace('Vue d’ensemble', 'Accueil').replace('Mes voyages', 'Voyages').replace('Demandes clients', 'Demandes').replace('Ajouter un voyage', 'Ajouter');
              return <Link key={href} href={href} aria-current={active ? 'page' : undefined} className={`flex min-h-12 flex-col items-center justify-center gap-1 px-1 text-[9px] font-semibold ${active ? 'text-[#2679ad]' : 'text-[#718297]'}`}><Icon size={17} aria-hidden="true" />{compactLabel}</Link>;
            })}
            <button type="button" onClick={() => setMobileMoreOpen((open) => !open)} aria-expanded={mobileMoreOpen} className={`flex min-h-12 flex-col items-center justify-center gap-1 text-[9px] font-semibold ${mobileMoreOpen ? 'text-[#2679ad]' : 'text-[#718297]'}`}><SlidersHorizontal size={17} aria-hidden="true" />Plus</button>
          </nav>
        </div>
      </div>
    </div>
  );
}

export function TripCard({ trip }: { trip: Trip }) {
  const agency = agencyById(trip.agencyId);
  const { favoriteIds, toggleFavorite } = useFavoriteTrips();
  const isFavorite = favoriteIds.includes(trip.id);

  return (
    <article className="trip-card group overflow-hidden rounded-[20px] border border-[#e7edf2] bg-white" data-testid={`card-trip-${trip.id}`}>
      <div className="relative">
        <Link href={`/voyages/${trip.id}`} aria-label={`Découvrir ${trip.title}`} className="relative block aspect-[1.55] overflow-hidden">
          <img src={trip.mainImage} alt={`${trip.destination}, ${trip.country}`} loading="lazy" className="h-full w-full object-cover" />
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold text-[#31526f]">{trip.type}</span>
          {trip.viewsCount >= 200 && <span className="absolute bottom-3 left-3 rounded-full bg-[#eff6ff]/95 px-3 py-1.5 text-[10px] font-bold text-[#294c79]">Populaire</span>}
          <span className="absolute bottom-3 right-3 rounded-full bg-[#172c4b]/90 px-3 py-1.5 text-xs font-semibold text-white">{trip.durationDays} jours <span aria-hidden="true">·</span> {trip.nights} nuits</span>
        </Link>
        <button
          type="button"
          aria-label={isFavorite ? `Retirer ${trip.title} des favoris locaux` : `Ajouter ${trip.title} aux favoris locaux`}
          aria-pressed={isFavorite}
          onClick={() => toggleFavorite(trip.id)}
          className={`absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full shadow-sm backdrop-blur transition hover:scale-105 ${isFavorite ? 'bg-[#fbecf1] text-[#bd5d78]' : 'bg-white/95 text-[#586f84] hover:text-[#b14f6a]'}`}
        >
          <Heart size={17} className={isFavorite ? 'fill-current' : ''} />
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs text-[#76879a]">{trip.country} <span className="mx-1" aria-hidden="true">·</span>{trip.city}</p>
            <Link href={`/voyages/${trip.id}`} className="mt-1 block font-display text-[17px] font-bold leading-snug text-[#1e3553] hover:text-[#277da5]">{trip.title}</Link>
          </div>
          <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-[#51667e]" aria-label={`${trip.rating} sur 5, ${trip.reviewCount} avis de démonstration`}>
            <Star size={13} className="fill-[#f3b649] text-[#f3b649]" aria-hidden="true" />{trip.rating}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#edf1f5] pt-3">
          {agency ? <Link href={`/agences/${agency.id}`} className="flex min-w-0 items-center gap-2 text-xs text-[#687b90]">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#e8f3f8] text-[10px] font-bold text-[#397aa1]">{agency.logo}</span>
            <span className="truncate">{agency.name}</span>
          </Link> : <span className="text-xs text-[#8291a0]">Agence démo</span>}
          <p className="shrink-0 text-right text-[10px] text-[#7c8b9c]">à partir de <strong className="block text-[16px] text-[#1c385d]">{trip.price.toLocaleString('fr-FR')} {trip.currency}</strong></p>
        </div>
        <p className="mt-2 text-[10px] text-[#91a0ac]">{trip.reviewCount} avis de démonstration</p>
      </div>
    </article>
  );
}

export function AgencyCard({ id }: { id: string }) {
  const agency = agencyById(id);
  if (!agency) return null;
  const count = trips.filter((trip) => trip.agencyId === id).length;

  return (
    <Link href={`/agences/${id}`} className="card agency-card group overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(25,55,95,.11)]" data-testid={`card-agency-${id}`}>
      <div className="h-36 overflow-hidden"><img src={agency.cover} alt={`Paysage présenté par ${agency.name}`} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" /></div>
      <div className="px-5 pb-5">
        <div className="-mt-7 flex items-end justify-between">
          <span className="grid h-14 w-14 place-items-center rounded-2xl border-4 border-white bg-[#e1f1f9] font-display font-extrabold text-[#32779c]">{agency.logo}</span>
          <span className="mb-1 flex items-center gap-1 text-xs font-bold text-[#5f7184]"><Star size={13} className="fill-[#f3b649] text-[#f3b649]" aria-hidden="true" />{agency.rating}</span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 font-display font-bold text-[#1e3553]">{agency.name}<BadgeCheck size={15} className="text-[#55a2c9]" aria-hidden="true" /></div>
        <p className="mt-1 text-xs text-[#75869a]"><MapPin size={12} className="mr-1 inline" aria-hidden="true" />{agency.city}, {agency.country} <span aria-hidden="true">·</span> {count} voyages démo</p>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#667a90]">{agency.description}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">{agency.specialties.slice(0, 2).map((specialty) => <span key={specialty} className="rounded-full bg-[#eff6fa] px-2.5 py-1 text-[10px] font-semibold text-[#55718c]">{specialty}</span>)}</div>
      </div>
    </Link>
  );
}

export function SearchBox({
  initial = '',
  initialStyle = '',
  initialDate = '',
  onSearch,
}: {
  initial?: string;
  initialStyle?: string;
  initialDate?: string;
  onSearch?: (query: string, style?: string, date?: string) => void;
}) {
  const [query, setQuery] = useState(initial);
  const [style, setStyle] = useState(initialStyle);
  const [date, setDate] = useState(initialDate);
  const [, navigate] = useLocation();

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (onSearch) {
      onSearch(query, style, date);
    } else {
      navigate(`/explore?q=${encodeURIComponent(query)}&type=${encodeURIComponent(style)}${date ? `&date=${date}` : ''}`);
    }
  };

  return (
    <form onSubmit={submit} className="search-card flex w-full flex-col items-stretch gap-2 rounded-2xl border border-[#e4ebf0] bg-white p-2 shadow-[0_12px_35px_rgba(25,55,95,.09)] sm:flex-row sm:items-center">
      <label className="flex min-w-0 flex-1 items-center gap-3 px-3 py-1">
        <MapPin size={19} className="shrink-0 text-[#4792bb]" aria-hidden="true" />
        <span className="min-w-0 flex-1">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-[#536b83]">Destination</span>
          <input aria-label="Rechercher une destination" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ville, pays, envie…" className="w-full bg-transparent pt-1 text-sm text-[#213752] outline-none placeholder:text-[#9ba9b7]" data-testid="input-search-destination" />
        </span>
      </label>
      <label className="flex items-center gap-2 border-t border-[#e8edf1] px-3 py-2 sm:border-l sm:border-t-0 sm:px-4">
        <CalendarDays size={17} className="shrink-0 text-[#8da0b1]" aria-hidden="true" />
        <span>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-[#536b83]">Départ</span>
          <input aria-label="Date de départ souhaitée" type="date" value={date} onChange={(event) => setDate(event.target.value)} className="max-w-[132px] bg-transparent pt-1 text-xs text-[#718196] outline-none" />
        </span>
      </label>
      <label className="flex items-center gap-2 border-t border-[#e8edf1] px-3 py-2 sm:border-l sm:border-t-0 sm:px-4">
        <Compass size={17} className="shrink-0 text-[#8da0b1]" aria-hidden="true" />
        <span>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-[#536b83]">Style</span>
          <select value={style} onChange={(event) => setStyle(event.target.value)} className="max-w-[140px] bg-transparent pt-1 text-xs text-[#718196] outline-none">
            <option value="">Tous les types</option>
            {[...new Set(trips.map((trip) => trip.type))].map((type) => <option key={type}>{type}</option>)}
          </select>
        </span>
      </label>
      <button type="submit" className="btn-primary flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold" data-testid="button-search">
        <Search size={17} aria-hidden="true" /><span>Rechercher</span>
      </button>
    </form>
  );
}

export function PageHeading({ kicker, title, description }: { kicker?: string; title: string; description?: string }) {
  return (
    <div className="mb-8">
      <p className="eyebrow">{kicker || 'TRIPAGENCY · DÉMO'}</p>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-[#19375f] md:text-[42px]">{title}</h1>
      {description && <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#6d8094]">{description}</p>}
    </div>
  );
}

export function formatDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}