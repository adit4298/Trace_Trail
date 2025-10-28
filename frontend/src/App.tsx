import { Routes, Route } from 'react-router-dom';
import Layout from '@components/layout/Layout';
import ProtectedRoute from '@components/auth/ProtectedRoute';

// Pages
import Home from '@pages/Home';
import Login from '@pages/Login';
import Signup from '@pages/Signup';
import Dashboard from '@pages/Dashboard';
import Insights from '@pages/Insights';
import Challenges from '@pages/Challenges';
import Connections from '@pages/Connections';
import Recommendations from '@pages/Recommendations';
import Settings from '@pages/Settings';
import Profile from '@pages/Profile';
import Reports from '@pages/Reports';
import NotFound from '@pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="insights" element={<Insights />} />
          <Route path="challenges" element={<Challenges />} />
          <Route path="connections" element={<Connections />} />
          <Route path="recommendations" element={<Recommendations />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
          <Route path="reports" element={<Reports />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
