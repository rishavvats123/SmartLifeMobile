
import React, {useMemo, useState} from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import colors from '../../theme/colors';
import {useTasks, type Priority} from '../../context/TasksContext';
type TaskFilter = 'All' | 'Pending' | 'Completed';

const priorityColors: Record<Priority, string> = {
  High: colors.error,
  Medium: colors.warning,
  Low: colors.success,
};

const filters: TaskFilter[] = ['All', 'Pending', 'Completed'];

export default function TasksScreen() {
 const {
  tasks,
  isLoaded,
  addTask: saveTask,
  toggleTask: toggleSavedTask,
  deleteTask: deleteSavedTask,
} = useTasks();

  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [filter, setFilter] = useState<TaskFilter>('All');

  const completedCount = tasks.filter(task => task.completed).length;
  const pendingCount = tasks.length - completedCount;

  const visibleTasks = useMemo(() => {
    if (filter === 'Pending') {
      return tasks.filter(task => !task.completed);
    }

    if (filter === 'Completed') {
      return tasks.filter(task => task.completed);
    }

    return tasks;
  }, [tasks, filter]);

  function addTask() {
    const title = newTask.trim();

    if (!title) {
      Alert.alert('Task required', 'Please enter a task title.');
      return;
    }

   saveTask(title, priority);
    setNewTask('');
    setPriority('Medium');
  }

  
function toggleTask(id: string) {
  toggleSavedTask(id);
}

  function deleteTask(id: string) {
    Alert.alert('Delete task', 'Are you sure you want to delete this task?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
  deleteSavedTask(id);
},
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Text style={styles.brand}>
          Smart<Text style={styles.brandAccent}>Life</Text>
        </Text>

        <View style={styles.headingRow}>
          <View style={styles.headingText}>
            <Text style={styles.heading}>My Tasks</Text>
            <Text style={styles.subtitle}>
              Make a plan. Get things done.
            </Text>
          </View>

          <View style={styles.headingIcon}>
            <Text style={styles.headingIconText}>✓</Text>
          </View>
        </View>

        {/* Task statistics */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{tasks.length}</Text>
            <Text style={styles.statLabel}>Total tasks</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={[styles.statNumber, {color: colors.warning}]}>
              {pendingCount}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={[styles.statNumber, {color: colors.success}]}>
              {completedCount}
            </Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        {/* Add task form */}
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Create a task</Text>

          <TextInput
            style={styles.input}
            placeholder="What do you need to do?"
            placeholderTextColor={colors.textMuted}
            value={newTask}
            onChangeText={setNewTask}
            onSubmitEditing={addTask}
            returnKeyType="done"
            maxLength={120}
            accessibilityLabel="New task title"
          />

          <Text style={styles.fieldLabel}>Choose priority</Text>

          <View style={styles.priorityRow}>
            {(['High', 'Medium', 'Low'] as Priority[]).map(item => {
              const selected = priority === item;

              return (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.priorityOption,
                    selected && {
                      borderColor: priorityColors[item],
                      backgroundColor: `${priorityColors[item]}15`,
                    },
                  ]}
                  onPress={() => setPriority(item)}
                  accessibilityRole="button"
                  accessibilityState={{selected}}>
                  <Text
                    style={[
                      styles.priorityOptionText,
                      selected && {color: priorityColors[item]},
                    ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={addTask}
            activeOpacity={0.8}
            accessibilityRole="button">
            <Text style={styles.addButtonText}>＋  Add Task</Text>
          </TouchableOpacity>
        </View>

        {/* Filters */}
        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>Your list</Text>
          <Text style={styles.listCount}>
            {visibleTasks.length} tasks
          </Text>
        </View>

        <View style={styles.filterRow}>
          {filters.map(item => (
            <TouchableOpacity
              key={item}
              style={[
                styles.filterChip,
                filter === item && styles.filterChipActive,
              ]}
              onPress={() => setFilter(item)}
              accessibilityRole="button"
              accessibilityState={{selected: filter === item}}>
              <Text
                style={[
                  styles.filterText,
                  filter === item && styles.filterTextActive,
                ]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Task list */}
        {visibleTasks.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>☀</Text>
            <Text style={styles.emptyTitle}>Nothing here yet</Text>
            <Text style={styles.emptyText}>
              {filter === 'Completed'
                ? 'Complete a task and it will appear here.'
                : filter === 'Pending'
                  ? 'All tasks are completed. Great job!'
                  : 'Add a task above to get your day started.'}
            </Text>
          </View>
        ) : (
          visibleTasks.map(task => (
            <View key={task.id} style={styles.taskCard}>
              <TouchableOpacity
                style={[
                  styles.checkbox,
                  task.completed && styles.checkboxChecked,
                ]}
                onPress={() => toggleTask(task.id)}
                accessibilityRole="checkbox"
                accessibilityState={{checked: task.completed}}
                accessibilityLabel={`Mark ${task.title} ${
                  task.completed ? 'incomplete' : 'complete'
                }`}>
                {task.completed ? (
                  <Text style={styles.checkmark}>✓</Text>
                ) : null}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.taskDetails}
                onPress={() => toggleTask(task.id)}
                activeOpacity={0.7}>
                <Text
                  style={[
                    styles.taskTitle,
                    task.completed && styles.taskCompleted,
                  ]}>
                  {task.title}
                </Text>

                <View style={styles.taskMeta}>
                  <View
                    style={[
                      styles.priorityDot,
                      {backgroundColor: priorityColors[task.priority]},
                    ]}
                  />
                  <Text
                    style={[
                      styles.taskPriority,
                      {color: priorityColors[task.priority]},
                    ]}>
                    {task.priority} priority
                  </Text>
                  <Text style={styles.taskStatus}>
                    {task.completed ? ' • Done' : ' • Pending'}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteTask(task.id)}
                accessibilityRole="button"
                accessibilityLabel={`Delete ${task.title}`}>
                <Text style={styles.deleteText}>×</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        <Text style={styles.footer}>
          One task at a time. You're doing great! 💜
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
    paddingBottom: 32,
  },
  brand: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  brandAccent: {
    color: colors.primary,
  },
  headingRow: {
    marginTop: 26,
    marginBottom: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headingText: {
    flex: 1,
  },
  heading: {
    fontSize: 29,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    marginTop: 5,
    color: colors.textSecondary,
    fontSize: 13,
  },
  headingIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headingIconText: {
    fontSize: 25,
    fontWeight: '800',
    color: colors.primary,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  statCard: {
    width: '31.5%',
    paddingVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: colors.white,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statNumber: {
    fontSize: 23,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 17,
    marginBottom: 27,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
  },
  input: {
    height: 49,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 13,
    marginTop: 15,
    color: colors.text,
    fontSize: 13,
  },
  fieldLabel: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 12,
    marginTop: 17,
    marginBottom: 10,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 9,
  },
  priorityOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  priorityOptionText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  addButton: {
    marginTop: 17,
    minHeight: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 13,
  },
  listCount: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 9,
    marginBottom: 15,
  },
  filterChip: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 15,
    paddingVertical: 9,
    backgroundColor: colors.white,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 12,
  },
  filterTextActive: {
    color: colors.white,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 13,
    paddingVertical: 14,
    marginBottom: 10,
  },
  checkbox: {
    height: 23,
    width: 23,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  checkmark: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
  },
  taskDetails: {
    flex: 1,
    marginLeft: 11,
    marginRight: 6,
  },
  taskTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  taskCompleted: {
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  taskPriority: {
    fontSize: 10,
    fontWeight: '700',
  },
  taskStatus: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  deleteButton: {
    height: 34,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 9,
    backgroundColor: colors.errorLight,
  },
  deleteText: {
    color: colors.error,
    fontSize: 23,
    lineHeight: 27,
    fontWeight: '600',
  },
  emptyCard: {
    paddingHorizontal: 22,
    paddingVertical: 32,
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyIcon: {
    fontSize: 32,
    color: colors.primary,
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  emptyText: {
    marginTop: 7,
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  footer: {
    marginTop: 24,
    textAlign: 'center',
    fontSize: 11,
    color: colors.textSecondary,
  },
});