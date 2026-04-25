import { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';

export default function DynamicForm({
  fields = [],
  onSubmit,
  loading = false,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  onCancel,
}) {
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: field.defaultValue || '' }), {})
  );
  const [errors, setErrors] = useState({});
  const { error: errorToast } = useToast();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
      if (field.validate && !field.validate(formData[field.name])) {
        newErrors[field.name] = field.errorMessage || 'Invalid input';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      errorToast('Please fix the errors in the form');
      return;
    }
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name}>
          {field.type === 'select' ? (
            <>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              <select
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required={field.required}
                className="w-full px-4 py-2 bg-[#0F0F0F] border border-[#333] rounded text-white focus:outline-none focus:ring-2 focus:ring-[#CCFF00]"
              >
                <option value="">Select {field.label}</option>
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </>
          ) : field.type === 'textarea' ? (
            <>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              <textarea
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required={field.required}
                rows={field.rows || 3}
                placeholder={field.placeholder}
                className="w-full px-4 py-2 bg-[#0F0F0F] border border-[#333] rounded text-white focus:outline-none focus:ring-2 focus:ring-[#CCFF00] resize-none"
              />
            </>
          ) : field.type === 'checkbox' ? (
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name={field.name}
                checked={formData[field.name]}
                onChange={handleChange}
                className="w-4 h-4 rounded accent-[#CCFF00]"
              />
              <span className="text-gray-300">{field.label}</span>
            </label>
          ) : (
            <Input
              type={field.type || 'text'}
              name={field.name}
              label={field.label}
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={handleChange}
              required={field.required}
              error={errors[field.name]}
            />
          )}
        </div>
      ))}

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? <Spinner size="sm" /> : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
            {cancelLabel}
          </Button>
        )}
      </div>
    </form>
  );
}
