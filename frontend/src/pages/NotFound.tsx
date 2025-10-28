import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center h-[80vh] text-center space-y-4">
      <h1 className="text-7xl font-bold text-primary-600">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
        Page Not Found
      </h2>
      <p className="text-gray-600 dark:text-gray-400 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center space-x-2 btn btn-primary px-6 py-3 rounded-md"
      >
        <Home size={20} />
        <span>Go Home</span>
      </Link>
    </div>
  );
};

export default NotFound;
