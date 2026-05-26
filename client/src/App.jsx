import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, Search, CheckCircle, Clock, ListTodo, AlertTriangle, 
  RefreshCw, CheckSquare, Sparkles, Sun, Moon, LayoutGrid, Kanban 
} from 'lucide-react';
import TodoCard from './components/TodoCard';
import TodoForm from './components/TodoForm';
import Toast from './components/Toast';

const API_BASE = 'http://localhost:3000/api/v1';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'completed', 'pending'
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'kanban'
  const [toasts, setToasts] = useState([]);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  // Handle dark mode class on HTML document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Toast notifications helper
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Fetch todos
  const fetchTodos = async (showNotification = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE}/getTodos`);
      if (response.data.success) {
        setTodos(response.data.data);
        if (showNotification) {
          showToast('Workspace tasks synced successfully', 'success');
        }
      } else {
        setError(response.data.message || 'Failed to fetch tasks');
        showToast(response.data.message || 'Failed to fetch tasks', 'error');
      }
    } catch (err) {
      console.error(err);
      setError('Could not connect to the backend server. Make sure the database and backend are running.');
      showToast('Backend connection offline', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos(false);
  }, []);

  // Create or Update Todo
  const handleFormSubmit = async (formData) => {
    try {
      if (todoToEdit) {
        // Update existing
        const response = await axios.put(`${API_BASE}/updateTodos/${todoToEdit._id}`, {
          ...formData,
          completed: todoToEdit.completed
        });
        if (response.data.success) {
          setTodos(prev => prev.map(t => t._id === todoToEdit._id ? response.data.data : t));
          showToast('Task updated successfully', 'success');
        }
      } else {
        // Create new
        const response = await axios.post(`${API_BASE}/createTodo`, {
          ...formData,
          completed: false
        });
        if (response.data.success) {
          setTodos(prev => [response.data.data, ...prev]);
          showToast('Task created successfully', 'success');
        }
      }
      setIsFormOpen(false);
      setTodoToEdit(null);
    } catch (err) {
      console.error(err);
      showToast('Failed to save task properties', 'error');
    }
  };

  // Toggle complete state
  const handleToggleComplete = async (todo) => {
    try {
      const updatedCompleted = !todo.completed;
      const response = await axios.put(`${API_BASE}/updateTodos/${todo._id}`, {
        title: todo.title,
        description: todo.description,
        completed: updatedCompleted,
        priority: todo.priority,
        dueDate: todo.dueDate,
        tags: todo.tags
      });
      if (response.data.success) {
        setTodos(prev => prev.map(t => t._id === todo._id ? response.data.data : t));
        showToast(updatedCompleted ? 'Task completed! 🎉' : 'Task marked as pending', 'success');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to update task status', 'error');
    }
  };

  // Delete Todo
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${API_BASE}/deleteTodos/${id}`);
      if (response.data.success) {
        setTodos(prev => prev.filter(t => t._id !== id));
        showToast('Task removed from workspace', 'success');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to remove task', 'error');
    }
  };

  // Open Edit Form
  const handleEditClick = (todo) => {
    setTodoToEdit(todo);
    setIsFormOpen(true);
  };

  // Open Add Form
  const handleAddClick = () => {
    setTodoToEdit(null);
    setIsFormOpen(true);
  };

  // Calculate statistics
  const totalCount = todos.length;
  const completedCount = todos.filter(t => t.completed).length;
  const pendingCount = totalCount - completedCount;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Filter & Search Logic
  const getFilteredTodos = (tasksList) => {
    return tasksList.filter(todo => {
      const matchesSearch = 
        todo.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        todo.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (filter === 'completed') return matchesSearch && todo.completed;
      if (filter === 'pending') return matchesSearch && !todo.completed;
      return matchesSearch;
    });
  };

  const displayedTodos = getFilteredTodos(todos);

  return (
    <div className="min-h-screen pb-20 relative transition-colors duration-500">
      {/* Decorative Blur Background Circles */}
      <div className="bg-gradient-spheres">
        <div className="sphere sphere-1" />
        <div className="sphere sphere-2" />
        <div className="sphere sphere-3" />
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Header Block */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-6 border-b border-slate-200 dark:border-slate-900">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-blue-500/10 dark:bg-blue-500/10 text-blue-650 dark:text-blue-400 rounded-xl animate-pulse-slow">
                <Sparkles className="h-6 w-6 animate-spin-slow" />
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-650 dark:from-white dark:via-slate-200 dark:to-slate-400">
                AetherFlow Workspace
              </h1>
            </div>
            <p className="mt-2 text-sm text-slate-550 dark:text-slate-400">
              Accelerate your daily velocity with premium task synchronization.
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 p-1 bg-slate-105 bg-slate-100 dark:bg-slate-900/60 rounded-2xl border border-slate-200/50 dark:border-slate-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  viewMode === 'grid' 
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-650 dark:hover:text-slate-200'
                }`}
                title="Grid Layout"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  viewMode === 'kanban' 
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-650 dark:hover:text-slate-200'
                }`}
                title="Kanban Board"
              >
                <Kanban className="h-4 w-4" />
              </button>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/65 text-slate-500 dark:text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-100 shadow-sm cursor-pointer transition-all duration-200"
              aria-label="Toggle Dark/Light Mode"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-indigo-650" />}
            </button>

            <button
              onClick={handleAddClick}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Create Task</span>
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {/* Stat 1: Total Tasks */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-900 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md p-6 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Total Tasks</p>
              <h3 className="text-3xl font-bold mt-1 text-slate-800 dark:text-slate-100">{totalCount}</h3>
            </div>
            <div className="p-3 bg-slate-100 dark:bg-slate-800/80 text-slate-550 dark:text-slate-300 rounded-xl">
              <ListTodo className="h-5 w-5" />
            </div>
          </div>

          {/* Stat 2: Pending */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-900 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md p-6 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Pending Tasks</p>
              <h3 className="text-3xl font-bold mt-1 text-amber-600 dark:text-amber-400">{pendingCount}</h3>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
              <Clock className="h-5 w-5" />
            </div>
          </div>

          {/* Stat 3: Completed */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-900 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md p-6 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Completed</p>
              <h3 className="text-3xl font-bold mt-1 text-emerald-650 dark:text-emerald-400">{completedCount}</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 rounded-xl">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>

          {/* Stat 4: Progress Bar */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-900 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md p-6 flex flex-col justify-center shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Completion Ratio</p>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </section>

        {/* Filters and Search Row */}
        <section className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-8 bg-white/40 dark:bg-slate-900/20 p-4 rounded-2xl border border-slate-200 dark:border-slate-900/60 backdrop-blur-md shadow-sm">
          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-100 dark:bg-slate-950/60 rounded-xl border border-slate-200/55 dark:border-slate-800">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-900'
              }`}
            >
              All Tasks
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                filter === 'pending' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-900'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                filter === 'completed' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-900'
              }`}
            >
              Completed ({completedCount})
            </button>
          </div>

          {/* Search bar */}
          <div className="relative flex-1 md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-850 bg-white/50 dark:bg-slate-950/40 pl-10 pr-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-500/50 focus:bg-white dark:focus:bg-slate-950/85 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
            />
          </div>
        </section>

        {/* Content Section */}
        {error && (
          <div className="flex items-start gap-3 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-500/20 p-5 text-red-650 dark:text-red-400 mb-8 shadow-sm">
            <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-200">Connection Error</h4>
              <p className="text-sm mt-1 text-red-550 dark:text-red-400/90">{error}</p>
              <button 
                onClick={() => fetchTodos(true)}
                className="mt-3 flex items-center gap-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Retry Connection</span>
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500 gap-3">
            <div className="h-10 w-10 border-4 border-blue-500/20 dark:border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-sm font-medium tracking-wide">Syncing workspace...</p>
          </div>
        ) : displayedTodos.length > 0 ? (
          /* Conditional Layout modes */
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedTodos.map((todo, idx) => (
                <TodoCard
                  key={todo._id}
                  todo={todo}
                  index={idx}
                  onToggleComplete={handleToggleComplete}
                  onEdit={handleEditClick}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            /* Kanban Board Mode */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Column 1: Pending column */}
              <div className="rounded-3xl border border-slate-200 dark:border-slate-850 bg-white/40 dark:bg-slate-900/10 p-6 backdrop-blur-md shadow-sm">
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
                    <h3 className="font-bold text-slate-850 dark:text-slate-200">Pending Column</h3>
                  </div>
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    {displayedTodos.filter(t => !t.completed).length}
                  </span>
                </div>
                
                <div className="space-y-4">
                  {displayedTodos.filter(t => !t.completed).length > 0 ? (
                    displayedTodos.filter(t => !t.completed).map((todo, idx) => (
                      <TodoCard
                        key={todo._id}
                        todo={todo}
                        index={idx}
                        onToggleComplete={handleToggleComplete}
                        onEdit={handleEditClick}
                        onDelete={handleDelete}
                      />
                    ))
                  ) : (
                    <div className="text-center py-10 text-xs text-slate-400 dark:text-slate-500">
                      No pending tasks remaining. Well done!
                    </div>
                  )}
                </div>
              </div>

              {/* Column 2: Completed column */}
              <div className="rounded-3xl border border-slate-200 dark:border-slate-850 bg-white/40 dark:bg-slate-900/10 p-6 backdrop-blur-md shadow-sm">
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <h3 className="font-bold text-slate-850 dark:text-slate-200">Completed Column</h3>
                  </div>
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    {displayedTodos.filter(t => t.completed).length}
                  </span>
                </div>
                
                <div className="space-y-4">
                  {displayedTodos.filter(t => t.completed).length > 0 ? (
                    displayedTodos.filter(t => t.completed).map((todo, idx) => (
                      <TodoCard
                        key={todo._id}
                        todo={todo}
                        index={idx}
                        onToggleComplete={handleToggleComplete}
                        onEdit={handleEditClick}
                        onDelete={handleDelete}
                      />
                    ))
                  ) : (
                    <div className="text-center py-10 text-xs text-slate-400 dark:text-slate-500">
                      Completed tasks will appear here.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/30 dark:bg-slate-950/20 backdrop-blur-md py-20 text-center px-4 shadow-sm">
            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 text-slate-400 dark:text-slate-500 rounded-2xl mb-4 border border-slate-200/55 dark:border-slate-850">
              <CheckSquare className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-850 dark:text-slate-200">No tasks found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm">
              {searchQuery || filter !== 'all' 
                ? "No tasks match your current query or status filters. Try clearing your filters." 
                : "Your todo list is empty. Get started by creating your first task!"}
            </p>
            {(searchQuery || filter !== 'all') ? (
              <button
                onClick={() => { setSearchQuery(''); setFilter('all'); }}
                className="mt-4 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
              >
                Clear Filters
              </button>
            ) : (
              <button
                onClick={handleAddClick}
                className="mt-6 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-650 dark:text-blue-400 font-semibold text-sm px-5 py-2.5 transition-all active:scale-95 animate-bounce-slow"
              >
                Get Started
              </button>
            )}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-slate-200 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
          <div>
            <p className="font-semibold text-slate-700 dark:text-slate-400 text-sm">AetherFlow Workspace</p>
            <p className="mt-1">A premium full-stack task manager by Aman Sah.</p>
          </div>
          
          {/* Tech stack badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-blue-500/5 text-blue-650 dark:text-blue-400 border border-blue-500/10 hover:scale-105 transition-transform">React</span>
            <span className="px-2.5 py-1 rounded-md bg-cyan-500/5 text-cyan-650 dark:text-cyan-400 border border-cyan-500/10 hover:scale-105 transition-transform">Tailwind CSS</span>
            <span className="px-2.5 py-1 rounded-md bg-green-500/5 text-green-600 dark:text-green-400 border border-green-500/10 hover:scale-105 transition-transform">Node.js</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-500/5 text-slate-600 dark:text-slate-400 border border-slate-500/10 hover:scale-105 transition-transform">Express</span>
            <span className="px-2.5 py-1 rounded-md bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10 hover:scale-105 transition-transform">MongoDB</span>
          </div>

          <div className="text-center md:text-right">
            <p>© {new Date().getFullYear()} AetherFlow. All rights reserved.</p>
            <p className="mt-1 flex items-center justify-center md:justify-end gap-1">
              <span>Made with</span>
              <span className="text-red-500 animate-pulse-slow">❤️</span>
              <span>for developer workflows</span>
            </p>
          </div>
        </footer>

      </div>

      {/* Slide-over Drawer / Modal */}
      <TodoForm
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setTodoToEdit(null); }}
        onSubmit={handleFormSubmit}
        todoToEdit={todoToEdit}
      />

      {/* Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full">
        {toasts.map(toast => (
          <Toast 
            key={toast.id} 
            toast={toast} 
            onClose={() => removeToast(toast.id)} 
          />
        ))}
      </div>
    </div>
  );
}
