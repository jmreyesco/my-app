// ...existing code...
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import api, { setAuthToken } from '../../lib/api';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setAuth } from '../../store/authSlice';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

type FormValues = { email: string; password: string };

const schema = yup.object({
  email: yup.string().email('Email inválido').required('Email requerido'),
  password: yup.string().min(4, 'Mínimo 4 caracteres').required('Password requerido'),
}).required();

export default function LoginPage() {
  const { register, handleSubmit, formState } = useForm<FormValues>({ resolver: yupResolver(schema) });
  const { errors, isSubmitting } = formState;
  const router = useRouter();
  const dispatch = useDispatch();

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await api.post('/auth/login', data);
      const token = res.data.access_token;
      setAuthToken(token);
      dispatch(setAuth({ token, user: { email: data.email } }));
      localStorage.setItem('token', token);
      router.push('/programs');
    } catch (err) {
      console.error(err);
      alert('Login failed: revisa credenciales o crea el usuario en /users');
    }
  };

  return (
    <div className="login-root">
      <form className="login-card" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="login-title">Iniciar sesión</h1>

        <label className="label">Email</label>
        <Input {...register('email')} placeholder="tu@correo.com" />
        {errors.email && <p className="error">{errors.email.message as string}</p>}

        <label className="label">Password</label>
        <Input {...register('password')} type="password" placeholder="********" />
        {errors.password && <p className="error">{errors.password.message as string}</p>}

        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Entrando...' : 'Entrar'}</Button>
        <p className="hint">Si aún no tienes usuario, crea uno en POST /users (email y fullName).</p>
      </form>
    </div>
  );
}
// ...existing code...