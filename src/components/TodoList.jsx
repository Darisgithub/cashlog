import { useState, useEffect } from 'react';
import { supabase } from '../lib/supaClient';
import { Plus, Trash2, Check, ListTodo, Clipboard, Pencil } from 'lucide-react';
import Swal from 'sweetalert2';

function TodoList({ session }) {
    const [tasks, setTasks] = useState([]);
    const [, setLoading] = useState(true);
    const [newTaskInput, setNewTaskInput] = useState('');

    useEffect(() => {
        fetchTodos();
    }, [session]);

    const fetchTodos = async () => {
        try {
            const { data, error } = await supabase
                .from('todos')
                .select('*')
                .order('created_at', { ascending: false });

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

            // Toast notification for multiple items
            if (rawTasks.length > 1) {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: `${rawTasks.length} tugas ditambahkan`,
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        } catch (error) {
            console.error('Error adding tasks:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Gagal menambah tugas',
            });
        } finally {
            setLoading(false);
        }
    };

    const toggleTask = async (id, currentStatus) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, is_completed: !currentStatus } : t));

        try {
            const { error } = await supabase
                .from('todos')
                .update({ is_completed: !currentStatus })
                .eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error updating task:', error);
            setTasks(tasks.map(t => t.id === id ? { ...t, is_completed: currentStatus } : t));
        }
    };

    const handleEditTask = async (task) => {
        const { value: newText } = await Swal.fire({
            title: 'Edit Tugas',
            input: 'textarea',
            inputValue: task.task,
            showCancelButton: true,
            confirmButtonText: 'Simpan',
            cancelButtonText: 'Batal',
            inputValidator: (value) => {
                if (!value) {
                    return 'Tugas tidak boleh kosong!';
                }
            },
            customClass: {
                input: 'dark:bg-gray-700 dark:text-white',
                popup: 'dark:bg-gray-800 dark:text-gray-100'
            }
        });

        if (newText && newText !== task.task) {
            const originalTasks = [...tasks];
            setTasks(tasks.map(t => t.id === task.id ? { ...t, task: newText } : t));

            try {
                const { error } = await supabase
                    .from('todos')
                    .update({ task: newText })
                    .eq('id', task.id);

                if (error) throw error;

                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: 'Tugas berhasil diperbarui!',
                    timer: 1000,
                    showConfirmButton: false
                });
            } catch (error) {
                console.error('Error updating task:', error);
                setTasks(originalTasks);
                Swal.fire('Error', 'Gagal update tugas.', 'error');
            }
        }
    };

    const deleteTask = async (id) => {
        const result = await Swal.fire({
            title: 'Hapus tugas ini?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal',
            customClass: {
                popup: 'dark:bg-gray-800 dark:text-gray-100',
                title: 'dark:text-gray-100'
            }
        });

        if (result.isConfirmed) {
            const originalTasks = [...tasks];
            setTasks(tasks.filter(t => t.id !== id));

            try {
                const { error } = await supabase
                    .from('todos')
                    .delete()
                    .eq('id', id);

                if (error) throw error;

                Swal.fire({
                    icon: 'success',
                    title: 'Terhapus!',
                    timer: 1000,
                    showConfirmButton: false
                });
            } catch (error) {
                console.error('Error deleting task:', error);
                setTasks(originalTasks); // Revert on error
                Swal.fire('Error', 'Gagal menghapus tugas.', 'error');
            }
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700/50 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <ListTodo className="text-indigo-500" />
                    To-Do List
                </h2>
                <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-full text-gray-500 dark:text-gray-400 font-medium">
                    {tasks.filter(t => !t.is_completed).length} Pending
                </span>
            </div>

            <form onSubmit={handleAddTask} className="mb-6">
                <div className="relative">
                    <textarea
                        value={newTaskInput}
                        onChange={(e) => setNewTaskInput(e.target.value)}
                        placeholder="Paste list disini (per baris)"
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
                        title="Add Task"
                    >
                        <Plus size={20} />
                    </button>
                    {newTaskInput.trim() === '' && (
                        <div className="absolute top-3 right-3 opacity-30 pointer-events-none">
                            <Clipboard size={16} />
                        </div>
                    )}
                </div>
                <p className="mt-2 text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                    <span>💡</span> Tip: Paste banyak baris sekaligus untuk input cepat.
                </p>
            </form>

            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin space-y-2 max-h-[400px]">
                {tasks.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 dark:text-gray-600 text-sm flex flex-col items-center gap-2">
                        <ListTodo size={40} strokeWidth={1} />
                        <p>Belum ada tugas. Mulai produktif hari ini!</p>
                    </div>
                ) : (
                    [...tasks].sort((a, b) => {
                        // Sort by completed status (false first, true last)
                        if (a.is_completed !== b.is_completed) {
                            return a.is_completed ? 1 : -1;
                        }
                        // Then sort by ID/Expected creation (descending)
                        return b.id - a.id;
                    }).map(task => (
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
                                {task.is_completed && <Check size={12} strokeWidth={4} />}
                            </button>

                            <span className={`flex-1 text-sm break-all pt-0.5 ${task.is_completed
                                ? 'text-gray-400 line-through'
                                : 'text-gray-700 dark:text-gray-200'
                                }`}>
                                {task.task}
                            </span>

                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleEditTask(task)}
                                    className="p-1 text-gray-400 hover:text-blue-500 transition-all rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                    title="Edit Task"
                                >
                                    <Pencil size={16} />
                                </button>
                                <button
                                    onClick={() => deleteTask(task.id)}
                                    className="p-1 text-gray-400 hover:text-red-500 transition-all rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                                    title="Delete Task"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default TodoList;
