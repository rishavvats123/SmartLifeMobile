
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Priority = 'High' | 'Medium' | 'Low';

export type Task = {
  id: string;
  title: string;
  priority: Priority;
  completed: boolean;
};

type TasksContextValue = {
  tasks: Task[];
  isLoaded: boolean;
  addTask: (title: string, priority: Priority) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
};

const STORAGE_KEY = '@SmartLifeMobile:tasks';

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Review project progress',
    priority: 'High',
    completed: false,
  },
  {
    id: '2',
    title: 'Plan tomorrow',
    priority: 'Medium',
    completed: false,
  },
];

const TasksContext = createContext<TasksContextValue | undefined>(
  undefined,
);

export function TasksProvider({children}: {children: ReactNode}) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadTasks() {
      try {
        const savedTasks = await AsyncStorage.getItem(STORAGE_KEY);

        if (!active) {
          return;
        }

        if (savedTasks !== null) {
          const parsed: unknown = JSON.parse(savedTasks);

          if (
            Array.isArray(parsed) &&
            parsed.every(
              task =>
                task !== null &&
                typeof task === 'object' &&
                typeof task.id === 'string' &&
                typeof task.title === 'string' &&
                ['High', 'Medium', 'Low'].includes(task.priority) &&
                typeof task.completed === 'boolean',
            )
          ) {
            setTasks(parsed as Task[]);
          } else {
            setTasks(initialTasks);
          }
        } else {
          setTasks(initialTasks);
        }
      } catch (error) {
        console.warn('Could not load saved tasks:', error);

        if (active) {
          setTasks(initialTasks);
        }
      } finally {
        if (active) {
          setIsLoaded(true);
        }
      }
    }

    loadTasks();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)).catch(
      error => {
        console.warn('Could not save tasks:', error);
      },
    );
  }, [tasks, isLoaded]);

  const addTask = useCallback((title: string, priority: Priority) => {
    const cleanTitle = title.trim();

    if (!cleanTitle) {
      return;
    }

    setTasks(current => [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        title: cleanTitle,
        priority,
        completed: false,
      },
      ...current,
    ]);
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks(current =>
      current.map(task =>
        task.id === id ? {...task, completed: !task.completed} : task,
      ),
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(current => current.filter(task => task.id !== id));
  }, []);

  return (
    <TasksContext.Provider
      value={{tasks, isLoaded, addTask, toggleTask, deleteTask}}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);

  if (!context) {
    throw new Error('useTasks must be used inside TasksProvider');
  }

  return context;
}
