import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchPackages = createAsyncThunk(
    'packages/fetchPackages',
    async () => {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/packages`);
        return response.data;
    }
);

export const fetchPackageById = createAsyncThunk(
    'packages/fetchPackageById',
    async (id) => {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/packages/${id}`);
        return response.data;
    }
);

const initialState = {
    packages: [],
    selectedPackage: null,
    loading: false,
    error: null
};

const packagesSlice = createSlice({
    name: 'packages',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPackages.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPackages.fulfilled, (state, action) => {
                state.loading = false;
                state.packages = action.payload;
                state.error = null;
            })
            .addCase(fetchPackages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchPackageById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPackageById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedPackage = action.payload;
                state.error = null;
            })
            .addCase(fetchPackageById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export default packagesSlice.reducer;