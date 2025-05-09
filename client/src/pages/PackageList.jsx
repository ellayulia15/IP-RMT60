import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPackages } from '../store/slices/packagesSlice';
import PackageCard from '../components/PackageCard';

function PackageList() {
    const dispatch = useDispatch();
    const { packages, loading, error } = useSelector((state) => state.packages);

    useEffect(() => {
        dispatch(fetchPackages());
    }, [dispatch]);

    if (loading) {
        return <div className="text-center py-10">Loading paket wisata...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-600">Error: {error}</div>;
    }

    return (
        <div className="bg-[#A7D7A7] min-h-screen px-6 py-10">
            <h1 className="text-3xl font-bold text-center text-[#2E8B57] mb-8">
                Daftar Paket Wisata
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map(pkg => (
                    <PackageCard key={pkg.id} pkg={pkg} />
                ))}
            </div>
        </div>
    );
}

export default PackageList;
