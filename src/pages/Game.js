import '../styles/Game.css'
import '../styles/Common.css'
import * as PIXI from 'pixi.js'
import Desert from '../images/game/desert.png'
import { Stage, Graphics, Sprite } from '@pixi/react';
import React, { useCallback, useEffect, useState } from "react";


const nodes_per_row = [3,4,4,5,5,6]
function Game() {
    const appWidth = 1200, appHeight = 675
    const cell_hor_offset = 115, cell_ver_offset = 100;

    const [selected_node, set_selected_node] = useState(null);
    const draw = useCallback((g) => {
        for (let i = 0; i < 3; i++) {
            let circle = new PIXI.Graphics();
            circle.id = `circle-${i}-1`
            circle.beginFill(selected_node === `circle-${i}-1` ? 0xffff00 : 0xffffff)
            circle.drawCircle(485 + cell_hor_offset*i, 78, 15);
            circle.endFill();
            circle.interactive = true;
            //circle.on("click", () => { console.log(circle.id)});
            circle.on("pointertap", () => set_selected_node(`circle-${i}-1`));
            g.addChild(circle)

            g.beginFill(0xffffff);
            g.drawCircle(485 + cell_hor_offset*i, 95 + cell_ver_offset*5, 15);
            g.endFill();
        }

        for (let i = 0; i < 4; i++) {
            g.beginFill(0xffffff);
            g.drawCircle(427 + cell_hor_offset*i, 105, 15);
            g.endFill();
            g.beginFill(0xffffff);
            g.drawCircle(427 + cell_hor_offset*i, 170, 15);
            g.endFill();
            g.beginFill(0xffffff);
            g.drawCircle(427 + cell_hor_offset*i, 105 + cell_ver_offset*4, 15);
            g.endFill();
            g.beginFill(0xffffff);
            g.drawCircle(427 + cell_hor_offset*i, 170 + cell_ver_offset*4, 15);
            g.endFill();
        }

        for (let i = 0; i < 5; i++) {
            g.beginFill(0xffffff);
            g.drawCircle(368 + cell_hor_offset*i, 105 + cell_ver_offset, 15);
            g.endFill();
            g.beginFill(0xffffff);
            g.drawCircle(368 + cell_hor_offset*i, 170 + cell_ver_offset, 15);
            g.endFill();
            g.beginFill(0xffffff);
            g.drawCircle(368 + cell_hor_offset*i, 105 + cell_ver_offset*3, 15);
            g.endFill();
            g.beginFill(0xffffff);
            g.drawCircle(368 + cell_hor_offset*i, 170 + cell_ver_offset*3, 15);
            g.endFill();
        }

        for (let i = 0; i < 6; i++) {
            g.beginFill(0xffffff);
            g.drawCircle(310 + cell_hor_offset*i, 105 + cell_ver_offset*2, 15);
            g.endFill();
            g.beginFill(0xffffff);
            g.drawCircle(310 + cell_hor_offset*i, 170 + cell_ver_offset*2, 15);
            g.endFill();
        }
    }, [selected_node]);



    useEffect(() => {
        console.log("Circle selected:", selected_node);
    }, [selected_node]);
    return (
        <div className="Game-header | Common-Header">
            <Stage width={appWidth} height={appHeight}>

                <Sprite image={Desert} x={appWidth/2 - cell_hor_offset} y={appHeight/2 - 2*cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Desert} x={appWidth/2} y={appHeight/2 - 2*cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Desert} x={appWidth/2 + cell_hor_offset} y={appHeight/2 - 2*cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />

                <Sprite image={Desert} x={appWidth/2 - 1.5*cell_hor_offset} y={appHeight/2 - cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Desert} x={appWidth/2 - 0.5*cell_hor_offset} y={appHeight/2 - cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Desert} x={appWidth/2 + 0.5*cell_hor_offset} y={appHeight/2 - cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Desert} x={appWidth/2 + 1.5*cell_hor_offset} y={appHeight/2 - cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />

                <Sprite image={Desert} x={appWidth/2 - 2*cell_hor_offset} y={appHeight/2} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Desert} x={appWidth/2 - cell_hor_offset} y={appHeight/2} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Desert} x={appWidth/2} y={appHeight/2} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Desert} x={appWidth/2 + cell_hor_offset} y={appHeight/2} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Desert} x={appWidth/2 + 2*cell_hor_offset} y={appHeight/2} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
            
                <Sprite image={Desert} x={appWidth/2 - 1.5*cell_hor_offset} y={appHeight/2 + cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Desert} x={appWidth/2 - 0.5*cell_hor_offset} y={appHeight/2 + cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Desert} x={appWidth/2 + 0.5*cell_hor_offset} y={appHeight/2 + cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Desert} x={appWidth/2 + 1.5*cell_hor_offset} y={appHeight/2 + cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                
                <Sprite image={Desert} x={appWidth/2 - cell_hor_offset} y={appHeight/2 + 2*cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Desert} x={appWidth/2} y={appHeight/2 + 2*cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Desert} x={appWidth/2 + cell_hor_offset} y={appHeight/2 + 2*cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                
                <Graphics draw={draw} />
            </Stage>
        </div>
    );
}

export default Game