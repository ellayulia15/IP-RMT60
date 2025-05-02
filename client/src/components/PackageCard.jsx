import { Link } from 'react-router';

function PackageCard({ pkg }) {
    const extractFileId = (url) => {
        const match = url?.match(/\/d\/(.+?)\//);
        return match ? match[1] : null;
    };

    const downloadUrl = pkg.pdfLink
        ? `https://drive.google.com/uc?export=download&id=${extractFileId(pkg.pdfLink)}`
        : '#';

    return (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <Link to={`/packages/${pkg.id}`}>
                {/* Gambar Paket */}
                {pkg.imageUrl && (
                    <img
                        src={pkg.imageUrl}
                        alt={pkg.packageName}
                        className="w-full h-48 object-cover"
                    />
                )}
                <div className="p-4">
                    <h2 className="text-xl font-semibold text-[#2E8B57] mb-1">{pkg.packageName}</h2>
                    <p className="text-gray-700 mb-3">Mulai dari <strong>Rp{parseInt(pkg.startPrice).toLocaleString()}</strong></p>
                </div>
            </Link>
        </div>
    );
}

export default PackageCard;
