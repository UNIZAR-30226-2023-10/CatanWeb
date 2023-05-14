// React
import React, { useCallback, useState, useContext } from "react";
import { SocketContext } from './App';

// Board
import * as PIXI from 'pixi.js'
import { Stage, Graphics } from '@pixi/react';
import Desert   from './images/desert.png'
import Farmland from './images/farmland.png'
import Forest   from './images/forest.png'
import Hill     from './images/hill.png'
import Mountain from './images/mountain.png'
import Ocean    from './images/ocean.png'
import Pasture  from './images/pasture.png'

// Resources
import Wheat from './images/wheat_card.svg'
import Lumber from './images/lumber_card.svg'
import Brick from './images/brick_card.svg'
import Stone from './images/stone_card.svg'
import Wool from './images/sheep_card.svg'

import Dice0 from './images/Dice00.png'
import Dice1 from './images/Dice01.png'
import Dice2 from './images/Dice02.png'
import Dice3 from './images/Dice03.png'
import Dice4 from './images/Dice04.png'
import Dice5 from './images/Dice05.png'
import Dice6 from './images/Dice06.png'

/*
import Caballero from './images/card_knight.svg'
import Monopoly from './images/card_monopoly.svg'
import ConstruccionCarreteras from './images/card_roadbuilding.svg'
import PuntosVictoria from './images/card_vp.svg'
import AgnoAbundancia from './images/card_yearofplenty.svg'
*/

// Buttons
import ButtonBuild from './images/button_build.png'
import ButtonBuildD from './images/button_build_d.png'
import ButtonBuildCancel from './images/button_build-cancel.png'
import ButtonCancel  from './images/button_cancel.png'
import ButtonConfirm from './images/button_confirm.png'
import ButtonDices from './images/button_dices.png'
import ButtonDicesD from './images/button_dices_d.png'
import ButtonNextTurn from './images/button_next-turn.png'
import ButtonNextTurnD from './images/button_next-turn_d.png'
import { create } from "./services/routes";

const MoveType = require( './services/movesTypes.js')

const Biomes = {
    'Desert': Desert,
    'Farmland': Farmland,
    'Forest': Forest,
    'Hill': Hill,
    'Mountain': Mountain,
    'Ocean': Ocean,
    'Pasture': Pasture
}

const Resources = [ Wheat, Lumber, Brick, Stone, Wool ]
const Dices = [ Dice0, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 ]

const borders = [[3,7],[2,8],[2,8],[1,9],[1,9],[0,10],[0,10],[1,9],[1,9],[2,8],[2,8],[3,7]];

const PlayersColors  = [0xd60000, 0x06b300, 0x005bb5, 0xd4b700]
const PlayersColorsD = [0x6e2323, 0x2f662d, 0x2e4a66, 0x706939]

// ============================================================================
// AUXILIAR FUNCTIONS
// ============================================================================

/*
function random(min, max) {
    return Math.floor(Math.random() * max) + min;
}
*/

function ncoor_toString(coords) {
    return coords.x.toString() + "," + coords.y.toString()
}

function Draw(color, type, ...params) {
    let new_graphic = new PIXI.Graphics()
    new_graphic.beginFill(color)
    if (type === 'Rect') {
        new_graphic.drawRect(...params)
    } else if (type === 'Circle') {
        new_graphic.drawCircle(...params)
    } else if (type === 'RoundedRect') {
        new_graphic.drawRoundedRect(...params)
    }
    new_graphic.endFill()
    return new_graphic
}

function DrawSprite(img, x, y, scale = 0.5) {
    let sprite = PIXI.Sprite.from(img)
    sprite.x = x;
    sprite.y = y;
    sprite.scale.set(scale);
    sprite.anchor.set(0.5);
    return sprite
}

function DrawSpritePro(img, x, y, width, height) {
    let sprite = PIXI.Sprite.from(img)
    sprite.width  = width
    sprite.height = height
    sprite.x = x;
    sprite.y = y;
    return sprite
}

function DrawText(text, font, fontSize, fill, align, position, anchor) {
    let new_text  = new PIXI.Text(text, {fontFamily: font, fontSize: fontSize, fill: fill, align: align});
    new_text.anchor.set(anchor);
    new_text.position.set(position.x, position.y);
    return new_text
}

// ============================================================================
// GAME
// ============================================================================
function Game(props) {

    const { gameChanged } = props
    let socket = useContext(SocketContext);
    //socket.on('notify', (data) => {
    //    console.log(data)
    //})

    const appWidth = 1200, appHeight = 675
    const cell_hor_offset = 115, cell_ver_offset = 100;

    const [buildmode, setBuildMode] = useState(true)
    const [throwDices, setThrowDices] = useState(false)
    const [selectedPoint, setSelectedPoint] = useState(null);
    const [hasToBuild, setHasToBuild] = useState([true, false])

    function create_biome(g, biomes, i, x, y) {

        let sprite = DrawSprite(Biomes[biomes[i].type], x, y)
        g.addChild(sprite)

        if (biomes[i].token !== 0) {
            let token = Draw(0xe8a85a, 'Circle', sprite.x, sprite.y, 20)
            if (biomes[i].token === 6 || biomes[i].token === 8) {
                token.addChild(DrawText(biomes[i].token, "Arial", 16, "red", 'center', {x: sprite.x, y: sprite.y }, 0.5))
            } else {
                token.addChild(DrawText(biomes[i].token, "Arial", 16, "white", 'center', {x: sprite.x, y: sprite.y }, 0.5))
            }
            g.addChild(token)
        }

    }

    function create_node_init(g, players, free_nodes_set, id, x, y) {
        let p_i = -1
        for (let p = 0; p < players.length; p++) {
            if ((new Set(players[p].villages)).has(id)) {
                p_i = p
            }
        }
        if (p_i === -1) {
            if (free_nodes_set.size > 0) {
                if (hasToBuild[0] && free_nodes_set.has(id) && JSON.parse(sessionStorage.getItem('game')).current_turn === parseInt(sessionStorage.getItem('my-turn'))) {
                    let node = Draw(selectedPoint && selectedPoint.id === id ? 0xffff00 : 0xffffff, 'Circle', x, y, 15)
                    node.interactive = true 
                    node.on("pointerdown", () => {
                        setSelectedPoint({id:id, type:'Node'})
                    })
                    g.addChild(node)
                }
            }

        } else {
            g.addChild(Draw(PlayersColors[p_i], 'Circle', x, y, 15))
        }
    }

    function create_node_post(g, players, free_nodes_set, id, x, y) {
        let p_i = -1
        for (let p = 0; p < players.length; p++) {
            if ((new Set(players[p].villages)).has(id)) {
                p_i = p
            }
        }
        if (p_i === -1) {
            if (free_nodes_set.size > 0) {
                if (buildmode && free_nodes_set.has(id)) {
                    let node = Draw(selectedPoint && selectedPoint.id === id ? 0xffff00 : 0xffffff, 'Circle', x, y, 15)
                    node.interactive = true 
                    node.on("pointerdown", () => {
                        setSelectedPoint({id:id, type:'Node'})
                    })
                    g.addChild(node)
                }
            }

        } else {
            g.addChild(Draw(PlayersColors[p_i], 'Circle', x, y, 15))
        }
    }

    function create_road_init(g, players, free_roads_set, id, x, y) {
        let p_i = -1
        for (let p = 0; p < players.length; p++) {
            if ((new Set(players[p].roads)).has(id)) {
                p_i = p
            }
        }
        if (p_i === -1) {
            if (free_roads_set.size > 0) {
                if (hasToBuild[1] && free_roads_set.has(id) && JSON.parse(sessionStorage.getItem('game')).current_turn === parseInt(sessionStorage.getItem('my-turn'))) {
                    let road = new PIXI.Graphics()
                    road.beginFill(selectedPoint && selectedPoint.id === id ? 0x0b04cf : 0x6f5c9c)
                    road.drawRoundedRect(x, y, 17, 17, 5)
                    road.endFill()
                    road.interactive = true
                    road.on("pointertap", () => {setSelectedPoint({id:id, type:'Road'})})
                    g.addChild(road)
                }
            }

        } else {
            g.addChild(Draw(PlayersColors[p_i], 'RoundedRect', x, y, 17, 17, 5))
        }
    }

    function create_road_post(g, players, free_roads_set, id, x, y) {
        let p_i = -1
        for (let p = 0; p < players.length; p++) {
            if ((new Set(players[p].roads)).has(id)) {
                p_i = p
            }
        }
        if (p_i === -1) {
            if (free_roads_set.size > 0) {
                if (buildmode && free_roads_set.has(id)) {
                    let road = new PIXI.Graphics()
                    road.beginFill(selectedPoint && selectedPoint.id === id ? 0x0b04cf : 0x6f5c9c)
                    road.drawRoundedRect(x, y, 17, 17, 5)
                    road.endFill()
                    road.interactive = true
                    road.on("pointertap", () => {setSelectedPoint({id:id, type:'Road'})})
                    g.addChild(road)
                }
            }
        } else {
            g.addChild(Draw(PlayersColors[p_i], 'RoundedRect', x, y, 17, 17, 5))
        }
    }

    function game_phase_init(g, game, players, me) {

        // Drawing the building nodes:
        let free_nodes_set = (me.free_nodes.length > 0) ? new Set(me.free_nodes) : new Set()
        for (let i = 0; i < 12; i++) {
            for (let j = borders[i][0]; j <= borders[i][1]; j+=2) {
                create_node_init(g, players, free_nodes_set, `${i},${j}`, 320 + (j*(cell_hor_offset-4)/2), 76 + (24 * (i%2)) + (Math.floor(i/2) * cell_ver_offset))
            }
        }

        // Drawing the road nodes:
        let free_roads_set = new Set(me.first_roads)
        create_road_init(g, players, free_roads_set, '0,3:1,2', 450, 81)
        create_road_init(g, players, free_roads_set, '0,3:1,4', 505, 81)
        create_road_init(g, players, free_roads_set, '0,5:1,4', 560, 81)
        create_road_init(g, players, free_roads_set, '0,5:1,6', 616, 81)
        create_road_init(g, players, free_roads_set, '0,7:1,6', 672, 81)
        create_road_init(g, players, free_roads_set, '0,7:1,8', 728, 81)

        create_road_init(g, players, free_roads_set, '1,2:2,2', 422, 131)
        create_road_init(g, players, free_roads_set, '1,4:2,4', 534, 131)
        create_road_init(g, players, free_roads_set, '1,6:2,6', 648, 131)
        create_road_init(g, players, free_roads_set, '1,8:2,8', 762, 131)

        create_road_init(g, players, free_roads_set, '2,2:3,1', 391, 181)
        create_road_init(g, players, free_roads_set, '2,2:3,3', 448, 181)
        create_road_init(g, players, free_roads_set, '2,4:3,3', 504, 181)
        create_road_init(g, players, free_roads_set, '2,4:3,5', 561, 181)
        create_road_init(g, players, free_roads_set, '2,6:3,5', 617, 181)
        create_road_init(g, players, free_roads_set, '2,6:3,7', 675, 181)
        create_road_init(g, players, free_roads_set, '2,8:3,7', 730, 181)
        create_road_init(g, players, free_roads_set, '2,8:3,9', 786, 181)

        create_road_init(g, players, free_roads_set, '3,1:4,1', 365, 231)
        create_road_init(g, players, free_roads_set, '3,3:4,3', 479, 231)
        create_road_init(g, players, free_roads_set, '3,5:4,5', 591, 231)
        create_road_init(g, players, free_roads_set, '3,7:4,7', 703, 231)
        create_road_init(g, players, free_roads_set, '3,9:4,9', 815, 231)

        create_road_init(g, players, free_roads_set, '4,1:5,0', 335, 281, 17, 17, 5)
        create_road_init(g, players, free_roads_set, '4,1:5,2', 391, 281, 17, 17, 5)
        create_road_init(g, players, free_roads_set, '4,3:5,2', 448, 281, 17, 17, 5)
        create_road_init(g, players, free_roads_set, '4,3:5,4', 504, 281, 17, 17, 5)
        create_road_init(g, players, free_roads_set, '4,5:5,4', 561, 281, 17, 17, 5)
        create_road_init(g, players, free_roads_set, '4,5:5,6', 617, 281, 17, 17, 5)
        create_road_init(g, players, free_roads_set, '4,7:5,6', 675, 281, 17, 17, 5)
        create_road_init(g, players, free_roads_set, '4,7:5,8', 735, 281, 17, 17, 5)
        create_road_init(g, players, free_roads_set, '4,9:5,8', 790, 281, 17, 17, 5)
        create_road_init(g, players, free_roads_set, '4,9:5,10', 845, 281, 17, 17, 5)

        create_road_init(g, players, free_roads_set, '5,0:6,0', 307, 331)
        create_road_init(g, players, free_roads_set, '5,2:6,2', 421, 331)
        create_road_init(g, players, free_roads_set, '5,4:6,4', 535, 331)
        create_road_init(g, players, free_roads_set, '5,6:6,6', 649, 331)
        create_road_init(g, players, free_roads_set, '5,8:6,8', 763, 331)
        create_road_init(g, players, free_roads_set, '5,10:6,10', 877, 331)

        create_road_init(g, players, free_roads_set, '6,0:7,1', 335, 381)
        create_road_init(g, players, free_roads_set, '6,2:7,1', 391, 381)
        create_road_init(g, players, free_roads_set, '6,2:7,3', 448, 381)
        create_road_init(g, players, free_roads_set, '6,4:7,3', 504, 381)
        create_road_init(g, players, free_roads_set, '6,4:7,5', 561, 381)
        create_road_init(g, players, free_roads_set, '6,6:7,5', 617, 381)
        create_road_init(g, players, free_roads_set, '6,6:7,7', 675, 381)
        create_road_init(g, players, free_roads_set, '6,8:7,7', 735, 381)
        create_road_init(g, players, free_roads_set, '6,8:7,9', 790, 381)
        create_road_init(g, players, free_roads_set, '6,10:7,9', 845, 381)

        create_road_init(g, players, free_roads_set, '7,1:8,1', 365, 430)
        create_road_init(g, players, free_roads_set, '7,3:8,3', 479, 430)
        create_road_init(g, players, free_roads_set, '7,5:8,5', 591, 430)
        create_road_init(g, players, free_roads_set, '7,7:8,7', 703, 430)
        create_road_init(g, players, free_roads_set, '7,9:8,9', 815, 430)

        create_road_init(g, players, free_roads_set, '8,1:9,2', 391, 480)
        create_road_init(g, players, free_roads_set, '8,3:9,2', 448, 480)
        create_road_init(g, players, free_roads_set, '8,3:9,4', 504, 480)
        create_road_init(g, players, free_roads_set, '8,5:9,4', 561, 480)
        create_road_init(g, players, free_roads_set, '8,5:9,6', 617, 480)
        create_road_init(g, players, free_roads_set, '8,7:9,6', 675, 480)
        create_road_init(g, players, free_roads_set, '8,7:9,8', 730, 480)
        create_road_init(g, players, free_roads_set, '8,9:9,8', 786, 480)

        create_road_init(g, players, free_roads_set, '9,2:10,2', 422, 530)
        create_road_init(g, players, free_roads_set, '9,4:10,4', 534, 530)
        create_road_init(g, players, free_roads_set, '9,6:10,6', 648, 530)
        create_road_init(g, players, free_roads_set, '9,8:10,8', 762, 530)

        create_road_init(g, players, free_roads_set, '10,2:11,3', 450, 580)
        create_road_init(g, players, free_roads_set, '10,4:11,3', 505, 580)
        create_road_init(g, players, free_roads_set, '10,4:11,5', 560, 580)
        create_road_init(g, players, free_roads_set, '10,6:11,5', 616, 580)
        create_road_init(g, players, free_roads_set, '10,6:11,7', 672, 580)
        create_road_init(g, players, free_roads_set, '10,8:11,7', 728, 580)

        if (game.current_turn === parseInt(sessionStorage.getItem('my-turn'))) {
            let BUTTON = null
            // Only if player has selected a place to build
            if (hasToBuild[0] || hasToBuild[1]) {
                if (selectedPoint) {
                    // Cancel building selection
                    BUTTON = DrawSprite(ButtonCancel, 1005, 600, 0.1)
                    BUTTON.interactive = true;
                    BUTTON.buttonMode = true;
                    BUTTON.on('pointerdown', () => {
                        setSelectedPoint(null)
                    })
                    g.addChild(BUTTON);

                    // Confirm building selection
                    BUTTON = DrawSprite(ButtonConfirm, 1100, 600, 0.1)
                    BUTTON.interactive = true;
                    BUTTON.buttonMode = true;
                    BUTTON.on('pointerdown', () => {
                        console.log("CONSTRUYO EN ", selectedPoint)
                        if (selectedPoint.type === 'Node') {
                            socket.emit('move', JSON.parse(sessionStorage.getItem('user')).accessToken, game.code, { id : MoveType.build_village, coords: selectedPoint.id })
                        } else if (selectedPoint.type === 'Road') {
                            socket.emit('move', JSON.parse(sessionStorage.getItem('user')).accessToken, game.code, {id : MoveType.build_road, coords: selectedPoint.id})
                        }
                        if (hasToBuild[0]) {
                            setHasToBuild([false, true])
                        } else if (hasToBuild[1]) {
                            setHasToBuild([false, false])
                            setBuildMode(false)
                        }
                        setSelectedPoint(null)
                    })
                    g.addChild(BUTTON);
                }
            } else {
                // Next turn button
                BUTTON = DrawSprite(ButtonNextTurn, 1100, 600, 0.1)
                BUTTON.interactive = true;
                BUTTON.buttonMode  = true;
                BUTTON.on('pointerdown', () => {
                    socket.emit('move', JSON.parse(sessionStorage.getItem('user')).accessToken, game.code, { id : MoveType.next_turn })
                    setHasToBuild([true, false])
                    if (game.current_turn === 0 && game.phase === 2) {
                        setBuildMode(false)
                    }
                })
                g.addChild(BUTTON)
            }
        }
    }

    function game_phase_post(g, game, players, me) {

        // Drawing the building nodes:
        let free_nodes_set = (me.free_nodes.length > 0) ? new Set(me.free_nodes) : new Set()
        for (let i = 0; i < 12; i++) {
            for (let j = borders[i][0]; j <= borders[i][1]; j+=2) {
                create_node_post(g, players, free_nodes_set, `${i},${j}`, 320 + (j*(cell_hor_offset-4)/2), 76 + (24 * (i%2)) + (Math.floor(i/2) * cell_ver_offset))
            }
        }

        // Drawing the road nodes:
        let free_roads_set = (me.free_roads.length > 0) ? new Set(me.free_roads) : new Set()
        create_road_post(g, players, free_roads_set, '0,3:1,2', 450, 81)
        create_road_post(g, players, free_roads_set, '0,3:1,4', 505, 81)
        create_road_post(g, players, free_roads_set, '0,5:1,4', 560, 81)
        create_road_post(g, players, free_roads_set, '0,5:1,6', 616, 81)
        create_road_post(g, players, free_roads_set, '0,7:1,6', 672, 81)
        create_road_post(g, players, free_roads_set, '0,7:1,8', 728, 81)

        create_road_post(g, players, free_roads_set, '1,2:2,2', 422, 131)
        create_road_post(g, players, free_roads_set, '1,4:2,4', 534, 131)
        create_road_post(g, players, free_roads_set, '1,6:2,6', 648, 131)
        create_road_post(g, players, free_roads_set, '1,8:2,8', 762, 131)

        create_road_post(g, players, free_roads_set, '2,2:3,1', 391, 181)
        create_road_post(g, players, free_roads_set, '2,2:3,3', 448, 181)
        create_road_post(g, players, free_roads_set, '2,4:3,3', 504, 181)
        create_road_post(g, players, free_roads_set, '2,4:3,5', 561, 181)
        create_road_post(g, players, free_roads_set, '2,6:3,5', 617, 181)
        create_road_post(g, players, free_roads_set, '2,6:3,7', 675, 181)
        create_road_post(g, players, free_roads_set, '2.8:3,7', 730, 181)
        create_road_post(g, players, free_roads_set, '2,8:3,9', 786, 181)

        create_road_post(g, players, free_roads_set, '3,1:4,1', 365, 231)
        create_road_post(g, players, free_roads_set, '3,3:4,3', 479, 231)
        create_road_post(g, players, free_roads_set, '3,5:4,5', 591, 231)
        create_road_post(g, players, free_roads_set, '3,7:4,7', 703, 231)
        create_road_post(g, players, free_roads_set, '3,9:4,9', 815, 231)

        create_road_post(g, players, free_roads_set, '4,1:5,0', 335, 281, 17, 17, 5)
        create_road_post(g, players, free_roads_set, '4,1:5,2', 391, 281, 17, 17, 5)
        create_road_post(g, players, free_roads_set, '4,3:5,2', 448, 281, 17, 17, 5)
        create_road_post(g, players, free_roads_set, '4,3:5,4', 504, 281, 17, 17, 5)
        create_road_post(g, players, free_roads_set, '4,5:5,4', 561, 281, 17, 17, 5)
        create_road_post(g, players, free_roads_set, '4,5:5,6', 617, 281, 17, 17, 5)
        create_road_post(g, players, free_roads_set, '4,7:5,6', 675, 281, 17, 17, 5)
        create_road_post(g, players, free_roads_set, '4,7:5,8', 735, 281, 17, 17, 5)
        create_road_post(g, players, free_roads_set, '4,9:5,8', 790, 281, 17, 17, 5)
        create_road_post(g, players, free_roads_set, '4,9:5,10', 845, 281, 17, 17, 5)

        create_road_post(g, players, free_roads_set, '5,0:6,0', 307, 331)
        create_road_post(g, players, free_roads_set, '5,2:6,2', 421, 331)
        create_road_post(g, players, free_roads_set, '5,4:6,4', 535, 331)
        create_road_post(g, players, free_roads_set, '5,6:6,6', 649, 331)
        create_road_post(g, players, free_roads_set, '5,8:6,8', 763, 331)
        create_road_post(g, players, free_roads_set, '5,10:6,10', 877, 331)

        create_road_post(g, players, free_roads_set, '6,0:7,1', 335, 381)
        create_road_post(g, players, free_roads_set, '6,2:7,1', 391, 381)
        create_road_post(g, players, free_roads_set, '6,2:7,3', 448, 381)
        create_road_post(g, players, free_roads_set, '6,4:7,3', 504, 381)
        create_road_post(g, players, free_roads_set, '6,4:7,5', 561, 381)
        create_road_post(g, players, free_roads_set, '6,6:7,5', 617, 381)
        create_road_post(g, players, free_roads_set, '6,6:7,7', 675, 381)
        create_road_post(g, players, free_roads_set, '6,8:7,7', 735, 381)
        create_road_post(g, players, free_roads_set, '6,8:7,9', 790, 381)
        create_road_post(g, players, free_roads_set, '6,10:7,9', 845, 381)

        create_road_post(g, players, free_roads_set, '7,1:8,1', 365, 430)
        create_road_post(g, players, free_roads_set, '7,3:8,3', 479, 430)
        create_road_post(g, players, free_roads_set, '7,5:8,5', 591, 430)
        create_road_post(g, players, free_roads_set, '7,7:8,7', 703, 430)
        create_road_post(g, players, free_roads_set, '7,9:8,9', 815, 430)

        create_road_post(g, players, free_roads_set, '8,1:9,2', 391, 480)
        create_road_post(g, players, free_roads_set, '8,3:9,2', 448, 480)
        create_road_post(g, players, free_roads_set, '8,3:9,4', 504, 480)
        create_road_post(g, players, free_roads_set, '8,5:9,4', 561, 480)
        create_road_post(g, players, free_roads_set, '8,5:9,6', 617, 480)
        create_road_post(g, players, free_roads_set, '8,7:9,6', 675, 480)
        create_road_post(g, players, free_roads_set, '8,7:9,8', 730, 480)
        create_road_post(g, players, free_roads_set, '8,9:9,8', 786, 480)

        create_road_post(g, players, free_roads_set, '9,2:10,2', 422, 530)
        create_road_post(g, players, free_roads_set, '9,4:10,4', 534, 530)
        create_road_post(g, players, free_roads_set, '9,6:10,6', 648, 530)
        create_road_post(g, players, free_roads_set, '9,8:10,8', 762, 530)

        create_road_post(g, players, free_roads_set, '10,2:11,3', 450, 580)
        create_road_post(g, players, free_roads_set, '10,4:11,3', 505, 580)
        create_road_post(g, players, free_roads_set, '10,4:11,5', 560, 580)
        create_road_post(g, players, free_roads_set, '10,6:11,5', 616, 580)
        create_road_post(g, players, free_roads_set, '10,6:11,7', 672, 580)
        create_road_post(g, players, free_roads_set, '10,8:11,7', 728, 580)

        // Drawing the buttons
        let BUTTON = null
        if (!buildmode) {
            // Build button
            if (players[game.current_turn].name === JSON.parse(sessionStorage.getItem('user')).name && (me.can_build[0] || me.can_build[1] || me.can_build[2])) {
                BUTTON = DrawSprite(ButtonBuild, 1100, 505, 0.1)
                BUTTON.interactive = true;
                BUTTON.buttonMode = true;
                BUTTON.on('pointerdown', () => {
                    setBuildMode(true)
                    setSelectedPoint(null)
                })
            } else {
                BUTTON = DrawSprite(ButtonBuildD, 1100, 505, 0.1)
            }
            g.addChild(BUTTON)

            // Next turn button
            if (players[game.current_turn].name === JSON.parse(sessionStorage.getItem('user')).name && throwDices) {
                BUTTON = DrawSprite(ButtonNextTurn, 1100, 600, 0.1)
                BUTTON.interactive = true;
                BUTTON.buttonMode = true;
                BUTTON.on('pointerdown', () => {
                    socket.emit('move', JSON.parse(sessionStorage.getItem('user')).accessToken, game.code, { id : MoveType.next_turn })
                })
            } else {
                BUTTON = DrawSprite(ButtonNextTurnD, 1100, 600, 0.1)
            }
            g.addChild(BUTTON)

            // Dice button
            if (players[game.current_turn].name === JSON.parse(sessionStorage.getItem('user')).name && !throwDices) {
                BUTTON = DrawSprite(ButtonDices, 1005, 600, 0.1)
                BUTTON.interactive = true
                BUTTON.buttonMode  = true
                BUTTON.on('pointerdown', () => {
                    setThrowDices(true)
                    socket.emit('move', JSON.parse(sessionStorage.getItem('user')).accessToken, game.code, { id : MoveType.roll_dices })
                })
            } else {
                BUTTON = DrawSprite(ButtonDicesD, 1005, 600, 0.1)
            }
            g.addChild(BUTTON);

        } else {
            // Build button cancel
            BUTTON = DrawSprite(ButtonBuildCancel, 1100, 505, 0.1)
            BUTTON.interactive = true;
            BUTTON.buttonMode = true;
            BUTTON.on('pointerdown', () => {
                setBuildMode(false)
                setSelectedPoint(null)
            })
            g.addChild(BUTTON)

            // Only if player has selected a place to build
            if (selectedPoint) {
                // Cancel building selection
                BUTTON = DrawSprite(ButtonCancel, 1005, 600, 0.1)
                BUTTON.interactive = true;
                BUTTON.buttonMode = true;
                BUTTON.on('pointerdown', () => {
                    setSelectedPoint(null)
                })
                g.addChild(BUTTON);

                // Confirm building selection
                BUTTON = DrawSprite(ButtonConfirm, 1100, 600, 0.1)
                BUTTON.interactive = true;
                BUTTON.buttonMode = true;
                BUTTON.on('pointerdown', () => {
                    console.log("CONSTRUYO EN ", selectedPoint)
                    if (selectedPoint.type === 'Node') {
                        socket.emit('move', JSON.parse(sessionStorage.getItem('user')).accessToken, game.code, { id : MoveType.build_village, coords: selectedPoint.id })
                    } else if (selectedPoint.type === 'Road') {
                        socket.emit('move', JSON.parse(sessionStorage.getItem('user')).accessToken, game.code, {id : MoveType.build_road, coords: selectedPoint.id})
                    }
                    setBuildMode(false)
                    setSelectedPoint(null)
                })
                g.addChild(BUTTON);
            }
        }

        g.addChild(DrawSprite(Dices[game.dices_res[0]], appWidth-110, 40, 1))
        g.addChild(DrawSprite(Dices[game.dices_res[1]], appWidth-45, 40, 1))

    }

    const draw_game = useCallback((g) => {

        // Variables:
        let game    = JSON.parse(sessionStorage.getItem('game'))
        let players = game.players 
        let me      = players[sessionStorage.getItem('my-turn')]

        // Clear background:
        for (let i = g.children.length - 1; i >= 0; i--) {
            g.removeChild(g.children[i])
        }
        g.addChild(Draw(0x000000, 'Rect', 0, 0, appWidth, appHeight))

        // Drawing the biomes:
        create_biome(g, game.board.biomes, 0, appWidth/2 - cell_hor_offset, appHeight/2 - 2*cell_ver_offset)
        create_biome(g, game.board.biomes, 1,  appWidth/2, appHeight/2 - 2*cell_ver_offset)
        create_biome(g, game.board.biomes, 2,  appWidth/2 + cell_hor_offset, appHeight/2 - 2*cell_ver_offset)
        create_biome(g, game.board.biomes, 11, appWidth/2 - 1.5*cell_hor_offset, appHeight/2 - cell_ver_offset)
        create_biome(g, game.board.biomes, 12, appWidth/2 - 0.5*cell_hor_offset, appHeight/2 - cell_ver_offset)
        create_biome(g, game.board.biomes, 13, appWidth/2 + 0.5*cell_hor_offset, appHeight/2 - cell_ver_offset)
        create_biome(g, game.board.biomes, 3,  appWidth/2 + 1.5*cell_hor_offset, appHeight/2 - cell_ver_offset)
        create_biome(g, game.board.biomes, 10, appWidth/2 - 2*cell_hor_offset, appHeight/2)
        create_biome(g, game.board.biomes, 17, appWidth/2 - cell_hor_offset, appHeight/2)
        create_biome(g, game.board.biomes, 18, appWidth/2,appHeight/2)
        create_biome(g, game.board.biomes, 14, appWidth/2 + cell_hor_offset, appHeight/2)
        create_biome(g, game.board.biomes, 4,  appWidth/2 + 2*cell_hor_offset, appHeight/2)
        create_biome(g, game.board.biomes, 9,  appWidth/2 - 1.5*cell_hor_offset, appHeight/2 + cell_ver_offset)
        create_biome(g, game.board.biomes, 16, appWidth/2 - 0.5*cell_hor_offset, appHeight/2 + cell_ver_offset)
        create_biome(g, game.board.biomes, 15, appWidth/2 + 0.5*cell_hor_offset, appHeight/2 + cell_ver_offset)
        create_biome(g, game.board.biomes, 5,  appWidth/2 + 1.5*cell_hor_offset, appHeight/2 + cell_ver_offset)
        create_biome(g, game.board.biomes, 6,  appWidth/2 - cell_hor_offset, appHeight/2 + 2*cell_ver_offset)
        create_biome(g, game.board.biomes, 7,  appWidth/2, appHeight/2 + 2*cell_ver_offset)
        create_biome(g, game.board.biomes, 8,  appWidth/2 + cell_hor_offset, appHeight/2 + 2*cell_ver_offset)

        if (game.phase !== 3) {
            game_phase_init(g, game, players, me)
        } else {
            game_phase_post(g, game, players, me)
        }

        // Drawing the player box
        g.addChild(Draw(0x420001, 'RoundedRect', 30, 500, 380, 150, 10))
        if (players[game.current_turn].name === JSON.parse(sessionStorage.getItem('user')).name) {
            g.addChild(Draw(PlayersColors[sessionStorage.getItem('my-turn')], 'RoundedRect', 57, 510, 327, 30, 5))
        } else {
            g.addChild(Draw(PlayersColorsD[sessionStorage.getItem('my-turn')], 'RoundedRect', 57, 510, 327, 30, 5))
        }
        g.addChild(DrawText(me.name, 'Arial', 22, 'white', 'left', {x: 65, y:513}, 0))
        for (let i = 0; i < 5; i++) {
            g.addChild(DrawSpritePro(Resources[i], 55+(71*i), 555, 46, 66))
            g.addChild(Draw(0xe8a85a, 'Circle', 78+(71*i), 621, 15))
            g.addChild(DrawText(Object.values(me.resources)[i], 'Arial', 14, 'black', 'center', {x:78+(71*i), y:621}, 0.5))
        }

        // Drawing the player list:
        let boxes = 0
        for (let p = 0; p < players.length; p++) {
            if (p != sessionStorage.getItem('my-turn')) {
                g.addChild(Draw((p === game.current_turn) ? PlayersColors[p] : PlayersColorsD[p],  'RoundedRect', 30, 500 - 45*(boxes+1), 200, 35, 5))
                g.addChild(DrawText(game.players[p].name, 'Arial', 13, 'white', 'left', {x:42, y:(514 - 47*(boxes+1))}, 0))
                boxes++
            }
        }

    }, [buildmode, gameChanged, hasToBuild, selectedPoint])

    return (
        <div id="game-header">
            <Stage width={appWidth} height={appHeight}>
                <Graphics draw={draw_game} />
            </Stage>
        </div>
    );
}

export default Game
