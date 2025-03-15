import { clearAuthSession, useAuthSession } from '@components/auth/lib/utils';
import { HelpCircle, LogIn, LogOut, MessageSquare, Rabbit } from 'lucide-react';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

const Header = () => {
  const router = useRouter();
  const { user } = useAuthSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b bg-white px-4 py-3 sm:px-6">
      <div className="flex items-center">
        <div className="mr-2 flex items-center">
          <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-md bg-gray-700">
            <Rabbit className="h-5 w-5 text-white" />
          </div>
          <span className="hidden text-xl font-medium text-gray-700 sm:inline">Sync Call</span>
        </div>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-4">
        <div className="whitespace-nowrap text-xs text-gray-600 sm:text-sm">14:22 • Mon 10 Mar</div>
        <button className="rounded-full p-1 hover:bg-gray-100 sm:p-2">
          <HelpCircle className="h-4 w-4 text-gray-600 sm:h-5 sm:w-5" />
        </button>
        <button className="rounded-full p-1 hover:bg-gray-100 sm:p-2">
          <MessageSquare className="h-4 w-4 text-gray-600 sm:h-5 sm:w-5" />
        </button>
        {/* <button className="rounded-full p-1 hover:bg-gray-100 sm:p-2">
          <Settings className="h-4 w-4 text-gray-600 sm:h-5 sm:w-5" />
        </button>
        <button className="rounded-full p-1 hover:bg-gray-100 sm:p-2">
          <Grid className="h-4 w-4 text-gray-600 sm:h-5 sm:w-5" />
        </button> */}

        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-200 hover:ring-2 hover:ring-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 sm:h-8 sm:w-8"
            >
              <span className="text-xs font-medium sm:text-sm">
                {user?.name
                  ?.split(' ')
                  .map((item) => item?.[0])
                  .join('')
                  .slice(0, 2)}
              </span>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-60 rounded-md border bg-white py-1 shadow-lg">
                <div className="border-b px-4 py-3">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>

                <div className="py-1">
                  {/* <button className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <User className="mr-3 h-4 w-4" />
                    Profile
                  </button> */}
                  {/* <button className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <Mail className="mr-3 h-4 w-4" />
                    Settings
                  </button> */}
                  {/* <div className="my-1 border-t"></div> */}
                  <button
                    onClick={() => {
                      clearAuthSession();
                      window.location.reload();
                    }}
                    className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => router.push('/auth/sign-in')}
            className="flex items-center gap-2 rounded-full bg-gray-700 px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-600"
          >
            <LogIn className="h-4 w-4" />
            <span className="hidden sm:inline">Sign in</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
