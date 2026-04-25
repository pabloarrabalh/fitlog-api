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
      placeholder: profile?.firstName,
    },
    {
      name: 'lastName',
      type: 'text',
      label: 'Last Name',
      placeholder: profile?.lastName,
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
      placeholder: profile?.bodyWeightKg,
    },
  ];

  const handleUpdateProfile = async (formData) => {
    try {
      await updateProfile(formData);
      success('Profile updated successfully!');
      setEditMode(false);
    } catch {
      error('Failed to update profile');
    }
  };

  if (!profile) {
    return (
      <MainLayout>
        <p className="text-gray-400">Loading profile...</p>
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
                  <p className="text-white text-lg">
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
                {profile.objectiv && (
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
              <Button onClick={() => setEditMode(true)} className="w-full">
                Edit Profile
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </MainLayout>
  );
}
