import Phaser from "phaser";
import BeatManager from "./BeatManager";

export default class Gramophone {
    constructor(scene, x, y, audioManager, beatManager) {
        this.scene = scene;
        this.audioManager = audioManager;
        this.beatManager = beatManager;
        // this.base = scene.add.image(x, y, "gramophone_base");
        // this.record = scene.add.image(x, y, "gramophone_record");
        // this.horn = scene.add.image(x, y - 12, "gramophone_horn");
        this.base = scene.add.image(x, y, "gramophone");
        this.record = this.base;
        this.horn = this.base;
        
        this.base.setInteractive({ useHandCursor: true });

        this.rotationTween = null;
        this.hornTween = null;

        this.base.on("pointerdown", () => {
            this.toggle();
        });
    }

    toggle() {
        if (this.audioManager.isPlaying) {
            this.stopAnimation();
            this.audioManager.stopAll();
            this.beatManager.stop();
        } else {
            this.startAnimation();
            this.audioManager.playCollected();
            this.beatManager.start();
        }
    }

    startAnimation() {
        // 回転
        // if (!this.rotationTween) {
        //     this.rotationTween = this.scene.tweens.add({
        //         targets: this.record,
        //         angle: 360,
        //         duration: 3000,
        //         repeat: -1,

        //         ease: "Linear",
        //     });
        // }

        if (!this.hornTween) {
            this.hornTween = this.scene.tweens.add({
                targets: this.horn,
                angle: 4,
                duration: 700,
                ease: "Sine.InOut",
                yoyo: true,
                repeat: -1,
            });
        }

        this.createMusicNotes();
    }

    stopAnimation() {
        this.rotationTween?.stop();
        this.rotationTween = null;

        this.hornTween?.stop();
        this.hornTween = null;

        this.record.angle = 0;
        this.horn.angle = 0;
    }

    createMusicNotes() {
        for (let i = 0; i < 5; i++) {
            const note = this.scene.add.text(
                this.horn.x,
                this.horn.y - 10,
                "♪",
                {
                    fontFamily: "PixelMplus",
                    fontSize: "16px",
                    color: "#ffd966",
                }
            );

            note.setAlpha(0);

            this.scene.tweens.add({
                targets: note,
                alpha: 1,
                x: note.x + Phaser.Math.Between(-20, 20),
                y: note.y - Phaser.Math.Between(25, 45),
                angle: Phaser.Math.Between(-20, 20),
                duration: Phaser.Math.Between(1200, 1800),
                ease: "Sine.Out",
                onComplete: () => note.destroy(),
            });
        }
    }
}