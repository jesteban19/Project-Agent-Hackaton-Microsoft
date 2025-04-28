import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SpeechState {
  isListening: boolean;
  transcript: string;
  error: string | null;
  processing: boolean;
  agentResponse: string | null;
}

const initialState: SpeechState = {
  isListening: false,
  transcript: "",
  error: null,
  processing: false,
  agentResponse: null,
};

const speechSlice = createSlice({
  name: "speech",
  initialState,
  reducers: {
    startListening: (state) => {
      state.isListening = true;
      state.error = null;
    },
    stopListening: (state) => {
      state.isListening = false;
    },
    setTranscript: (state, action: PayloadAction<string>) => {
      state.transcript = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isListening = false;
    },
    setProcessing: (state, action: PayloadAction<boolean>) => {
      state.processing = action.payload;
    },
    setAgentResponse: (state, action: PayloadAction<string | null>) => {
      state.agentResponse = action.payload;
    },
  },
});

export const {
  startListening,
  stopListening,
  setTranscript,
  setError,
  setProcessing,
  setAgentResponse,
} = speechSlice.actions;
export default speechSlice.reducer;
