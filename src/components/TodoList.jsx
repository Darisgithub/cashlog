import { useState, useEffect } from 'react';
import { supabase } from '../lib/supaClient';

function TodoList({ session }) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newTaskInput, setNewTaskInput] = useState('');
    const [isPasting, setIsPasting] = useState(false);

    useEffect(() => {
        fetchTodos();
    }, [session]);

    const fetchTodos = async () => {
        try {
            const { data, error } = await supabase
                .from('todos')
                .select('*')
                .order('created_at', { ascending: false }); // Newest first

            if (error) throw error;
            setTasks(data || []);
        } catch (error) {
            console.error('Error fetching todos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTaskInput.trim()) return;

        setLoading(true);
        // Split by newline to handle bulk paste
        const rawTasks = newTaskInput.split('\n').filter(t => t.trim() !== '');

        const tasksToInsert = rawTasks.map(task => ({
            task: task.trim(),
            user_id: session.user.id,
            is_completed: false
        }));

        try {
            const { data, error } = await supabase
                .from('todos')
                .insert(tasksToInsert)
                .select();

            if (error) throw error;

            setTasks(prev => [...(data || []), ...prev]);
            setNewTaskInput('');
            setIsPasting(false);
        } catch (error) {
            console.error('Error adding tasks:', error);
            alert('Gagal menambah tugas');
        } finally {
            setLoading(false);
        }
    };

    const toggleTask = async (id, currentStatus) => {
        // Optimistic update
        setTasks(tasks.map(t => t.id === id ? { ...t, is_completed: !currentStatus } : t));

        try {
            const { error } = await supabase
                .from('todos')
                .update({ is_completed: !currentStatus })
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error updating task:', error);
            // Revert on error
            setTasks(tasks.map(t => t.id === id ? { ...t, is_completed: currentStatus } : t));
        }
    };

    const deleteTask = async (id) => {
        // Optimistic update
        setTasks(tasks.filter(t => t.id !== id));

        try {
            const { error } = await supabase
                .from('todos')
                .delete()
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error deleting task:', error);
            fetchTodos(); // Re-fetch to sync
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700/50 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    ✅ To-Do List
                </h2>
                <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-500 dark:text-gray-400">
                    {tasks.filter(t => !t.is_completed).length} Pending
                </span>
            </div>

            <form onSubmit={handleAddTask} className="mb-6">
                <div className="relative">
                    <textarea
                        value={newTaskInput}
                        onChange={(e) => setNewTaskInput(e.target.value)}
                        placeholder="Paste list tasks here (one per line)..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all outline-none resize-none min-h-[80px] text-sm"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleAddTask(e);
                            }
                        }}
                    />
                    <button
                        type="submit"
                        disabled={!newTaskInput.trim()}
                        className="absolute bottom-3 right-3 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        ➕
                    </button>
                </div>
                <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                    Tip: Paste banyak baris sekaligus untuk input cepat.
                </p>
            </form>

            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin space-y-2 max-h-[400px]">
                {tasks.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 dark:text-gray-600 text-sm">
                        Belum ada tugas. Mulai produktif hari ini!
                    </div>
                ) : (
                    tasks.map(task => (
                        <div
                            key={task.id}
                            className={`group flex items-start gap-3 p-3 rounded-xl transition-all duration-200 border ${task.is_completed
                                    ? 'bg-gray-50 dark:bg-gray-800/50 border-transparent opacity-60'
                                    : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800'
                                }`}
                        >
                            <button
                                onClick={() => toggleTask(task.id, task.is_completed)}
                                className={`mt-0.5 min-w-[20px] h-[20px] rounded-full border-2 flex items-center justify-center transition-colors ${task.is_completed
                                        ? 'bg-green-500 border-green-500 text-white'
                                        : 'border-gray-300 dark:border-gray-600 hover:border-indigo-500'
                                    }`}
                            >
                                {task.is_completed && <span className="text-[10px]">✓</span>}
                            </button>

                            <span className={`flex-1 text-sm break-all ${task.is_completed
                                    ? 'text-gray-400 line-through'
                                    : 'text-gray-700 dark:text-gray-200'
                                }`}>
                                {task.task}
                            </span>

                            <button
                                onClick={() => deleteTask(task.id)}
                                className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                            >
                                ✕
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default TodoList;
