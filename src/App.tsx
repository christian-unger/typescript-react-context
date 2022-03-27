import * as React from 'react'

interface CountCtxInterface {
  count: number
  increment(amount?: number): void
  decrement(amount?: number): void
  clear(): void
}

const CountCtx = React.createContext<CountCtxInterface | null>(null)

const initialState = { count: 0 }

type ACTION_TYPE = 
  | { type: "increment", payload: number }
  | { type: "decrement", payload: number }
  | { type: "clear" }

const countReducer = (state: typeof initialState, action: ACTION_TYPE) => {
  switch(action.type) {
    case "increment":
      return { count: state.count + action.payload }
    case "decrement":
      return { count: state.count - action.payload }
    case "clear":
      return initialState
    default:
      throw new Error("No matching action type")
  }
}

export default function App() {
  const [{ count }, dispatch] = React.useReducer(countReducer, initialState)
  
  const increment = (amount = 1) => dispatch({ type: "increment", payload: amount})
  const decrement = (amount = 1) => dispatch({ type: "decrement", payload: amount})
  const clear = () => dispatch({ type: "clear" })

  const value = React.useMemo(() => ({
    count,
    increment,
    decrement,
    clear,
  }), [count])
  
  return (
    <CountCtx.Provider value={value}>
      <ConsumerComponent />
    </CountCtx.Provider>
  )
}

const useCount = () => {
  const context = React.useContext(CountCtx)
  if (!context) {
    throw new Error("No context")
  }
  return context
}

const ConsumerComponent = () => {
  const { count, increment, decrement, clear } = useCount()
  
  return (
    <main>
      <section style={styles.section}>
        <button onClick={() => decrement(5)}>-5</button>
        <button onClick={() => decrement()}>-1</button>
        <p style={styles.count}>{count}</p>
        <button onClick={() => increment()}>+1</button>
        <button onClick={() => increment(5)}>+5</button>
      </section>
      <button onClick={() => clear()} style={styles.clearButton}>clear</button>
    </main>
  )
}

const styles = {
  section: {
    display: "flex",
  },
  count: {
    textAlign: "center" as "center",
    width: "2rem",
  },
  clearButton: {
    padding: "0.25rem 1rem",
  },
}