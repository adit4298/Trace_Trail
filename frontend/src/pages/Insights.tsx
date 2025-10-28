import LoadingSpinner from '@components/common/LoadingSpinner';

const Insights = () => {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
        Insights & Analytics
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        Explore your privacy trends, risk breakdowns, and behavioral analytics.
      </p>
      {/* TODO: Add insights visualization components */}
      <div className="flex justify-center py-10">
        <LoadingSpinner size="large" />
      </div>
    </div>
  );
};

export default Insights;
