import { Server } from "engine.io";
import { Mutex, Semaphore, withTimeout } from "async-mutex";
import { Sheet } from "../models/sheet.model.js";
import { jwtDecode } from "jwt-decode";

import Joi from "joi";

export default class SocketIOEventHandlers {
  /**
   * @type {Server}
   */
  io;

  /**
   *
   * @param {Server} io
   */
  constructor(io) {
    this.io = io;
    io.on("connection", (socket) => {
      console.log("new connection");
      socket.on("ping", () => {
        socket.emit("pong", "pong!!!");
      });
      // join room
      socket.on("join", (payload) => {
        // test if guy has permission to join room
        if (checkRight(payload)) {
          socket.join(payload.roomId);
        } else {
          socket.emit("error", "you are not allowed to join this room");
        }
      });
    });
  }
}

const checkRight = async (payload) => {
  const { token, roomId } = payload;
  const sheet = await Sheet.findById(roomId);
  // retrieve user from token
};

const roomsMutex = new Map();
const getRoomMutex = new Mutex();
const getRoom = (roomId) => {
  if (!roomsMutex.has(roomId)) {
    getRoomMutex.runExclusive(() => {
      if (!roomsMutex.has(roomId)) {
        roomsMutex.set(roomId, new Mutex());
      }
    });
  }
  return roomsMutex.get(roomId);
};
