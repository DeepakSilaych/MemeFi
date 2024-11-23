import { useEffect, useRef, useState } from 'react';

export const useWebSocket = (url: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log(`Connected to WebSocket: ${url}`);
      setIsConnected(true);
    };

    ws.onclose = () => {
      console.log(`Disconnected from WebSocket: ${url}`);
      setIsConnected(false);
      // Attempt to reconnect after 3 seconds
      setTimeout(() => {
        wsRef.current = new WebSocket(url);
      }, 3000);
    };

    ws.onerror = (error) => {
      console.error(`WebSocket error: ${error}`);
      ws.close();
    };

    wsRef.current = ws;

    // Cleanup on unmount
    return () => {
      ws.close();
    };
  }, [url]);

  return wsRef.current;
};
