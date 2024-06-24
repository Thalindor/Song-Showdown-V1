import { createSlice } from '@reduxjs/toolkit';
import { generateRandomNumber } from './action';

const initialState = {
  randomSixDigitNumber: null,
  isLoading: false,
}

const roomNumberSlice = createSlice({
  name: 'roomNumber',
  initialState,
  reducers: {
    setRandomNumber: (state) => {
      state.isLoading = true;
      state.randomSixDigitNumber = null;
    },
    setRandomNumberSuccess: (state, action) => {
      state.randomSixDigitNumber = action.payload;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateRandomNumber.fulfilled, (state, action) => {
        state.randomSixDigitNumber = action.payload;
        state.isLoading = false;
      });
  },
});

export const { setRandomNumber, setRandomNumberSuccess } = roomNumberSlice.actions;
export default roomNumberSlice.reducer;
