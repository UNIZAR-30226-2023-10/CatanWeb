import * as PIXI from 'pixi.js'
import Desert from './images/desert.png'
import Farmland from './images/farmland.png'
import Forest from './images/forest.png'
import Hill from './images/hill.png'
import Mountain from './images/mountain.png'
import Pasture from './images/pasture.png'
import Ocean from './images/ocean.png'
import './styles/boton.css'
//import Dado1 from './images/Dice01.png'
import { Stage, Graphics, Sprite } from '@pixi/react';
import React, { useCallback, useEffect, useMemo, useState } from "react";

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
const color_1 = 0xd60000
const color_2 = 0x06b300
const color_3 = 0x005bb5
const color_4 = 0xd4b700

function Game() {
    const players = JSON.parse(sessionStorage.getItem('players'))
    const user = JSON.parse(sessionStorage.getItem('user'))
    console.log(players[0])
    console.log(players[1])
    console.log(players[2])
    console.log(players[3])
    console.log('Users:', user)

    const appWidth = 1200, appHeight = 675
    const cell_hor_offset = 115, cell_ver_offset = 100;
    const [selected_point, set_selected_point] = useState(null);
    const nodes = useMemo(() => new Set(), []);
    const user1 = new PIXI.Text(players[0], {
        fontFamily: "Arial",
        fontSize: 20,
        fill: 0xffffff,
        align: "center"
    });
    user1.anchor.set(0.5); // Establece el anclaje en el punto medio horizontal y vertical
    user1.position.set(105, 45); // Establece la posición del texto dentro del rectángulo

    const user2 = new PIXI.Text(players[1], {
        fontFamily: "Arial",
        fontSize: 20,
        fill: 0xffffff,
        align: "center"
    });

    user2.anchor.set(0.5); // Establece el anclaje en el punto medio horizontal y vertical
    user2.position.set(105, 105); // Establece la posición del texto dentro del rectángulo

    const user3 = new PIXI.Text(players[2], {
        fontFamily: "Arial",
        fontSize: 20,
        fill: 0xffffff,
        align: "center"
    });

    user3.anchor.set(0.5); // Establece el anclaje en el punto medio horizontal y vertical
    user3.position.set(105, 165); // Establece la posición del texto dentro del rectángulo

    const user4 = new PIXI.Text(players[3], {
        fontFamily: "Arial",
        fontSize: 20,
        fill: 0xffffff,
        align: "center"
    });

    user4.anchor.set(0.5); // Establece el anclaje en el punto medio horizontal y vertical
    user4.position.set(105, 225); // Establece la posición del texto dentro del rectángulo


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
        user_rectangle.beginFill(color_1)
        user_rectangle.drawRoundedRect(-20, 20, 250, 50, 5)
        user_rectangle.addChild(user1)
        user_rectangle.endFill()
        g.addChild(user_rectangle)
        let user_rectangle2 = new PIXI.Graphics()
        user_rectangle2.beginFill(color_2)
        user_rectangle2.drawRoundedRect(-20, 80, 250, 50, 5)
        user_rectangle2.addChild(user2)
        user_rectangle2.endFill()
        g.addChild(user_rectangle2)
        let user_rectangle3 = new PIXI.Graphics()
        user_rectangle3.beginFill(color_3)
        user_rectangle3.drawRoundedRect(-20, 140, 250, 50, 5)
        user_rectangle3.addChild(user3)
        user_rectangle3.endFill()
        g.addChild(user_rectangle3)
        let user_rectangle4 = new PIXI.Graphics()
        user_rectangle4.beginFill(color_4)
        user_rectangle4.drawRoundedRect(-20, 200, 250, 50, 5)
        user_rectangle4.addChild(user4)
        user_rectangle4.endFill()
        g.addChild(user_rectangle4)

        user_rectangle.beginFill(0xffffff);
        user_rectangle.drawCircle(1100, 570, 70);
        user_rectangle.endFill();
        //g.addChild(circle);
        

    }, [])

    const draw_Dice = useCallback((g) => {
        let dice1 = new PIXI.Graphics();
        dice1.lineStyle(2, 0x000000, 1);
        dice1.beginFill(0xffffff);
        dice1.drawRoundedRect(905,10, 100, 100, 20);
        dice1.beginFill(0x000000);
        dice1.endFill(); 
        g.addChild(dice1);

        let dice2 = new PIXI.Graphics();
        dice2.lineStyle(2, 0x000000, 1);
        dice2.beginFill(0xffffff);
        dice2.drawRoundedRect(1010,10, 100, 100, 20);
        dice2.beginFill(0x000000);
        dice2.endFill();
        g.addChild(dice2);
    }, [])

    useEffect(() => {
        if (selected_point !== null) {
            //set_select_road(null)
            console.log("Selected point", selected_point);
        }
    }, [selected_point]);
    return (
        <div id="game-header">
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
                <Graphics draw={draw_Dice} />
            </Stage>
        </div>
    );
}

export default Game
