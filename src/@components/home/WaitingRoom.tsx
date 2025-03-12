'use client';

import type React from 'react';

import { Mic, MicOff, Settings, Video, VideoOff, Volume2 } from 'lucide-react';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

interface MediaDevice {
  deviceId: string;
  kind: string;
  label: string;
}

export default function WaitingRoom({ userName }: { userName: string }) {
  const router = useRouter();
  const [cameraOn, setCameraOn] = useState(false);
  const [micOn, setMicOn] = useState(false);
  // const [userName, setUserName] = useState('John Doe');
  const [waitingTime, setWaitingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Device states
  const [videoDevices, setVideoDevices] = useState<MediaDevice[]>([]);
  const [audioInputDevices, setAudioInputDevices] = useState<MediaDevice[]>([]);
  const [audioOutputDevices, setAudioOutputDevices] = useState<MediaDevice[]>([]);
  const [selectedVideoDevice, setSelectedVideoDevice] = useState<string>('');
  const [selectedAudioInputDevice, setSelectedAudioInputDevice] = useState<string>('');
  const [selectedAudioOutputDevice, setSelectedAudioOutputDevice] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const microphone = useRef<MediaStreamAudioSourceNode | null>(null);
  const mediaStream = useRef<MediaStream | null>(null);
  const animationFrame = useRef<number | null>(null);
  const mediaOperationInProgress = useRef<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Safely stop media stream
  const safelyStopMediaStream = () => {
    if (mediaStream.current) {
      try {
        const tracks = mediaStream.current.getTracks();
        tracks.forEach((track) => {
          try {
            track.stop();
          } catch (err) {
            console.error('Error stopping track:', err);
          }
        });
        mediaStream.current = null;
      } catch (err) {
        console.error('Error stopping media stream:', err);
      }
    }

    // Clear video element
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject = null;
    }
  };

  // Safely close audio context
  const safelyCloseAudioContext = async () => {
    if (audioContext.current && audioContext.current.state !== 'closed') {
      try {
        await audioContext.current.close();
      } catch (err) {
        console.error('Error closing AudioContext:', err);
      }
      audioContext.current = null;
    }

    if (analyser.current) {
      analyser.current = null;
    }

    if (microphone.current) {
      microphone.current = null;
    }

    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    }

    // Reset audio level when closing audio context
    setAudioLevel(0);
  };

  // Enumerate available media devices with retry
  const getAvailableDevices = async (retryCount = 0) => {
    if (mediaOperationInProgress.current) {
      return;
    }

    mediaOperationInProgress.current = true;

    try {
      // We need to request permissions first to get labeled devices
      if (!hasPermissions) {
        try {
          // Try to get permissions for both audio and video
          const tempStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
          tempStream.getTracks().forEach((track) => track.stop());
          setHasPermissions(true);
        } catch (err) {
          console.warn('Could not get both audio and video permissions:', err);

          // Try with just audio if video fails
          try {
            const audioOnlyStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioOnlyStream.getTracks().forEach((track) => track.stop());
            setHasPermissions(true);
            // If we can only get audio, turn off camera
            setCameraOn(false);
          } catch (audioErr) {
            console.warn('Could not get audio permissions:', audioErr);

            // Try with just video if audio fails
            try {
              const videoOnlyStream = await navigator.mediaDevices.getUserMedia({ video: true });
              videoOnlyStream.getTracks().forEach((track) => track.stop());
              setHasPermissions(true);
              // If we can only get video, turn off mic
              setMicOn(false);
            } catch (videoErr) {
              console.error('Could not get any media permissions:', videoErr);
              if (retryCount < 2) {
                setTimeout(() => getAvailableDevices(retryCount + 1), 1000);
                return;
              } else {
                alert('Please allow access to at least one of camera or microphone to use the waiting room');
                mediaOperationInProgress.current = false;
                return;
              }
            }
          }
        }
      }

      // Wait a moment before enumerating devices to avoid conflicts
      await new Promise((resolve) => setTimeout(resolve, 500));

      const devices = await navigator.mediaDevices.enumerateDevices();

      const videoDevs = devices.filter((device) => device.kind === 'videoinput');
      const audioInputDevs = devices.filter((device) => device.kind === 'audioinput');
      const audioOutputDevs = devices.filter((device) => device.kind === 'audiooutput');

      setVideoDevices(
        videoDevs.map((device) => ({
          deviceId: device.deviceId,
          kind: device.kind,
          label: device.label || `Camera ${videoDevs.indexOf(device) + 1}`,
        })),
      );

      setAudioInputDevices(
        audioInputDevs.map((device) => ({
          deviceId: device.deviceId,
          kind: device.kind,
          label: device.label || `Microphone ${audioInputDevs.indexOf(device) + 1}`,
        })),
      );

      setAudioOutputDevices(
        audioOutputDevs.map((device) => ({
          deviceId: device.deviceId,
          kind: device.kind,
          label: device.label || `Speaker ${audioOutputDevs.indexOf(device) + 1}`,
        })),
      );

      // Set default selected devices if not already set
      if (
        (!selectedVideoDevice || !videoDevs.find((d) => d.deviceId === selectedVideoDevice)) &&
        videoDevs.length > 0
      ) {
        setSelectedVideoDevice(videoDevs[0].deviceId);
      }

      if (
        (!selectedAudioInputDevice || !audioInputDevs.find((d) => d.deviceId === selectedAudioInputDevice)) &&
        audioInputDevs.length > 0
      ) {
        setSelectedAudioInputDevice(audioInputDevs[0].deviceId);
      }

      if (
        (!selectedAudioOutputDevice || !audioOutputDevs.find((d) => d.deviceId === selectedAudioOutputDevice)) &&
        audioOutputDevs.length > 0
      ) {
        setSelectedAudioOutputDevice(audioOutputDevs[0].deviceId);
      }
    } catch (err) {
      console.error('Error enumerating devices:', err);
    } finally {
      mediaOperationInProgress.current = false;
    }
  };

  // Initialize device enumeration
  useEffect(() => {
    getAvailableDevices();

    // Listen for device changes
    navigator.mediaDevices.addEventListener('devicechange', () => getAvailableDevices());

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', () => getAvailableDevices());
    };
  }, [hasPermissions]);

  // Function to specifically set up camera
  const setupCamera = async () => {
    if (!cameraOn || mediaOperationInProgress.current) return;

    mediaOperationInProgress.current = true;
    setCameraError(null);

    try {
      // If we already have a stream with video, use it
      if (mediaStream.current) {
        const videoTracks = mediaStream.current.getVideoTracks();
        if (videoTracks.length > 0) {
          // We already have video, just make sure it's enabled
          videoTracks.forEach((track) => (track.enabled = true));

          // Make sure it's connected to the video element
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream.current;
          }

          mediaOperationInProgress.current = false;
          return;
        }
      }

      // We need to get a new video stream
      const constraints: MediaStreamConstraints = {
        video: selectedVideoDevice ? { deviceId: { exact: selectedVideoDevice } } : true,
      };

      // If we already have audio enabled, include it in the constraints
      if (micOn && mediaStream.current && mediaStream.current.getAudioTracks().length > 0) {
        constraints.audio = selectedAudioInputDevice ? { deviceId: { exact: selectedAudioInputDevice } } : true;
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      // If we already have a stream with audio only, combine them
      if (
        micOn &&
        mediaStream.current &&
        mediaStream.current.getAudioTracks().length > 0 &&
        stream.getAudioTracks().length === 0
      ) {
        const audioTracks = mediaStream.current.getAudioTracks();
        audioTracks.forEach((track) => stream.addTrack(track.clone()));
      }

      // Stop the old stream
      safelyStopMediaStream();

      mediaStream.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setHasPermissions(true);

      // If mic is on, make sure audio analyzer is working
      if (micOn) {
        setupAudioAnalyzer();
      }
    } catch (err) {
      console.error('Error setting up camera:', err);
      setCameraError(err instanceof Error ? err.message : 'Unknown error');
      setCameraOn(false);
    } finally {
      mediaOperationInProgress.current = false;
    }
  };

  // Function to specifically set up microphone
  const setupMicrophone = async () => {
    if (!micOn || mediaOperationInProgress.current) return;

    mediaOperationInProgress.current = true;

    try {
      // If we already have a stream with audio, use it
      if (mediaStream.current) {
        const audioTracks = mediaStream.current.getAudioTracks();
        if (audioTracks.length > 0) {
          // We already have audio, just make sure it's enabled
          audioTracks.forEach((track) => (track.enabled = true));

          // Set up audio analyzer - always recreate it to ensure proper functioning
          setupAudioAnalyzer();

          mediaOperationInProgress.current = false;
          return;
        }
      }

      // We need to get a new audio stream
      const constraints: MediaStreamConstraints = {
        audio: selectedAudioInputDevice ? { deviceId: { exact: selectedAudioInputDevice } } : true,
      };

      // If camera is on, include video in constraints
      if (cameraOn && mediaStream.current && mediaStream.current.getVideoTracks().length > 0) {
        constraints.video = selectedVideoDevice ? { deviceId: { exact: selectedVideoDevice } } : true;
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      // If we already have a stream with video only, combine them
      if (
        cameraOn &&
        mediaStream.current &&
        mediaStream.current.getVideoTracks().length > 0 &&
        stream.getVideoTracks().length === 0
      ) {
        const videoTracks = mediaStream.current.getVideoTracks();
        videoTracks.forEach((track) => stream.addTrack(track.clone()));
      }

      // Stop the old stream
      safelyStopMediaStream();

      mediaStream.current = stream;

      // If we have video, update the video element
      if (videoRef.current && mediaStream.current.getVideoTracks().length > 0) {
        videoRef.current.srcObject = stream;
      }

      setHasPermissions(true);

      // Set up audio analyzer
      setupAudioAnalyzer();
    } catch (err) {
      console.error('Error setting up microphone:', err);
      setMicOn(false);
    } finally {
      mediaOperationInProgress.current = false;
    }
  };

  // Set up audio analyzer
  const setupAudioAnalyzer = () => {
    if (!mediaStream.current || !micOn) return;

    try {
      // Close previous audio context if exists
      safelyCloseAudioContext();

      // Create new audio context
      audioContext.current = new AudioContext();
      analyser.current = audioContext.current.createAnalyser();

      // Get audio track from stream
      const audioTracks = mediaStream.current.getAudioTracks();
      if (audioTracks.length > 0) {
        microphone.current = audioContext.current.createMediaStreamSource(mediaStream.current);
        microphone.current.connect(analyser.current);
        analyser.current.fftSize = 256;

        const updateAudioLevel = () => {
          if (!analyser.current || !micOn) {
            setAudioLevel(0);
            return;
          }

          const dataArray = new Uint8Array(analyser.current.frequencyBinCount);
          analyser.current.getByteFrequencyData(dataArray);

          // Calculate average volume level
          const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
          setAudioLevel(average / 128); // Normalize to 0-1

          animationFrame.current = requestAnimationFrame(updateAudioLevel);
        };

        updateAudioLevel();
      }
    } catch (err) {
      console.error('Error setting up audio analyzer:', err);
    }
  };

  // Initialize camera and microphone when component mounts
  useEffect(() => {
    // Initial setup
    if (cameraOn) {
      setupCamera();
    }

    if (micOn) {
      setupMicrophone();
    }

    // Cleanup function
    return () => {
      safelyStopMediaStream();
      safelyCloseAudioContext();
    };
  }, []); // Empty dependency array for initial setup only

  // Handle camera state changes
  useEffect(() => {
    if (cameraOn) {
      setupCamera();
    } else if (mediaStream.current) {
      // Disable video tracks
      const videoTracks = mediaStream.current.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = false;
      });
    }
  }, [cameraOn, selectedVideoDevice]);

  // Handle microphone state changes
  useEffect(() => {
    if (micOn) {
      setupMicrophone();
    } else {
      // Disable audio tracks
      if (mediaStream.current) {
        const audioTracks = mediaStream.current.getAudioTracks();
        audioTracks.forEach((track) => {
          track.enabled = false;
        });
      }

      // Stop audio analyzer and reset audio level
      safelyCloseAudioContext();
    }
  }, [micOn, selectedAudioInputDevice]);

  // Update waiting time
  useEffect(() => {
    const timer = setInterval(() => {
      setWaitingTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format waiting time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Toggle camera
  const toggleCamera = () => {
    if (mediaOperationInProgress.current) return;
    setCameraOn(!cameraOn);
  };

  // Toggle microphone
  const toggleMic = () => {
    if (mediaOperationInProgress.current) return;
    setMicOn(!micOn);
  };

  // Handle device selection changes
  const handleVideoDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVideoDevice(e.target.value);
  };

  const handleAudioInputDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAudioInputDevice(e.target.value);
  };

  const handleAudioOutputDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAudioOutputDevice(e.target.value);
  };

  // Test audio output device by generating a tone
  const testAudioOutput = () => {
    try {
      // Create a new audio context
      const testAudioContext = new AudioContext();

      // Create an oscillator (tone generator)
      const oscillator = testAudioContext.createOscillator();
      oscillator.type = 'sine'; // Sine wave - smooth sound
      oscillator.frequency.setValueAtTime(440, testAudioContext.currentTime); // 440 Hz - A4 note

      // Create a gain node to control volume
      const gainNode = testAudioContext.createGain();
      gainNode.gain.setValueAtTime(0.2, testAudioContext.currentTime); // Set volume to 20%

      // Connect oscillator to gain node
      oscillator.connect(gainNode);

      // If setSinkId is supported, use it to route audio to the selected output device
      if ('setSinkId' in HTMLAudioElement.prototype && selectedAudioOutputDevice) {
        // Create an audio element to route the sound
        const audioElement = new Audio();
        audioElement.srcObject = testAudioContext.createMediaStreamDestination().stream;

        // Set the sink ID (output device)
        (audioElement as any)
          .setSinkId(selectedAudioOutputDevice)
          .then(() => {
            // Play the tone for 1 second
            gainNode.connect(testAudioContext.destination);
            oscillator.start();
            oscillator.stop(testAudioContext.currentTime + 1);

            // Clean up after 1.1 seconds
            setTimeout(() => {
              testAudioContext.close().catch((err) => console.error('Error closing test audio context:', err));
            }, 1100);
          })
          .catch((err: Error) => {
            console.error('Error setting audio output device for test:', err);
            // Fallback to default output
            gainNode.connect(testAudioContext.destination);
            oscillator.start();
            oscillator.stop(testAudioContext.currentTime + 1);

            setTimeout(() => {
              testAudioContext.close().catch((err) => console.error('Error closing test audio context:', err));
            }, 1100);
          });
      } else {
        // If setSinkId is not supported, just play through default output
        gainNode.connect(testAudioContext.destination);
        oscillator.start();
        oscillator.stop(testAudioContext.currentTime + 1);

        // Clean up after 1.1 seconds
        setTimeout(() => {
          testAudioContext.close().catch((err) => console.error('Error closing test audio context:', err));
        }, 1100);
      }
    } catch (err) {
      console.error('Error testing audio output:', err);
      alert('Could not test audio output. Please check your browser permissions.');
    }
  };

  if (!isMounted) return null;

  return (
    <div className="gray-800 flex min-h-screen items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-xl border border-gray-700 bg-gray-900 text-white shadow-2xl">
        {/* Header */}
        {/* <div className="bg-gray-800 p-4">
          <h1 className="text-center text-xl font-semibold">Waiting Room</h1>
        </div> */}
        {/* Main content */}
        <div className="p-6">
          {/* Video preview */}
          <div className="relative mb-6 aspect-video overflow-hidden rounded-lg border border-gray-700 bg-black">
            {cameraOn && hasPermissions && !cameraError ? (
              <video ref={videoRef} autoPlay muted playsInline className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-700 text-3xl font-semibold text-white">
                  {userName
                    ?.split(' ')
                    .map((name) => name[0])
                    .join('')}
                </div>
              </div>
            )}

            {/* User name overlay */}
            <div className="absolute bottom-3 left-3 rounded-md bg-black bg-opacity-70 px-3 py-1 text-sm text-white">
              {userName}
            </div>

            {/* Loading indicator */}
            {mediaOperationInProgress.current && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-white"></div>
              </div>
            )}

            {/* Camera error message */}
            {cameraError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
                <div className="p-4 text-center">
                  <p className="mb-2 text-red-400">Camera Error</p>
                  <p className="text-sm text-gray-300">{cameraError}</p>
                </div>
              </div>
            )}
          </div>

          {/* Status message */}
          <div className="mb-6 text-center">
            <div className="mb-2 flex items-center justify-center gap-2">
              <div className="h-3 w-3 animate-pulse rounded-full bg-yellow-400"></div>
              <p className="font-medium text-gray-300">Waiting for the host to let you in</p>
            </div>
            <p className="text-sm text-gray-400">Waiting time: {formatTime(waitingTime)}</p>
          </div>

          {/* Controls */}
          <div className="mb-6 flex items-center justify-center gap-4">
            <button
              onClick={toggleMic}
              disabled={mediaOperationInProgress.current}
              className={`rounded-full p-3 ${
                micOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-900 hover:bg-red-800'
              } transition-colors ${mediaOperationInProgress.current ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              {micOn ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
            </button>

            <button
              onClick={toggleCamera}
              disabled={mediaOperationInProgress.current}
              className={`rounded-full p-3 ${
                cameraOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-900 hover:bg-red-800'
              } transition-colors ${mediaOperationInProgress.current ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              {cameraOn ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
            </button>

            <button
              onClick={() => setShowSettings(!showSettings)}
              disabled={mediaOperationInProgress.current}
              className={`rounded-full bg-gray-700 p-3 transition-colors hover:bg-gray-600 ${
                mediaOperationInProgress.current ? 'cursor-not-allowed opacity-50' : ''
              }`}
            >
              <Settings className="h-6 w-6" />
            </button>
          </div>

          {/* Audio level indicator */}
          {micOn && hasPermissions && (
            <div className="mb-6">
              <div className="mb-1 flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-gray-400" />
                <p className="text-sm text-gray-400">Microphone</p>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-700">
                <div
                  className="h-full bg-green-500 transition-all duration-100"
                  style={{ width: `${audioLevel * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Settings panel */}
          {showSettings && (
            <div className="animate-fadeIn mb-6 rounded-lg border border-gray-700 bg-gray-800 p-4">
              <h3 className="mb-3 font-medium">Audio and Video Settings</h3>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm text-gray-400">Camera</label>
                  <select
                    className="w-full rounded-md border border-gray-600 bg-gray-700 p-2 text-sm text-white"
                    value={selectedVideoDevice}
                    onChange={handleVideoDeviceChange}
                    disabled={videoDevices.length === 0 || mediaOperationInProgress.current}
                  >
                    {videoDevices.length === 0 ? (
                      <option value="">No cameras available</option>
                    ) : (
                      videoDevices.map((device) => (
                        <option key={device.deviceId} value={device.deviceId}>
                          {device.label}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm text-gray-400">Microphone</label>
                  <select
                    className="w-full rounded-md border border-gray-600 bg-gray-700 p-2 text-sm text-white"
                    value={selectedAudioInputDevice}
                    onChange={handleAudioInputDeviceChange}
                    disabled={audioInputDevices.length === 0 || mediaOperationInProgress.current}
                  >
                    {audioInputDevices.length === 0 ? (
                      <option value="">No microphones available</option>
                    ) : (
                      audioInputDevices.map((device) => (
                        <option key={device.deviceId} value={device.deviceId}>
                          {device.label}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm text-gray-400">Speaker</label>
                  <div className="flex gap-2">
                    <select
                      className="flex-1 rounded-md border border-gray-600 bg-gray-700 p-2 text-sm text-white"
                      value={selectedAudioOutputDevice}
                      onChange={handleAudioOutputDeviceChange}
                      disabled={
                        audioOutputDevices.length === 0 ||
                        !('setSinkId' in HTMLMediaElement.prototype) ||
                        mediaOperationInProgress.current
                      }
                    >
                      {!('setSinkId' in HTMLMediaElement.prototype) ? (
                        <option value="">Speaker selection not supported</option>
                      ) : audioOutputDevices.length === 0 ? (
                        <option value="">No speakers available</option>
                      ) : (
                        audioOutputDevices.map((device) => (
                          <option key={device.deviceId} value={device.deviceId}>
                            {device.label}
                          </option>
                        ))
                      )}
                    </select>
                    <button
                      onClick={testAudioOutput}
                      className="rounded-md bg-gray-600 p-2 text-sm transition-colors hover:bg-gray-500"
                      disabled={
                        !('setSinkId' in HTMLMediaElement.prototype) ||
                        audioOutputDevices.length === 0 ||
                        mediaOperationInProgress.current
                      }
                    >
                      Test
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => getAvailableDevices()}
                  disabled={mediaOperationInProgress.current}
                  className={`w-full rounded-md bg-gray-700 p-2 text-sm transition-colors hover:bg-gray-600 ${
                    mediaOperationInProgress.current ? 'cursor-not-allowed opacity-50' : ''
                  }`}
                >
                  Refresh Devices
                </button>
              </div>
            </div>
          )}

          {/* Leave button */}
          <button
            onClick={() => router.push('/')}
            className="w-full rounded-md bg-red-600 py-2 text-white transition-colors hover:bg-red-700"
          >
            Leave
          </button>
        </div>
      </div>
    </div>
  );
}
