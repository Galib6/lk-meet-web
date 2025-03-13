import { ENV } from '.environments';
import GoogleIcon from '@components/auth/components/Google';
import { useLogin } from '@components/auth/lib/hooks';
import { setAuthSession } from '@components/auth/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Paths, pathToUrl } from 'src/@base/constants/paths';

const SignIn = () => {
  const router = useRouter();
  let callbackUrl = router.query?.callbackUrl?.toString();
  const webRedirectUrl = `${pathToUrl(Paths.auth.validate)}?callbackUrl=${callbackUrl ?? pathToUrl(Paths.root)}`;
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
  });

  const loginFn = useLogin({
    config: {
      onSuccess(data) {
        if (!data?.success) return;
        setAuthSession(data?.data);
        toast
          .promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
            pending: 'Logging in...',
            success: 'Login successful!',
            error: 'Login failed!',
          })
          .then(() => {
            if (callbackUrl) {
              window.location.replace(callbackUrl);
              return Promise.resolve(true);
            } else {
              return router.push('/');
            }
          });
      },
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginFn.mutate(formValues);
  };

  return (
    <div className="flex h-screen">
      {/* Right Pane */}
      <div className="flex w-full items-center justify-center bg-gray-100 lg:w-1/2">
        <div className="w-full max-w-md p-6">
          <h1 className="mb-6 text-center text-3xl font-semibold text-black">Sign In</h1>
          <h1 className="mb-6 text-center text-sm font-semibold text-gray-500">
            Welcome to our community with all-time access and free
          </h1>
          <div className="mt-4 flex flex-col items-center justify-between lg:flex-row">
            <div className="mb-2 w-full lg:mb-0 lg:w-full">
              <form action={`${ENV.apiUrl}/auth/google`} method="GET">
                <input type="hidden" name="webRedirectUrl" value={webRedirectUrl} />
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-200 bg-white p-2 text-sm text-gray-600 transition-colors duration-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
                >
                  <GoogleIcon /> Sign Up with Google{' '}
                </button>
              </form>
            </div>
          </div>
          <div>
            <div className="mt-4 flex items-center justify-center">
              <div className="w-full border-t border-gray-300"></div>
              <div className="px-4 text-sm text-gray-500">Or</div>
              <div className="w-full border-t border-gray-300"></div>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formValues.email}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border p-2 transition-colors duration-300 focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formValues.password}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border p-2 transition-colors duration-300 focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full rounded-md bg-black p-2 text-white transition-colors duration-300 hover:bg-gray-800 focus:bg-black focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
              >
                Sign In
              </button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm text-gray-600">
            <p>
              Already haven't an account?{' '}
              <Link href="/auth/sign-up" className="text-black hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Left Pane */}
      <div className="hidden flex-1 items-center justify-center bg-white text-black lg:flex">
        <img src="/images/fingerprint-pana.svg" alt="Sign Up" className="h-[60%] w-[60%]" />
      </div>
    </div>
  );
};

export default SignIn;
