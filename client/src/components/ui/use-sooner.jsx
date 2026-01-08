import * as React from "react"

const SOONER_LIMIT = 1
const SOONER_REMOVE_DELAY = 1000000

// Types
const actionTypes = {
  ADD_SOONER: "ADD_SOONER",
  UPDATE_SOONER: "UPDATE_SOONER",
  DISMISS_SOONER: "DISMISS_SOONER",
  REMOVE_SOONER: "REMOVE_SOONER",
}

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

const SoonerContext = React.createContext(null)
const SoonerDispatchContext = React.createContext(null)

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.ADD_SOONER:
      return {
        ...state,
        // Naya toast add karte waqt purana turant hatayein taaki overlap na ho
        sooners: [action.sooner, ...state.sooners].slice(0, SOONER_LIMIT),
      }

    case actionTypes.UPDATE_SOONER:
      return {
        ...state,
        sooners: state.sooners.map((t) =>
          t.id === action.sooner.id ? { ...t, ...action.sooner } : t
        ),
      }

    case actionTypes.DISMISS_SOONER: {
      const { soonerId } = action
      if (soonerId) {
        addToRemoveQueue(soonerId)
      } else {
        state.sooners.forEach((sooner) => {
          addToRemoveQueue(sooner.id)
        })
      }

      return {
        ...state,
        sooners: state.sooners.map((t) =>
          t.id === soonerId || soonerId === undefined ?
            {
              ...t,
              open: false
            } :
            t
        ),
      }
    }
    case actionTypes.REMOVE_SOONER:
      if (action.soonerId === undefined) {
        return {
          ...state,
          sooners: [],
        }
      }
      return {
        ...state,
        sooners: state.sooners.filter((t) => t.id !== action.soonerId),
      }
    default:
      return state
  }
}

const soonerTimeouts = new Map()
let dispatch;

const addToRemoveQueue = (soonerId) => {
  if (soonerTimeouts.has(soonerId)) {
    return
  }

  const timeout = setTimeout(() => {
    soonerTimeouts.delete(soonerId)
    dispatch({
      type: actionTypes.REMOVE_SOONER,
      soonerId: soonerId,
    })
  }, SOONER_REMOVE_DELAY)

  soonerTimeouts.set(soonerId, timeout)
}

export const SoonerProvider = ({ children }) => {
  const [state, dispatchLocal] = React.useReducer(reducer, { sooners: [] });

  React.useEffect(() => {
    dispatch = dispatchLocal;
  }, [dispatchLocal]);

  return (
    <SoonerContext.Provider value={state}>
      <SoonerDispatchContext.Provider value={dispatchLocal}>
        {children}
      </SoonerDispatchContext.Provider>
    </SoonerContext.Provider>
  );
};

function useSooner() {
  const context = React.useContext(SoonerContext);

  if (context === undefined) {
    return { sooners: [] };
  }

  return {
    sooners: context.sooners,
    sooner,
    dismiss: (soonerId) => dispatch({ type: actionTypes.DISMISS_SOONER, soonerId }),
  }
}

function sooner({ duration = 5000, ...props }) {
  if (!dispatch) {
    console.warn("Sooner called outside of SoonerProvider.");
    return { id: null, dismiss: () => { }, update: () => { } };
  }

  const id = genId()

  const dismiss = () => dispatch({
    type: actionTypes.DISMISS_SOONER,
    soonerId: id
  })

  // ✅ IMPROVED UPDATE FUNCTION
  const update = (updatedProps) => {
    dispatch({
      type: actionTypes.UPDATE_SOONER,
      sooner: { ...updatedProps, id }
    })

    // Agar update mein duration hai (jaise Loading -> Success), toh naya timeout set karo
    if (updatedProps.duration && updatedProps.duration !== Infinity) {
      setTimeout(dismiss, updatedProps.duration);
    }
  }

  dispatch({
    type: actionTypes.ADD_SOONER,
    sooner: {
      ...props,
      id,
      open: true,
      duration,
      onOpenChange: (open) => {
        if (!open) dismiss()
      }
    },
  })

  if (duration !== Infinity) {
    setTimeout(dismiss, duration);
  }

  return {
    id: id,
    dismiss,
    update
  }
}

// Quick Access Helpers
sooner.success = (title, description, duration = 4000) => sooner({
  title,
  description,
  variant: "success",
  duration
})
sooner.error = (title, description, duration = 6000) => sooner({
  title,
  description,
  variant: "destructive",
  duration
})
sooner.info = (title, description, duration = 4000) => sooner({
  title,
  description,
  variant: "default",
  duration
})
sooner.loading = (title, description) => sooner({
  title,
  description,
  variant: "loading",
  duration: Infinity // Keep open until manually updated/dismissed
})
sooner.quote = (title, description, duration = 8000) => sooner({
  title,
  description,
  variant: "quote",
  duration
})

export { useSooner, sooner }