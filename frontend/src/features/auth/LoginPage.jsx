import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import DynamicForm from '../../components/forms/DynamicForm';
import Card, { CardHeader, CardTitle, CardBody } from '../../components/ui/Card';

export default function LoginPage() {
  const { login } = useAuth();
  const { error: errorToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const fields = [
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      placeholder: 'your@email.com',
      required: true,
    },
    {
      name: 'password',
      type: 'password',
      label: 'Password',
      placeholder: '••••••••',
      required: true,
    },
  ];

  const handleLogin = async (formData) => {
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      errorToast(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to FitLog</CardTitle>
        </CardHeader>
        <CardBody>
          <DynamicForm
            fields={fields}
            onSubmit={handleLogin}
            submitLabel="Sign In"
            loading={loading}
          />
          <p className="text-center text-gray-400 mt-4">
            Don't have an account?{' '}
            <Link to="/auth/register" className="text-[#CCFF00] hover:underline">
              Sign up
            </Link>
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
