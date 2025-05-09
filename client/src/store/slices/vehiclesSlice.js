import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchVehicles = createAsyncThunk(
    'vehicles/fetchVehicles',
    async () => {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/vehicles`);
        return response.data;
    }
);

export const fetchVehicleById = createAsyncThunk(
    'vehicles/fetchVehicleById',
    async (id) => {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/vehicles/${id}`);
        return response.data;
    }
);

const initialState = {
    vehicles: [],
    selectedVehicle: null,
    loading: false,
    error: null
};

const vehiclesSlice = createSlice({
    name: 'vehicles',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchVehicles.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchVehicles.fulfilled, (state, action) => {
                state.loading = false;
                state.vehicles = action.payload;
                state.error = null;
            })
            .addCase(fetchVehicles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchVehicleById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchVehicleById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedVehicle = action.payload;
                state.error = null;
            })
            .addCase(fetchVehicleById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export default vehiclesSlice.reducer;