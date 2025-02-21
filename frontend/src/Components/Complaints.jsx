import React from "react";
const ComplaintsTracking = () => {
    return (
      <div className="bg-gray-100 min-h-screen p-6 mt-10">
        <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">CityHub Complaints Tracking</h1>
          <p className="text-gray-600 mb-6">Welcome to the complaints tracking page. Here you can track the status of your complaints.</p>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4 border">Complaint ID</th>
                  <th className="py-2 px-4 border">Category</th>
                  <th className="py-2 px-4 border">Status</th>
                  <th className="py-2 px-4 border">Date</th>
                  <th className="py-2 px-4 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {/* Example row - Replace with dynamic data */}
                <tr>
                  <td className="py-2 px-4 border">#12345</td>
                  <td className="py-2 px-4 border">Road Repair</td>
                  <td className="py-2 px-4 border text-green-600">Resolved</td>
                  <td className="py-2 px-4 border">2025-02-20</td>
                  <td className="py-2 px-4 border">
                    <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">
                      View Details
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };
  
  export default ComplaintsTracking;
  