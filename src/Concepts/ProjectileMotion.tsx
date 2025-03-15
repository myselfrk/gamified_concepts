import { useState, useEffect } from "react";

const targetX = 300;
const PI = 3.14
const marginOfError = 0.1; // Strict floating-point tolerance
const gravity = 9.81;
const interval = 5; // Faster animation update

const ProjectileGame = () => {
  const [angle, setAngle] = useState(45);
  const [velocity, setVelocity] = useState(0); 
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [launched, setLaunched] = useState(false);
  const [timeOfFlight, setTime] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let timer : number;
    if (launched) {
      timer = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime + 0.02; // Faster simulation steps
          const radianAngle = (angle * PI) / 180;
          
          const x = velocity * newTime * +Math.cos(radianAngle).toFixed(2); // s = ut + 1/2 at^2  // a = 0
          const y = velocity * newTime * +Math.sin(radianAngle).toFixed(2) - 0.5 * gravity * newTime * newTime;  // s = ut + 1/2 at^2  

          if (y <= 0) {
            clearInterval(timer);
            setLaunched(false);
            const finalX = parseFloat(x.toFixed(2));
            if (Math.abs(targetX - finalX) <= marginOfError) {
              setMessage("🎯 Success! You hit the target!");
            } else {
              setMessage(`❌ Missed! Final X: ${finalX}m, Target: ${targetX}m`);
            }
            setPosition({ x, y });
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
      <h1 className="text-2xl font-bold">Projectile Motion Game</h1>
      <p className="text-sm text-gray-600 mb-4">{`(Assume either the angle or the velocity is given, g = ${gravity} m/s^2, margin of error = ${marginOfError} m, PI= ${PI})`}</p>
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
      <p className="text-sm text-gray-600 mb-4">Time Of Flight : {timeOfFlight.toFixed(2)}</p>
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
