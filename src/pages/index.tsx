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
import { toast } from 'react-toastify';
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
  const [meetingCode, setMeetingCode] = useState('');

  const handleJoinMeeting = () => {
    if (!meetingCode.trim()) {
      toast.error('Please enter a meeting code');
      return;
    }

    if (!auth?.user?.id) {
      router.push({
        pathname: Paths.auth.login,
        query: { callbackUrl: router.asPath },
      });
      return;
    }

    router.push(Paths.meeting.toRoomPage(meetingCode.trim()));
  };

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
      <Header />

      <main className="mx-auto mt-0 max-w-[1400px] px-4 py-6 sm:px-6 sm:py-12 lg:mt-[70px]">
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl font-medium leading-tight text-gray-800 sm:text-5xl md:text-6xl lg:text-6xl">
                Video calls and meetings for everyone
              </h1>
              <p className="text-lg text-gray-600 sm:text-xl lg:text-2xl">
                Connect, collaborate and celebrate from anywhere with Sync Call
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative">
                <button
                  ref={buttonRef}
                  onClick={toggleDropdown}
                  className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-lg font-medium text-white transition hover:bg-blue-700 sm:w-auto"
                >
                  <Video className="mr-3 h-6 w-6" />
                  New meeting
                  <ChevronDown className="ml-2 h-5 w-5" />
                </button>

                {dropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute left-0 top-full z-10 mt-2 w-72 rounded-lg border border-gray-200 bg-white shadow-xl"
                  >
                    <div className="py-2">
                      <button
                        className="flex w-full items-center px-6 py-4 text-left text-base text-gray-700 hover:bg-gray-50"
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
                        <Video className="mr-4 h-6 w-6 text-blue-600" />
                        <div>
                          <div className="font-medium">Create instant meeting</div>
                          <div className="mt-1 text-sm text-gray-500">Start a meeting now</div>
                        </div>
                      </button>
                      <button
                        className="flex w-full items-center px-6 py-4 text-left text-base text-gray-700 hover:bg-gray-50"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Calendar className="mr-4 h-6 w-6 text-blue-600" />
                        <div>
                          <div className="font-medium">Create meeting for later</div>
                          <div className="mt-1 text-sm text-gray-500">Schedule in Google Calendar</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative flex-1">
                <input
                  type="text"
                  value={meetingCode}
                  onChange={(e) => setMeetingCode(e.target.value)}
                  placeholder="Enter a code or link"
                  className="w-full rounded-lg border border-gray-300 px-6 py-3 text-lg focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleJoinMeeting}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transform px-4 text-lg font-medium text-blue-600 hover:text-blue-700"
                >
                  Join
                </button>
              </div>
            </div>

            <div className="border-t pt-8">
              <a href="#" className="flex items-center text-lg text-blue-600 hover:underline">
                Learn more
                <span className="ml-2">about Sync Call</span>
              </a>
            </div>
          </div>

          {/* Right Column - Carousel */}
          <div className="w-full">
            <Slider />
          </div>
        </div>
      </main>
    </div>
  );
}
