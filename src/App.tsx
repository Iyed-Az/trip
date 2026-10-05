import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  AboutPage, AgenciesPage, AgencyProfilePage, BookingPage, ContactPage,
  ExplorePage, HomePage, NotFoundPublic, TripDetailPage,
} from '@/pages/PublicPages';
import {
  AgencyAuthPage, AgencyProfileEditor, DashboardPage, MessagesPage,
  NotificationsPage, RequestDetailPage, RequestsPage, SettingsPage,
  StatisticsPage, TripEditorPage, TripsPage,
} from '@/pages/AgencyPages';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={HomePage}/>
        <Route path="/explore" component={ExplorePage}/>
        <Route path="/voyages" component={ExplorePage}/>
        <Route path="/voyages/:id" component={TripDetailPage}/>
        <Route path="/agences" component={AgenciesPage}/>
        <Route path="/agences/:id" component={AgencyProfilePage}/>
        <Route path="/reservation/:tripId" component={BookingPage}/>
        <Route path="/a-propos" component={AboutPage}/>
        <Route path="/contact" component={ContactPage}/>
        <Route path="/agency/login">{()=><AgencyAuthPage/>}</Route>
        <Route path="/agency/register">{()=><AgencyAuthPage register/>}</Route>
        <Route path="/agency/dashboard" component={DashboardPage}/>
        <Route path="/agency/trips/new">{()=><TripEditorPage/>}</Route>
        <Route path="/agency/trips/:id/edit">{()=><TripEditorPage editing/>}</Route>
        <Route path="/agency/trips" component={TripsPage}/>
        <Route path="/agency/requests/:id" component={RequestDetailPage}/>
        <Route path="/agency/requests" component={RequestsPage}/>
        <Route path="/agency/profile" component={AgencyProfileEditor}/>
        <Route path="/agency/statistics" component={StatisticsPage}/>
        <Route path="/agency/messages" component={MessagesPage}/>
        <Route path="/agency/notifications" component={NotificationsPage}/>
        <Route path="/agency/settings" component={SettingsPage}/>
        <Route component={NotFoundPublic}/>
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;