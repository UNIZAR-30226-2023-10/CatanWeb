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
import { BackgroundSystem } from 'pixi.js'

function random(min, max) {
    return Math.floor(Math.random() * max) + min;
}

function ncoor_toString(coords) {
    return coords.x.toString() + "," + coords.y.toString()
}

function create_road(id, x, y, selected_point, set_selected_point) {
    let road = new PIXI.Graphics()
    road.id  = id
    road.beginFill(selected_point && selected_point.id === road.id ? 0x0b04cf : 0x6f5c9c)
    road.drawRoundedRect(x, y, 17, 17, 5)
    road.endFill()
    road.interactive = true
    road.on("pointertap", () => {set_selected_point({id:id, type:'Road'})})
    return road
}

const borders = [[3,7],[2,8],[2,8],[1,9],[1,9],[0,10],[0,10],[1,9],[1,9],[2,8],[2,8],[3,7]];
function Game() {
    const appWidth = 1200, appHeight = 675
    const cell_hor_offset = 115, cell_ver_offset = 100;
    const [selected_point, set_selected_point] = useState(null);
    const nodes = useMemo(() => new Set(), []);
    const draw_nodes = useCallback((g) => {
        let start_width = 320;
        for (let i = 0; i < 12; i++) {
            for (let j = borders[i][0]; j <= borders[i][1]; j+=2) {
                let node = new PIXI.Graphics(), id = `${i},${j}`
                node.id = id
                node.beginFill(selected_point && selected_point.id === id ? 0xffff00 : 0xffffff)
                node.drawCircle(start_width + (j*(cell_hor_offset-4)/2), 76 + (24 * (i%2)) + (Math.floor(i/2) * cell_ver_offset), 15)
                node.endFill()
                node.interactive = true
                node.on("pointertap", () => set_selected_point({id:id, type:'Node'}))
                g.addChild(node)
                nodes.add(id)
            }
        }
    }, [selected_point, nodes]);

    const draw_roads = useCallback((g) => {
        let arr_nodes = [...nodes], n = [0, arr_nodes.length-1]
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < (3+i); j++) {
                // Upper part:
                let coords = arr_nodes[n[0]].split(','), x = parseInt(coords[0]), y = parseInt(coords[1])
                // -- Road(x+1,y-1)
                g.addChild(create_road(`${coords}:${ncoor_toString({x:x+1, y:y-1})}`, 448+(113*j)-(57*i), 78+100*i, selected_point, set_selected_point))
                // -- Road(x+1,y+1)
                g.addChild(create_road(`${coords}:${ncoor_toString({x:x+1, y:y+1})}`, 505+(113*j)-(57*i), 78+100*i, selected_point, set_selected_point))
                n[0]++
                // Bottom part:
                coords = arr_nodes[n[1]].split(','); x = parseInt(coords[0]); y = parseInt(coords[1])
                // -- Road(x-1,y+1)
                g.addChild(create_road(`${ncoor_toString({x:x-1, y:y+1})}:${coords}`, 730-(112*j)+(57*i), 78+(101*(5-i)), selected_point, set_selected_point))
                // -- Road(x-1,y-1)
                g.addChild(create_road(`${ncoor_toString({x:x-1, y:y-1})}:${coords}`, 673-(112*j)+(57*i), 78+(101*(5-i)), selected_point, set_selected_point))
                n[1]--
            }
            for (let j = 0; j < (4+i); j++) {
                // Upper part:
                let coords = arr_nodes[n[0]].split(','), x = parseInt(coords[0]), y = parseInt(coords[1])
                // -- Road(x+1,y)
                g.addChild(create_road(`${coords}:${ncoor_toString({x:x+1, y:y})}`, 419+(115*j)-(58*i), 129+(100*i), selected_point, set_selected_point))
                n[0]++
                // Bottom part:
                coords = arr_nodes[n[1]].split(','); x = parseInt(coords[0]); y = parseInt(coords[1])
                // -- Road(x-1,y)
                g.addChild(create_road(`${ncoor_toString({x:x-1, y:y})}:${coords}`, 419+(115*j)-(58*i), 129+(100*(4-i)), selected_point, set_selected_point))
                n[1]--
            }
        }
    }, [selected_point, nodes])


    const draw_UI = useCallback((g) => {
        let user_rectangle = new PIXI.Graphics()
        user_rectangle.beginFill(0xd6b487)
        user_rectangle.drawRoundedRect(20, 20, 250, 100, 5)
        user_rectangle.endFill()
        g.addChild(user_rectangle)
        user_rectangle.beginFill(0xd6b487)
        user_rectangle.drawRoundedRect(930, 20, 250, 100, 5)
        user_rectangle.endFill()
        g.addChild(user_rectangle)
        user_rectangle.beginFill(0xd6b487)
        user_rectangle.drawRoundedRect(20, 555, 250, 100, 5)
        user_rectangle.endFill()
        g.addChild(user_rectangle)
        user_rectangle.beginFill(0xd6b487)
        user_rectangle.drawRoundedRect(930, 555, 250, 100, 5)
        user_rectangle.endFill()
        g.addChild(user_rectangle)
    }, [])

    useEffect(() => {
        if (selected_point !== null) {
            //set_select_road(null)
            console.log("Selected point", selected_point);
        }
    }, [selected_point]);
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
                <Graphics draw={draw_UI} />
            </Stage>
        </div>
    );
}

export default Game