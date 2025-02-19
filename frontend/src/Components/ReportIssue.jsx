// import React, { useState } from "react";
// import { Camera, ChevronDown } from "lucide-react";

// const ReportIssue = () => {
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [description, setDescription] = useState("");
//   const [image, setImage] = useState(null);

//   const handleCapture = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setImage(URL.createObjectURL(file));
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-[#0FA4AF] to-sky-100 py-16 px-6">
//       <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
//         <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Report an Issue</h1>

//         {/* Capture Image */}
//         <div className="mb-6 text-center">
//           {image ? (
//             <img src={image} alt="Captured Issue" className="w-full h-64 object-cover rounded-lg shadow-md" />
//           ) : (
//             <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200">
//               <Camera className="w-12 h-12 text-gray-500" />
//               <span className="text-gray-600 mt-2">Capture or Upload an Image</span>
//               <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleCapture} />
//             </label>
//           )}
//         </div>

//         {/* Category Selection */}
//         <div className="mb-6">
//           <label className="block text-gray-700 font-semibold mb-2">Category</label>
//           <div className="relative">
//             <select
//               className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0FA4AF]"
//               value={selectedCategory}
//               onChange={(e) => setSelectedCategory(e.target.value)}
//             >
//               <option value="">Select a category</option>
//               <option value="Road Damage">Road Damage</option>
//               <option value="Garbage Collection">Garbage Collection</option>
//               <option value="Street Light Issue">Street Light Issue</option>
//               <option value="Water Supply">Water Supply</option>
//               <option value="Other">Other</option>
//             </select>
//             <ChevronDown className="absolute right-4 top-3 text-gray-500" />
//           </div>
//         </div>

//         {/* Description */}
//         <div className="mb-6">
//           <label className="block text-gray-700 font-semibold mb-2">Description</label>
//           <textarea
//             className="w-full p-3 border border-gray-300 rounded-lg resize-none h-28 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0FA4AF]"
//             placeholder="Describe the issue in detail..."
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//           />
//         </div>

//         {/* Submit Button */}
//         <div className="text-center">
//           <button className="h-12 w-full rounded-full bg-[#0FA4AF] text-white font-semibold text-lg shadow-md hover:bg-[#0E7490] transition-all">
//             Submit Report
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReportIssue;



import React, { useState } from "react";
import ImageUploader from "./ImageUploader";
import CategorySelector from "./CategorySelector";
import DescriptionBox from "./DescriptionBox";

const ReportIssue = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const handleCapture = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0FA4AF] to-sky-100 py-16 px-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Report an Issue</h1>

        {/* Image Upload */}
        <ImageUploader image={image} handleCapture={handleCapture} />

        {/* Category Selection */}
        <CategorySelector selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

        {/* Description */}
        <DescriptionBox description={description} setDescription={setDescription} />

        {/* Submit Button */}
        <div className="text-center">
          <button className="h-12 w-full rounded-full bg-[#0FA4AF] text-white font-semibold text-lg shadow-md hover:bg-[#0E7490] transition-all">
            Submit Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;
