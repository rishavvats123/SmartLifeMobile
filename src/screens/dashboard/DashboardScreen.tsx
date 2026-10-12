
import React from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import colors from '../../theme/colors';
import {useTasks} from '../../context/TasksContext';


function StatCard({
  emoji,
  title,
  value,
  subtitle,
}: {
  emoji: string;
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statEmoji}>{emoji}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statSubtitle}>{subtitle}</Text>
    </View>
  );
}

export default function DashboardScreen() {
    const {tasks, isLoaded, toggleTask} = useTasks();

  const completedCount = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const pendingCount = totalTasks - completedCount;
  const progress = totalTasks > 0 ? completedCount / totalTasks : 0;
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>
              Smart<Text style={styles.logoAccent}>Life</Text>
            </Text>
            <Text style={styles.date}>{today}</Text>
          </View>

          <TouchableOpacity
            style={styles.avatar}
            onPress={() => Alert.alert('Profile', 'Profile screen coming soon!')}>
            <Text style={styles.avatarText}>U</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.welcome}>
          <Text style={styles.greeting}>Hello, there! 👋</Text>
          <Text style={styles.heading}>Make today count.</Text>
          <Text style={styles.description}>
            Organize your day, one step at a time.
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>YOUR DAILY SUMMARY</Text>
          <Text style={styles.summaryTitle}>You're making progress! ✨</Text>

          <View style={styles.progressTrack}>
            <View
  style={[
    styles.progressFill,
    {width: `${progress * 100}%`},
  ]}
/>
          </View>

          <Text style={styles.summaryText}>
           {completedCount} of {totalTasks} tasks completed 
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Overview</Text>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
             emoji="✓"
             title="Tasks"
             value={`${completedCount}/${totalTasks}`}
             subtitle={`${pendingCount} pending`}
             />
          <StatCard emoji="✎" title="Notes" value="0" subtitle="Quick ideas" />
          <StatCard emoji="₹" title="Expenses" value="₹0" subtitle="Spent today" />
          <StatCard emoji="◷" title="Reminders" value="0" subtitle="Upcoming" />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>

        <View style={styles.actionsRow}>
          {[
            {icon: '+', label: 'Add Task'},
            {icon: '✎', label: 'Quick Note'},
            {icon: '₹', label: 'Expense'},
            {icon: '◷', label: 'Reminder'},
          ].map(action => (
            <TouchableOpacity
              key={action.label}
              style={styles.action}
              onPress={() =>
                Alert.alert(
                  action.label,
                  'This feature will be connected in the next step.',
                )
              }>
              <View style={styles.actionIcon}>
                <Text style={styles.actionIconText}>{action.icon}</Text>
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Tasks</Text>
          <Text style={styles.smallText}>View all</Text>
        </View>

        <View style={styles.taskCard}>
          {tasks.map((task, index) => (
            <View
              key={task.id}
              style={[
                styles.taskRow,
                index !== tasks.length - 1 && styles.taskDivider,
              ]}>
              <View
                style={[
                  styles.checkbox,
                  task.completed && styles.checkboxDone,
                ]}>
                {task.completed ? <Text style={styles.checkmark}>✓</Text> : null}
              </View>

              <View style={styles.taskInfo}>
                <Text
                  style={[
                    styles.taskTitle,
                    task.completed && styles.taskDone,
                  ]}>
                  {task.title}
                </Text>
                <Text style={styles.taskTime}>{task.priority} priority</Text>
              </View>

              <View
                style={[
                  styles.priorityBadge,
                  {
                    backgroundColor: task.completed
                      ? colors.successLight
                      : colors.primaryLight,
                  },
                ]}>
                <Text
                  style={[
                    styles.priorityText,
                    {
                      color: task.completed ? colors.success : colors.primary,
                    },
                  ]}>
                  {task.completed ? 'Done' : 'Pending'}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Expense Snapshot</Text>
        </View>

        <View style={styles.expenseCard}>
          <View style={styles.expenseIcon}>
            <Text style={styles.expenseIconText}>₹</Text>
          </View>
          <View style={styles.expenseInfo}>
            <Text style={styles.expenseTitle}>Weekly spending</Text>
            <Text style={styles.smallText}>
              Your expense summary will appear here.
            </Text>
          </View>
          <Text style={styles.expenseValue}>₹0</Text>
        </View>

        <Text style={styles.footer}>
          Small steps lead to big results. 💜
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: 27,
    fontWeight: '800',
    color: colors.text,
  },
  logoAccent: {
    color: colors.primary,
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 3,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 18,
  },
  welcome: {
    marginTop: 27,
    marginBottom: 21,
  },
  greeting: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  heading: {
    fontSize: 27,
    fontWeight: '800',
    color: colors.text,
    marginTop: 7,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 5,
  },
  summaryCard: {
    padding: 18,
    backgroundColor: colors.primary,
    borderRadius: 20,
    marginBottom: 27,
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#E0E7FF',
  },
  summaryTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.white,
    marginTop: 9,
  },
  progressTrack: {
    height: 7,
    borderRadius: 5,
    backgroundColor: '#FFFFFF50',
    overflow: 'hidden',
    marginTop: 19,
  },
  progressFill: {
    height: '100%',
    width: '33.33%',
    backgroundColor: colors.white,
    borderRadius: 5,
  },
  summaryText: {
    fontSize: 11,
    color: '#E0E7FF',
    marginTop: 9,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 13,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    minHeight: 116,
    padding: 13,
    marginBottom: 12,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statEmoji: {
    fontSize: 19,
    color: colors.primary,
  },
  statTitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 5,
  },
  statValue: {
    fontSize: 23,
    fontWeight: '800',
    color: colors.text,
    marginTop: 5,
  },
  statSubtitle: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 27,
  },
  action: {
    width: '23%',
    alignItems: 'center',
  },
  actionIcon: {
    width: 53,
    height: 53,
    backgroundColor: colors.primaryLight,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconText: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
  },
  actionLabel: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
    color: colors.textSecondary,
  },
  smallText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  taskCard: {
    paddingHorizontal: 13,
    backgroundColor: colors.white,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 27,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  taskDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  checkmark: {
    fontSize: 13,
    color: colors.white,
    fontWeight: '800',
  },
  taskInfo: {
    flex: 1,
    marginLeft: 11,
    marginRight: 5,
  },
  taskTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  taskDone: {
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  taskTime: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 5,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 9,
    fontWeight: '700',
  },
  expenseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  expenseIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: colors.warningLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expenseIconText: {
    fontSize: 21,
    fontWeight: '800',
    color: '#B45309',
  },
  expenseInfo: {
    flex: 1,
    marginLeft: 11,
    marginRight: 6,
  },
  expenseTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 5,
  },
  expenseValue: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  footer: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 24,
  },
});