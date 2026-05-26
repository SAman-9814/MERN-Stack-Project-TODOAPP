import React from 'react';
import { Trash2, Edit2, CheckCircle2, Circle, Calendar, AlertCircle } from 'lucide-react';

const TAG_COLOR_MAP = {
  Code: 'bg-blue-500/10 text-blue-650 dark:text-blue-400 border-blue-500/15',
  Design: 'bg-purple-500/10 text-purple-650 dark:text-purple-400 border-purple-500/15',
  Planning: 'bg-amber-500/10 text-amber-650 dark:text-amber-400 border-amber-500/15',
  Personal: 'bg-pink-500/10 text-pink-650 dark:text-pink-400 border-pink-500/15',
  Finance: 'bg-emerald-500/10 text-emerald-650 dark:text-emerald-400 border-emerald-500/15'
};

export default function TodoCard({ todo, index, onToggleComplete, onEdit, onDelete }) {
  
  // Dynamic border glow mouse tracking
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = !todo.completed && todo.dueDate && new Date(todo.dueDate) < new Date();

  // Helper colors for priorities
  const getPriorityBadge = (p) => {
    switch (p) {
      case 'high':
        return 'bg-red-500/10 text-red-650 dark:text-red-400 border-red-500/20';
      case 'low':
        return 'bg-blue-500/10 text-blue-650 dark:text-blue-400 border-blue-500/20';
      case 'medium':
      default:
        return 'bg-amber-500/10 text-amber-650 dark:text-amber-400 border-amber-500/20';
    }
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className={`group cursor-glow-card relative overflow-hidden rounded-2xl border transition-all duration-300 animate-fade-in-up ${
        todo.completed 
          ? 'border-emerald-500/20 bg-emerald-50/20 dark:bg-emerald-950/10 backdrop-blur-md shadow-sm' 
          : 'border-slate-200 dark:border-slate-850 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md hover:border-transparent dark:hover:border-transparent shadow-sm hover:shadow-xl dark:hover:shadow-slate-950/50 hover:-translate-y-0.5'
      }`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      
      {/* Background Gradient Glow (theme specific) */}
      <div className={`absolute -right-16 -top-16 h-32 w-32 rounded-full blur-3xl transition-opacity duration-500 opacity-0 group-hover:opacity-100 pointer-events-none ${
        todo.completed ? 'bg-emerald-500/10' : 'bg-blue-500/10 dark:bg-blue-500/5'
      }`} />

      <div className="p-6 flex flex-col justify-between h-full gap-4 relative z-10">
        
        {/* Top Header line: Checkbox, Title & Priority */}
        <div className="flex items-start gap-4">
          <button 
            onClick={() => onToggleComplete(todo)}
            className="mt-1 flex-shrink-0 cursor-pointer rounded-full transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none"
            aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
          >
            {todo.completed ? (
              <CheckCircle2 className="h-6 w-6 text-emerald-500 dark:text-emerald-400 fill-emerald-500/10" />
            ) : (
              <Circle className="h-6 w-6 text-slate-350 dark:text-slate-655 text-slate-500 dark:text-slate-650 hover:text-blue-500 dark:hover:text-blue-400 hover:scale-105 transition-all" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className={`text-base font-bold tracking-wide truncate transition-all duration-300 ${
                todo.completed 
                  ? 'text-slate-400 dark:text-slate-600 line-through decoration-slate-350 dark:decoration-slate-700' 
                  : 'text-slate-800 dark:text-slate-100'
              }`}>
                {todo.title}
              </h3>
              
              {/* Priority badge */}
              {todo.priority && (
                <span className={`text-[10px] px-2 py-0.5 font-bold uppercase rounded-md border tracking-wider ${getPriorityBadge(todo.priority)}`}>
                  {todo.priority}
                </span>
              )}
            </div>
            
            <p className={`mt-2 text-sm leading-relaxed transition-all duration-300 ${
              todo.completed 
                ? 'text-slate-400 dark:text-slate-600 line-through' 
                : 'text-slate-600 dark:text-slate-400'
            }`}>
              {todo.description}
            </p>
          </div>
        </div>

        {/* Middle Line: Tags */}
        {todo.tags && todo.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {todo.tags.map(tag => (
              <span 
                key={tag} 
                className={`text-[10px] px-2 py-0.5 font-semibold rounded-lg border ${
                  TAG_COLOR_MAP[tag] || 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border-slate-200'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Bottom Section: Meta details and actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-slate-100 dark:border-slate-800/60 pt-4 mt-2 gap-2">
          
          {/* Date / Timeline */}
          <div className="flex flex-col gap-1">
            {todo.dueDate && (
              <div className={`flex items-center gap-1 text-[11px] font-semibold ${
                isOverdue ? 'text-red-500 dark:text-red-400' : 'text-slate-455 text-slate-500 dark:text-slate-450'
              }`}>
                {isOverdue ? <AlertCircle className="h-3.5 w-3.5" /> : <Calendar className="h-3.5 w-3.5" />}
                <span>{isOverdue ? 'Overdue: ' : 'Due: '}{formatDate(todo.dueDate)}</span>
              </div>
            )}
            
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500">
              <span>
                {todo.updateAt && todo.updateAt !== todo.createAt ? 'Updated: ' : 'Created: '}
                {formatDate(todo.updateAt || todo.createAt)}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 self-end sm:self-center">
            <button
              onClick={() => onEdit(todo)}
              className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-850 transition-all duration-200 cursor-pointer"
              title="Edit Task"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(todo._id)}
              className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-red-650 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200 cursor-pointer"
              title="Delete Task"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
