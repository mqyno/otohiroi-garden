import Phaser from "phaser";

export default class Flower {

    constructor(scene, x, y, soundInfo, onCollect){
        this.scene = scene;
        this.soundInfo = soundInfo;
        this.onCollect = onCollect;
        this.collected = false;

        // 花を生成
        this.sprite = scene.add.image(x, y, "flower");
        this.soundSe = scene.sound.add(this.soundInfo.collectSE, { loop: false, volume: 60 });

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
        this.soundSe.play();

        // 収集処理
        this.onCollect(this.soundInfo);

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
}