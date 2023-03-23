import '../styles/Game.css'
import '../styles/Common.css'
import * as PIXI from 'pixi.js'
import Desert from '../images/game/desert.png'
import Ocean from '../images/game/ocean.png'
import Road from '../images/game/camino.png'
import { Stage, Graphics, Sprite } from '@pixi/react';
import React, { useCallback, useEffect, useState } from "react";


const borders = [[3,7],[2,8],[2,8],[1,9],[1,9],[0,10],[0,10],[1,9],[1,9],[2,8],[2,8],[3,7]];
function Game() {
    const appWidth = 1200, appHeight = 675
    const cell_hor_offset = 115, cell_ver_offset = 100;
    const [selected_node, set_selected_node] = useState(null);

    const nodes = new Set()
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
    }, [selected_node]);

    const draw_roads = useCallback((g) => {
        const local_nodes = [...nodes]
        let road = new PIXI.Graphics()
        road.beginFill(0x00ff00)
        road.drawRoundedRect(appWidth/2 - 10, appHeight/2 -10, 20, 20, 5)
        road.endFill()
        g.addChild(road)
        //for (var ncoor of local_nodes) {
        //    let coords = ncoor.split(",")
        //    console.log(coords)
            /*let coords = ncoor.split(","), x = parseInt(coords[0]), y = parseInt(coords[1]), mcoor = ""
            // Para x = par (2n). (x,y) -> (x-1,y),(x+1,y-1),(x+1,y+1):
            if (x % 2 === 0) {
                if (x-1 > 0) {
                    mcoor = ncoor_toString({x:x-1, y:y})
                    if (!(ncoor+":"+mcoor in edges) && !(mcoor+":"+ncoor in edges)) {
                        edges[ncoor+":"+mcoor] = { id: null }
                    }
                }
                if (y-1 >= borders[x+1][0]) {
                    mcoor = ncoor_toString({x:x+1,y:y-1})
                    if (!(ncoor+":"+mcoor in edges) && !(mcoor+":"+ncoor in edges)) {
                        edges[ncoor+":"+mcoor] = { id: null }
                    }
                }
                if (y+1 <= borders[x+1][1]) {
                    mcoor = ncoor_toString({x:x+1,y:y+1})
                    if (!(ncoor+":"+mcoor in edges) && !(mcoor+":"+ncoor in edges)) {
                        edges[ncoor+":"+mcoor] = { id: null }
                    }
                }
            // Para x = impar (2n+1). (x,y) -> (x-1,y-1),(x-1,y+1),(x+1,y):
            } else {
                if (y-1 >= borders[x-1][0]) {
                    mcoor = ncoor_toString({x:x-1,y:y-1})
                    if (!(ncoor+":"+mcoor in edges) && !(mcoor+":"+ncoor in edges)) {
                        edges[ncoor+":"+mcoor] = { id: null }
                    }
                }
                if (y+1 <= borders[x-1][1]) {
                    mcoor = ncoor_toString({x:x-1,y:y+1})
                    if (!(ncoor+":"+mcoor in edges) && !(mcoor+":"+ncoor in edges)) {
                        edges[ncoor+":"+mcoor] = { id: null }
                    }
                }
                if (x+1 < 12) {
                    mcoor = ncoor_toString({x:x+1, y:y})
                    if (!(ncoor+":"+mcoor in edges) && !(mcoor+":"+ncoor in edges)) {
                        edges[ncoor+":"+mcoor] = { id: null }
                    }
                }
            }
            */
        //}
    })



    useEffect(() => {
        console.log("Circle selected:", selected_node);
    }, [selected_node]);
    return (
        <div className="Game-header | Common-Header">
            <Stage width={appWidth} height={appHeight}>

                <Sprite image={Ocean} x={appWidth/2 - cell_hor_offset} y={appHeight/2 - 2*cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Ocean} x={appWidth/2} y={appHeight/2 - 2*cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Ocean} x={appWidth/2 + cell_hor_offset} y={appHeight/2 - 2*cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Ocean} x={appWidth/2 - 1.5*cell_hor_offset} y={appHeight/2 - cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Ocean} x={appWidth/2 - 0.5*cell_hor_offset} y={appHeight/2 - cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Ocean} x={appWidth/2 + 0.5*cell_hor_offset} y={appHeight/2 - cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Ocean} x={appWidth/2 + 1.5*cell_hor_offset} y={appHeight/2 - cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Ocean} x={appWidth/2 - 2*cell_hor_offset} y={appHeight/2} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Ocean} x={appWidth/2 - cell_hor_offset} y={appHeight/2} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Ocean} x={appWidth/2} y={appHeight/2} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Ocean} x={appWidth/2 + cell_hor_offset} y={appHeight/2} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Ocean} x={appWidth/2 + 2*cell_hor_offset} y={appHeight/2} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Ocean} x={appWidth/2 - 1.5*cell_hor_offset} y={appHeight/2 + cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Ocean} x={appWidth/2 - 0.5*cell_hor_offset} y={appHeight/2 + cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Ocean} x={appWidth/2 + 0.5*cell_hor_offset} y={appHeight/2 + cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Ocean} x={appWidth/2 + 1.5*cell_hor_offset} y={appHeight/2 + cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Ocean} x={appWidth/2 - cell_hor_offset} y={appHeight/2 + 2*cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Ocean} x={appWidth/2} y={appHeight/2 + 2*cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Ocean} x={appWidth/2 + cell_hor_offset} y={appHeight/2 + 2*cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                
                <Graphics draw={draw_nodes} />
                <Graphics draw={draw_roads} />
            </Stage>
        </div>
    );
}

export default Game