import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import DynamicForm from '../../components/forms/DynamicForm';
import Card, { CardHeader, CardTitle, CardBody } from '../../components/ui/Card';

export default function RegisterPage() {
  const { register } = useAuth();
  const { error: errorToast, success: successToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const fields = [
    {
      name: 'firstName',
      type: 'text',
      label: 'First Name',
      placeholder: 'John',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      label: 'Last Name',
      placeholder: 'Doe',
      required: true,
    },
    {
      name: 'username',
      type: 'text',
      label: 'Username',
      placeholder: 'johndoe',
      required: true,
    },
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
    {
      name: 'experience',
      type: 'select',
      label: 'Experience Level',
      options: [
        { label: 'Beginner', value: 'beginner' },
        { label: 'Intermediate', value: 'intermediate' },
        { label: 'Advanced', value: 'advanced' },
      ],
    },
    {
      name: 'objective',
      type: 'select',
      label: 'Fitness Objective',
      options: [
        { label: 'Strength', value: 'strength' },
        { label: 'Hypertrophy', value: 'hypertrophy' },
        { label: 'Endurance', value: 'endurance' },
        { label: 'Recomposition', value: 'recomposition' },
      ],
    },
    {
      name: 'bodyWeightKg',
      type: 'number',
      label: 'Body Weight (kg)',
      placeholder: '75',
    },
  ];

  const handleRegister = async (formData) => {
    try {
      const dataToSend = {};
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== undefined && formData[key] !== null && formData[key].toString().trim() !== '') {
          dataToSend[key] = formData[key];
        }
      });
      if (dataToSend.password && dataToSend.password.length < 5) {
        errorToast('Password must be at least 5 characters long');
        return;
      }
      if (dataToSend.bodyWeightKg) {
        const parsedWeight = Number(dataToSend.bodyWeightKg);
        if (isNaN(parsedWeight) || parsedWeight < 30 || parsedWeight > 250) {
          errorToast('Weight must be a realistic value between 30kg and 250kg');
          return;
        }
        dataToSend.bodyWeightKg = parsedWeight; // Send as an actual Number
      }

      setLoading(true);
      await register(dataToSend);
      successToast('Account created successfully!');
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.details?.[0]?.message
        || err.response?.data?.message
        || 'Registration failed';

      errorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Your FitLog Account</CardTitle>
        </CardHeader>
        <CardBody>
          <DynamicForm
            fields={fields}
            onSubmit={handleRegister}
            submitLabel="Create Account"
            loading={loading}
          />
          <p className="text-center text-gray-400 mt-4">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-[#CCFF00] hover:underline">
              Sign in
            </Link>
          </p>
        </CardBody>
      </Card>
    </div>
  );
}