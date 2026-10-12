import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {TasksProvider} from '../context/TasksContext';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

import DashboardScreen from '../screens/dashboard/DashboardScreen';
import TasksScreen from '../screens/tasks/TasksScreen';
import colors from '../theme/colors';

const Tab = createBottomTabNavigator();

function PlaceholderScreen({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle: string;
  icon: string;
}) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconBox}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Coming soon</Text>
          <Text style={styles.cardText}>
            This section will be built next.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

function NotesScreen() {
  return (
    <PlaceholderScreen
      title="My Notes"
      subtitle="Capture your ideas and important thoughts."
      icon="✎"
    />
  );
}

function ExpensesScreen() {
  return (
    <PlaceholderScreen
      title="My Expenses"
      subtitle="Track spending and manage your budget."
      icon="₹"
    />
  );
}

function ProfileScreen() {
  return (
    <PlaceholderScreen
      title="My Profile"
      subtitle="Manage your account and preferences."
      icon="●"
    />
  );
}

export default function AppNavigator() {
  return (
   <SafeAreaProvider>
      <TasksProvider>
        
        <NavigationContainer>
           <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerShown: false,
              tabBarActiveTintColor: colors.primary,
              tabBarInactiveTintColor: colors.textMuted,
              tabBarStyle: {
                height: 64,
                paddingTop: 7,
                paddingBottom: 7,
                backgroundColor: colors.white,
                borderTopColor: colors.border,
              },
              tabBarLabelStyle: {
                fontSize: 11,
                fontWeight: '600',
              },
            }}>
            <Tab.Screen
              name="Home"
              component={DashboardScreen}
              options={{
                tabBarIcon: () => (
                  <Text style={styles.tabIcon}>⌂</Text>
                ),
              }}
            />

            <Tab.Screen
              name="Tasks"
              component={TasksScreen}
              options={{
                tabBarIcon: () => (
                  <Text style={styles.tabIcon}>✓</Text>
                ),
              }}
            />

          
            <Tab.Screen
              name="Notes"
              component={NotesScreen}
              options={{
                tabBarIcon: () => (
                  <Text style={styles.tabIcon}>✎</Text>
                ),
              }}
            />

            <Tab.Screen
              name="Expenses"
              component={ExpensesScreen}
              options={{
                tabBarIcon: () => (
                  <Text style={styles.tabIcon}>₹</Text>
                ),
              }}
            />

            <Tab.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                tabBarIcon: () => (
                  <Text style={styles.tabIcon}>●</Text>
                ),
              }}
            />
            </Tab.Navigator>
        </NavigationContainer>
      </TasksProvider>
    </SafeAreaProvider>
  );
}
  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBox: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 34,
    color: colors.primary,
    fontWeight: '700',
  },
  title: {
    marginTop: 22,
    fontSize: 27,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 9,
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSecondary,
  },
  card: {
    marginTop: 30,
    alignSelf: 'stretch',
    padding: 20,
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  cardText: {
    marginTop: 6,
    fontSize: 13,
    color: colors.textSecondary,
  },
  tabIcon: {
    fontSize: 19,
    color: colors.primary,
  },
});
