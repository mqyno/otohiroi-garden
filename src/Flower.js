import Phaser from "phaser";

export default class Flower {

    constructor(scene, x, y, flowerInfo, onCollect){
        this.scene = scene;
        this.info = flowerInfo;
        this.onCollect = onCollect;
        this.collected = false;

        // 花を生成
        this.sprite = scene.add.image(x, y, "flower");

        // クリック可能にする
        this.sprite.setInteractive();

        // イベント登録
        this.sprite.on("pointerdown", () => this.pick());
    }

    /**
     *  拾うイベント
     * @returns 
     */
    pick() {
        // 二重クリック防止
        if (this.collected) return;

        this.collected = true;

        // 効果音を鳴らす
        this.scene.audioManager.playCollectSE(this.info.musicTrack);

        // 収集処理
        this.onCollect(this.info);

        // アニメーション開始
        this.bloom();
    }

    /**
     * 花を拾ったときのアニメーション
     */
    bloom() {
        // アニメーション設定
        this.scene.tweens.add({
            targets: this.sprite,
            scaleX: 1.3,
            scaleY: 1.3,
            alpha: 0,
            duration: 250,
            ease: "Back.Out",

            // アニメーション完了時イベント設定
            onComplete: () => {
                this.createSparkles();
                this.hide();
            },
        });
    }

    /**
     * キラキラ生成
     */
    createSparkles() {
        // キラキラを描く
        for (let i = 0; i < 10; i++) {
            // 円を描く（後でimageに差し替える）
            const sparkle = this.scene.add.circle(
                this.sprite.x,
                this.sprite.y,
                Phaser.Math.Between(1, 3),
                // 色設定
                0xfff2a8
            );

            // ランダムな方向に
            const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
            const distance = Phaser.Math.Between(20, 40);

            const targetX = sparkle.x + Math.cos(angle) * distance;
            const targetY = sparkle.y + Math.sin(angle) * distance;

            this.scene.tweens.add({
                targets: sparkle,
                x: targetX,
                y: targetY,
                alpha: 0,
                duration: Phaser.Math.Between(300, 500),
                ease: "Sine.Out",
                onComplete: () => sparkle.destroy(),
            });
        }
    }

    /**
     * 非表示にする
     */
    hide() {
        this.sprite.setVisible(false);
    }

    /**
     * 拾う前の状態に戻す
     */
    reset() {
        this.collected = false;
        this.sprite.setVisible(true);
        this.sprite.setScale(1);
        this.sprite.setAlpha(1);
    }

    /**
     * 呼吸
     * @returns 
     */
    breathe() {
        if (this.collected) return;

        this.scene.tweens.add({
            targets: this.sprite,
            scaleX: 1.08,
            scaleY: 1.08,
            duration: 180,
            yoyo: true,
            ease: "Sine.InOut",
        });
    }

    /**
     * 拍ごとの演出
     * @param {} beat 
     * @returns 
     */
    onBeat(beat) {
        // 拾われた花は反応しない
        if (this.collected) return;
        
        // 全ての花が毎拍ふわっと呼吸する
        this.breathe();

        // 花ごとの演出
        switch (this.info.beatEffect) {

            case "light":
            if (beat % 4 === 0) {
                this.emitLight();
            }
            break;

            case "ripple":
            if (beat % 4 === 0) {
                this.emitRipple();
            }
            break;

            case "sparkle":
            if (beat % 2 === 0) {
                this.emitSparkle();
            }
            break;

            case "petals":
            if (beat % 8 === 0) {
                this.emitPetals();
            }
            break;

            case "grass":
            if (beat % 2 === 0) {
                this.emitLeaf();
            }
            break;

            case "mist":
            if (beat % 8 === 0) {
                this.emitMist();
            }
            break;

            case "glow":
            this.glow();
            break;

            default:
            break;
        }
    }

    emitLight() {
        const light = this.scene.add.circle(
            this.sprite.x,
            this.sprite.y - 6,
            2,
            0xfff2a6
        );

        this.scene.tweens.add({
            targets: light,
            y: light.y - 18,
            alpha: 0,
            scale: 1.8,
            duration: 900,
            ease: "Sine.Out",
            onComplete: () => light.destroy()
        });
    }

    emitRipple() {
        const ripple = this.scene.add.circle(
            this.sprite.x,
            this.sprite.y,
            3,
            0xffffff,
            0
        );

        ripple.setStrokeStyle(1, 0x87cefa);

        this.scene.tweens.add({
            targets: ripple,
            radius: 16,
            alpha: 0,
            duration: 700,
            ease: "Sine.Out",
            onComplete: () => ripple.destroy()
        });
    }

    emitSparkle() {
        for (let i = 0; i < 3; i++) {

            const sparkle = this.scene.add.star(
            this.sprite.x + Phaser.Math.Between(-6, 6),
            this.sprite.y + Phaser.Math.Between(-6, 6),
            4,
            2,
            4,
            0xffffff
            );

            this.scene.tweens.add({
            targets: sparkle,
            alpha: 0,
            y: sparkle.y - Phaser.Math.Between(10, 18),
            scale: 2,
            duration: 700,
            ease: "Sine.Out",
            onComplete: () => sparkle.destroy()
            });
        }
    }

    emitPetals() {
        const petal = this.scene.add.text(
            this.sprite.x,
            this.sprite.y,
            "✿",
            {
            fontFamily: "PixelMplus",
            fontSize: "10px",
            color: "#ffb6c1"
            }
        );

        this.scene.tweens.add({
            targets: petal,
            x: petal.x + Phaser.Math.Between(-12, 12),
            y: petal.y + 18,
            angle: Phaser.Math.Between(-40, 40),
            alpha: 0,
            duration: 1200,
            ease: "Sine.Out",
            onComplete: () => petal.destroy()
        });
    }

    emitLeaf() {
        const leaf = this.scene.add.text(
            this.sprite.x,
            this.sprite.y,
            "❈",
            {
            fontFamily: "PixelMplus",
            fontSize: "8px",
            color: "#8bc34a"
            }
        );

        this.scene.tweens.add({
            targets: leaf,
            x: leaf.x + Phaser.Math.Between(-20, 20),
            y: leaf.y - Phaser.Math.Between(8, 18),
            angle: Phaser.Math.Between(-90, 90),
            alpha: 0,
            duration: 900,
            ease: "Sine.Out",
            onComplete: () => leaf.destroy()
        });
    }

    emitMist() {
        const mist = this.scene.add.circle(
            this.sprite.x,
            this.sprite.y,
            6,
            0xffffff,
            0.25
        );

        this.scene.tweens.add({
            targets: mist,
            scale: 2,
            alpha: 0,
            duration: 1500,
            ease: "Sine.Out",
            onComplete: () => mist.destroy()
        });
    }

    glow() {
        this.scene.tweens.add({
            targets: this.sprite,
            alpha: 0.5,
            duration: 180,
            yoyo: true,
            ease: "Sine.InOut"
        });
    }
}