"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function Home() {
  const [headlight, setHeadlight] = useState(true);
  const [distance, setDistance] = useState<any>(180);
  const [headlightColor, setHeadlightColor] = useState("-green-400");
  const [headlightDesignColor, setHeadlightDesColor] =
    useState("border-t-green-400");

  // how good lighting of the enviroment
  const [lighting, setLighting] = useState(false);

  useEffect(() => {
    const socket = io("http://localhost:3001"); // Connects to the same server (auto-detects the server)

    socket.on("connect", () => {
      console.log("WebSocket connected");
    });

    socket.on("Lighting", (data) => {
      console.log(data);
      if (data === 0) {
        setLighting(true);
      } else if (data === 1) {
        setLighting(false);
      }
    });

    socket.on("distance", (data) => {
      console.log(data);
      if (Number(data) <= 300) {
        setDistance(Number(data));
      } else {
        setDistance(null);
      }
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    // set headlight color
    if (distance <= 200 && distance >= 120) {
      setHeadlightDesColor("border-t-green-400");
      setHeadlightColor("text-green-400");
    } else if (distance < 120 && distance > 50) {
      setHeadlightDesColor("border-t-amber-400");
      setHeadlightColor("text-amber-400");
    } else if (distance <= 50 && distance > 0) {
      setHeadlightDesColor("border-t-red-400");
      setHeadlightColor("text-red-400");
    } else if (distance === 0 || distance === null) {
      setHeadlightColor("text-green-300");
      setHeadlightDesColor("border-t-green-300");
    }

    // if lighting is not good
    // set headlight of the vehicle
    if (!lighting) {
      if (distance <= 120 && distance !== null) {
        setHeadlight(false);
      } else {
        setHeadlight(true);
      }
    } else if (lighting) {
      setHeadlight(false);
    }
  }, [lighting, distance]);

  return (
    <main className="flex min-h-screen min-w-full overflow-hidden ">
      <div className="flex min-h-full min-w-full bg-zinc-950 items-center justify-center">
        <div className="flex items-center justify-center w-full space-x-52">
          <div className="relative">
            <Image
              src={"/images/Animated.svg"}
              alt={"Car Image"}
              height={500}
              width={250}
            />
            <div
              className={`h-[250px] w-[290px] absolute -top-3 -left-5 animate-pulse border-t-4 ${headlightDesignColor} transition-all duration-700 rounded-full `}
            ></div>
          </div>

          <div className="flex flex-col space-y-9 items-center  p-11 rounded-xl shadow-lg ">
            <h1 className="text-7xl font-sans ">
              {distance !== null ? (
                <>
                  <span
                    className={`${headlightColor} transition-all duration-700`}
                  >
                    {distance}m
                  </span>{" "}
                  <span>away</span>
                </>
              ) : (
                <span className="text-green-300">CLEAR</span>
              )}
            </h1>

            {/* surrounding light */}

            <div className="h-32 w-96 rounded-xl border-zinc-900 border-2 relative overflow-clip">
              <div
                className={`absolute bottom-2 left-4 h-32 w-32 blur-2xl rounded-full ${
                  lighting ? "bg-amber-300" : "bg-transparent"
                } animate-pulse transition-all duration-700`}
              ></div>
              <img
                className="absolute bottom-0 left-5"
                src={"/images/street.png"}
                alt="Street"
                height={200}
                width={100}
              />
              <p className="absolute   bottom-12 right-6 text-xl font-semibold text-white">
                {lighting ? "Illuminated environment" : "Dimly lit environment"}
              </p>
            </div>

            {/* headlight status */}
            <div className="flex pt-8 space-x-6">
              <div
                className={`w-64  flex  justify-center items-center py-2 font-bold ${
                  headlight ? "text-black" : "text-white"
                } rounded-full ${
                  headlight ? "bg-amber-300" : "bg-orange-400"
                } transition-all duration-150`}
              >
                {headlight ? <p>Headlights Intense</p> : <p>Headlights Dim</p>}
              </div>
              <div
                className="p-3 rounded-xl border-2 border-zinc-900 "
                onClick={() => {
                  // setLighting(!lighting);
                }}
              >
                <Image
                  src={headlight ? "/images/full.svg" : "/images/dim.png"}
                  alt={"headlight full"}
                  height={30}
                  width={30}
                  className="invert "
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
