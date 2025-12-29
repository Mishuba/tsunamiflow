export class TfWebsocket {
  constructor(url = null) {
    this.socketLink = url;
    this.tfSocket = null;
    this.listeners = {};
  }
  emit(event, data) {
    const eventListeners = this.listeners[event];
    
    if (eventListeners === undefined) {
      return;
    }
    
    for (let i = 0; i < eventListeners.length; i++) {
      const listener = eventListeners[i];
      listener(data);
    }
  }
  
  connect() {
    if (this.tfSocket) {
      console.warn("WebSocket already exists");
      return;
    } else {
      this.tfSocket = new WebSocket(this.socketLink);
      this.tfSocket.binaryType = "arraybuffer";
      this.tfSocket.onopen = () => {
        console.log("web socket is now connected");
        this.emit("open");
      };
    
      this.tfSocket.onmessage = (event) => {
        console.log("just received a message from websocket.");
        this.emit("message", event.data);
      };
    
      this.tfSocket.onclose = (event) => {
        console.log("websocket has closed");
        this.emit("close", event);
      };
    
      this.tfSocket.onerror = (error) => {
         console.error("websocket has an error that needs to be fixed");
        this.emit("error", error);
      };
    }
  }
  
  send(data) {
    if (this.tfSocket !== null) {
      
      if (this.tfSocket.readyState === WebSocket.OPEN) {
        
        this.tfSocket.send(data);
      } else {
        console.warn("WebSocket exists but is not open");
      }
    } else {
      console.warn("WebSocket has not been created yet");
    }
  }
  
  on(event, fn) {
    if (this.listeners[event] === undefined) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(fn);
  }

isOpen() {
    return (
        this.tfSocket &&
        this.tfSocket.readyState === WebSocket.OPEN
    );
}

sendBinary(data) {
    if (!this.isOpen()) return;
    this.tfSocket.send(data);
}
  
  close() {
    if (this.tfSocket !== null) {
      this.tfSocket.close();
      this.tfSocket = null;
    }
  }
}