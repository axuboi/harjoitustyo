let socket = io();

let i = 0;

socket.on("order_updated", (data) => {
    const messages = document.getElementById("messages");
    messages.innerHTML += "Orders updated " + i + " times.<br>";
    i++;
});