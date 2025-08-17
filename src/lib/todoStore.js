import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useTodoStore = create(
  persist(
    (set, get) => ({
      todos: [],
      filter: 'all',
      
      addTodo: (text) => {
        const newTodo = {
          id: Date.now().toString(),
          text: text.trim(),
          completed: false,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          todos: [...state.todos, newTodo]
        }))
      },
      
      toggleTodo: (id) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          )
        }))
      },
      
      deleteTodo: (id) => {
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id)
        }))
      },
      
      editTodo: (id, newText) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, text: newText.trim() } : todo
          )
        }))
      },
      
      clearCompleted: () => {
        set((state) => ({
          todos: state.todos.filter((todo) => !todo.completed)
        }))
      },
      
      setFilter: (filter) => {
        set({ filter })
      },
      
      getFilteredTodos: () => {
        const { todos, filter } = get()
        switch (filter) {
          case 'active':
            return todos.filter((todo) => !todo.completed)
          case 'completed':
            return todos.filter((todo) => todo.completed)
          default:
            return todos
        }
      },
      
      getStats: () => {
        const { todos } = get()
        return {
          total: todos.length,
          completed: todos.filter((todo) => todo.completed).length,
          active: todos.filter((todo) => !todo.completed).length,
        }
      },
    }),
    {
      name: 'glassmorphism-todo-storage',
      version: 1,
    }
  )
)

export default useTodoStore