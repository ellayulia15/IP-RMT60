import { useParams } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";

function extractFileId(url) {
    const match = url.match(/\/d\/(.+?)\//);
    return match ? match[1] : null;
}

export default function PackageDetail() {
    const { id } = useParams();
    const [packageDetail, setPackageDetail] = useState(null);

    useEffect(() => {
        const fetchPackageDetail = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/packages/${id}`);
                setPackageDetail(response.data);
            } catch (error) {
                console.error("Error fetching package detail:", error);
            }
        };

        fetchPackageDetail();
    }, [id]);

    if (!packageDetail) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    return (
        <div className="p-6 max-w-4xl mx-auto text-center flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-4 text-[#2E8B57]">
                {packageDetail.packageName}
            </h1>

            <img
                src={packageDetail.imageUrl}
                alt={packageDetail.packageName}
                className="w-full h-auto max-h-[500px] object-contain mb-4 rounded"
            />

            <p className="text-lg font-semibold text-[#2E8B57] mb-4">
                Mulai dari Rp{parseInt(packageDetail.startPrice).toLocaleString()}
            </p>

            <a
                href={`https://drive.google.com/uc?export=download&id=${extractFileId(packageDetail.pdfLink)}`}
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                target="_blank"
                rel="noopener noreferrer"
            >
                Download Itinerary
            </a>
        </div>
    );
}
