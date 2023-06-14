import { Manager, Socket } from "socket.io-client";

let socket: Socket;

export const connectToServer = (token: string) => {
  const manager = new Manager(
    "https://samsang-nest.herokuapp.com//socket.io/socket.io.js",
    {
      extraHeaders: {
        authentication: token,
      },
    }
  );

  socket?.removeAllListeners();
  socket = manager.socket("/");

  addListeners();

  // http://localhost:3000/socket.io/socket.io.js
};

const addListeners = () => {
  const clientsConnectedList = document.querySelector("#clients-list")!;
  const messageForm = document.querySelector<HTMLFormElement>("#message-form")!;
  const messageInput =
    document.querySelector<HTMLInputElement>("#message-input")!;
  const messagesUL = document.querySelector<HTMLUListElement>("#messages-ul")!;
  const serverStatusLabel = document.querySelector("#server-status")!;

  socket.on("connect", () => {
    serverStatusLabel.innerHTML = "Connected";
    serverStatusLabel.innerHTML = "Connected";
  });

  socket.on("disconnect", () => {
    serverStatusLabel.innerHTML = "Disconnected";
  });

  socket.on("clients-updated", (clients: string[]) => {
    let clientsHTML = "";
    clients.forEach((clientId) => {
      clientsHTML += `
            <li>${clientId}</li>
        `;
    });

    clientsConnectedList.innerHTML = clientsHTML;
  });

  messageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (messageInput.value.trim().length <= 0) return;

    socket.emit("message-from-client", {
      id: socket.id,
      message: messageInput.value,
    });

    messageInput.value = "";
  });

  socket.on(
    "message-from-server",
    (payload: { fullName: string; message: string }) => {
      const newMessage = `
        <l1>
          <strong>${payload.fullName}</strong>
          <span>${payload.message}</span>
        </l1>
      `;

      const li = document.createElement("li");
      li.innerHTML = newMessage;
      messagesUL.append(li);
    }
  );
};
