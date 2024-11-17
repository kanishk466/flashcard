import { configureStore, createSlice } from "@reduxjs/toolkit";

// Load initial state from localStorage
const loadState = () => {
    try {
        const serializedState = localStorage.getItem("flashcards");
        return serializedState ? JSON.parse(serializedState) : [];
    } catch (error) {
        console.error("Failed to load state from localStorage", error);
        return [];
    }
};

// Save state to localStorage
const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem("flashcards", serializedState);
    } catch (error) {
        console.error("Failed to save state to localStorage", error);
    }
};

// Create a slice for flashcards
const flashcardSlice = createSlice({
    name: "flashcards",
    initialState: loadState(), // Load initial state from localStorage
    reducers: {
        addFlashcard: (state, action) => {
            state.push(action.payload);
        },
        deleteFlashcard: (state, action) => {
            return state.filter((_, index) => index !== action.payload);
        },
    },
});

export const { addFlashcard, deleteFlashcard } = flashcardSlice.actions;

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
