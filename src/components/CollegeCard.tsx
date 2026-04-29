import Link from 'next/link';

interface College {
  id: number;
  name: string;
  location: string;
  state: string;
  fees_min: number;
  fees_max: number;
  rating: number;
  placement_percent: number;
  type: string;
}

interface Props {
  college: College;
  onCompare?: (college: College) => void;
  isCompared?: boolean;
}

export default function CollegeCard({ college, onCompare, isCompared }: Props) {
  return (
    <div className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border-2 ${
      isCompared ? 'border-blue-500' : 'border-gray-100'
    }`}>

      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{college.name}</h2>
          <p className="text-gray-500 text-sm mt-1">
            📍 {college.location}, {college.state}
          </p>
        </div>
        <span className={`text-xs px-3 py-1 rounded-full font-medium ${
          college.type === 'Government'
            ? 'bg-green-100 text-green-700'
            : 'bg-blue-100 text-blue-700'
        }`}>
          {college.type}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 my-4">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500">Fees/Year</p>
          <p className="text-sm font-bold text-gray-800">
            ₹{(college.fees_min / 100000).toFixed(1)}L
          </p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500">Rating</p>
          <p className="text-sm font-bold text-yellow-600">⭐ {college.rating}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500">Placement</p>
          <p className="text-sm font-bold text-green-600">{college.placement_percent}%</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mt-4">
        <Link href={`/colleges/${college.id}`}
          className="flex-1 text-center bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
          View Details
        </Link>
        <button
          onClick={() => onCompare?.(college)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition border ${
            isCompared
              ? 'bg-blue-600 text-white border-blue-600'
              : 'border-blue-600 text-blue-600 hover:bg-blue-50'
          }`}>
          {isCompared ? '✓ Added' : '+ Compare'}
        </button>
      </div>
    </div>
  );
}