export default class AudioManager {

    constructor(scene) {
        this.scene = scene;
        this.collected = new Set();

        // PhaserのSoundオブジェクト
        this.sounds = {
            bells: scene.sound.add("bells", { loop: true, volume: 0 }),
            pad: scene.sound.add("pad", { loop: true, volume: 0 }),
            melody: scene.sound.add("melody", { loop: true, volume: 0 }),
        };
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

            if (!sound.isPlaying) {
                sound.play();
            }

            sound.setVolume(0);

            this.scene.tweens.add({
                targets: sound,
                volume: 1,
                duration: 800,
                ease: "Sine.Out",
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