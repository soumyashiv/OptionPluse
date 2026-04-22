import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DashboardScreen } from '../screens/dashboard/DashboardScreen';
import { OptionChainScreen } from '../screens/options/OptionChainScreen';
import { StrikeAnalysisScreen } from '../screens/options/StrikeAnalysisScreen';
import { NewsScreen } from '../screens/news/NewsScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { BottomNav } from '../components/common';
import type { MainTabParamList, OptionsStackParamList, DashboardStackParamList } from '../types';

const Tab = createBottomTabNavigator<MainTabParamList>();
const DashboardStack = createNativeStackNavigator<DashboardStackParamList>();
const OptionsStack = createNativeStackNavigator<OptionsStackParamList>();

const DashboardNavigator = () => {
  return (
    <DashboardStack.Navigator screenOptions={{ headerShown: false }}>
      {/* Name changed to DashboardOverview to avoid collision with Tab named Dashboard */}
      <DashboardStack.Screen name="DashboardOverview" component={DashboardScreen as any} />
    </DashboardStack.Navigator>
  );
};

const OptionsNavigator = () => {
  return (
    <OptionsStack.Navigator screenOptions={{ headerShown: false }}>
      <OptionsStack.Screen name="OptionChain" component={OptionChainScreen as any} />
      <OptionsStack.Screen name="StrikeAnalysis" component={StrikeAnalysisScreen} />
    </OptionsStack.Navigator>
  );
};

export const MainNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomNav {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardNavigator} />
      <Tab.Screen name="Options" component={OptionsNavigator} />
      <Tab.Screen name="News" component={NewsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};
