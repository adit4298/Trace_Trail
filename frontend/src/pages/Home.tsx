import { Link } from 'react-router-dom';
import {
  Shield,
  TrendingUp,
  Target,
  Award,
  ArrowRight,
  Check,
  Zap,
  Users,
} from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const features = [
    {
      icon: Shield,
      title: 'Privacy Risk Scoring',
      description:
        'Real-time analysis of your digital privacy across all social media platforms with a unified score.',
    },
    {
      icon: TrendingUp,
      title: 'Insights & Analytics',
      description:
        'Detailed breakdowns, trends, and predictions of your privacy score over time.',
    },
    {
      icon: Target,
      title: 'Privacy Challenges',
      description:
        'Gamified tasks to improve your privacy settings and earn rewards and badges.',
    },
    {
      icon: Award,
      title: 'Personalized Recommendations',
      description:
        'AI-powered suggestions tailored specifically to your privacy profile and habits.',
    },
  ];

  const benefits = [
    'Monitor all platforms in one dashboard',
    'Get real-time privacy risk alerts',
    'Track your progress with analytics',
    'Earn badges and complete challenges',
    'Receive personalized recommendations',
    'Export detailed privacy reports',
  ];

  const stats = [
    { value: '10,000+', label: 'Active Users' },
    { value: '50,000+', label: 'Connections Monitored' },
    { value: '95%', label: 'Privacy Improvement' },
    { value: '4.8/5', label: 'User Rating' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-24 overflow-hidden">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="uppercase text-primary-100 tracking-wider text-sm font-semibold">
              Your Privacy, Our Priority
            </span>

            <h1 className="text-4xl md:text-6xl font-extrabold mt-4 mb-6">
              Take Control of Your{' '}
              <span className="text-yellow-300">Digital Privacy</span>
            </h1>

            <p className="max-w-2xl mx-auto text-lg text-primary-100 mb-8">
              TraceTrail helps you understand, monitor, and improve your privacy
              across social media platforms — all in one intelligent dashboard.
            </p>

            <div className="flex justify-center gap-4 mb-4">
              <Link
                to="/signup"
                className="btn bg-white text-primary-700 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-lg inline-flex items-center"
              >
                Get Started Free
                <ArrowRight className="ml-2" size={20} />
              </Link>

              <Link
                to="/login"
                className="btn bg-primary-700/50 backdrop-blur-sm text-white border border-primary-500 hover:bg-primary-700 px-8 py-4 text-lg font-semibold rounded-lg inline-flex items-center"
              >
                Sign In
              </Link>
            </div>

            <p className="text-sm text-primary-100">
              No credit card required • Free forever • 5-minute setup
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {stat.value}
              </p>
              <p className="text-gray-600 dark:text-gray-300">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">
              Powerful Privacy Features
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Everything you need to understand and improve your digital privacy
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-xl transition-shadow text-center"
                >
                  <div className="flex justify-center mb-4">
                    <Icon className="text-primary-600" size={32} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Why Choose TraceTrail?</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Take control of your digital footprint with comprehensive privacy
              monitoring and actionable insights.
            </p>

            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-3"
                >
                  <Check className="text-green-600" size={16} />
                  <p className="text-gray-700 dark:text-gray-400">{benefit}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <Shield className="text-primary-600 dark:text-primary-400" size={160} />
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container mx-auto px-6"
        >
          <Zap className="mx-auto mb-6 text-yellow-300" size={64} />
          <h2 className="text-4xl font-bold mb-4">
            Ready to Start Your Privacy Journey?
          </h2>
          <p className="max-w-xl mx-auto mb-8 text-primary-100">
            Join thousands of users protecting their digital privacy with
            TraceTrail.
          </p>

          <Link
            to="/signup"
            className="inline-flex items-center space-x-2 bg-white text-primary-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-lg transition"
          >
            <Users size={24} />
            <span>Get Started Now</span>
            <ArrowRight size={20} />
          </Link>

          <p className="mt-4 text-sm text-primary-100">
            ✓ No credit card required • ✓ Setup in 5 minutes • ✓ Free forever
          </p>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
