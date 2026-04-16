import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import authService from '../services/authService';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Token ausente na URL
  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Link inválido</h2>
          <p className="text-gray-500 text-sm mb-6">
            Este link de recuperação é inválido ou está incompleto.
          </p>
          <Link to="/forgot-password" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            Solicitar novo link
          </Link>
        </div>
      </div>
    );
  }

  const onSubmit = async (data) => {
    setIsLoading(true);
    setFormError('');
    try {
      await authService.resetPassword(token, data.password);
      toast.success('Senha redefinida com sucesso!');
      navigate('/login');
    } catch (error) {
      setFormError(error?.detail || 'Erro ao redefinir senha. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const EyeIcon = ({ show }) => show ? (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
    </svg>
  ) : (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Criar nova senha</h2>
          <p className="text-gray-500 text-sm">
            A senha deve ter no mínimo 8 caracteres, uma letra maiúscula, um número e um caractere especial.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nova senha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nova senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password', {
                  required: 'Nova senha é obrigatória',
                  minLength: { value: 8, message: 'Mínimo 8 caracteres' },
                  validate: {
                    hasUpper: v => /[A-Z]/.test(v) || 'Deve conter uma letra maiúscula',
                    hasNumber: v => /\d/.test(v) || 'Deve conter um número',
                    hasSpecial: v => /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(v) || 'Deve conter um caractere especial',
                  },
                })}
                className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? 'border-red-400' : 'border-gray-300'
                }`}
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPassword(p => !p)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600" tabIndex={-1}>
                <EyeIcon show={showPassword} />
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Confirmar senha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar nova senha
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                {...register('confirmPassword', {
                  required: 'Confirmação é obrigatória',
                  validate: v => v === watch('password') || 'As senhas não coincidem',
                })}
                className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.confirmPassword ? 'border-red-400' : 'border-gray-300'
                }`}
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowConfirm(p => !p)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600" tabIndex={-1}>
                <EyeIcon show={showConfirm} />
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          {formError && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-300 rounded-md px-4 py-3">
              <svg className="h-5 w-5 text-red-500 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-700">{formError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {isLoading ? 'Salvando...' : 'Redefinir senha'}
          </button>
        </form>
      </div>
    </div>
  );
}
