export const checkMediaSupport = () => {
  if (typeof window === 'undefined') return { supported: false, reason: 'SSR' };
  
  const hasMediaDevices = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  return {
    supported: hasMediaDevices,
    reason: hasMediaDevices ? '' : 'Browser does not support WebRTC media stream queries.'
  };
};
