import { useValidate } from '@components/auth/lib/hooks';
import { setAuthSession } from '@components/auth/lib/utils';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import Spinner from 'src/@base/components/Spinner';

const AuthValidate = () => {
  const router = useRouter();

  const provider = router?.query?.provider?.toString();
  const callbackUrlWithToken = router?.query?.callbackUrl?.toString() ?? '';
  const [callbackUrl, token] = callbackUrlWithToken?.split('?token=');

  const validate = useValidate({
    config: {
      onSuccess: (data) => {
        if (data?.success) {
          setAuthSession(data?.data);
          toast
            .promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
              pending: 'Logging in...',
              success: 'Login successful!',
              error: 'Login failed!',
            })
            .then(() => window.location.replace(callbackUrl));
          return;
        }
        toast.error(data?.message, {
          autoClose: 1000,
        });
      },
    },
  });

  useEffect(() => {
    if (token && provider) {
      validate?.mutateAsync({ token, provider });
    }
  }, [token]);

  return (
    <div className="flex h-screen items-center justify-center">
      <Spinner />
    </div>
  );
};

export default AuthValidate;
