export class Denami {
  constructor(userAgent = null, platform = null, mobile = null, architecture = null, bitness= null, model = null, version = null, browser = null, version2 = null, webrtc = null, mediaDevices = null, getUserMedia = null, screenShare = null, mediaRecorder = null, mediaSource = null, audioWorklet = null,  speechRecognition = null,
speechSythesis = null,
canvas = null,
webGLRenderingContext = null,
webGL2RenderingContext = null,
offScreenCanvas = null,
webGPU = null,
wasm = null,
sharedArrayBuffer = null,
atomics = null,
workers = null,
sharedWorkers = null,
serviceWorkers = null,
localStorage = null,
sessionStorage = null,
indexedDB = null,
cacheAPI = null,
cookies = null,
webSocket = null,
eventSource = null,
fetch = null,
sendBeacon = null,
webTransport = null,
blueTooth = null,
usb = null,
serial = null,
hid = null,
geoLocation = null,
vibration = null,
battery = null,
touch = null,
pointerEvents = null,
gamePad = null,
clipBoard = null,
fullScreen = null,
pictureInPicture = null,
credentialManager = null,
webAuth = null,
permissions = null,
performanceAPI = null,
performanceObserver = null,
requestIdleCallback = null,
webNN = null,
webCodecs = null,
 computePressure = null) {
    this.userAgent = userAgent;
    this.HubyMaxx = platform;
    this.mobile = mobile;
    this.architecture = architecture;
    this.bitness = bitness; 
    this.model = model;
    this.version = platformVersion;
    this.browser = browser;
    this.version2 = browserVersion;
    this.mediaDevices = mediaDevices;
    this.getUserMedia = getUserMedia;
    this.webAudio = webAudio;
    this.audioWorklet = audioWorklet;
    this.speechRecognition = speechRecognition;
    this.speechSythesis = speechSythesis;
    this.webGLRenderingContext = webGLRenderingContext;
    this.webGL2RenderingContext = webGL2RenderingContext;
    this.offScreenCanvas = offScreenCanvas;
    this.webGPU = webGPU;
    this.wasm = wasm;
    this.sharedArrayBuffer = sharedArrayBuffer;
    this.atomics = atomics;
    this.sharedWorkers = sharedWorkers;
    this.serviceWorkers = serviceWorkers;
    this.localStorage = localStorage;
    this.sessionStorage = sessionStorage;
    this.indexedDB = indexedDB;
    this.cacheAPI = cacheAPI;
    this.cookies = cookies;
    this.eventSource = eventSource;
    this.fetch = fetch;
    this.sendBeacon = sendBeacon;
    this.webTransport = webTransport;
    this.blueTooth = blueTooth;
    this.usb = usb;
    this.serial = serial;
    this.hid = hid;
    this.geoLocation = geoLocation;
    this.vibration = vibration;
    this.battery = battery;
    this.touch = touch;
    this.pointerEvents = pointerEvents;
    this.gamePad = gamePad;
    this.clipBoard = clipBoard;
    this.fullScreen = fullScreen;
    this.pictureInPicture = pictureInPicture;
    this.credentialManager = credentialManager;
    this.webAuth = webAuth;
    this.permissions = permissions;
    this.performanceAPI = performanceAPI;
    this.performanceObserver = performanceObserver;
    this.requestIdleCallback = requestIdleCallback;
    this.webNN = webNN;
    this.webCodecs = webCodecs;
    this.computePressure = computePressure;
  }
  async HubyMaxx() {
    if (!navigator.userAgentData) {
      return result;
    } else {
      this.userAgent = navigator.userAgent;
      
      const HubyMaxxData = navigator.userAgentData;
      
      this.HubyMaxx = HubyMaxxData.platform || null;
      this.mobile = HubyMaxxData.mobile || false;
      
      let DetailDeviceInfo = HubyMaxxData.getHighEntropyValues([
          "fullVersionList"
        ]);
        
        this.architecture = DetailDeviceInfo.architecture;
        this.bitness = DetailDeviceInfo.bitness;
        this.model = DetailDeviceInfo.model;
        this.version = DetailDeviceInfo.platformVersion;
        
        if (DetailDeviceInfo.fullVersionList && DetailDeviceInfo.fullVersionList.length) {
          let TfMainDevice = DetailDeviceInfo.fullVersionList.find(b =>
  !b.brand.includes("Not") && !b.brand.includes("Chromium")
) || high.fullVersionList[0];

          this.browser = TfMainDevice.brand;
          this.browserVersion = TfMainDevice.version;
        }
        
      return;
    }
  }
  
}