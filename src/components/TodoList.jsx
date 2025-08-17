import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Filter, CheckCircle2, Circle, Trash2, Edit3, Save, X } from 'lucide-react'

function TodoList() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

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

  const startEditing = (id, text) => {
    setEditingId(id)
    setEditText(text)
  }

  const saveEdit = (id) => {
    if (editText.trim()) {
      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, text: editText.trim() } : todo
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
    const matchesFilter = filter === 'all' || 
                         (filter === 'active' && !todo.completed) ||
                         (filter === 'completed' && todo.completed)
    const matchesSearch = todo.text.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const completedCount = todos.filter(todo => todo.completed).length
  const totalCount = todos.length

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Header Stats */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h1 className="text-4xl font-bold text-white mb-2">Todo List</h1>
        <p className="text-sky-100">
          {completedCount} of {totalCount} tasks completed
        </p>
      </motion.div>

      {/* Add Todo Form */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-md bg-white/10 rounded-2xl p-6 mb-6 border border-white/20 shadow-xl"
      >
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              placeholder="Add a new task..."
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent backdrop-blur-sm"
            />
          </div>
          <motion.button
            onClick={addTodo}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-sky-400 to-blue-500 text-white rounded-xl font-medium hover:from-sky-500 hover:to-blue-600 transition-all duration-200 shadow-lg flex items-center gap-2"
          >
            <Plus size={20} />
            Add
          </motion.button>
        </div>
      </motion.div>

      {/* Search and Filter */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="backdrop-blur-md bg-white/10 rounded-2xl p-6 mb-6 border border-white/20 shadow-xl"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sky-200" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent backdrop-blur-sm"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'active', 'completed'].map((filterType) => (
              <motion.button
                key={filterType}
                onClick={() => setFilter(filterType)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-3 rounded-xl font-medium capitalize transition-all duration-200 flex items-center gap-2 ${
                  filter === filterType
                    ? 'bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-lg'
                    : 'bg-white/10 text-sky-100 hover:bg-white/20 border border-white/20'
                }`}
              >
                <Filter size={16} />
                {filterType}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Todo List */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <AnimatePresence>
          {filteredTodos.map((todo, index) => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              className="backdrop-blur-md bg-white/10 rounded-2xl p-4 border border-white/20 shadow-xl hover:bg-white/15 transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <motion.button
                  onClick={() => toggleTodo(todo.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                    todo.completed
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                      : 'border-2 border-sky-300 hover:border-sky-400'
                  }`}
                >
                  {todo.completed ? <CheckCircle2 size={16} /> : <Circle size={16} className="text-sky-300" />}
                </motion.button>

                <div className="flex-1 min-w-0">
                  {editingId === todo.id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && saveEdit(todo.id)}
                        className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent backdrop-blur-sm"
                        autoFocus
                      />
                      <motion.button
                        onClick={() => saveEdit(todo.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-green-400 hover:text-green-300 transition-colors"
                      >
                        <Save size={18} />
                      </motion.button>
                      <motion.button
                        onClick={cancelEdit}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <X size={18} />
                      </motion.button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <p className={`text-lg transition-all duration-200 ${
                        todo.completed 
                          ? 'text-sky-200 line-through' 
                          : 'text-white'
                      }`}>
                        {todo.text}
                      </p>
                      <div className="flex gap-2 ml-4">
                        <motion.button
                          onClick={() => startEditing(todo.id, todo.text)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-sky-300 hover:text-sky-200 transition-colors"
                        >
                          <Edit3 size={18} />
                        </motion.button>
                        <motion.button
                          onClick={() => deleteTodo(todo.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </div>
                    </div>
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
            <div className="backdrop-blur-md bg-white/10 rounded-2xl p-8 border border-white/20 shadow-xl">
              <Circle size={48} className="mx-auto text-sky-300 mb-4" />
              <p className="text-sky-100 text-lg">
                {searchTerm || filter !== 'all' 
                  ? 'No tasks match your criteria' 
                  : 'No tasks yet. Add one above!'}
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default TodoList