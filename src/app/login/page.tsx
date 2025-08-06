"use client";

import React, { useEffect, useState } from 'react';
import { Logo } from '@/components/layout/Logo';
import { Flex } from 'antd';
import { useAuth } from '@/hooks/useAuth';
import { redirect } from 'next/navigation';

const LoginPage = () => {
  const { isAuthenticated, login, isLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      redirect('/quotes');
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await login({
      email: username,
      password: password,
    });
  };

  return (
      <div className="login-page flex items-center justify-center min-h-screen bg-background text-foreground">
      <div className="card p-8 shadow-md">
        <Logo theme="light" />
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field w-full"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field w-full"
            />
          </div>
          <button type="submit" disabled={isLoading} className="btn-primary w-full">Login</button>
        </form>
        </div>
      </div>
  );
};

export default LoginPage;