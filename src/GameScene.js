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
  
        // this.load.image("gramophone_base","assets/objects/gramophone_base.png");
        // this.load.image("gramophone_record","assets/objects/gramophone_record.png");
        // this.load.image("gramophone_horn","assets/objects/gramophone_horn.png");
        this.load.image("gramophone","assets/objects/gramophone.png");

        this.load.audio("bells", "assets/bgm/bells.mp3");
        this.load.audio("pad", "assets/bgm/pad.mp3");
        this.load.audio("melody", "assets/bgm/melody.mp3");
        // 花を拾う効果音
        this.load.audio("pick_bell", "assets/se/pick_bell.mp3");
        this.load.audio("pick_pad", "assets/se/pick_pad.mp3");
        this.load.audio("pick_melody", "assets/se/pick_melody.mp3");

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

        // 種獲得数の表示
        this.seedCount = 0;
        this.seedText = this.add.text(8, 8, "音の種 0 / 3", {
            fontFamily: "PixelMplus",
            fontSize: "20px",
            color: "#333333",
        });
        this.seedText.setResolution(1);
        this.seedText.setScrollFactor(0);

        // 花生成
        this.flower1 = new Flower(
            this,
            80,
            90,
            {
                collectSE: "pick_bell",
                musicTrack: "bells",
            },
            (sound) => this.collectSeed(sound)
        );
        this.flower2 = new Flower(
            this,
            160,
            90,
            {
                collectSE: "pick_pad",
                musicTrack: "pad",
            },
            (sound) => this.collectSeed(sound)
        );
        this.flower3 = new Flower(
            this,
            200,
            90,
            {
                collectSE: "pick_melody",
                musicTrack: "melody",
            },
            (sound) => this.collectSeed(sound)
        );


        this.audioManager = new AudioManager(this);

        // 音に合わせて動くものセット
        this.beatManager = new BeatManager(this, 96);
        this.beatManager.onBeat(() => {
            this.flower1.breathe();
            this.flower2.breathe();
            this.flower3.breathe();
        });
        this.beatManager.onBeat((beat) => {
            if (beat % 4 === 0) {
                this.ripple(210, 120);
            }
        });
        this.beatManager.onBeat((beat) => {
            if (beat % 8 === 0) {
                this.emitLight();
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
    collectSeed(soundInfo) {
        this.audioManager.addSeed(soundInfo.musicTrack);
        this.seedCount++;
        this.seedText.setText(`音の種 ${this.seedCount} / 3`);
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
    emitLight() {
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