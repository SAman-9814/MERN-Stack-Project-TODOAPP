import React, { useState, useEffect } from 'react';
import { X, Check, Calendar, Tag, AlertCircle } from 'lucide-react';

const AVAILABLE_TAGS = [
  { name: 'Code', color: 'border-blue-500/20 bg-blue-500/5 text-blue-650 dark:text-blue-450 text-blue-400' },
  { name: 'Design', color: 'border-purple-500/20 bg-purple-500/5 text-purple-650 dark:text-purple-450 text-purple-400' },
  { name: 'Planning', color: 'border-amber-500/20 bg-amber-500/5 text-amber-650 dark:text-amber-450 text-amber-400' },
  { name: 'Personal', color: 'border-pink-500/20 bg-pink-500/5 text-pink-650 dark:text-pink-450 text-pink-400' },
  { name: 'Finance', color: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-650 dark:text-emerald-450 text-emerald-400' }
];

export default function TodoForm({ isOpen, onClose, onSubmit, todoToEdit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium'); // 'low' | 'medium' | 'high'
  const [dueDate, setDueDate] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (todoToEdit) {
      setTitle(todoToEdit.title || '');
      setDescription(todoToEdit.description || '');
      setPriority(todoToEdit.priority || 'medium');
      
      // Format date for HTML input field (yyyy-MM-dd)
      if (todoToEdit.dueDate) {
        const d = new Date(todoToEdit.dueDate);
        const formattedDate = d.toISOString().split('T')[0];
        setDueDate(formattedDate);
      } else {
        setDueDate('');
      }
      setSelectedTags(todoToEdit.tags || []);
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
      setSelectedTags([]);
    }
    setError('');
  }, [todoToEdit, isOpen]);

  const handleTagToggle = (tagName) => {
    setSelectedTags(prev => 
      prev.includes(tagName)
        ? prev.filter(t => t !== tagName)
        : [...prev, tagName]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!description.trim()) {
      setError('Description is required');
      return;
    }
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      tags: selectedTags
    });
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-slate-950/40 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Slide-Over Drawer panel */}
      <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-md sm:max-w-lg border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl transition-transform duration-300 ease-out transform ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        
        {/* Decorative Ambient glow */}
        <div className="absolute -left-20 top-20 h-40 w-40 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
        <div className="absolute right-0 bottom-20 h-32 w-32 rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />

        <div className="flex flex-col h-full relative z-10">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800/80">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-slate-800 dark:text-white">
                {todoToEdit ? 'Modify Task Details' : 'Create New Workflow'}
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                {todoToEdit ? 'Update metadata properties' : 'Design task settings & timeline'}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form Content - Scrollable */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-6 space-y-6 pr-2">
            {error && (
              <div className="rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-500/30 p-3 flex items-start gap-2 text-sm text-red-650 dark:text-red-405 text-red-600 dark:text-red-400">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-xs font-semibold uppercase tracking-wider text-slate-450 dark:text-slate-400">
                Task Title
              </label>
              <input
                type="text"
                id="title"
                maxLength={50}
                placeholder="e.g. Code authentication service"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 px-4 py-3 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:border-blue-500/50 focus:bg-white dark:focus:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all shadow-sm"
              />
              <div className="text-right text-[10px] text-slate-450 mt-1">
                {title.length}/50 characters
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-xs font-semibold uppercase tracking-wider text-slate-450 dark:text-slate-400">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                maxLength={50}
                placeholder="Break down subtasks, requirements, or dependencies..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 px-4 py-3 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:border-blue-500/50 focus:bg-white dark:focus:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all resize-none shadow-sm"
              />
              <div className="text-right text-[10px] text-slate-450 mt-1">
                {description.length}/50 characters
              </div>
            </div>

            {/* Priority Selector */}
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-slate-450 dark:text-slate-400 mb-2">
                Task Priority
              </span>
              <div className="grid grid-cols-3 gap-2">
                {['low', 'medium', 'high'].map(p => {
                  const isActive = priority === p;
                  let activeColors = '';
                  if (isActive) {
                    if (p === 'low') activeColors = 'bg-blue-500/10 border-blue-500/40 text-blue-650 dark:text-blue-400';
                    if (p === 'medium') activeColors = 'bg-amber-500/10 border-amber-500/40 text-amber-650 dark:text-amber-400';
                    if (p === 'high') activeColors = 'bg-red-500/10 border-red-500/40 text-red-650 dark:text-red-400';
                  }
                  
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`py-2 text-xs font-bold capitalize rounded-xl border transition-all cursor-pointer ${
                        isActive 
                          ? activeColors 
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850/60 text-slate-500 dark:text-slate-450'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label htmlFor="dueDate" className="block text-xs font-semibold uppercase tracking-wider text-slate-450 dark:text-slate-400 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>Due Date</span>
              </label>
              <input
                type="date"
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 px-4 py-3 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-450 focus:border-blue-500/50 focus:bg-white dark:focus:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all shadow-sm"
              />
            </div>

            {/* Category Tags */}
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-slate-450 dark:text-slate-400 flex items-center gap-1.5 mb-2">
                <Tag className="h-3.5 w-3.5" />
                <span>Categories / Tags</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_TAGS.map(tag => {
                  const isSelected = selectedTags.includes(tag.name);
                  return (
                    <button
                      key={tag.name}
                      type="button"
                      onClick={() => handleTagToggle(tag.name)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer hover:scale-[1.02] ${
                        isSelected 
                          ? `${tag.color} border-current ring-1 ring-current` 
                          : 'border-slate-200 dark:border-slate-800 bg-transparent text-slate-500 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-850/60'
                      }`}
                    >
                      {tag.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </form>

          {/* Footer actions */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-end gap-3 mt-auto">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-6 py-3 text-sm font-bold text-white hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-blue-500/20"
            >
              <Check className="h-4 w-4" />
              <span>{todoToEdit ? 'Save Changes' : 'Launch Task'}</span>
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
