import "./style.css";
import Phaser from "phaser";
import GameScene from "./GameScene";

const config = {
    type: Phaser.AUTO,

    width: 320,
    height: 180,

    backgroundColor: "#87CEEB",

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },

    pixelArt: true,
    roundPixels: true, // 座標を整数に丸めてにじみを防ぐ

    // 描画位置を整数ピクセルに丸める
    render: {
      pixelArt: true,
      roundPixels: true,
    },


    scene: [GameScene],
};

new Phaser.Game(config);