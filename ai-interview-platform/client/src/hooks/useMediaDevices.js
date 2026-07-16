import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useMediaDevices - Enhanced hook for managing camera/microphone streams.
 * Fixes black video screen by properly assigning srcObject and calling play().
 * Provides permissionState, stream, error, and a retry function.
 */
export function useMediaDevices(videoRef) {
  const [devices, setDevices] = useState([]);
  const [stream, setStream] = useState(null);
  const [permissionState, setPermissionState] = useState('idle'); // idle | requesting | granted | denied | error
  const [mediaError, setMediaError] = useState(null);
  const streamRef = useRef(null);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setStream(null);
    }
  }, []);

  const startStream = useCallback(async () => {
    setPermissionState('requesting');
    setMediaError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: true,
      });
      streamRef.current = mediaStream;
      setStream(mediaStream);
      setPermissionState('granted');

      // Critical fix: assign srcObject and call play() to prevent black screen
      if (videoRef && videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        try {
          await videoRef.current.play();
        } catch (playErr) {
          console.warn('[MediaDevices] Auto-play blocked, user interaction required:', playErr.message);
        }
      }
    } catch (err) {
      setMediaError(err.message);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionState('denied');
      } else {
        setPermissionState('error');
      }
      console.error('[MediaDevices] Failed to get user media:', err);
    }
  }, [videoRef]);

  useEffect(() => {
    const getDevices = async () => {
      try {
        const list = await navigator.mediaDevices.enumerateDevices();
        setDevices(list);
      } catch (err) {
        console.warn('[MediaDevices] Could not enumerate devices:', err.message);
      }
    };
    getDevices();

    // Cleanup on unmount
    return () => stopStream();
  }, [stopStream]);

  return { devices, stream, permissionState, mediaError, startStream, stopStream };
}
