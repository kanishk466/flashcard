import { configureStore, createSlice } from "@reduxjs/toolkit";

// Load initial state from localStorage with validation
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("flashcards");
    const parsedState = serializedState ? JSON.parse(serializedState) : [];
    if (Array.isArray(parsedState) && parsedState.every((card) => card.groupTitle && card.terms)) {
      return parsedState;
    }
    return [];
  } catch (error) {
    console.error("Failed to load state from localStorage:", error);
    return [];
  }
};

// Save state to localStorage (debounced)
let saveTimeout;
const saveState = (state) => {
  try {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      const serializedState = JSON.stringify(state);
      localStorage.setItem("flashcards", serializedState);
    }, 300); // Debounce interval
  } catch (error) {
    console.error("Failed to save state to localStorage:", error);
  }
};

// Create a slice for flashcards
const flashcardSlice = createSlice({
  name: "flashcards",
  initialState: loadState(),
  reducers: {
    addFlashcard: (state, action) => {
      state.push(action.payload);
    },
    deleteFlashcard: (state, action) => {
      return state.filter((_, index) => index !== action.payload);
    },
    updateFlashcard: (state, action) => {
      const { index, updatedFlashcard } = action.payload;
      if (index >= 0 && index < state.length) {
        state[index] = updatedFlashcard;
      }
    },
  },
});

// Export actions
export const { addFlashcard, deleteFlashcard, updateFlashcard } = flashcardSlice.actions;

// Configure store
const store = configureStore({
  reducer: {
    flashcards: flashcardSlice.reducer,
  },
});

// Subscribe to store updates to save state to localStorage
store.subscribe(() => {
  saveState(store.getState().flashcards);
});

export default store;
