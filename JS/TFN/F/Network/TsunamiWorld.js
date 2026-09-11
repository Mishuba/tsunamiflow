// TsunamiWorldNetworks.js
import { TfEventSource } from './TfEventSource.js';
import { TfFetch } from './TfFetch.js';
import { TfWebsocket } from './TfWebsocket.js';
import { TfSendBeacon } from './TfSendBeacon.js';
import { TfXHR } from './TfXHR.js';
import { TfWebTransport } from './TfWebTransport.js';

export class TsunamiWorldNetworks {
    constructor({
        websocketUrl = null,
        eventSourceUrl = null,
        webTransportUrl = null
    } = {}) {

        // Core transports
        this.fetch = new TfFetch();
        this.xhr = new TfXHR();
        this.beacon = new TfSendBeacon();

        // Persistent connection transports
        this.websocket = websocketUrl ? new TfWebsocket(websocketUrl) : null;
        this.eventSource = eventSourceUrl ? new TfEventSource(eventSourceUrl) : null;
        this.webTransport = webTransportUrl ? new TfWebTransport(webTransportUrl) : null;

        this.ready = {
            fetch: true,
            xhr: true,
            beacon: true,
            websocket: !!this.websocket,
            eventSource: !!this.eventSource,
            webTransport: !!this.webTransport
        };
    }

    // ===== FETCH =====
    async fetchRequest(url, options = {}) {
        return await this.fetch.request(url, options);
    }

    onFetch(event, fn) {
        this.fetch.on(event, fn);
    }

    // ===== XHR =====
    xhrRequest(method, url, data = null, headers = {}) {
        return this.xhr.request(method, url, data, headers);
    }

    onXHR(event, fn) {
        this.xhr.on(event, fn);
    }

    // ===== BEACON =====
    sendBeacon(url, data) {
        this.beacon.send(url, data);
    }

    onBeacon(event, fn) {
        this.beacon.on(event, fn);
    }

    // ===== WEBSOCKET =====
    connectWebSocket() {
        if (!this.websocket) return;
        this.websocket.connect();
    }

    sendWebSocket(data) {
        if (!this.websocket) return;
        this.websocket.send(data);
    }

    sendWebSocketBinary(data) {
        if (!this.websocket) return;
        this.websocket.sendBinary(data);
    }

    onWebSocket(event, fn) {
        if (!this.websocket) return;
        this.websocket.on(event, fn);
    }

    closeWebSocket() {
        if (!this.websocket) return;
        this.websocket.close();
    }

    // ===== EVENT SOURCE (SSE) =====
    connectEventSource() {
        if (!this.eventSource) return;
        this.eventSource.connect();
    }

    onEventSource(event, fn) {
        if (!this.eventSource) return;
        this.eventSource.on(event, fn);
    }

    closeEventSource() {
        if (!this.eventSource) return;
        this.eventSource.close();
    }

    // ===== WEBTRANSPORT =====
    async connectWebTransport() {
        if (!this.webTransport) return;
        await this.webTransport.connect();
    }

    async sendWebTransport(data) {
        if (!this.webTransport) return;
        await this.webTransport.send(data);
    }

    onWebTransport(event, fn) {
        if (!this.webTransport) return;
        this.webTransport.on(event, fn);
    }

    closeWebTransport() {
        if (!this.webTransport) return;
        this.webTransport.close();
    }

    // ===== UTILITY =====
    isReady() {
        return this.ready;
    }
}