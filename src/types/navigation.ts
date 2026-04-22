import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import type { StrikeAnalysis } from './market';

// ─── Auth Stack ───────────────────────────────────────────────────────────

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

// ─── Options Stack (within Options tab) ──────────────────────────────────

export type OptionsStackParamList = {
  OptionChain: undefined;
  StrikeAnalysis: { strike: number; symbol?: string };
};

// ─── Dashboard Stack ────────────────────────────────────────────────────────
export type DashboardStackParamList = {
  DashboardOverview: undefined;
};

// ─── Main Bottom Tab Navigator ────────────────────────────────────────────

export type MainTabParamList = {
  Dashboard: NavigatorScreenParams<DashboardStackParamList>;
  Options: undefined; // Options stack root
  News: undefined;
  Profile: undefined;
};

// ─── Root Navigator ───────────────────────────────────────────────────────

export type RootStackParamList = {
  Auth: undefined; // Auth navigator
  Main: undefined; // Main tab navigator
};

// ─── Screen prop helpers ──────────────────────────────────────────────────

export type SignInScreenProps = CompositeScreenProps<
  NativeStackScreenProps<AuthStackParamList, 'SignIn'>,
  NativeStackScreenProps<RootStackParamList>
>;
export type SignUpScreenProps = CompositeScreenProps<
  NativeStackScreenProps<AuthStackParamList, 'SignUp'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type DashboardScreenProps = CompositeScreenProps<
  NativeStackScreenProps<DashboardStackParamList, 'DashboardOverview'>,
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList>,
    NativeStackScreenProps<RootStackParamList>
  >
>;
export type NewsScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'News'>,
  NativeStackScreenProps<RootStackParamList>
>;
export type ProfileScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Profile'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type OptionChainScreenProps = CompositeScreenProps<
  NativeStackScreenProps<OptionsStackParamList, 'OptionChain'>,
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList>,
    NativeStackScreenProps<RootStackParamList>
  >
>;

export type StrikeAnalysisScreenProps = CompositeScreenProps<
  NativeStackScreenProps<OptionsStackParamList, 'StrikeAnalysis'>,
  BottomTabScreenProps<MainTabParamList>
>;
