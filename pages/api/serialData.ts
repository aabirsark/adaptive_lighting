import { Server, Socket } from "socket.io";
import { NextApiRequest, NextApiResponse } from "next";
import { SerialPort, ReadlineParser } from "serialport";
import Readline from "@serialport/parser-readline";

let io: Server;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!io) {
    req.socket.on("connection", (socket: Socket) => {
      console.log("Client connected");

      req.socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
    });

    const port = new SerialPort({ path: "COM4", baudRate: 9600 }); // Replace 'YOUR_SERIAL_PORT_NAME'
    const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

    parser.on("data", (data: string) => {
      if (data.includes("DISTANCE")) {
        const distanceIndex = data.indexOf("DISTANCE: ");
        if (distanceIndex !== -1) {
          const distanceStr = data.substring(
            distanceIndex + "DISTANCE: ".length
          );
          const distance = parseFloat(distanceStr);
          console.log("Distance:", distance);

          // Emit 'distance' event to all connected clients
          req.socket.emit("distance", distance);
        }
      }
    });
  }

  res.status(200).end();
}
