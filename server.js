// import { createServer } from "node:http";
// import next from "next"; // allows us to run our cli commands
// import { Server } from "socket.io";
// import { v4 as uuidv4 } from "uuid";

// const dev = process.env.NODE_ENV !== "production";
// const hostname = "localhost";
// const port = 3001;
// // when using middleware `hostname` and `port` must be provided below
// const app = next({ dev, hostname, port });
// const handler = app.getRequestHandler();

// let onlineUsers = [];

// // TODO: Adding the user to the socket
// const addUser = (username, socketId) => {
//   const isExist = onlineUsers.find((user) => user.socketId === socketId);

//   if (!isExist) {
//     onlineUsers.push({ username, socketId });
//     // console.log(username + "added!");
//   }
//   console.log("This is the list of online users", onlineUsers);
// };

// const removeUser = (socketId) => {
//   onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
//   // console.log("user removed");
// };

// const getUser = (username) => {
//   return onlineUsers.find((user) => user.username === username);
// };

// // TODO: Wire up HTTP and NEXT and SOCKET.IO
// app.prepare().then(() => {
//   console.log("app is preparing");
//   const httpServer = createServer(handler);

//   const io = new Server(httpServer); // basically creating a whole circuti or whole room of servers that we can tap into

//   io.on("connection", (socket) => {
//     // console.log("in socket");
//     // console.dir(socket);
//     socket.on("newUser", (username) => {
//       console.log("reached new user");
//       addUser(username, socket.id);
//     });

//     socket.on("sendNotification", ({ receiverUsername, data }) => {
//       console.log("a post has just been liked");
//       console.log("this is the reciever username", receiverUsername);
//       const reciever = getUser(receiverUsername);
//       console.log("this is the reciever");
//       console.log("this is the reciever", reciever);

//       io.to(reciever.socketId).emit("getNotification", {
//         id: uuidv4(),
//         ...data,
//       });
//     });

//     socket.on("disconnect", () => {
//       removeUser(socket.id);
//     });
//   });

//   httpServer
//     .once("error", (err) => {
//       console.error(err);
//       process.exit(1);
//     })
//     .listen(port, () => {
//       // console.log(`> Ready on http://${hostname}:${port}`);
//     });
// });
