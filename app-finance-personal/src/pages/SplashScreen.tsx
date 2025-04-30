import { useNavigate } from "react-router-dom";
import {
  MicrophoneIcon,
  ClockIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const SplashScreen = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/home");
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-primary-50 to-primary-100 flex flex-col items-center justify-center p-6"
      onClick={handleContinue}
    >
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary-600 mb-4">
          Finance Assistant
        </h1>
        <p className="text-gray-600">
          Your personal finance management companion
        </p>
      </div>

      <div className="space-y-8 w-full max-w-md">
        <div className="flex items-center space-x-4 bg-white p-4 rounded-ios shadow-ios">
          <div className="bg-primary-100 p-3 rounded-full">
            <MicrophoneIcon className="text-primary-500 w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Voice Commands</h3>
            <p className="text-gray-600 text-sm">
              Record your transactions with voice
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4 bg-white p-4 rounded-ios shadow-ios">
          <div className="bg-secondary-100 p-3 rounded-full">
            <ClockIcon className="text-secondary-500 w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Transaction History</h3>
            <p className="text-gray-600 text-sm">
              Track all your income and expenses
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4 bg-white p-4 rounded-ios shadow-ios">
          <div className="bg-accent-100 p-3 rounded-full">
            <ChartBarIcon className="text-accent-500 w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Smart Analytics</h3>
            <p className="text-gray-600 text-sm">
              Get insights into your spending
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
