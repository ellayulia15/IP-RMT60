import { configureStore } from '@reduxjs/toolkit';
import packagesReducer from './slices/packagesSlice';
import vehiclesReducer from './slices/vehiclesSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
    reducer: {
        packages: packagesReducer,
        vehicles: vehiclesReducer,
        user: userReducer,
    },
});