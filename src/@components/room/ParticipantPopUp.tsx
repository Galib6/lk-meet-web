'use client';

import { ChevronDown, Mic, MicOff, Search, UsersRound, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function ParticipantsPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const participants = [
    { id: 1, name: 'Casey Cecil', status: 'Admin', avatar: '/placeholder.svg?height=40&width=40', waiting: false },
    { id: 2, name: 'Mike Nolan', status: 'Joining...', avatar: '/placeholder.svg?height=40&width=40', waiting: false },
    {
      id: 3,
      name: 'Marketing Huddle',
      status: '',
      avatar: '/placeholder.svg?height=40&width=40',
      waiting: false,
      audioOff: true,
    },
    {
      id: 4,
      name: 'Victoria Ripes (Host, You)',
      status: '',
      avatar: '/placeholder.svg?height=40&width=40',
      waiting: false,
      audioOff: true,
    },
    {
      id: 5,
      name: 'Henry Park',
      status: '',
      avatar: '/placeholder.svg?height=40&width=40',
      waiting: false,
      audioOff: true,
    },
    { id: 6, name: 'Stephen Hill', status: '', avatar: '/placeholder.svg?height=40&width=40', waiting: true },
    { id: 7, name: 'Christian Park', status: 'Mobile', avatar: '/placeholder.svg?height=40&width=40', waiting: true },
    { id: 8, name: 'Henry Park', status: 'Declined', avatar: '/placeholder.svg?height=40&width=40', waiting: true },
    { id: 9, name: 'Jane Nolan', status: 'No response', avatar: '/placeholder.svg?height=40&width=40', waiting: true },
  ];

  return (
    <div className="relative">
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-10 rounded-full bg-red-500 p-3 text-white shadow-lg transition-colors hover:bg-red-600"
        aria-label="Show participants"
      >
        <UsersRound className="h-4 w-4" />
      </button>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black bg-opacity-30" onClick={() => setIsOpen(false)}></div>}

      {/* Participants popup */}
      <div
        ref={popupRef}
        className={`fixed right-0 top-0 z-50 h-full w-80 bg-white shadow-xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between border-b p-3">
          <h2 className="font-medium text-black">Participants</h2>
          <button onClick={() => setIsOpen(false)} className="p-1 text-gray-500 hover:text-gray-700" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="w-full rounded-full border bg-transparent py-2 pl-9 pr-3 text-sm text-black focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-y-auto" style={{ height: 'calc(100% - 170px)' }}>
          <div className="border-b p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1 text-sm font-medium text-black">
                Waiting Room <span className="text-gray-500">(2)</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div>
              <div className="flex gap-2">
                <button className="text-sm text-blue-500">Admit All</button>
              </div>
            </div>

            {participants
              .filter((p) => p.waiting)
              .map((participant) => (
                <div key={participant.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    {/* <img
                      src={participant.avatar || '/placeholder.svg'}
                      alt={participant.name}
                      className="h-8 w-8 rounded-full object-cover"
                    /> */}
                    <div className="bg-gray-8 flex h-8 w-8 items-center justify-center rounded-full bg-gray-500 text-white">
                      {participant?.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-black">{participant.name}</div>
                      {participant.status && <div className="text-xs text-red-500">{participant.status}</div>}
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className="p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1 text-sm font-medium text-black">
                Meeting Participants <span className="text-gray-500">(4)</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div>
            </div>

            {participants
              .filter((p) => !p.waiting)
              .map((participant) => (
                <div key={participant.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    {/* <img
                      src={participant.avatar || '/placeholder.svg'}
                      alt={participant.name}
                      className="h-8 w-8 rounded-full object-cover"
                    /> */}

                    <div className="bg-gray-8 flex h-8 w-8 items-center justify-center rounded-full bg-gray-500 text-white">
                      {participant?.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-black">{participant.name}</div>
                      {/* {participant.status && <div className="text-xs text-red-500">{participant.status}</div>} */}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {participant.audioOff !== undefined && (
                      <div className="text-gray-400">
                        {participant.audioOff ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="absolute bottom-0 flex w-full items-center justify-between border-t bg-gray-50 p-3">
          <button className="text-sm font-medium text-red-500">End</button>
          <div className="flex gap-4">
            <button className="text-sm text-gray-700">Invite</button>
            <button className="text-sm text-gray-700">Mute All</button>
            <button className="text-sm text-gray-700">···</button>
          </div>
        </div>
      </div>
    </div>
  );
}
