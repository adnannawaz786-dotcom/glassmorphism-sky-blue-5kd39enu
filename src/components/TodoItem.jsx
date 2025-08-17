import { useState } from 'react'
import { Check, X, Edit3, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'

function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)

  const handleEdit = () => {
    if (isEditing && editText.trim()) {
      onEdit(todo.id, editText.trim())
    }
    setIsEditing(!isEditing)
  }

  const handleCancel = () => {
    setEditText(todo.text)
    setIsEditing(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleEdit()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      className="group relative backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)'
      }}
    >
      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onToggle(todo.id)}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
            todo.completed
              ? 'bg-gradient-to-r from-sky-400 to-blue-500 border-sky-400 text-white'
              : 'border-white/30 hover:border-sky-400'
          }`}
        >
          {todo.completed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <Check size={14} />
            </motion.div>
          )}
        </motion.button>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyPress}
              onBlur={handleCancel}
              autoFocus
              className="w-full bg-transparent text-white placeholder-white/50 border-none outline-none text-lg font-medium"
              placeholder="Enter todo text..."
            />
          ) : (
            <motion.p
              className={`text-lg font-medium transition-all duration-300 ${
                todo.completed
                  ? 'text-white/60 line-through'
                  : 'text-white'
              }`}
              animate={{
                opacity: todo.completed ? 0.6 : 1,
                scale: todo.completed ? 0.98 : 1
              }}
            >
              {todo.text}
            </motion.p>
          )}
          {todo.createdAt && (
            <p className="text-white/40 text-sm mt-1">
              {new Date(todo.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {isEditing ? (
            <>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleEdit}
                className="p-2 text-green-400 hover:text-green-300 hover:bg-white/10 rounded-lg transition-all duration-300"
                title="Save"
              >
                <Check size={18} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleCancel}
                className="p-2 text-red-400 hover:text-red-300 hover:bg-white/10 rounded-lg transition-all duration-300"
                title="Cancel"
              >
                <X size={18} />
              </motion.button>
            </>
          ) : (
            <>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsEditing(true)}
                className="p-2 text-white/60 hover:text-sky-400 hover:bg-white/10 rounded-lg transition-all duration-300"
                title="Edit"
              >
                <Edit3 size={18} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => onDelete(todo.id)}
                className="p-2 text-white/60 hover:text-red-400 hover:bg-white/10 rounded-lg transition-all duration-300"
                title="Delete"
              >
                <Trash2 size={18} />
              </motion.button>
            </>
          )}
        </div>
      </div>

      {todo.completed && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full"
          style={{ width: '100%', transformOrigin: 'left' }}
        />
      )}
    </motion.div>
  )
}

export default TodoItem