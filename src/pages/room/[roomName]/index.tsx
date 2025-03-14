import { getAuthSession } from '@components/auth/lib/utils';
import LiveKitRoomCom from '@components/home/LiveKitRoomCom';
import WaitingRoom from '@components/home/WaitingRoom';
import { useGetMeetingSessionRequests } from '@lib/hooks/hooks';
import { Services } from '@lib/services/service';
import { socketService } from '@lib/services/socket';
import '@livekit/components-styles';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
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
  const [loading, setLoading] = useState(false);
  const [connectionDetails, setConnectionDetails, isLocalStorageLoading] = useLocalStorage(
    localStorageSate?.connectionDetails,
  );
  const [authUserType, setAuthUserType] = useLocalStorage(localStorageSate?.userType);

  const meetingSessionRequests = useGetMeetingSessionRequests({ options: { roomName: roomName?.toString() } });

  useEffect(() => {
    if (isLocalStorageLoading || !roomName) return;

    const createSessionRequest = async () => {
      try {
        setLoading(true);
        const res = await Services.createSessionRequest({ roomName: roomName?.toString() });
        if (!res?.success) {
          toast.error(res.errorMessages?.[0]);
          return;
        }
        setAuthUserType(res.data.userType);
      } catch (error) {
        console.error('Error creating session request:', error);
        toast.error('Failed to create session. Try again.');
      } finally {
        setLoading(false);
      }
    };

    createSessionRequest();
  }, [roomName, isLocalStorageLoading]);

  useEffect(() => {
    if (!auth?.user?.id) return;

    const authUserId = auth?.user?.id.toString();

    // Ensure socket is connected before sending events
    if (!socketService.isConnected(authUserId)) {
      socketService.connect(authUserId);
    }

    const handleConnectionDetails = (data: any) => {
      if (data?.roomName && data?.participantToken) {
        setConnectionDetails({
          roomName: data?.roomName,
          token: data?.participantToken,
        });
      } else {
        console.warn('Received invalid connection details:', data);
      }
    };

    const handleNewRequest = (data: any) => {
      queryClient.invalidateQueries({
        queryKey: [Services.getMeetingRequestList.name],
      });

      toast.info(`${data?.name} requested to join the meeting`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    };

    const handleOnRejection = () => {
      toast.error(`Host rejected your request!`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      router.push('/');
    };

    // Add event listeners
    socketService.on(SOCKET_EVENT.CONNECTION_DETAILS, handleConnectionDetails);
    socketService.on(SOCKET_EVENT.NEW_REQUEST, handleNewRequest);
    socketService.on(SOCKET_EVENT.REQ_REJECTED, handleOnRejection);

    // Cleanup function to remove event listeners
    return () => {
      socketService.off(SOCKET_EVENT.CONNECTION_DETAILS, handleConnectionDetails);
      socketService.off(SOCKET_EVENT.NEW_REQUEST, handleNewRequest);
      socketService.off(SOCKET_EVENT.REQ_REJECTED, handleOnRejection);
    };
  }, [auth?.user?.id]);

  const renderContent = () => {
    if (loading || isLocalStorageLoading) {
      return (
        <div className="flex h-screen items-center justify-center">
          <Spinner />
        </div>
      );
    }

    if (connectionDetails?.token) {
      return <LiveKitRoomCom meetingSessionRequests={meetingSessionRequests?.data?.data} />;
    }

    if (authUserType === 'admin') {
      return (
        <div className="flex h-screen items-center justify-center">
          <Spinner />
        </div>
      );
    }

    if (authUserType === 'participant') {
      return <WaitingRoom userName={auth?.user?.name} />;
    }

    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  };

  return <div className="min-h-screen">{renderContent()}</div>;
}
