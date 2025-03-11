'use client';

import Slider from '@components/home/Slider';
import { Calendar, ChevronDown, Grid, HelpCircle, MessageSquare, Rabbit, Settings, Video } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function GoogleMeetClone() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 flex items-center justify-between border-b px-4 py-3 sm:px-6">
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
          <button className="rounded-full p-1 hover:bg-gray-100 sm:p-2">
            <Settings className="h-4 w-4 text-gray-600 sm:h-5 sm:w-5" />
          </button>
          <button className="rounded-full p-1 hover:bg-gray-100 sm:p-2">
            <Grid className="h-4 w-4 text-gray-600 sm:h-5 sm:w-5" />
          </button>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-200 sm:h-8 sm:w-8">
            <span className="text-xs font-medium sm:text-sm">U</span>
          </div>
        </div>
      </header>

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
                Connect, collaborate and celebrate from anywhere with Connect Through
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
                        onClick={() => setDropdownOpen(false)}
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
                <span className="ml-1">about Google Meet</span>
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
