import { useState, useEffect } from "react";

const ProjectileGame = () => {
  const [angle, setAngle] = useState(45);
  const [velocity, setVelocity] = useState(54.28);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [launched, setLaunched] = useState(false);
  const [, setTime] = useState<number>(0);
  const [message, setMessage] = useState("");
  const targetX = 300;
  const marginOfError = 5; // Small tolerance for floating-point errors

  const gravity = 9.81;
  const interval = 20; // Smaller intervals for more accuracy

  useEffect(() => {
    let timer: number;
    if (launched) {
      timer = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime + interval / 1000;
          const radianAngle = (angle * Math.PI) / 180;
          const x = velocity * newTime * Math.cos(radianAngle);
          const y = velocity * newTime * Math.sin(radianAngle) - 0.5 * gravity * Math.pow(newTime, 2);
          
          // Stop if projectile hits ground
          if (y <= 0) {
            clearInterval(timer);
            setLaunched(false);
            
            // Check if target is within the allowed margin
            if (Math.abs(targetX - x) <= marginOfError) {
              setMessage("🎯 Success! You hit the target!");
            } else {
              setMessage(`❌ Missed! You landed at ${x.toFixed(2)}m. Try again.`);
            }
            return prevTime;
          }

          setPosition({ x, y });
          return newTime;
        });
      }, interval);
    }
    return () => clearInterval(timer);
  }, [launched]);

  const launchProjectile = () => {
    setPosition({ x: 0, y: 0 });
    setTime(0);
    setMessage("");
    setLaunched(true);
  };

  return (
    <div className="text-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold">🎯 Projectile Motion Game</h1>
      <h1 className="text-2m font-bold mb-4">(Assume either the angle or the velocity is given, g = 9.8 m/s^2 and margin of error = 1 m)</h1>
      <div className="mb-4">
        <label className="block text-lg font-semibold">Angle (degrees):</label>
        <input 
          type="number" 
          value={angle} 
          onChange={(e) => setAngle(Number(e.target.value))} 
          className="border border-gray-400 rounded p-2 w-32 text-center"
        />
      </div>
      <div className="mb-4">
        <label className="block text-lg font-semibold">Velocity (m/s):</label>
        <input 
          type="number" 
          value={velocity} 
          onChange={(e) => setVelocity(Number(e.target.value))} 
          className="border border-gray-400 rounded p-2 w-32 text-center"
        />
      </div>
      <button 
        onClick={launchProjectile} 
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Launch
      </button>
      <div className="relative w-[400px] h-[200px] border border-black mt-6 mx-auto bg-white">
        <div 
          className="absolute w-4 h-4 bg-red-500 rounded-full" 
          style={{ left: `${position.x}px`, bottom: `${position.y}px` }}
        ></div>
        <div 
          className="absolute w-4 h-4 bg-blue-500" 
          style={{ left: `${targetX}px`, bottom: "0px" }}
        ></div>
        <div 
          className="absolute text-sm text-black" 
          style={{ left: `${position.x}px`, bottom: "0px" }}
        >
          Distance to Target: {(targetX - position.x).toFixed(2)}m
        </div>
      </div>
      {message && <p className="mt-4 text-lg font-bold text-green-600">{message}</p>}
    </div>
  );
};

export default ProjectileGame;
