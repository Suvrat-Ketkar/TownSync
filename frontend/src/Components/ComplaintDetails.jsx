import React from 'react';
import { Link } from 'react-router-dom';

// Dummy data for demonstration (replace with actual data from API or state)
const complaint = {
  id: '12345',
  issueType: 'Potholes',
  location: 'Main St near Park Ave',
  dateReported: '2/20/2025',
  status: 'In Progress',
  photo: 'https://media.istockphoto.com/id/174662203/photo/pot-hole.jpg?s=2048x2048&w=is&k=20&c=UvKWfgZEVoVuNj6juY4l_dGsFYkktbCbTGktZeiT0DU=', // Larger placeholder for full-width display
  description: 'Large pothole causing traffic delays and safety concerns.',
};

const ComplaintDetails = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0FA4AF] to-sky-100 flex items-center justify-center p-6 mt-10">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-4xl transform transition-all duration-300 hover:shadow-3xl">
        {/* Header with slide-in animation */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center animate-slideDown">
          Complaint Details
        </h1>

        {/* Complaint Details Grid (2-column layout for most fields, full-width for photo) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Complaint ID */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200 animate-fadeInLeft">
              <p className="text-gray-600 font-medium text-lg">Complaint ID</p>
              <p className="text-gray-800 font-semibold text-xl">{complaint.id}</p>
            </div>

            {/* Issue Type */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200 animate-fadeInLeft delay-200">
              <p className="text-gray-600 font-medium text-lg">Issue Type</p>
              <p className="text-gray-800 font-semibold text-xl">{complaint.issueType}</p>
            </div>

            {/* Location */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200 animate-fadeInLeft delay-400">
              <p className="text-gray-600 font-medium text-lg">Location</p>
              <p className="text-gray-800 font-semibold text-xl">{complaint.location}</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Date Reported */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200 animate-fadeInRight">
              <p className="text-gray-600 font-medium text-lg">Date Reported</p>
              <p className="text-gray-800 font-semibold text-xl">{complaint.dateReported}</p>
            </div>

            {/* Status */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200 animate-fadeInRight delay-200">
              <p className="text-gray-600 font-medium text-lg">Status</p>
              <p className={`text-gray-800 font-semibold text-xl ${complaint.status === 'Resolved' ? 'text-green-600' : 'text-yellow-600'}`}>
                {complaint.status}
              </p>
            </div>
          </div>

          {/* Photo (full-width across both columns) */}
          <div className="col-span-1 md:col-span-2 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200 animate-fadeInUp delay-400">
            <p className="text-gray-600 font-medium text-lg">Photo</p>
            <img 
              src={complaint.photo} 
              alt="Complaint" 
              className="w-full h-64 object-cover rounded-md shadow-md mt-2 transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Description (full-width at bottom for emphasis) */}
          <div className="col-span-1 md:col-span-2 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200 animate-fadeInUp delay-600">
            <p className="text-gray-600 font-medium text-lg">Description</p>
            <p className="text-gray-800 font-medium text-lg mt-2">{complaint.description}</p>
          </div>
        </div>

        {/* Back Button with bounce animation */}
        <div className="mt-8 text-center">
          <Link 
            to="/" 
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 animate-bounceOnce"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

// CSS for animations (added inline for simplicity, move to CSS file if preferred)
const styles = `
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeInLeft {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes fadeInRight {
    from { opacity: 0; transform: translateX(20px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes bounceOnce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
  .animate-slideDown { animation: slideDown 0.5s ease-out; }
  .animate-fadeInLeft { animation: fadeInLeft 0.5s ease-out; }
  .animate-fadeInRight { animation: fadeInRight 0.5s ease-out; }
  .animate-fadeInUp { animation: fadeInUp 0.5s ease-out; }
  .animate-bounceOnce { animation: bounceOnce 0.5s ease-out; }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default ComplaintDetails;