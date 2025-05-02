import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PackageCard from '../components/PackageCard';

function PackageList() {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await axios.get('http://localhost:3000/packages');
                setPackages(response.data);
            } catch (error) {
                console.error('Gagal memuat paket:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPackages();
    }, []);

    if (loading) {
        return <div className="text-center py-10">Loading paket wisata...</div>;
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
