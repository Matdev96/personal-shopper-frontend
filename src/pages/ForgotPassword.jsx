import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import authService from '../services/authService';

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  const onSubmit = async (data) => {
    setIsLoading(true);
    setFormError('');
    try {
      await authService.forgotPassword(data.email);
      setSubmitted(true);
    } catch (error) {
      setFormError(error?.detail || 'Erro ao enviar email. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Email enviado!</h2>
          <p className="text-gray-600 mb-2">
            Se este email estiver cadastrado, você receberá as instruções para redefinir sua senha em breve.
          </p>
          <p className="text-sm text-gray-400 mb-8">
            Verifique também sua caixa de spam. O link expira em <strong>1 hora</strong>.
          </p>
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Voltar para o login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Esqueceu a senha?</h2>
          <p className="text-gray-500 text-sm">
            Digite seu email e enviaremos um link para você criar uma nova senha.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              {...register('email', {
                required: 'Email é obrigatório',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email inválido',
                },
              })}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-400' : 'border-gray-300'
              }`}
              placeholder="seu@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
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
            {isLoading ? 'Enviando...' : 'Enviar link de recuperação'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Lembrou a senha?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Voltar para o login
          </Link>
        </p>
      </div>
    </div>
  );
}
