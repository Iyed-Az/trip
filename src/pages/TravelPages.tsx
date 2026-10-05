import { useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import { Link, useParams } from 'wouter';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Clock3,
  Heart,
  Hotel,
  MapPin,
  Plane,
  Share2,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  Users,
  X,
} from 'lucide-react';
import { agencies, agencyById, tripById, trips, type Trip } from '../lib/demo-data';
import { AgencyCard, PageHeading, PublicLayout, SearchBox, TripCard, useFavoriteTrips } from '../components/Shared';

export function HomePage() {
  return (
    <PublicLayout>
      <section className="hero-bg relative flex min-h-[610px] items-center overflow-hidden px-5 py-16 md:min-h-[660px] md:px-12">
        <div className="relative mx-auto w-full max-w-7xl">
          <div className="fade-up max-w-[700px]">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur">
              <Plane size={15} aria-hidden="true" /> Voyages sans limites
            </div>
            <h1 className="font-display text-[42px] font-extrabold leading-[1.05] tracking-tight text-white md:text-[62px]">
              Trouvez votre prochain <span className="text-[#a7def5]">voyage, plus facilement.</span>
            </h1>
            <p className="mt-5 max-w-[570px] text-base leading-7 text-white/85 md:text-lg">
              Découvrez les meilleurs trajets et séjours proposés par des agences de voyages, et choisissez celui qui correspond à vos envies.
            </p>
          </div>
          <div className="mt-9 max-w-[920px]">
            <SearchBox />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/80">
            <span className="flex items-center gap-2"><ShieldCheck size={15} aria-hidden="true" /> Agences présentées en démo</span>
            <span className="flex items-center gap-2"><CircleCheck size={15} aria-hidden="true" /> Exploration sans compte</span>
            <span className="flex items-center gap-2"><Check size={15} aria-hidden="true" /> Demande sans paiement</span>
          </div>
          <div className="absolute -bottom-20 right-5 hidden items-center gap-2 text-xs text-white/80 lg:flex xl:right-12">
            <span className="h-px w-8 bg-white/70" /> Méditerranée, à votre rythme
          </div>
        </div>
        <a href="#voyages-populaires" aria-label="Découvrir les voyages populaires" className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 rounded-full border border-white/40 bg-white/10 p-2.5 text-white backdrop-blur transition hover:bg-white/20 md:block">
          <ArrowDown size={17} aria-hidden="true" />
        </a>
      </section>

      <section id="voyages-populaires" className="section-space mx-auto max-w-7xl px-5 md:px-10">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">L’inspiration du moment</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold text-[#19375f]">Voyages populaires</h2>
            <p className="mt-2 text-sm text-[#74869a]">Les destinations les plus appréciées dans les données de démonstration.</p>
          </div>
          <Link href="/explore" className="hidden items-center gap-2 text-sm font-bold text-[#327da6] sm:flex">Tous les voyages <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{trips.slice(0, 4).map((trip) => <TripCard key={trip.id} trip={trip} />)}</div>
        <Link href="/explore" className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-[#dfe8ef] py-3 text-sm font-bold text-[#31536f] sm:hidden">Explorer tous les voyages <ArrowRight size={16} aria-hidden="true" /></Link>
      </section>

      <section className="bg-[#eef6fa]">
        <div className="mx-auto grid max-w-7xl items-center gap-9 px-5 py-14 md:grid-cols-[1.05fr_.95fr] md:px-10 md:py-20">
          <div>
            <p className="eyebrow">Une autre façon de partir</p>
            <h2 className="mt-3 max-w-lg font-display text-3xl font-extrabold leading-tight text-[#19375f] md:text-[40px]">Le regard d’une agence. La liberté de choisir.</h2>
            <p className="mt-4 max-w-lg text-[15px] leading-7 text-[#61778e]">Parcourez des offres conçues par des professionnels qui connaissent leurs destinations. Comparez, prenez le temps, puis préparez votre demande directement depuis la page du voyage.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {['Conseils de spécialistes', 'Demande sans compte', 'Aucun paiement en ligne'].map((item) => <span key={item} className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#365d79]">{item}</span>)}
            </div>
            <Link href="/a-propos" className="mt-7 inline-flex items-center gap-2 font-bold text-[#307ca4]">Notre approche <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <div className="relative">
            <img src="/images/maldives.jpg" alt="Lagon turquoise aux Maldives" loading="lazy" className="aspect-[1.28] w-full rounded-[28px] object-cover shadow-lg" />
            <div className="absolute -bottom-5 left-4 rounded-2xl bg-white p-4 shadow-lg md:left-8">
              <p className="flex items-center gap-2 text-sm font-bold text-[#213956]"><Check size={17} className="text-[#4e9b81]" aria-hidden="true" /> Des voyages pensés avec soin</p>
              <p className="mt-1 text-xs text-[#708196]">Exemples de séjours, en mode démonstration.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-20">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div><p className="eyebrow">À vos côtés</p><h2 className="mt-2 font-display text-3xl font-extrabold text-[#19375f]">Des agences à découvrir</h2></div>
          <Link href="/agences" className="hidden items-center gap-2 text-sm font-bold text-[#327da6] sm:flex">Voir les agences <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{agencies.map((agency) => <AgencyCard key={agency.id} id={agency.id} />)}</div>
        <Link href="/agences" className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-[#dfe8ef] py-3 text-sm font-bold text-[#31536f] sm:hidden">Découvrir les agences <ArrowRight size={16} aria-hidden="true" /></Link>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 md:px-10">
        <div className="agency-callout relative overflow-hidden rounded-[28px] bg-[#1b385d] p-8 text-white md:px-12 md:py-10">
          <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.15em] text-[#9ed8f1]">Vous êtes une agence de voyage ?</p>
              <h2 className="mt-2 max-w-2xl font-display text-2xl font-extrabold md:text-3xl">Partagez vos voyages et faites découvrir votre expertise.</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-white/75">Explorez l’espace professionnel de TripAgency en mode démonstration. Aucun compte ne sera créé.</p>
            </div>
            <Link href="/agency/register" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#1b385d] transition hover:-translate-y-0.5 hover:bg-[#edf6fb]">
              Explorer l’espace agence <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <Plane className="absolute -bottom-10 right-5 hidden h-40 w-40 rotate-[-12deg] text-white/[.07] md:block" aria-hidden="true" />
        </div>
      </section>
    </PublicLayout>
  );
}

type ExploreFilterProps = {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  countries: string[];
  selectedCountries: string[];
  toggleCountry: (country: string) => void;
  types: string[];
  selectedTypes: string[];
  toggleType: (type: string) => void;
  agenciesList: typeof agencies;
  agency: string;
  setAgency: Dispatch<SetStateAction<string>>;
  maxPrice: number;
  setMaxPrice: Dispatch<SetStateAction<number>>;
  minRating: number;
  setMinRating: Dispatch<SetStateAction<number>>;
  duration: string;
  setDuration: Dispatch<SetStateAction<string>>;
};

function ExploreFilterFields(props: ExploreFilterProps) {
  return (
    <div className="space-y-6">
      <label className="block text-xs font-bold text-[#3b526b]">
        Destination
        <span className="relative mt-2 block">
          <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8296a8]" aria-hidden="true" />
          <input value={props.query} onChange={(event) => props.setQuery(event.target.value)} className="field pl-9 text-sm" placeholder="Ville ou pays" />
        </span>
      </label>

      <fieldset>
        <legend className="text-xs font-bold text-[#3b526b]">Pays</legend>
        <div className="mt-3 space-y-2.5">
          {props.countries.map((country) => <label key={country} className="flex cursor-pointer items-center gap-2.5 text-sm text-[#667a90]">
            <input type="checkbox" checked={props.selectedCountries.includes(country)} onChange={() => props.toggleCountry(country)} className="h-4 w-4 rounded border-[#c8d6e0] accent-[#285c80]" />
            {country}
          </label>)}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-xs font-bold text-[#3b526b]">Type de voyage</legend>
        <div className="mt-3 space-y-2.5">
          {props.types.map((type) => <label key={type} className="flex cursor-pointer items-center gap-2.5 text-sm text-[#667a90]">
            <input type="checkbox" checked={props.selectedTypes.includes(type)} onChange={() => props.toggleType(type)} className="h-4 w-4 rounded border-[#c8d6e0] accent-[#285c80]" />
            {type}
          </label>)}
        </div>
      </fieldset>

      <label className="block text-xs font-bold text-[#3b526b]">
        Agence
        <select value={props.agency} onChange={(event) => props.setAgency(event.target.value)} className="field mt-2 text-sm">
          <option value="Toutes">Toutes les agences</option>
          {props.agenciesList.map((agency) => <option key={agency.id} value={agency.id}>{agency.name}</option>)}
        </select>
      </label>

      <div>
        <label htmlFor="budget-range" className="text-xs font-bold text-[#3b526b]">Budget maximal · {props.maxPrice.toLocaleString('fr-FR')} €</label>
        <input id="budget-range" type="range" min="200" max="1500" step="10" value={props.maxPrice} onChange={(event) => props.setMaxPrice(Number(event.target.value))} className="mt-3 w-full accent-[#285c80]" />
        <div className="flex justify-between text-[11px] text-[#8291a0]"><span>200 €</span><span>1 500 €+</span></div>
      </div>

      <label className="block text-xs font-bold text-[#3b526b]">
        Note minimale
        <select value={props.minRating} onChange={(event) => props.setMinRating(Number(event.target.value))} className="field mt-2 text-sm">
          <option value={0}>Toutes les notes</option>
          <option value={4}>4 étoiles et plus</option>
          <option value={4.5}>4,5 étoiles et plus</option>
          <option value={4.8}>4,8 étoiles et plus</option>
        </select>
      </label>

      <fieldset>
        <legend className="text-xs font-bold text-[#3b526b]">Durée</legend>
        <div className="mt-3 space-y-2.5">
          {['Toutes', '1–3 jours', '4–7 jours', '8–14 jours', '+14 jours'].map((duration) => <label key={duration} className="flex cursor-pointer items-center gap-2.5 text-sm text-[#667a90]">
            <input type="radio" name="trip-duration" checked={props.duration === duration} onChange={() => props.setDuration(duration)} className="h-4 w-4 accent-[#285c80]" />
            {duration}
          </label>)}
        </div>
      </fieldset>
    </div>
  );
}

export function ExplorePage() {
  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get('q') ?? '';
  const initialType = params.get('type') ?? '';
  const initialDate = params.get('date') ?? '';
  const [query, setQuery] = useState(initialQuery);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(initialType && initialType !== 'Tous les types' ? [initialType] : []);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [sort, setSort] = useState('Plus populaires');
  const [agency, setAgency] = useState('Toutes');
  const [duration, setDuration] = useState('Toutes');
  const [maxPrice, setMaxPrice] = useState(1500);
  const [minRating, setMinRating] = useState(0);
  const [departureDate, setDepartureDate] = useState(initialDate);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const countries = useMemo(() => [...new Set(trips.map((trip) => trip.country))].sort((a, b) => a.localeCompare(b, 'fr')), []);
  const types = useMemo(() => [...new Set(trips.map((trip) => trip.type))].sort((a, b) => a.localeCompare(b, 'fr')), []);
  const activeFilterCount = selectedCountries.length + selectedTypes.length + (agency !== 'Toutes' ? 1 : 0) + (duration !== 'Toutes' ? 1 : 0) + (minRating > 0 ? 1 : 0) + (maxPrice < 1500 ? 1 : 0) + (departureDate ? 1 : 0);

  const toggleCountry = (country: string) => setSelectedCountries((current) => current.includes(country) ? current.filter((value) => value !== country) : [...current, country]);
  const toggleType = (type: string) => setSelectedTypes((current) => current.includes(type) ? current.filter((value) => value !== type) : [...current, type]);
  const clearFilters = () => {
    setQuery('');
    setSelectedTypes([]);
    setSelectedCountries([]);
    setAgency('Toutes');
    setDuration('Toutes');
    setMaxPrice(1500);
    setMinRating(0);
    setDepartureDate('');
    setSort('Plus populaires');
  };

  const shown = useMemo(() => {
    let list = trips.filter((trip) => {
      const haystack = `${trip.title} ${trip.destination} ${trip.country} ${trip.city} ${trip.type} ${agencyById(trip.agencyId)?.name ?? ''}`.toLowerCase();
      const durationMatch = duration === 'Toutes'
        || (duration === '1–3 jours' && trip.durationDays <= 3)
        || (duration === '4–7 jours' && trip.durationDays >= 4 && trip.durationDays <= 7)
        || (duration === '8–14 jours' && trip.durationDays >= 8 && trip.durationDays <= 14)
        || (duration === '+14 jours' && trip.durationDays > 14);
      return haystack.includes(query.trim().toLowerCase())
        && trip.price <= maxPrice
        && (selectedCountries.length === 0 || selectedCountries.includes(trip.country))
        && (selectedTypes.length === 0 || selectedTypes.includes(trip.type))
        && (agency === 'Toutes' || trip.agencyId === agency)
        && trip.rating >= minRating
        && (!departureDate || trip.startDate >= departureDate)
        && durationMatch;
    });
    if (sort === 'Prix croissant') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'Prix décroissant') list = [...list].sort((a, b) => b.price - a.price);
    if (sort === 'Meilleure note') list = [...list].sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    if (sort === 'Plus récents') list = [...list].sort((a, b) => b.startDate.localeCompare(a.startDate));
    if (sort === 'Plus populaires') list = [...list].sort((a, b) => b.viewsCount - a.viewsCount);
    return list;
  }, [query, selectedCountries, selectedTypes, agency, minRating, departureDate, duration, maxPrice, sort]);

  const filterProps: ExploreFilterProps = {
    query,
    setQuery,
    countries,
    selectedCountries,
    toggleCountry,
    types,
    selectedTypes,
    toggleType,
    agenciesList: agencies,
    agency,
    setAgency,
    maxPrice,
    setMaxPrice,
    minRating,
    setMinRating,
    duration,
    setDuration,
  };

  return (
    <PublicLayout>
      <section className="mx-auto max-w-7xl px-5 py-10 md:px-10 md:py-14">
        <PageHeading kicker="LE CARNET DES DÉPARTS" title="Tous les voyages" description="Explorez les séjours présentés par les agences de cette démonstration et choisissez une idée de départ." />
        <div className="mb-7 max-w-4xl">
          <SearchBox
            initial={initialQuery}
            initialStyle={initialType}
            initialDate={initialDate}
            onSearch={(nextQuery, nextType, nextDate) => {
              setQuery(nextQuery);
              setSelectedTypes(nextType ? [nextType] : []);
              setDepartureDate(nextDate ?? '');
            }}
          />
        </div>
        <div className="grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)]">
          <aside className="filter-sidebar hidden h-fit rounded-2xl border border-[#e6edf3] bg-white p-5 lg:block">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display font-bold text-[#213956]">Filtres</h2>
              <button type="button" onClick={clearFilters} className="text-xs font-semibold text-[#3e82a7]">Tout effacer</button>
            </div>
            <ExploreFilterFields {...filterProps} />
          </aside>

          <section className="min-w-0">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-[#718399]"><strong className="text-[#244260]">{shown.length} voyages</strong> à découvrir</p>
                {departureDate && <p className="mt-1 text-xs text-[#8291a0]">Départs à partir du {departureDate}</p>}
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setMobileFiltersOpen(true)} className="inline-flex items-center gap-2 rounded-xl border border-[#dfe7ee] bg-white px-3 py-2.5 text-xs font-bold text-[#36516d] lg:hidden">
                  <SlidersHorizontal size={15} aria-hidden="true" /> Filtres {activeFilterCount > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#1c3b60] px-1 text-[10px] text-white">{activeFilterCount}</span>}
                </button>
                <label className="flex items-center gap-2 text-xs text-[#65788d]">
                  <span className="hidden sm:inline">Trier par</span>
                  <select value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-xl border border-[#dfe7ee] bg-white px-3 py-2.5 text-xs font-bold text-[#36516d]">
                    <option>Plus populaires</option>
                    <option>Plus récents</option>
                    <option>Prix croissant</option>
                    <option>Prix décroissant</option>
                    <option>Meilleure note</option>
                  </select>
                </label>
              </div>
            </div>

            {activeFilterCount > 0 && <div className="mb-4 flex flex-wrap items-center gap-2">
              {[...selectedCountries, ...selectedTypes, ...(agency !== 'Toutes' ? [agencyById(agency)?.name ?? agency] : []), ...(minRating > 0 ? [`${minRating}★ et plus`] : []), ...(duration !== 'Toutes' ? [duration] : []), ...(maxPrice < 1500 ? [`≤ ${maxPrice} €`] : []), ...(departureDate ? [`Départ dès ${departureDate}`] : [])].map((label) => <span key={label} className="rounded-full bg-[#eef5f9] px-3 py-1.5 text-[10px] font-semibold text-[#55718c]">{label}</span>)}
              <button type="button" onClick={clearFilters} className="px-2 py-1 text-[10px] font-bold text-[#3e82a7]">Effacer</button>
            </div>}

            {shown.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{shown.map((trip) => <TripCard key={trip.id} trip={trip} />)}</div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[#ccdbe5] bg-white px-6 py-16 text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#eef5f9] text-[#4d7d9a]"><MapPin size={20} aria-hidden="true" /></span>
                <p className="mt-4 font-display text-xl font-bold text-[#263d59]">Aucun voyage trouvé</p>
                <p className="mt-2 text-sm text-[#75869a]">Essayez de modifier vos filtres ou votre destination.</p>
                <button type="button" onClick={clearFilters} className="mt-5 rounded-xl bg-[#e8f3f9] px-4 py-2.5 text-sm font-bold text-[#32789f]">Réinitialiser les filtres</button>
              </div>
            )}
          </section>
        </div>
      </section>

      {mobileFiltersOpen && <div className="mobile-filter-backdrop fixed inset-0 z-[70] lg:hidden">
        <button type="button" aria-label="Fermer les filtres" onClick={() => setMobileFiltersOpen(false)} className="absolute inset-0 bg-[#102b49]/45 backdrop-blur-[2px]" />
        <aside role="dialog" aria-modal="true" aria-labelledby="mobile-filters-title" className="mobile-filter-sheet absolute inset-x-0 bottom-0 rounded-t-[26px] border border-[#e5ebef] bg-[#f8fafc] px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 shadow-2xl">
          <div className="mx-auto mb-5 h-1 w-11 rounded-full bg-[#cbd7df]" />
          <div className="mb-5 flex items-center justify-between">
            <div><p className="eyebrow">Affinez votre recherche</p><h2 id="mobile-filters-title" className="mt-1 font-display text-xl font-bold text-[#213956]">Filtres</h2></div>
            <button type="button" aria-label="Fermer les filtres" onClick={() => setMobileFiltersOpen(false)} className="rounded-full border border-[#dfe7ee] bg-white p-2 text-[#5b7086]"><X size={18} /></button>
          </div>
          <div className="max-h-[58dvh] overflow-y-auto rounded-2xl border border-[#e5ebef] bg-white p-5"><ExploreFilterFields {...filterProps} /></div>
          <div className="mt-4 flex gap-3">
            <button type="button" onClick={clearFilters} className="rounded-xl border border-[#dce6ed] bg-white px-4 py-3 text-sm font-bold text-[#536b83]">Effacer</button>
            <button type="button" onClick={() => setMobileFiltersOpen(false)} className="btn-primary flex-1 rounded-xl py-3 text-sm font-bold">Afficher {shown.length} résultats</button>
          </div>
        </aside>
      </div>}
    </PublicLayout>
  );
}

export function FavoritesPage() {
  const { favoriteIds } = useFavoriteTrips();
  const favoriteTrips = trips.filter((trip) => favoriteIds.includes(trip.id));
  return (
    <PublicLayout>
      <section className="mx-auto max-w-7xl px-5 py-10 md:px-10 md:py-14">
        <PageHeading kicker="VOTRE CARNET DE VOYAGE" title="Vos favoris" description="Les séjours que vous avez mis de côté sur cet appareil. Ces favoris sont enregistrés localement dans votre navigateur." />
        {favoriteTrips.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{favoriteTrips.map((trip) => <TripCard key={trip.id} trip={trip} />)}</div>
        ) : (
          <div className="rounded-[24px] border border-dashed border-[#ccdbe5] bg-white px-6 py-16 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#f8edf1] text-[#a8516b]"><Heart size={22} aria-hidden="true" /></span>
            <h2 className="mt-4 font-display text-xl font-bold text-[#263d59]">Votre liste est encore vide</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#75869a]">Touchez le cœur d’un voyage pour le retrouver ici. La liste reste uniquement sur cet appareil.</p>
            <Link href="/explore" className="btn-primary mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold">Explorer les voyages <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        )}
      </section>
    </PublicLayout>
  );
}

export function TripDetailPage() {
  const { id } = useParams();
  const trip = tripById(id);
  const images = trip ? [...new Set([trip.mainImage, ...trip.images])] : [];
  const [activeImage, setActiveImage] = useState(0);
  const [shareNotice, setShareNotice] = useState('');
  const { favoriteIds, toggleFavorite } = useFavoriteTrips();

  if (!trip) return <PublicLayout><div className="mx-auto max-w-3xl px-5 py-24 text-center"><p className="eyebrow">VOYAGE INDISPONIBLE</p><h1 className="mt-3 font-display text-3xl font-extrabold text-[#19375f]">Ce voyage n’est pas dans la démonstration.</h1><Link href="/explore" className="btn-primary mt-7 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold"><ArrowLeft size={16} /> Revenir aux voyages</Link></div></PublicLayout>;
  const agency = agencyById(trip.agencyId);
  if (!agency) return <PublicLayout><div className="mx-auto max-w-3xl px-5 py-24 text-center"><h1 className="font-display text-2xl font-bold text-[#19375f]">Agence indisponible.</h1><Link href="/explore" className="mt-5 inline-flex text-sm font-bold text-[#327da6]">Revenir aux voyages</Link></div></PublicLayout>;

  const isFavorite = favoriteIds.includes(trip.id);
  const share = async () => {
    setShareNotice('');
    try {
      if (navigator.share) {
        await navigator.share({ title: trip.title, text: `Découvrez ${trip.title} sur TripAgency`, url: window.location.href });
        return;
      }
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setShareNotice('Lien copié dans le presse-papiers.');
      } else {
        setShareNotice('Le partage n’est pas disponible dans ce navigateur.');
      }
    } catch {
      setShareNotice('Le partage a été fermé ou n’a pas pu être effectué.');
    }
  };

  const hasFlight = trip.included.some((item) => item.toLowerCase().includes('vol'));
  const hasHotel = trip.highlights.some((item) => item.toLowerCase().includes('hôtel'));

  return (
    <PublicLayout>
      <div className="mx-auto max-w-7xl px-5 py-7 md:px-10 md:py-9">
        <Link href="/explore" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#648097]"><ArrowLeft size={16} aria-hidden="true" /> Tous les voyages</Link>

        <div className="trip-gallery grid gap-3 overflow-hidden rounded-[24px] md:grid-cols-[1.7fr_1fr] md:grid-rows-2">
          <div className="relative min-h-[260px] overflow-hidden md:row-span-2 md:min-h-[450px]">
            <img src={images[activeImage] ?? trip.mainImage} alt={`${trip.destination} — vue ${activeImage + 1}`} className="h-full min-h-[260px] w-full object-cover md:min-h-[450px]" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-[#0c223e]/65 to-transparent p-4 pt-16">
              <span className="rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold text-[#31526f]">Voyage en démonstration</span>
              <div className="flex gap-2">
                <button type="button" onClick={() => toggleFavorite(trip.id)} aria-label={isFavorite ? 'Retirer ce voyage des favoris locaux' : 'Ajouter ce voyage aux favoris locaux'} aria-pressed={isFavorite} className={`grid h-10 w-10 place-items-center rounded-full backdrop-blur transition ${isFavorite ? 'bg-[#f9e8ee] text-[#b94f6b]' : 'bg-white/95 text-[#526a81]'}`}><Heart size={18} className={isFavorite ? 'fill-current' : ''} /></button>
                <button type="button" onClick={share} aria-label="Partager ce voyage" className="grid h-10 w-10 place-items-center rounded-full bg-white/95 text-[#526a81] transition hover:bg-white"><Share2 size={18} /></button>
              </div>
            </div>
          </div>
          {images.slice(0, 2).map((image, index) => (
            <button key={`${image}-${index}`} type="button" aria-label={`Afficher la photo ${index + 1} sur ${images.length}`} onClick={() => setActiveImage(index)} className={`relative hidden overflow-hidden rounded-xl md:block ${activeImage === index ? 'ring-2 ring-inset ring-white' : ''}`}>
              <img src={image} alt={`${trip.destination}, photo ${index + 1}`} loading="lazy" className="h-full min-h-[218px] w-full object-cover transition duration-300 hover:scale-[1.025]" />
              <span className="absolute bottom-3 right-3 rounded-full bg-[#172c4b]/85 px-3 py-1.5 text-[10px] font-bold text-white">{index + 1} / {images.length}</span>
            </button>
          ))}
        </div>
        {images.length > 1 && <div className="mt-3 flex gap-2 overflow-x-auto pb-1 md:hidden">
          {images.map((image, index) => <button key={`${image}-mobile-${index}`} type="button" aria-label={`Afficher la photo ${index + 1}`} aria-pressed={activeImage === index} onClick={() => setActiveImage(index)} className={`photo-thumb h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 ${activeImage === index ? 'border-[#377fa5]' : 'border-transparent'}`}><img src={image} alt="" className="h-full w-full object-cover" /></button>)}
        </div>}

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_355px]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="eyebrow">{trip.country} <span aria-hidden="true">·</span> {trip.city}</p>
              {trip.viewsCount >= 200 && <span className="rounded-full bg-[#eff6ff] px-3 py-1 text-[10px] font-bold text-[#325d84]">Populaire dans la démo</span>}
            </div>
            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-[#19375f] md:text-[42px]">{trip.title}</h1>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#6d8094]">
              <span className="flex items-center gap-1"><Star size={15} className="fill-[#eab04a] text-[#eab04a]" aria-hidden="true" /> {trip.rating} <span className="text-[#8392a0]">({trip.reviewCount} avis démo)</span></span>
              <span className="flex items-center gap-1"><MapPin size={15} aria-hidden="true" />{trip.country}</span>
              <span>{trip.durationDays} jours <span aria-hidden="true">·</span> {trip.nights} nuits</span>
            </div>
            {shareNotice && <p role="status" className="mt-4 rounded-xl bg-[#eef6fa] px-4 py-3 text-sm text-[#3d718d]">{shareNotice}</p>}

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <QuickFact icon={<Clock3 size={18} />} label="Durée" value={`${trip.durationDays} jours`} />
              <QuickFact icon={<Hotel size={18} />} label="Hébergement" value={hasHotel ? 'Inclus au programme' : `${trip.nights} nuits`} />
              <QuickFact icon={<Plane size={18} />} label="Transport" value={hasFlight ? 'Vols inclus' : 'À préciser à l’agence'} />
              <QuickFact icon={<Users size={18} />} label="Disponibilité" value={`${trip.availablePlaces} places démo`} />
            </div>

            <section className="mt-9">
              <h2 className="font-display text-xl font-bold text-[#213956]">À propos de ce voyage</h2>
              <p className="mt-3 max-w-3xl text-[15px] leading-7 text-[#62768c]">{trip.description}</p>
            </section>

            <section className="mt-9">
              <h2 className="font-display text-xl font-bold text-[#213956]">Points forts</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {trip.highlights.map((highlight) => <p key={highlight} className="flex gap-3 rounded-xl bg-white p-3 text-sm text-[#526981]"><Check size={17} className="shrink-0 text-[#4e9b81]" aria-hidden="true" />{highlight}</p>)}
              </div>
            </section>

            <section className="mt-10">
              <h2 className="font-display text-xl font-bold text-[#213956]">Au fil des jours</h2>
              <div className="mt-5 space-y-0">
                {trip.itinerary.map((item, index) => <div key={`${item}-${index}`} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#e9f4f9] text-xs font-bold text-[#397da3]">{String(index + 1).padStart(2, '0')}</span>
                    {index < trip.itinerary.length - 1 && <span className="my-1 w-px flex-1 bg-[#dbe7ed]" />}
                  </div>
                  <div className="pb-5"><p className="font-bold text-[#334c67]">Jour {index + 1}</p><p className="mt-1 text-sm leading-6 text-[#708196]">{item}</p></div>
                </div>)}
              </div>
            </section>

            <section className="mt-5 grid gap-8 border-t border-[#e6edf2] pt-7 sm:grid-cols-2">
              <div><h2 className="font-display text-lg font-bold text-[#213956]">Inclus</h2><ul className="mt-3 space-y-2">{trip.included.map((item) => <li key={item} className="flex gap-2 text-sm text-[#60768c]"><Check size={15} className="shrink-0 text-[#4e9b81]" aria-hidden="true" />{item}</li>)}</ul></div>
              <div><h2 className="font-display text-lg font-bold text-[#213956]">Non inclus</h2><ul className="mt-3 space-y-2">{trip.notIncluded.map((item) => <li key={item} className="flex gap-2 text-sm text-[#75869a]"><X size={14} className="shrink-0 text-[#a77a73]" aria-hidden="true" />{item}</li>)}</ul></div>
            </section>
          </div>

          <aside className="h-fit rounded-[22px] border border-[#e2eaf0] bg-white p-5 shadow-[0_12px_36px_rgba(25,55,95,.07)] lg:sticky lg:top-24">
            <div className="flex items-end justify-between">
              <div><span className="text-xs text-[#77889a]">À partir de</span><p className="font-display text-3xl font-extrabold text-[#19375f]">{trip.price.toLocaleString('fr-FR')} {trip.currency}</p></div>
              <span className="text-xs text-[#78899a]">/ personne</span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-[#f3f7fa] p-3"><p className="text-[10px] uppercase text-[#78899a]">Départ indiqué</p><p className="mt-1 text-xs font-bold text-[#344d67]"><CalendarDays size={13} className="mr-1 inline" aria-hidden="true" />{trip.startDate}</p></div>
              <div className="rounded-xl bg-[#f3f7fa] p-3"><p className="text-[10px] uppercase text-[#78899a]">Durée</p><p className="mt-1 text-xs font-bold text-[#344d67]">{trip.durationDays} jours</p></div>
            </div>
            <Link href={`/reservation/${trip.id}`} className="btn-primary mt-5 flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold">Demander une réservation <ArrowRight size={16} aria-hidden="true" /></Link>
            <p className="mt-3 text-center text-[11px] leading-5 text-[#8492a0]">Demande en aperçu local <span aria-hidden="true">·</span> aucun paiement en ligne</p>

            <div className="my-5 border-t border-[#eaf0f4]" />
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#e4f1f7] font-bold text-[#397da3]">{agency.logo}</span>
              <div className="min-w-0 flex-1">
                <Link href={`/agences/${agency.id}`} className="flex items-center gap-1 text-sm font-bold text-[#27415e]">{agency.name}<BadgeCheck size={14} className="text-[#4d9bc3]" aria-hidden="true" /></Link>
                <p className="mt-1 text-xs text-[#7c8c9c]"><Star size={12} className="mr-1 inline fill-[#eab04a] text-[#eab04a]" aria-hidden="true" />{agency.rating} <span aria-hidden="true">·</span> {agency.city}</p>
              </div>
              <Link href={`/agences/${agency.id}`} aria-label={`Voir l’agence ${agency.name}`} className="rounded-lg p-2 text-[#7990a5] hover:bg-[#f2f6f9]"><ChevronRight size={17} /></Link>
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">{agency.specialties.slice(0, 3).map((specialty) => <span key={specialty} className="rounded-full bg-[#f0f6f9] px-2.5 py-1 text-[10px] font-semibold text-[#55718c]">{specialty}</span>)}</div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <a href={`tel:${agency.phone}`} className="rounded-xl border border-[#dfe7ed] px-3 py-2.5 text-center text-xs font-bold text-[#49657e]">Appeler · démo</a>
              <button type="button" onClick={() => setShareNotice('WhatsApp n’est pas connecté dans cette démonstration.')} className="rounded-xl border border-[#dfe7ed] px-3 py-2.5 text-xs font-bold text-[#49657e]">WhatsApp · démo</button>
            </div>
            <p className="mt-4 rounded-xl bg-[#f5f8fa] p-3 text-xs leading-5 text-[#74869a]">Cette offre et cette agence illustrent l’interface. La demande ne sera pas transmise à une agence.</p>
          </aside>
        </div>
      </div>
    </PublicLayout>
  );
}

function QuickFact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="rounded-2xl border border-[#e6edf2] bg-white p-4">
    <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#eef6fa] text-[#427d9e]">{icon}</span>
    <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-[#8291a0]">{label}</p>
    <p className="mt-1 text-sm font-bold text-[#334c67]">{value}</p>
  </div>;
}