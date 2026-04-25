import MainLayout from '../../components/layout/MainLayout';
import Card, { CardHeader, CardTitle, CardBody, CardFooter } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import DynamicForm from '../../components/forms/DynamicForm';
import { useState } from 'react';
import { useProfile } from '../../hooks/useProfile';
import { useToast } from '../../context/ToastContext';

export default function ProfilePage() {
  const [editMode, setEditMode] = useState(false);
  const { profile, loading, updateProfile } = useProfile();
  const { success, error } = useToast();

  const fields = [
    {
      name: 'firstName',
      type: 'text',
      label: 'First Name',
      defaultValue: profile?.firstName,
    },
    {
      name: 'lastName',
      type: 'text',
      label: 'Last Name',
      defaultValue: profile?.lastName,
    },
    {
      name: 'experience',
      type: 'select',
      label: 'Experience Level',
      defaultValue: profile?.experience,
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
      defaultValue: profile?.objective,
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
      defaultValue: profile?.bodyWeightKg,
    },
  ];

  const handleUpdateProfile = async (formData) => {
    try {
      const dataToSend = {};
      Object.keys(formData).forEach((key) => {
        // Solo enviamos datos que tengan contenido real
        if (formData[key] !== undefined && formData[key] !== null && formData[key].toString().trim() !== '') {
          dataToSend[key] = formData[key];
        }
      });
      if (dataToSend.bodyWeightKg) {
        const parsedWeight = Number(dataToSend.bodyWeightKg);
        if (isNaN(parsedWeight) || parsedWeight < 30 || parsedWeight > 250) {
          error('Weight must be a realistic value between 30kg and 250kg');
          return;
        }
        dataToSend.bodyWeightKg = parsedWeight;
      }
      if (dataToSend.firstName && dataToSend.firstName.trim().length < 2) {
        error('First name must be at least 2 characters long');
        return;
      }

      if (dataToSend.lastName && dataToSend.lastName.trim().length < 2) {
        error('Last name must be at least 2 characters long');
        return;
      }
      await updateProfile(dataToSend);
      success('Profile updated successfully!');
      setEditMode(false);
    } catch (err) {
      console.error('Error updating profile:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.details?.[0]?.message
        || err.response?.data?.message
        || 'Failed to update profile';

      error(errorMessage);
    }
  };

  if (!profile) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-400 animate-pulse">Loading profile data...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
          </CardHeader>
          <CardBody>
            {editMode ? (
              <DynamicForm
                fields={fields}
                onSubmit={handleUpdateProfile}
                submitLabel="Save Changes"
                onCancel={() => setEditMode(false)}
                loading={loading}
              />
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm">Name</p>
                  <p className="text-white text-lg font-medium">
                    {profile.firstName} {profile.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white text-lg">{profile.email}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Username</p>
                  <p className="text-white text-lg">@{profile.username}</p>
                </div>
                {profile.experience && (
                  <div>
                    <p className="text-gray-400 text-sm">Experience Level</p>
                    <p className="text-white text-lg capitalize">{profile.experience}</p>
                  </div>
                )}
                {profile.objective && (
                  <div>
                    <p className="text-gray-400 text-sm">Fitness Objective</p>
                    <p className="text-white text-lg capitalize">{profile.objective}</p>
                  </div>
                )}
                {profile.bodyWeightKg && (
                  <div>
                    <p className="text-gray-400 text-sm">Body Weight</p>
                    <p className="text-white text-lg">{profile.bodyWeightKg} kg</p>
                  </div>
                )}
              </div>
            )}
          </CardBody>
          {!editMode && (
            <CardFooter>
              <Button onClick={() => setEditMode(true)} className="w-full bg-[#CCFF00] text-black hover:bg-opacity-90">
                Edit Profile
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </MainLayout>
  );
}