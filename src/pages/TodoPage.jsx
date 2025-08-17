import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Check, Trash2, Edit3, Save, X, Filter, Search } from 'lucide-react'

function TodoPage() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const savedTodos = localStorage.getItem('glassmorphism-todos')
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('glassmorphism-todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
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

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const startEdit = (todo) => {
    setEditingId(todo.id)
    setEditText(todo.text)
  }

  const saveEdit = () => {
    if (editText.trim()) {
      setTodos(todos.map(todo =>
        todo.id === editingId ? { ...todo, text: editText.trim() } : todo
      ))
    }
    setEditingId(null)
    setEditText('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditText('')
  }

  const filteredTodos = todos.filter(todo => {
    const matchesFilter = 
      filter === 'all' ||
      (filter === 'active' && !todo.completed) ||
      (filter === 'completed' && todo.completed)
    
    const matchesSearch = todo.text.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  const completedCount = todos.filter(todo => todo.completed).length
  const totalCount = todos.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Sky Tasks
          </h1>
          <p className="text-sky-100 text-lg">
            Organize your life with glassmorphism elegance
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="backdrop-blur-md bg-white/20 rounded-2xl p-6 mb-8 border border-white/30 shadow-xl"
        >
          <div className="flex justify-between items-center text-white">
            <div className="text-center">
              <div className="text-2xl font-bold">{totalCount}</div>
              <div className="text-sm text-sky-100">Total Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{totalCount - completedCount}</div>
              <div className="text-sm text-sky-100">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{completedCount}</div>
              <div className="text-sm text-sky-100">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
              </div>
              <div className="text-sm text-sky-100">Progress</div>
            </div>
          </div>
        </motion.div>

        {/* Add Todo */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-md bg-white/20 rounded-2xl p-6 mb-8 border border-white/30 shadow-xl"
        >
          <div className="flex gap-3">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              placeholder="Add a new task..."
              className="flex-1 bg-white/30 border border-white/40 rounded-xl px-4 py-3 text-white placeholder-sky-100 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addTodo}
              className="bg-white/30 hover:bg-white/40 border border-white/40 rounded-xl px-6 py-3 text-white font-medium transition-all duration-200 backdrop-blur-sm"
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-md bg-white/20 rounded-2xl p-6 mb-8 border border-white/30 shadow-xl"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sky-100 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tasks..."
                className="w-full bg-white/30 border border-white/40 rounded-xl pl-10 pr-4 py-2 text-white placeholder-sky-100 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              {['all', 'active', 'completed'].map((filterType) => (
                <motion.button
                  key={filterType}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilter(filterType)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 capitalize ${
                    filter === filterType
                      ? 'bg-white text-sky-500'
                      : 'bg-white/30 text-white hover:bg-white/40'
                  } border border-white/40 backdrop-blur-sm`}
                >
                  <Filter className="w-4 h-4 inline mr-2" />
                  {filterType}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Todo List */}
        <div className="space-y-3">
          <AnimatePresence>
            {filteredTodos.map((todo, index) => (
              <motion.div
                key={todo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.1 }}
                className="backdrop-blur-md bg-white/20 rounded-2xl p-6 border border-white/30 shadow-xl"
              >
                <div className="flex items-center gap-4">
                  {/* Checkbox */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleTodo(todo.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      todo.completed
                        ? 'bg-white text-sky-500 border-white'
                        : 'border-white/60 hover:border-white'
                    }`}
                  >
                    {todo.completed && <Check className="w-4 h-4" />}
                  </motion.button>

                  {/* Text */}
                  <div className="flex-1">
                    {editingId === todo.id ? (
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                        className="w-full bg-white/30 border border-white/40 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
                        autoFocus
                      />
                    ) : (
                      <span
                        className={`text-white text-lg ${
                          todo.completed ? 'line-through opacity-60' : ''
                        }`}
                      >
                        {todo.text}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {editingId === todo.id ? (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={saveEdit}
                          className="p-2 bg-green-500/30 hover:bg-green-500/40 rounded-lg text-white transition-colors border border-green-400/30"
                        >
                          <Save className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={cancelEdit}
                          className="p-2 bg-red-500/30 hover:bg-red-500/40 rounded-lg text-white transition-colors border border-red-400/30"
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                      </>
                    ) : (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => startEdit(todo)}
                          className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors border border-white/30"
                        >
                          <Edit3 className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => deleteTodo(todo.id)}
                          className="p-2 bg-red-500/30 hover:bg-red-500/40 rounded-lg text-white transition-colors border border-red-400/30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </>
                    )}
                  </div>
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
              <div className="backdrop-blur-md bg-white/20 rounded-2xl p-8 border border-white/30 shadow-xl">
                <div className="text-white/60 text-lg">
                  {searchTerm ? 'No tasks match your search' : 
                   filter === 'active' ? 'No active tasks' :
                   filter === 'completed' ? 'No completed tasks' :
                   'No tasks yet. Add one above!'}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 text-sky-100"
        >
          <p>Built with React, Tailwind CSS, and Framer Motion</p>
        </motion.div>
      </div>
    </div>
  )
}

export default TodoPage