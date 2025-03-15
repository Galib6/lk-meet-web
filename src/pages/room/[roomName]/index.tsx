import { getAuthSession } from '@components/auth/lib/utils';
import LiveKitRoomCom from '@components/home/LiveKitRoomCom';
import WaitingRoom from '@components/home/WaitingRoom';
import { useGetMeetingSessionRequests, useSendJoinRequest } from '@lib/hooks/hooks';
import { Services } from '@lib/services/service';
import { socketService } from '@lib/services/socket';
import { playSound } from '@lib/utils/notificationSound';
import '@livekit/components-styles';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import Spinner from 'src/@base/components/Spinner';
import { queryClient } from 'src/@base/config';
import { SOCKET_EVENT } from 'src/@base/constants/meetingSessionEvent';
import { localStorageSate } from 'src/@base/constants/storage';
import useLocalStorage from 'src/@base/hooks/useLocalStorage';

export default function Index() {
  const router = useRouter();
  const { roomName } = router?.query;
  const auth = getAuthSession();
  const userId = auth?.user?.id?.toString();
  const [loading, setLoading] = useState(false);
  const [connectionDetails, setConnectionDetails, isLocalStorageLoading] = useLocalStorage(
    localStorageSate?.connectionDetails,
  );
  const [authUserType, setAuthUserType] = useLocalStorage(localStorageSate?.userType);

  const meetingSessionRequests = useGetMeetingSessionRequests({ options: { roomName: roomName?.toString() } });

  // Fetch session request when roomName and localStorage state is ready
  useEffect(() => {
    if (isLocalStorageLoading || !roomName) return;

    (async () => {
      try {
        setLoading(true);
        setConnectionDetails(null);
        const res = await Services.createSessionRequest({ roomName: roomName?.toString() });

        if (!res?.success) {
          if (res.errorMessages?.[0]?.includes('Not Allowed')) router.push('/');
          return;
        }

        setAuthUserType(res?.data?.userType);
      } catch (error) {
        console.error('Error creating session request:', error);
        toast.error('Failed to create session. Try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, [roomName, isLocalStorageLoading]);

  // Handle socket events efficiently
  useEffect(() => {
    if (!userId) return;

    // Ensure socket is connected
    if (!socketService.isConnected(userId)) {
      socketService.connect(userId);
    }

    const handleConnectionDetails = (data: any) => {
      if (data?.roomName && data?.participantToken) {
        setConnectionDetails({ roomName: data.roomName, token: data.participantToken });
      } else {
        console.warn('Invalid connection details received:', data);
      }
    };

    const handleNewRequest = (data: any) => {
      queryClient.invalidateQueries({ queryKey: [Services.getMeetingRequestList.name] });
      playSound('new-req');
      toast.info(`${data?.name} requested to join the meeting`, {
        position: 'top-right',
        autoClose: 10000,
        hideProgressBar: true,
      });
    };

    const handleOnRejection = () => {
      toast.error(`Host rejected your request!`, {
        position: 'top-right',
        autoClose: 10000,
        hideProgressBar: true,
      });
      router.push('/');
    };

    socketService.on(SOCKET_EVENT.CONNECTION_DETAILS, handleConnectionDetails);
    socketService.on(SOCKET_EVENT.NEW_REQUEST, handleNewRequest);
    socketService.on(SOCKET_EVENT.REQ_REJECTED, handleOnRejection);

    return () => {
      socketService.off(SOCKET_EVENT.CONNECTION_DETAILS, handleConnectionDetails);
      socketService.off(SOCKET_EVENT.NEW_REQUEST, handleNewRequest);
      socketService.off(SOCKET_EVENT.REQ_REJECTED, handleOnRejection);
    };
  }, [userId]);

  const sendJoinRequestFn = useSendJoinRequest({
    config: {
      onSuccess(data) {
        if (!data?.success) return;
      },
    },
  });

  // Memoized content rendering
  const content = useMemo(() => {
    if (loading || isLocalStorageLoading) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <Spinner />
        </div>
      );
    }

    if (connectionDetails?.token) {
      return <LiveKitRoomCom meetingSessionRequests={meetingSessionRequests?.data?.data} />;
    }

    if (authUserType === 'admin' || authUserType === 'participant') {
      return authUserType === 'participant' ? (
        <WaitingRoom
          userName={auth?.user?.name}
          onSendRequest={() => sendJoinRequestFn.mutate({ roomName: roomName.toString() })}
        />
      ) : (
        <div className="flex min-h-screen items-center justify-center">
          <Spinner />
        </div>
      );
    }

    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }, [loading, isLocalStorageLoading, connectionDetails?.token, authUserType, meetingSessionRequests?.data?.data]);

  return content;
}
