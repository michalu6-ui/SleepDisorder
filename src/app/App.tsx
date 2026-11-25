import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { PhoneFrame } from '../components/PhoneFrame';
import { RescueOverlay } from '../features/rescue/RescueOverlay';
import { OnboardingWelcome } from '../features/onboarding/OnboardingWelcome';
import { WhyProfileScreen } from '../features/onboarding/WhyProfileScreen';
import { OnboardingQuiz } from '../features/onboarding/OnboardingQuiz';
import { TodayScreen } from '../features/today/TodayScreen';
import { CalmHubScreen } from '../features/calm/CalmHubScreen';
import { BrainDumpModal } from '../features/calm/BrainDumpModal';
import { BreathSession } from '../features/calm/BreathSession';
import { RhythmScreen } from '../features/rhythm/RhythmScreen';
import { SettingsScreen } from '../features/settings/SettingsScreen';
import { MainLayout } from './layouts/MainLayout';
import { RescueProvider, useRescue } from './providers/RescueProvider';
import { StorageProvider, useStorage } from './providers/StorageProvider';
import { ThemeProvider } from './providers/ThemeProvider';

import './app.css';

function AppRoutes() {
  const { ready, settings, updateSettings } = useStorage();
  const { active: rescueActive } = useRescue();

  if (!ready) {
    return <div className="boot">Ładowanie…</div>;
  }

  return (
    <ThemeProvider
      settings={settings}
      rescueActive={rescueActive}
      onOverrideChange={(value) => updateSettings({ timeOfDayOverride: value })}
    >
      <PhoneFrame enabled={settings.phoneFrameEnabled}>
        <Routes>
          <Route
            path="/onboarding"
            element={settings.onboardingCompleted ? <Navigate to="/today" replace /> : <OnboardingWelcome />}
          />
          <Route
            path="/onboarding/why-profile"
            element={settings.onboardingCompleted ? <Navigate to="/today" replace /> : <WhyProfileScreen />}
          />
          <Route
            path="/onboarding/quiz"
            element={settings.onboardingCompleted ? <Navigate to="/today" replace /> : <OnboardingQuiz />}
          />
          <Route
            path="/me/why-profile"
            element={<WhyProfileScreen mode="from-settings" />}
          />
          <Route
            element={settings.onboardingCompleted ? <MainLayout /> : <Navigate to="/onboarding" replace />}
          >
            <Route path="/today" element={<TodayScreen />} />
            <Route path="/calm" element={<CalmHubScreen />} />
            <Route path="/calm/brain-dump" element={<BrainDumpModal />} />
            <Route path="/calm/breath" element={<BreathSession />} />
            <Route path="/rhythm" element={<RhythmScreen />} />
            <Route path="/me" element={<SettingsScreen />} />
          </Route>
          <Route path="*" element={<Navigate to={settings.onboardingCompleted ? '/today' : '/onboarding'} replace />} />
        </Routes>
        <RescueOverlay />
      </PhoneFrame>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter
      basename={import.meta.env.BASE_URL.replace(/\/$/, '') || undefined}
    >
      <RescueProvider>
        <StorageProvider>
          <AppRoutes />
        </StorageProvider>
      </RescueProvider>
    </BrowserRouter>
  );
}