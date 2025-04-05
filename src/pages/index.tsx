'use client';

import { getAuthSession } from '@components/auth/lib/utils';
import Header from '@components/home/Header';
import Slider from '@components/home/Slider';

import { ENUM_MEETING_SESSION_TYPE } from '@lib/enums';
import { useMeetingSessionCreate } from '@lib/hooks/hooks';
import { socketService } from '@lib/services/socket';
import { Calendar, ChevronDown, Video } from 'lucide-react';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { SOCKET_EVENT } from 'src/@base/constants/meetingSessionEvent';
import { Paths } from 'src/@base/constants/paths';
import { localStorageSate } from 'src/@base/constants/storage';
import useLocalStorage from 'src/@base/hooks/useLocalStorage';

export default function GoogleMeetClone() {
  const router = useRouter();
  const auth = getAuthSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [_connectionDetails, setConnectionDetails] = useLocalStorage(localStorageSate?.connectionDetails);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    setConnectionDetails(null);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const createMeetingSessionFn = useMeetingSessionCreate({
    config: {
      onSuccess(data) {
        if (!data?.success) return;
      },
    },
  });

  useEffect(() => {
    if (!auth?.user?.id) return;

    const userId = auth.user.id.toString();
    socketService.connect(userId);

    const handleConnectionDetails = (data) => {
      router.push(Paths.meeting.toRoomPage(data.roomName));
    };

    socketService.on(SOCKET_EVENT.CONNECTION_DETAILS, handleConnectionDetails);

    // Cleanup function
    return () => {
      socketService.off(SOCKET_EVENT.CONNECTION_DETAILS, handleConnectionDetails);
    };
  }, [auth?.user?.id, router]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="mx-auto mt-0 max-w-6xl px-4 py-6 sm:px-6 sm:py-12 lg:mt-[70px]">
        <div className="grid items-center gap-8 md:grid-cols-2">
          {/* Left Column - Text Content */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-medium leading-tight text-gray-800 sm:text-4xl md:text-5xl">
                Video calls and meetings for everyone
              </h1>
              <p className="text-base text-gray-600 sm:text-lg">
                Connect, collaborate and celebrate from anywhere with Sync Call
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <button
                  ref={buttonRef}
                  onClick={toggleDropdown}
                  className="flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 sm:w-auto"
                >
                  <Video className="mr-2 h-5 w-5" />
                  New meeting
                  <ChevronDown className="ml-2 h-4 w-4" />
                </button>

                {dropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute left-0 top-full z-10 mt-1 w-64 rounded-md border border-gray-200 bg-white shadow-lg"
                  >
                    <div className="py-1">
                      <button
                        className="flex w-full items-center px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          if (!auth?.user?.id) {
                            router.push({
                              pathname: Paths.auth.login,
                              query: { callbackUrl: router.asPath },
                            });
                            return;
                          }
                          createMeetingSessionFn.mutate({ sessionType: ENUM_MEETING_SESSION_TYPE.public });
                          setDropdownOpen(false);
                        }}
                      >
                        <Video className="mr-3 h-5 w-5 text-blue-600" />
                        <div>
                          <div className="font-medium">Create instant meeting</div>
                          <div className="mt-0.5 text-xs text-gray-500">Start a meeting now</div>
                        </div>
                      </button>
                      <button
                        className="flex w-full items-center px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Calendar className="mr-3 h-5 w-5 text-blue-600" />
                        <div>
                          <div className="font-medium">Create meeting for later</div>
                          <div className="mt-0.5 text-xs text-gray-500">Schedule in Google Calendar</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Enter a code or link"
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 transform px-2 font-medium text-blue-600">
                  Join
                </button>
              </div>
            </div>

            <div className="border-t pt-6">
              <a href="#" className="flex items-center text-sm text-blue-600 hover:underline">
                Learn more
                <span className="ml-1">about Sync Call</span>
              </a>
            </div>
          </div>

          {/* Right Column - Carousel */}
          <Slider />
        </div>
      </main>
    </div>
  );
}
