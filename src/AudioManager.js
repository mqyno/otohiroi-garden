export default class AudioManager {

    constructor(scene) {
        this.scene = scene;
        this.collected = new Set();

        // PhaserのSoundオブジェクト
        this.sounds = {
            bass_01: scene.sound.add("bass_01", { loop: true, volume: 0 }),
            bass_02: scene.sound.add("bass_02", { loop: true, volume: 0 }),
            harmony_01_01: scene.sound.add("harmony_01_01", { loop: true, volume: 0 }),
            harmony_01_02: scene.sound.add("harmony_01_02", { loop: true, volume: 0 }),
            harmony_02_01: scene.sound.add("harmony_02_01", { loop: true, volume: 0 }),
            harmony_02_02: scene.sound.add("harmony_02_02", { loop: true, volume: 0 }),
            melody: scene.sound.add("melody", { loop: true, volume: 0 }),
        };

        for (let key in this.sounds) {
            const sound = this.sounds[key];
            // 種を拾ったときの開始位置と再生時間
            sound.addMarker({ name: "collect", start: 0.0, duration: 0.6, });
            // 音楽再生時の開始位置と再生時間
            sound.addMarker({ name: "loop", start: 0.0, duration: 15.0, });
        }

        this.isPlaying = false;
    }

    addSeed(soundName) {
        this.collected.add(soundName);
        // 拾ったときに音鳴らしたい
        //const sound = this.sounds[soundName];
        //sound.play();
    }

    /**
     * 集めた音の再生
     */
    playCollected() { 
        if (this.isPlaying) return;

        this.isPlaying = true;
        
        this.collected.forEach((name) => {
            const sound = this.sounds[name];
            sound.play("loop", {
            loop: true,
            volume: 0,
            });

            this.scene.tweens.add({
            targets: sound,
            volume: 1,
            //duration: 800,  //（0.6秒以降）
            ease: "Sine.Out",
            });
        });
    }

    /**
     * 拾ったときの効果音再生
     * @param {*} trackName 
     */
    playCollectSE(trackName) {
        const sound = this.scene.sound.add(trackName);

        sound.play({
            seek: 0,
            volume: 1,
        });

        // 0.8 秒再生　0.6秒～最後まで 0.2秒間フェードアウト
        this.scene.time.delayedCall(600, () => {
            this.scene.tweens.add({
            targets: sound,
            volume: 0,
            duration: 200,
            ease: "Sine.Out",

            onComplete: () => sound.destroy(),
            });
        });
    }

    stopAll() {
        if (!this.isPlaying) return;

        this.isPlaying = false;
        
        Object.values(this.sounds).forEach((sound) => {
        if (!sound.isPlaying) return;

        this.scene.tweens.add({
            targets: sound,
            volume: 0,
            duration: 500,
            ease: "Sine.InOut",

            onComplete: () => {
            sound.stop();
            },
        });
        });
    }

    togglePlayback() {
        if (this.isPlaying) {
            this.stopAll();
        } else {
            this.playCollected();
        }
    }

}