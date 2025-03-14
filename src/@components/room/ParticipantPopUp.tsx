'use client';

import { ENUM_MEETING_ENTRY_APPROVAL_STATUS } from '@lib/enums';
import { useUpdateSessionRequest } from '@lib/hooks/hooks';
import { IMeetingSessionRequest } from '@lib/interface/meetingSession.interfaces';
import { useRemoteParticipants } from '@livekit/components-react';
import { Check, ChevronDown, Mic, MicOff, Search, UsersRound, Video, VideoOff, X, XIcon } from 'lucide-react';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { localStorageSate } from 'src/@base/constants/storage';
import useLocalStorage from 'src/@base/hooks/useLocalStorage';

export default function ParticipantsPopup({
  meetingSessionRequests,
}: {
  meetingSessionRequests: IMeetingSessionRequest[];
}) {
  const router = useRouter();
  const { roomName } = router?.query;
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const remoteParticipants = useRemoteParticipants();
  const [authUserType, _, isLoading] = useLocalStorage(localStorageSate?.userType);
  const userIsAdmin = authUserType === 'admin';

  const updateSessionRequestFn = useUpdateSessionRequest({
    config: {
      onSuccess(res) {
        if (!res?.success) return;
      },
    },
  });

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

  const participants = remoteParticipants.map((p) => ({
    name: p.name,
    id: p?.identity,
    audioOff: !p.isMicrophoneEnabled,
    videoOff: !p.isCameraEnabled,
  }));

  const waitingRoomParticipants =
    meetingSessionRequests?.map((p) => ({
      name: `${p?.user?.firstName} ${p?.user?.lastName}`,
      id: p?.user?.id,
      avatar: p?.user?.avatar,
    })) || [];
  // { id: 1, name: 'Casey Cecil', status: 'Admin', avatar: '/placeholder.svg?height=40&width=40', waiting: false },

  return (
    <div className="relative">
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-4 top-4 z-10 rounded-full bg-red-500 p-3 text-white shadow-lg transition-colors hover:bg-red-600 md:bottom-4 md:top-auto"
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
          {!isLoading && userIsAdmin && (
            <div className="border-b p-3">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm font-medium text-black">
                  Waiting Room <span className="text-gray-500">({waitingRoomParticipants?.length})</span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      updateSessionRequestFn.mutate({
                        requestsIds: [...waitingRoomParticipants.map((p) => p.id)],
                        status: ENUM_MEETING_ENTRY_APPROVAL_STATUS.approved,
                        roomName: roomName?.toString(),
                      })
                    }
                    className="text-sm text-blue-500"
                  >
                    Admit All
                  </button>
                </div>
              </div>

              {waitingRoomParticipants.map((participant) => (
                <div key={participant.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-8 flex h-8 w-8 items-center justify-center rounded-full bg-gray-500 text-white">
                      {participant?.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-black">{participant.name}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        updateSessionRequestFn.mutate({
                          requestsIds: [participant.id],
                          status: ENUM_MEETING_ENTRY_APPROVAL_STATUS.approved,
                          roomName: roomName?.toString(),
                        })
                      }
                      className="rounded-full bg-green-100 p-1.5 text-green-600 hover:bg-green-200"
                      aria-label="Admit participant"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() =>
                        updateSessionRequestFn.mutate({
                          requestsIds: [participant.id],
                          status: ENUM_MEETING_ENTRY_APPROVAL_STATUS.rejected,
                          roomName: roomName?.toString(),
                        })
                      }
                      className="rounded-full bg-red-100 p-1.5 text-red-600 hover:bg-red-200"
                      aria-label="Reject participant"
                    >
                      <XIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1 text-sm font-medium text-black">
                Meeting Participants <span className="text-gray-500">({participants?.length})</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div>
            </div>

            {participants.map((participant) => (
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
                      .join('')
                      .slice(0, 2)}
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
                  {participant.videoOff !== undefined && (
                    <div className="text-gray-400">
                      {participant.videoOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 flex w-full items-center justify-between border-t bg-gray-50 p-3">
          {!isLoading && userIsAdmin && (
            <>
              <button className="text-sm font-medium text-red-500">End</button>
              <div className="flex gap-4">
                <button className="text-sm text-gray-700">Invite</button>
                <button className="text-sm text-gray-700">Mute All</button>
                <button className="text-sm text-gray-700">···</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
