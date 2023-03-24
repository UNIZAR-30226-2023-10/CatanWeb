import '../styles/Game.css'
import '../styles/Common.css'
import * as PIXI from 'pixi.js'
import Desert from '../images/game/desert.png'
import Farmland from '../images/game/farmland.png'
import Forest from '../images/game/forest.png'
import Hill from '../images/game/hill.png'
import Mountain from '../images/game/mountain.png'
import Pasture from '../images/game/pasture.png'
import Ocean from '../images/game/ocean.png'
import Road from '../images/game/camino.png'
import { Stage, Graphics, Sprite } from '@pixi/react';
import React, { useCallback, useEffect, useMemo, useState } from "react";

function random(min, max) {
    return Math.floor(Math.random() * max) + min;
}

function ncoor_toString(coords) {
    return coords.x.toString() + "," + coords.y.toString()
}

const borders       = [[3,7],[2,8],[2,8],[1,9],[1,9],[0,10],[0,10],[1,9],[1,9],[2,8],[2,8],[3,7]];
const roads_borders = [
    [[2,7],[1,8],[0,9],[0,9],[1,8],[2,7]],
    [[2]]
]
function Game() {
    const appWidth = 1200, appHeight = 675
    const cell_hor_offset = 115, cell_ver_offset = 100;
    const [selected_node, set_selected_node] = useState(null);
    const nodes = useMemo(() => new Set(), []);
    const draw_nodes = useCallback((g) => {
        let start_width = 320;
        for (let i = 0; i < 12; i++) {
            for (let j = borders[i][0]; j <= borders[i][1]; j+=2) {
                let node = new PIXI.Graphics(), id = `${i},${j}`
                node.id = id
                node.beginFill(selected_node === id ? 0xffff00 : 0xffffff)
                node.drawCircle(start_width + (j*(cell_hor_offset-4)/2), 76 + (24 * (i%2)) + (Math.floor(i/2) * cell_ver_offset), 15)
                node.endFill()
                node.interactive = true
                node.on("pointertap", () => set_selected_node(id))
                g.addChild(node)
                nodes.add(id)
            }
        }
    }, [selected_node, nodes]);

    const draw_roads = useCallback((g) => {
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 10; j++) {
                let road = new PIXI.Graphics()
                road.beginFill(0x00ff00)
                road.drawRoundedRect(335 + (57*j), 80 + (100*i), 17, 17, 5)
                road.endFill()
                g.addChild(road)
            }
        }
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 11; j++) {
                let road = new PIXI.Graphics()
                road.beginFill(0x00ff00)
                road.drawRoundedRect(305 + (57.5*j), 125 + (100*i), 17, 17, 5)
                road.endFill()
                g.addChild(road)
            }
        }
        //for (let i in [...nodes]) {
            //let road = new PIXI.Graphics()
            //road.beginFill(0x00ff00)
            /*
            let road = new PIXI.Graphics()
            road.beginFill(0x00ff00)
            let coords = ncoor.split(","), x = parseInt(coords[0]), y = parseInt(coords[1])
            if (x % 2 === 0) {
                if (y-1 >= borders[x+1][0]) {
                    console.log(y)
                }
                if (y+1 <= borders[x+1][1]) {
                    //edges.add(ncoor+":"+ncoor_toString({x:x+1,y:y+1}))
                    //road.drawRoundedRect(449 + (1.5*cell_hor_offset*x), 80, 17, 17, 5)
                }
            } else if (x+1 < 12) {
                //edges.add(ncoor+":"+ncoor_toString({x:x+1, y:y}))
            }
            */
            //road.drawRoundedRect(roads_pos[i][0], roads_pos[i][1], 17, 17, 5)
            //road.endFill()
            //g.addChild(road)
        //}
    }, [nodes])

    useEffect(() => {
        console.log("Circle selected:", selected_node);
    }, [selected_node]);
    return (
        <div className="Game-header | Common-Header">
            <Stage width={appWidth} height={appHeight}>
                <Sprite image={Ocean} x={appWidth/2 - 1.5*cell_hor_offset} y={appHeight/2 - 3*cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Ocean} x={appWidth/2 - 0.5*cell_hor_offset} y={appHeight/2 - 3*cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Ocean} x={appWidth/2 + 0.5*cell_hor_offset} y={appHeight/2 - 3*cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Ocean} x={appWidth/2 + 1.5*cell_hor_offset} y={appHeight/2 - 3*cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                
                <Sprite image={Ocean} x={appWidth/2 - 2*cell_hor_offset} y={appHeight/2 - 2*cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Farmland} x={appWidth/2 - cell_hor_offset} y={appHeight/2 - 2*cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Forest} x={appWidth/2} y={appHeight/2 - 2*cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Hill} x={appWidth/2 + cell_hor_offset} y={appHeight/2 - 2*cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Ocean} x={appWidth/2 + 2*cell_hor_offset} y={appHeight/2 - 2*cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                
                <Sprite image={Ocean} x={appWidth/2 - 2.5*cell_hor_offset} y={appHeight/2 - cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Forest} x={appWidth/2 - 1.5*cell_hor_offset} y={appHeight/2 - cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Mountain} x={appWidth/2 - 0.5*cell_hor_offset} y={appHeight/2 - cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Desert} x={appWidth/2 + 0.5*cell_hor_offset} y={appHeight/2 - cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Pasture} x={appWidth/2 + 1.5*cell_hor_offset} y={appHeight/2 - cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Ocean} x={appWidth/2 + 2.5*cell_hor_offset} y={appHeight/2 - cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                
                <Sprite image={Ocean} x={appWidth/2 - 3*cell_hor_offset} y={appHeight/2} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Hill} x={appWidth/2 - 2*cell_hor_offset} y={appHeight/2} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Hill} x={appWidth/2 - cell_hor_offset} y={appHeight/2} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Forest} x={appWidth/2} y={appHeight/2} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Farmland} x={appWidth/2 + cell_hor_offset} y={appHeight/2} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Mountain} x={appWidth/2 + 2*cell_hor_offset} y={appHeight/2} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Ocean} x={appWidth/2 + 3*cell_hor_offset} y={appHeight/2} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                
                <Sprite image={Ocean} x={appWidth/2 - 2.5*cell_hor_offset} y={appHeight/2 + cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Pasture} x={appWidth/2 - 1.5*cell_hor_offset} y={appHeight/2 + cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Farmland} x={appWidth/2 - 0.5*cell_hor_offset} y={appHeight/2 + cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Pasture} x={appWidth/2 + 0.5*cell_hor_offset} y={appHeight/2 + cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Mountain} x={appWidth/2 + 1.5*cell_hor_offset} y={appHeight/2 + cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Ocean} x={appWidth/2 + 2.5*cell_hor_offset} y={appHeight/2 + cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                

                <Sprite image={Ocean} x={appWidth/2 - 2*cell_hor_offset} y={appHeight/2 + 2*cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Forest} x={appWidth/2 - cell_hor_offset} y={appHeight/2 + 2*cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Farmland} x={appWidth/2} y={appHeight/2 + 2*cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Pasture} x={appWidth/2 + cell_hor_offset} y={appHeight/2 + 2*cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Ocean} x={appWidth/2 + 2*cell_hor_offset} y={appHeight/2 + 2*cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                
                <Sprite image={Ocean} x={appWidth/2 - 1.5*cell_hor_offset} y={appHeight/2 + 3*cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Ocean} x={appWidth/2 - 0.5*cell_hor_offset} y={appHeight/2 + 3*cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Ocean} x={appWidth/2 + 0.5*cell_hor_offset} y={appHeight/2 + 3*cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Ocean} x={appWidth/2 + 1.5*cell_hor_offset} y={appHeight/2 + 3*cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                
                <Graphics draw={draw_nodes} />
                <Graphics draw={draw_roads} />
            </Stage>
        </div>
    );
}

export default Game