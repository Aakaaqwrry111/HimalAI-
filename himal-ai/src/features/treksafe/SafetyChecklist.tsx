import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Plus } from 'lucide-react';

interface ChecklistItem {
  id: number;
  text: string;
  completed: boolean;
}

const DEFAULT_TASKS: ChecklistItem[] = [
  { id: 1, text: 'Acclimatization day completed', completed: true },
  { id: 2, text: 'Water purified (3 Liters)', completed: false },
  { id: 3, text: 'Diamox (Acetazolamide) packed', completed: true },
  { id: 4, text: 'Headlamp batteries', completed: false },
];

export default function SafetyChecklist() {
  // Initialize state from localStorage, fallback to defaults
  const [tasks, setTasks] = useState<ChecklistItem[]>(() => {
    if (typeof window === 'undefined') return DEFAULT_TASKS;
    const saved = localStorage.getItem('treksafe_checklist');
    return saved ? JSON.parse(saved) : DEFAULT_TASKS;
  });

  const [newTaskText, setNewTaskText] = useState('');

  // Save to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('treksafe_checklist', JSON.stringify(tasks));
  }, [tasks]);

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    const newTask: ChecklistItem = {
      id: Date.now(),
      text: newTaskText.trim(),
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setNewTaskText('');
  };

  return (
    <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 flex flex-col h-full min-h-[300px]">
      <h3 className="text-white/50 text-xs font-bold uppercase tracking-widest mb-4">
        Safety Checklist
      </h3>

      <div className="flex-grow overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className="flex items-start gap-3 cursor-pointer group"
          >
            <div className="mt-0.5 flex-shrink-0">
              {task.completed ? (
                <CheckCircle2 size={18} className="text-emerald-500" />
              ) : (
                <Circle
                  size={18}
                  className="text-white/30 group-hover:text-white/60 transition-colors"
                />
              )}
            </div>

            <span
              className={`text-sm transition-all duration-200 ${
                task.completed
                  ? 'text-white/40 line-through'
                  : 'text-white/90 group-hover:text-white'
              }`}
            >
              {task.text}
            </span>
          </div>
        ))}

        {tasks.length === 0 && (
          <p className="text-white/30 text-sm italic text-center py-4">
            All checks complete. You're good to go.
          </p>
        )}
      </div>

      <form
        onSubmit={handleAddTask}
        className="relative mt-auto pt-4 border-t border-white/10"
      >
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Add safety check..."
          className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-4 pr-10 text-sm text-white placeholder:text-white/30 outline-none focus:border-accent-temple-gold transition-colors"
        />
        <button
          type="submit"
          disabled={!newTaskText.trim()}
          className="absolute right-3 top-[26px] text-white/40 hover:text-accent-temple-gold disabled:opacity-50 disabled:hover:text-white/40 transition-colors"
        >
          <Plus size={20} />
        </button>
      </form>
    </div>
  );
}