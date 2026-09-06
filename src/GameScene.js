import Phaser from "phaser";
import AudioManager from "./AudioManager";
import BeatManager from "./BeatManager";
import Gramophone from "./Gramophone";
import Flower from "./Flower";

export default class GameScene extends Phaser.Scene {

    /**
     * コンストラクタ
     */
    constructor() {
        super("game");
    }

    /**
     * 画像や音のロード処理
     */
    preload() {

        this.load.image("grass", "assets/tiles/grass.png");
        this.load.image("flower", "assets/objects/flower.png");
        this.load.image("gramophone","assets/objects/gramophone.png");

        // 花
        this.load.audio("bass_01", "assets/bgm/bass_01.mp3");
        this.load.audio("bass_02", "assets/bgm/bass_02.mp3");
        this.load.audio("harmony_01_01", "assets/bgm/harmony_01_01.mp3");
        this.load.audio("harmony_01_02", "assets/bgm/harmony_01_02.mp3");
        this.load.audio("harmony_02_01", "assets/bgm/harmony_02_01.mp3");
        this.load.audio("harmony_02_02", "assets/bgm/harmony_02_02.mp3");
        this.load.audio("melody", "assets/bgm/melody.mp3");
    }
    
    /**
     * 初期化処理
     */
    async create() {
        await document.fonts.load('20px "PixelMplus"');

        this.add.text(20, 20, "OtoHiroi", {
        fontSize: "16px",
        color: "#000000",
        });

        // 背景をテクスチャで埋める
        const AREA_HEIGHT = 11;
        const AREA_WIDTH = 20;
        const TEXTURE_SIZE = 16;
        for(let y=0;y<AREA_HEIGHT;y++){
            for(let x=0;x<AREA_WIDTH;x++){
                this.add.image(
                    x*TEXTURE_SIZE+8,
                    y*TEXTURE_SIZE+8,
                    "grass"
                );
            }

        }

        // 花情報
        const flowerData = [
            { id: "pink", x: 200, y: 150, collectSE: "melody", musicTrack: "melody", beatEffect: "light", },
            { id: "blue", x: 50, y: 50, collectSE: "bass_01", musicTrack: "bass_01", beatEffect: "light", },
            { id: "yellow", x: 100, y: 50, collectSE: "harmony_01_01", musicTrack: "harmony_01_01", beatEffect: "light", },
            { id: "green", x: 150, y: 50, collectSE: "harmony_01_02", musicTrack: "harmony_01_02", beatEffect: "light", },
            { id: "purple", x: 50, y: 100, collectSE: "bass_02", musicTrack: "bass_02", beatEffect: "light", },
            { id: "white", x: 100, y: 100, collectSE: "harmony_02_01", musicTrack: "harmony_02_01", beatEffect: "light", },
            { id: "orange", x: 150, y: 100, collectSE: "harmony_02_02", musicTrack: "harmony_02_02", beatEffect: "light", },
        ];

        this.flowers = [];
        flowerData.forEach((data) => {
            const flower = new Flower(
                this,
                data.x,
                data.y,
                data,
                (flowerInfo) => this.collectSeed(flowerInfo)
            );

            this.flowers.push(flower);
        });

        this.audioManager = new AudioManager(this);

        // 音に合わせて動くものセット
        this.beatManager = new BeatManager(this, 96);
        this.beatManager.onBeat((beat) => {

            // プレイヤーが止まっている時だけ景色が反応
            if (this.playerMoving) return;

            // 全ての花にBeatを通知
            this.flowers.forEach((flower) => {
                flower.onBeat(beat);
            });

            // 庭全体の演出
            // if (beat % 2 === 0) {
            //     this.swayGrass();
            // }

            if (beat % 4 === 0) {
                this.ripple(210, 120);
            }

            if (beat % 8 === 0) {
                this.emitGardenLight();
            }
        });

        // 蓄音機
        this.gramophone = new Gramophone(
            this,
            270,
            145,
            this.audioManager,
            this.beatManager
        );

        // 種獲得数の表示
        this.seedCount = 0;
        this.seedText = this.add.text(8, 8, "音の種 0 / " + Object.keys(this.flowers).length, {
            fontFamily: "PixelMplus",
            fontSize: "20px",
            color: "#333333",
        });
        this.seedText.setResolution(1);
        this.seedText.setScrollFactor(0);
    }

    /**
     * ゲームループ　1秒60回くらい呼ばれる
     */
    update() {
        
        //player.update();
    }

    /**
     * 種収集処理
     */
    collectSeed(flowerInfo) {
        this.audioManager.addSeed(flowerInfo.musicTrack);
        this.seedCount++;
        this.seedText.setText(`音の種 ${this.seedCount} / ` + Object.keys(this.flowers).length);
    }

    /**
     * 波紋仮
     * @param {*} x 
     * @param {*} y 
     */
    ripple(x, y) {
        const circle = this.add.circle(
            x,
            y,
            4,
            0xffffff,
            0
        );

        circle.setStrokeStyle(2, 0xaee7ff);

        this.tweens.add({
            targets: circle,
            radius: 22,
            alpha: 0,
            duration: 700,
            ease: "Sine.Out",
            onComplete: () => circle.destroy(),
        });
    }
    /**
     * 光の粒
     */
    emitGardenLight() {
        const light = this.add.circle(
            Phaser.Math.Between(30, 290),
            Phaser.Math.Between(40, 150),
            2,
            0xfff7cc
        );

        this.tweens.add({
            targets: light,
            y: light.y - 20,
            alpha: 0,
            duration: 1200,
            ease: "Sine.Out",
            onComplete: () => light.destroy(),
        });
    }
}