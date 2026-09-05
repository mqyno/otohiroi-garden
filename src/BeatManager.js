export default class BeatManager {
    constructor(scene, bpm = 90) {
        this.scene = scene;
        this.bpm = bpm;

        this.beatCount = 0;
        this.callbacks = [];

        this.timer = null;
    }

    getBeatInterval() {
        return 60000 / this.bpm;
    }

    onBeat(callback) {
        this.callbacks.push(callback);
    }

    start() {
        if (this.timer) return;

        this.timer = this.scene.time.addEvent({
            delay: this.getBeatInterval(),
            callback: () => this.emitBeat(),
            loop: true,
        });
    }

    stop() {
        if (!this.timer) return;

        this.timer.remove();
        this.timer = null;
        this.beatCount = 0;
    }

    emitBeat() {
        this.beatCount++;

        this.callbacks.forEach((callback) => {
            callback(this.beatCount);
        });
    }
}
