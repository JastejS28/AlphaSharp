import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

export default function ApiWakeupLoader({ message = "Waking up API..." }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simple loading animation data (you can replace with a JSON from lottiefiles.com)
  const animationData = {
    v: "5.5.7",
    fr: 30,
    ip: 0,
    op: 90,
    w: 300,
    h: 300,
    nm: "Loading",
    ddd: 0,
    assets: [],
    layers: [{
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "circle",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 1, k: [{ t: 0, s: [0], e: [360] }, { t: 90, s: [360] }] },
        p: { a: 0, k: [150, 150, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      ao: 0,
      shapes: [{
        ty: "gr",
        it: [{
          ty: "el",
          s: { a: 0, k: [100, 100] },
          p: { a: 0, k: [0, 0] }
        }, {
          ty: "st",
          c: { a: 0, k: [0.23, 0.51, 0.96, 1] },
          o: { a: 0, k: 100 },
          w: { a: 0, k: 8 }
        }, {
          ty: "tr",
          p: { a: 0, k: [0, 0] },
          a: { a: 0, k: [0, 0] },
          s: { a: 0, k: [100, 100] },
          r: { a: 0, k: 0 },
          o: { a: 0, k: 100 }
        }],
        nm: "Ellipse"
      }],
      ip: 0,
      op: 90,
      st: 0
    }]
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="w-48 h-48 mb-6">
        <Lottie 
          animationData={animationData} 
          loop={true}
          autoplay={true}
        />
      </div>
      
      <div className="text-center">
        <h3 className="text-xl font-semibold text-white mb-2">
          {message}
        </h3>
        <p className="text-gray-400 mb-4">
          API is waking up from cold start (may take up to 50 seconds)
        </p>
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Elapsed: {seconds}s
        </p>
      </div>
    </div>
  );
}
