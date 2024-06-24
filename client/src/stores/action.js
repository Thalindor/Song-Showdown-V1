import { createAsyncThunk } from '@reduxjs/toolkit';

export const generateRandomNumber = createAsyncThunk(
  'roomNumber/generateRandomNumber',
  async () => {
    return Math.floor(100000 + Math.random() * 900000);
  }
);
