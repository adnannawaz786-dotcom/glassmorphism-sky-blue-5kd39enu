import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Check, Edit3, X } from 'lucide-react'

function App() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingText, setEditingText] = useState('')
  const [filter, setFilter] = useState('all')

  // Load todos from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('glassmorphism-todos')
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos))
    }
  }, [])

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('glassmorphism-todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = (e) => {
    e.preventDefault()
    if (newTodo.trim()) {
      const todo = {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false,
        createdAt: new Date().toISOString()
      }
      setTodos([todo, ...todos])
      setNewTodo('')
    }
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const startEditing = (id, text) => {
    setEditingId(id)
    setEditingText(text)
  }

  const saveEdit = () => {
    if (editingText.trim()) {
      setTodos(todos.map(todo =>
        todo.id === editingId ? { ...todo, text: editingText.trim() } : todo
      ))
    }
    setEditingId(null)
    setEditingText('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingText('')
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const completedCount = todos.filter(todo => todo.completed).length
  const activeCount = todos.length - completedCount

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-cyan-600 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            Sky Todo
          </h1>
          <p className="text-sky-100 text-lg">
            Organize your tasks with glassmorphism elegance
          </p>
        </motion.div>

        {/* Add Todo Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="backdrop-blur-md bg-white/10 rounded-2xl p-6 mb-6 border border-white/20 shadow-xl"
        >
          <form onSubmit={addTodo} className="flex gap-3">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 px-4 py-3 rounded-xl backdrop-blur-sm bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/25 transition-all"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl border border-white/30 text-white transition-all duration-200 flex items-center gap-2 font-medium hover:scale-105 active:scale-95"
            >
              <Plus size={20} />
              Add
            </button>
          </form>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-md bg-white/10 rounded-2xl p-2 mb-6 border border-white/20 shadow-xl"
        >
          <div className="flex gap-1">
            {[
              { key: 'all', label: 'All', count: todos.length },
              { key: 'active', label: 'Active', count: activeCount },
              { key: 'completed', label: 'Completed', count: completedCount }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  filter === tab.key
                    ? 'bg-white/30 text-white shadow-lg'
                    : 'text-white/80 hover:bg-white/20 hover:text-white'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </motion.div>

        {/* Todo List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredTodos.map((todo) => (
              <motion.div
                key={todo.id}
                layout
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                className="backdrop-blur-md bg-white/10 rounded-2xl p-4 border border-white/20 shadow-xl hover:bg-white/15 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      todo.completed
                        ? 'bg-white/30 border-white/50 text-white'
                        : 'border-white/50 hover:border-white/70 hover:bg-white/10'
                    }`}
                  >
                    {todo.completed && <Check size={14} />}
                  </button>

                  <div className="flex-1">
                    {editingId === todo.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEdit()
                            if (e.key === 'Escape') cancelEdit()
                          }}
                          className="flex-1 px-3 py-1 rounded-lg backdrop-blur-sm bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                          autoFocus
                        />
                        <button
                          onClick={saveEdit}
                          className="p-1 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-1 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <span
                        className={`text-white transition-all ${
                          todo.completed
                            ? 'line-through opacity-60'
                            : ''
                        }`}
                      >
                        {todo.text}
                      </span>
                    )}
                  </div>

                  {editingId !== todo.id && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEditing(todo.id, todo.text)}
                        className="p-2 text-white/60 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="p-2 text-white/60 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-200"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredTodos.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="backdrop-blur-md bg-white/10 rounded-2xl p-8 border border-white/20 shadow-xl">
                <p className="text-white/80 text-lg">
                  {filter === 'active' && 'No active tasks'}
                  {filter === 'completed' && 'No completed tasks'}
                  {filter === 'all' && 'No tasks yet'}
                </p>
                <p className="text-white/60 mt-2">
                  {filter === 'all' && 'Add your first task above to get started!'}
                  {filter === 'active' && 'All your tasks are completed! 🎉'}
                  {filter === 'completed' && 'Complete some tasks to see them here'}
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Stats Footer */}
        {todos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-center"
          >
            <div className="backdrop-blur-md bg-white/10 rounded-2xl p-4 border border-white/20 shadow-xl">
              <p className="text-white/80">
                {activeCount} active, {completedCount} completed of {todos.length} total tasks
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default App