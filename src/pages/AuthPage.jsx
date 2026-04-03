import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthContext } from '../context/AuthContext';
import { ROUTES } from '../lib/constants';
import { Mail, Lock, BarChart3, AlertCircle } from 'lucide-react';

/**
 * Authentication page for login and signup.
 * Offers email/password and Google OAuth options.
 * @returns {JSX.Element}
 */
export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { login, signup, loginWithGoogle, loading, error } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || ROUTES.DASHBOARD;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      navigate(from, { replace: true });
    } catch {
      // Error is centrally managed in useAuth
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch {
      // Error managed in useAuth
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-surface-main flex flex-col items-center justify-center p-4">
      <div className="mb-8 flex items-center justify-center gap-2 text-primary-600">
        <BarChart3 className="w-8 h-8" />
        <span className="text-2xl font-bold tracking-tight text-slate-900">InsightAI</span>
      </div>

      <Card className="w-full max-w-md p-8 pt-10 shadow-elevated">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h1>
          <p className="text-slate-500 text-sm mt-2">
            {isLogin 
              ? 'Enter your details to access your dashboard.' 
              : 'Sign up to start analyzing your startup data.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-md bg-rose-50 text-rose-600 text-sm flex items-start gap-2 border border-rose-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="founder@startup.com"
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            required
            helperText={!isLogin ? "Must be at least 8 characters long." : null}
          />

          <Button
            type="submit"
            className="w-full mt-2"
            size="lg"
            isLoading={loading}
          >
            {isLogin ? 'Sign in' : 'Create account'}
          </Button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="mx-4 text-xs font-medium text-slate-400 uppercase tracking-wider">OR</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <Button
          variant="secondary"
          className="w-full"
          onClick={handleGoogle}
          disabled={loading}
          leftIcon={
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
          }
        >
          Continue with Google
        </Button>

        <div className="mt-8 text-center text-sm text-slate-500">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={toggleMode}
            className="font-semibold text-primary-600 hover:text-primary-700 transition-colors focus:outline-none focus:underline"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default AuthPage;
