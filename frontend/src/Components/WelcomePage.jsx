import { Link } from "react-router-dom";
import WelcomeNavbar from "./WelcomeNavbar";

const WelcomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0FA4AF] to-sky-100">
      {/* Custom Navbar for Welcome Page */}
      <WelcomeNavbar />

      {/* Hero Section */}
      <div className="px-6 md:px-20 lg:px-40 flex justify-center py-10 pt-32">
        <div className="layout-content-container flex flex-col max-w-[1500px] w-full">
          <div 
            className="flex min-h-[400px] md:min-h-[500px] lg:min-h-[600px] flex-col gap-4 md:gap-6 bg-cover bg-center bg-no-repeat items-start justify-end px-6 pb-12 rounded-2xl shadow-lg" 
            style={{ 
              backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5)), url('https://cdn.usegalileo.ai/sdxl10/dbcb05ef-1b43-4884-a06d-cfc9df0c622c.png')",
            }}
          >
            <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-[-0.033em] drop-shadow-lg">
              Welcome to TownSync
            </h1>
            <h2 className="text-white text-lg md:text-2xl font-light leading-normal drop-shadow-md">
              Your platform for community engagement and issue resolution
            </h2>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-6 md:px-20 lg:px-40 py-16">
        <div className="max-w-[1500px] mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Why Choose TownSync?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-2">Easy Reporting</h3>
              <p className="text-gray-600">Quickly report issues in your neighborhood with our user-friendly interface.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
              <p className="text-gray-600">Track the progress of reported issues and stay informed about resolutions.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold mb-2">Community Focus</h3>
              <p className="text-gray-600">Join hands with your neighbors to make your community a better place.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="px-6 md:px-20 lg:px-40 py-16">
        <div className="max-w-[1500px] mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Make a Difference?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of community members who are actively working to improve their neighborhoods.
          </p>
          <Link to="/login">
            <button className="h-12 px-8 rounded-full bg-[#2F80ED] text-white font-semibold text-lg shadow-md hover:bg-[#1C66C1] transition-all">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
