// React
import React, { useCallback, useMemo, useState, useContext } from "react";

// Board
import * as PIXI from 'pixi.js'
import { Stage, Graphics, Sprite } from '@pixi/react';
import Desert   from './images/desert.png'
import Farmland from './images/farmland.png'
import Forest   from './images/forest.png'
import Hill     from './images/hill.png'
import Mountain from './images/mountain.png'
import Ocean    from './images/ocean.png'
import Pasture  from './images/pasture.png'

import './styles/boton.css'
import Dice1 from './images/Dice01.png'
import Dice2 from './images/Dice02.png'
import Dice3 from './images/Dice03.png'
import Dice4 from './images/Dice04.png'
import Dice5 from './images/Dice05.png'
import Dice6 from './images/Dice06.png'

import Caballero from './images/card_knight.svg'
import Monopoly from './images/card_monopoly.svg'
import ConstruccionCarreteras from './images/card_roadbuilding.svg'
import PuntosVictoria from './images/card_vp.svg'
import AgnoAbundancia from './images/card_yearofplenty.svg'

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
import './styles/boton.css'
import { SocketContext } from './App';

const MoveType = require( './services/movesTypes.js')
/*
function random(min, max) {
    return Math.floor(Math.random() * max) + min;
}
*/

const Biomes = {
    'Desert': Desert,
    'Farmland': Farmland,
    'Forest': Forest,
    'Hill': Hill,
    'Mountain': Mountain,
    'Ocean': Ocean,
    'Pasture': Pasture
}

function ncoor_toString(coords) {
    return coords.x.toString() + "," + coords.y.toString()
}

const borders = [[3,7],[2,8],[2,8],[1,9],[1,9],[0,10],[0,10],[1,9],[1,9],[2,8],[2,8],[3,7]];
const color_1 = 0xd60000
const color_2 = 0x06b300
const color_3 = 0x005bb5
const color_4 = 0xd4b700

const PlayersColors  = [0xd60000, 0x06b300, 0x005bb5, 0xd4b700]
const PlayersColorsD = [0x6e2323, 0x2f662d, 0x2e4a66, 0x706939]

const color_1_2 = 0x6e2323
const color_2_2 = 0x2f662d
const color_3_2 = 0x2e4a66
const color_4_2 = 0x706939

function NewSprite(img, x, y, scale = 0.5) {
    let sprite = PIXI.Sprite.from(img)
    sprite.x = x;
    sprite.y = y;
    sprite.scale.set(scale);
    sprite.anchor.set(0.5);
    return sprite
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

function DrawText(text, font, fontSize, fill, position, anchor) {
    let new_text  = new PIXI.Text(text, {fontFamily: font, fontSize: fontSize, fill: fill});
    new_text.anchor.set(anchor);
    new_text.position.set(position.x, position.y);
    return new_text
}

function Game(props) {

    const { gameChanged } = props
    let socket = useContext(SocketContext);
    let game = JSON.parse(sessionStorage.getItem('game'))
    console.log(JSON.parse(sessionStorage.getItem('game')))
    //socket.on('notify', (data) => {
    //    console.log(data)
    //})

    const appWidth = 1200, appHeight = 675
    const cell_hor_offset = 115, cell_ver_offset = 100;

    const [buildmode, setBuildMode] = useState(false)
    const [throwDices, setThrowDices] = useState(false)
    const [selectedPoint, setSelectedPoint] = useState(null);
    const [turnEnd, setTurnEnd] = useState(false);
    const [builtVillage, setBuiltVillage] = useState(false);

    function create_road(g, players, free_roads_set, id, x, y) {

        let p_i = -1
        for (let p = 0; p < players.length; p++) {
            if ((new Set(players[p].roads)).has(id)) {
                p_i = p
            }
        }
        if (p_i === -1) {
            if (buildmode && free_roads_set.has(id) && (game.phase === 3 || (game.phase !== 3 && builtVillage))) {
                let road = new PIXI.Graphics()
                //road.id  = id
                road.beginFill(selectedPoint && selectedPoint.id === id ? 0x0b04cf : 0x6f5c9c)
                road.drawRoundedRect(x, y, 17, 17, 5)
                road.endFill()
                road.interactive = true
                road.on("pointertap", () => {setSelectedPoint({id:id, type:'Road'})})
                g.addChild(road)
            }
        } else {
            g.addChild(Draw(PlayersColors[p_i], 'RoundedRect', x, y, 17, 17, 5))
        }

    }
    
    //const nodes = useMemo(() => new Set(), []);

    const draw_game = useCallback((g) => {
        // Clear background:
        for (let i = g.children.length - 1; i >= 0; i--) {
            g.removeChild(g.children[i])
        }
        g.addChild(Draw(0x000000, 'Rect', 0, 0, appWidth, appHeight))

        game    = JSON.parse(sessionStorage.getItem('game'))
        let players = game.players 
        let me      = players[sessionStorage.getItem('my-turn')]

        // Drawing the biomes:
        const sprites = [
            NewSprite(Biomes[game.board.biomes[0].type], appWidth/2 - cell_hor_offset, appHeight/2 - 2*cell_ver_offset),
            NewSprite(Biomes[game.board.biomes[1].type], appWidth/2, appHeight/2 - 2*cell_ver_offset),
            NewSprite(Biomes[game.board.biomes[2].type], appWidth/2 + cell_hor_offset, appHeight/2 - 2*cell_ver_offset),

            NewSprite(Biomes[game.board.biomes[3].type], appWidth/2 - 1.5*cell_hor_offset, appHeight/2 - cell_ver_offset),
            NewSprite(Biomes[game.board.biomes[4].type], appWidth/2 - 0.5*cell_hor_offset, appHeight/2 - cell_ver_offset),
            NewSprite(Biomes[game.board.biomes[5].type], appWidth/2 + 0.5*cell_hor_offset, appHeight/2 - cell_ver_offset),
            NewSprite(Biomes[game.board.biomes[6].type], appWidth/2 + 1.5*cell_hor_offset, appHeight/2 - cell_ver_offset),

            NewSprite(Biomes[game.board.biomes[7].type], appWidth/2 - 2*cell_hor_offset, appHeight/2),
            NewSprite(Biomes[game.board.biomes[8].type], appWidth/2 - cell_hor_offset, appHeight/2),
            NewSprite(Biomes[game.board.biomes[9].type], appWidth/2,appHeight/2),
            NewSprite(Biomes[game.board.biomes[10].type],appWidth/2 + cell_hor_offset, appHeight/2),
            NewSprite(Biomes[game.board.biomes[11].type],appWidth/2 + 2*cell_hor_offset, appHeight/2),

            NewSprite(Biomes[game.board.biomes[12].type],appWidth/2 - 1.5*cell_hor_offset, appHeight/2 + cell_ver_offset),
            NewSprite(Biomes[game.board.biomes[13].type],appWidth/2 - 0.5*cell_hor_offset, appHeight/2 + cell_ver_offset),
            NewSprite(Biomes[game.board.biomes[14].type],appWidth/2 + 0.5*cell_hor_offset, appHeight/2 + cell_ver_offset),
            NewSprite(Biomes[game.board.biomes[15].type],appWidth/2 + 1.5*cell_hor_offset, appHeight/2 + cell_ver_offset),

            NewSprite(Biomes[game.board.biomes[16].type],appWidth/2 - cell_hor_offset, appHeight/2 + 2*cell_ver_offset),
            NewSprite(Biomes[game.board.biomes[17].type],appWidth/2, appHeight/2 + 2*cell_ver_offset),
            NewSprite(Biomes[game.board.biomes[18].type],appWidth/2 + cell_hor_offset, appHeight/2 + 2*cell_ver_offset),
        ]
        for (let i = 0; i < sprites.length; i++) {
            g.addChild(sprites[i])
            if (game.board.biomes[i].token !== 0) {
                let token = Draw(0xe8a85a, 'Circle', sprites[i].x, sprites[i].y, 20)
                if (game.board.biomes[i].token === 6 || game.board.biomes[i].token === 8) {
                    token.addChild(DrawText(game.board.biomes[i].token, "Arial", 16, "red", {x: sprites[i].x, y: sprites[i].y }, 0.5))
                } else {
                    token.addChild(DrawText(game.board.biomes[i].token, "Arial", 16, "white", {x: sprites[i].x, y: sprites[i].y }, 0.5))
                }
                g.addChild(token)
            }
        }

        // Drawing the building nodes:
        let start_width = 320;
        let free_nodes_set = new Set(me.free_nodes)
        for (let i = 0; i < 12; i++) {
            for (let j = borders[i][0]; j <= borders[i][1]; j+=2) {

                let id = `${i},${j}`

                let p_i = -1
                for (let p = 0; p < players.length; p++) {
                    if ((new Set(players[p].villages)).has(id)) {
                        p_i = p
                    }
                }

                if (p_i === -1) {
                    if (buildmode && free_nodes_set.has(id) && !builtVillage) {
                        let node = Draw(selectedPoint && selectedPoint.id === id ? 0xffff00 : 0xffffff, 'Circle', start_width + (j*(cell_hor_offset-4)/2), 76 + (24 * (i%2)) + (Math.floor(i/2) * cell_ver_offset), 15)
                        node.interactive = true
                        node.on("pointerdown", () => {
                            setSelectedPoint({id:id, type:'Node'})
                        })
                        g.addChild(node)
                    }
                } else {
                    g.addChild(Draw(PlayersColors[p_i], 'Circle', start_width + (j*(cell_hor_offset-4)/2), 76 + (24 * (i%2)) + (Math.floor(i/2) * cell_ver_offset), 15))
                }
            }
        }

        // Drawing the road nodes:
        let free_roads_set = new Set(me.free_roads)
        create_road(g, players, free_roads_set, '0,3:1,2', 450, 81)
        create_road(g, players, free_roads_set, '0,3:1,4', 505, 81)
        create_road(g, players, free_roads_set, '0,5:1,4', 560, 81)
        create_road(g, players, free_roads_set, '0,5:1,6', 616, 81)
        create_road(g, players, free_roads_set, '0,7:1,6', 672, 81)
        create_road(g, players, free_roads_set, '0,7:1,8', 728, 81)

        create_road(g, players, free_roads_set, '1,2:2,2', 422, 131)
        create_road(g, players, free_roads_set, '1,4:2,4', 534, 131)
        create_road(g, players, free_roads_set, '1,6:2,6', 648, 131)
        create_road(g, players, free_roads_set, '1,8:2,8', 762, 131)

        create_road(g, players, free_roads_set, '2,2:3,1', 391, 181)
        create_road(g, players, free_roads_set, '2,2:3,3', 448, 181)
        create_road(g, players, free_roads_set, '2,4:3,3', 504, 181)
        create_road(g, players, free_roads_set, '2,4:3,5', 561, 181)
        create_road(g, players, free_roads_set, '2,6:3,5', 617, 181)
        create_road(g, players, free_roads_set, '2,6:3,7', 675, 181)
        create_road(g, players, free_roads_set, '2.8:3,7', 730, 181)
        create_road(g, players, free_roads_set, '2,8:3,9', 786, 181)

        create_road(g, players, free_roads_set, '3,1:4,1', 365, 231)
        create_road(g, players, free_roads_set, '3,3:4,3', 479, 231)
        create_road(g, players, free_roads_set, '3,5:4,5', 591, 231)
        create_road(g, players, free_roads_set, '3,7:4,7', 703, 231)
        create_road(g, players, free_roads_set, '3,9:4,9', 815, 231)

        create_road(g, players, free_roads_set, '4,1:5,0', 335, 281, 17, 17, 5)
        create_road(g, players, free_roads_set, '4,1:5,2', 391, 281, 17, 17, 5)
        create_road(g, players, free_roads_set, '4,3:5,2', 448, 281, 17, 17, 5)
        create_road(g, players, free_roads_set, '4,3:5:4', 504, 281, 17, 17, 5)
        create_road(g, players, free_roads_set, '4,5:5,4', 561, 281, 17, 17, 5)
        create_road(g, players, free_roads_set, '4,5:5,6', 617, 281, 17, 17, 5)
        create_road(g, players, free_roads_set, '4,7:5,6', 675, 281, 17, 17, 5)
        create_road(g, players, free_roads_set, '4,7:5,8', 735, 281, 17, 17, 5)
        create_road(g, players, free_roads_set, '4,9:5,8', 790, 281, 17, 17, 5)
        create_road(g, players, free_roads_set, '4,9:5,10', 845, 281, 17, 17, 5)

        create_road(g, players, free_roads_set, '5,0:6,0', 307, 331)
        create_road(g, players, free_roads_set, '5,2:6,2', 421, 331)
        create_road(g, players, free_roads_set, '5,4:6,4', 535, 331)
        create_road(g, players, free_roads_set, '5,6:6,6', 649, 331)
        create_road(g, players, free_roads_set, '5,8:6,8', 763, 331)
        create_road(g, players, free_roads_set, '5,10:6,10', 877, 331)

        create_road(g, players, free_roads_set, '6,0:7,1', 335, 381)
        create_road(g, players, free_roads_set, '6,2:7,1', 391, 381)
        create_road(g, players, free_roads_set, '6,2:7,3', 448, 381)
        create_road(g, players, free_roads_set, '6,4:7,3', 504, 381)
        create_road(g, players, free_roads_set, '6,4:7,5', 561, 381)
        create_road(g, players, free_roads_set, '6,6:7,5', 617, 381)
        create_road(g, players, free_roads_set, '6,6:7,7', 675, 381)
        create_road(g, players, free_roads_set, '6,8:7,7', 735, 381)
        create_road(g, players, free_roads_set, '6,8:7,9', 790, 381)
        create_road(g, players, free_roads_set, '6,10:7,9', 845, 381)

        create_road(g, players, free_roads_set, '7,1:8,1', 365, 430)
        create_road(g, players, free_roads_set, '7,3:8,3', 479, 430)
        create_road(g, players, free_roads_set, '7,5:8,5', 591, 430)
        create_road(g, players, free_roads_set, '7,7:8,7', 703, 430)
        create_road(g, players, free_roads_set, '7,9:8,9', 815, 430)

        create_road(g, players, free_roads_set, '8,1:9,2', 391, 480)
        create_road(g, players, free_roads_set, '8,3:9,2', 448, 480)
        create_road(g, players, free_roads_set, '8,3:9,4', 504, 480)
        create_road(g, players, free_roads_set, '8,5:9,4', 561, 480)
        create_road(g, players, free_roads_set, '8,5:9,6', 617, 480)
        create_road(g, players, free_roads_set, '8,7:9,6', 675, 480)
        create_road(g, players, free_roads_set, '8,7:9,8', 730, 480)
        create_road(g, players, free_roads_set, '8,9:9,8', 786, 480)

        create_road(g, players, free_roads_set, '9,2:10,2', 422, 530)
        create_road(g, players, free_roads_set, '9,4:10,4', 534, 530)
        create_road(g, players, free_roads_set, '9,6:10,6', 648, 530)
        create_road(g, players, free_roads_set, '9,8:10,8', 762, 530)

        create_road(g, players, free_roads_set, '10,2:11,3', 450, 580)
        create_road(g, players, free_roads_set, '10,4:11,3', 505, 580)
        create_road(g, players, free_roads_set, '10,4:11,5', 560, 580)
        create_road(g, players, free_roads_set, '10,6:11,5', 616, 580)
        create_road(g, players, free_roads_set, '10,6:11,7', 672, 580)
        create_road(g, players, free_roads_set, '10,8:11,7', 728, 580)


        // Drawing the interface:
        let BUTTON = null
        if (!buildmode) {
            // Build button
            if (players[game.current_turn].name === JSON.parse(sessionStorage.getItem('user')).name && !turnEnd) {
                BUTTON = NewSprite(ButtonBuild, 1100, 505, 0.1)
                BUTTON.interactive = true;
                BUTTON.buttonMode = true;
                BUTTON.on('pointerdown', () => {
                    setBuildMode(true)
                    setSelectedPoint(null)
                })
            } else {
                BUTTON = NewSprite(ButtonBuildD, 1100, 505, 0.1)
            }
            g.addChild(BUTTON)

        } else {
            // Build button cancel
            BUTTON = NewSprite(ButtonBuildCancel, 1100, 505, 0.1)
            BUTTON.interactive = true;
            BUTTON.buttonMode = true;
            BUTTON.on('pointerdown', () => {
                if (players[game.current_turn].name === JSON.parse(sessionStorage.getItem('user')).name) {
                    setBuildMode(false)
                    setSelectedPoint(null)
                    g.clear()
                }
            })
            g.addChild(BUTTON)

            // Only if player has selected a place to build
            if (selectedPoint) {
                // Cancel building selection
                BUTTON = NewSprite(ButtonCancel, 1005, 600, 0.1)
                BUTTON.interactive = true;
                BUTTON.buttonMode = true;
                BUTTON.on('pointerdown', () => {
                    setSelectedPoint(null)
                })
                g.addChild(BUTTON);

                // Confirm building selection
                BUTTON = NewSprite(ButtonConfirm, 1100, 600, 0.1)
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

    }, [buildmode, gameChanged, selectedPoint, turnEnd])

    console.log(selectedPoint)
    /*
    const draw_board2 = useCallback((g) => {
        g.clear()
        let background = new PIXI.Graphics()
        background.beginFill(0x000000)
        background.drawRect(0,0,appWidth,appHeight)
        background.endFill()
        g.addChild(background)

        game  = JSON.parse(sessionStorage.getItem('game'))
        let me    = game.players[sessionStorage.getItem('my-turn')]

        const sprites = [
            NewSprite(Biomes[game.board.biomes[0].type], appWidth/2 - cell_hor_offset, appHeight/2 - 2*cell_ver_offset),
            NewSprite(Biomes[game.board.biomes[1].type], appWidth/2, appHeight/2 - 2*cell_ver_offset),
            NewSprite(Biomes[game.board.biomes[2].type], appWidth/2 + cell_hor_offset, appHeight/2 - 2*cell_ver_offset),

            NewSprite(Biomes[game.board.biomes[3].type], appWidth/2 - 1.5*cell_hor_offset, appHeight/2 - cell_ver_offset),
            NewSprite(Biomes[game.board.biomes[4].type], appWidth/2 - 0.5*cell_hor_offset, appHeight/2 - cell_ver_offset),
            NewSprite(Biomes[game.board.biomes[5].type], appWidth/2 + 0.5*cell_hor_offset, appHeight/2 - cell_ver_offset),
            NewSprite(Biomes[game.board.biomes[6].type], appWidth/2 + 1.5*cell_hor_offset, appHeight/2 - cell_ver_offset),

            NewSprite(Biomes[game.board.biomes[7].type], appWidth/2 - 2*cell_hor_offset, appHeight/2),
            NewSprite(Biomes[game.board.biomes[8].type], appWidth/2 - cell_hor_offset, appHeight/2),
            NewSprite(Biomes[game.board.biomes[9].type], appWidth/2,appHeight/2),
            NewSprite(Biomes[game.board.biomes[10].type],appWidth/2 + cell_hor_offset, appHeight/2),
            NewSprite(Biomes[game.board.biomes[11].type],appWidth/2 + 2*cell_hor_offset, appHeight/2),

            NewSprite(Biomes[game.board.biomes[12].type],appWidth/2 - 1.5*cell_hor_offset, appHeight/2 + cell_ver_offset),
            NewSprite(Biomes[game.board.biomes[13].type],appWidth/2 - 0.5*cell_hor_offset, appHeight/2 + cell_ver_offset),
            NewSprite(Biomes[game.board.biomes[14].type],appWidth/2 + 0.5*cell_hor_offset, appHeight/2 + cell_ver_offset),
            NewSprite(Biomes[game.board.biomes[15].type],appWidth/2 + 1.5*cell_hor_offset, appHeight/2 + cell_ver_offset),

            NewSprite(Biomes[game.board.biomes[16].type],appWidth/2 - cell_hor_offset, appHeight/2 + 2*cell_ver_offset),
            NewSprite(Biomes[game.board.biomes[17].type],appWidth/2, appHeight/2 + 2*cell_ver_offset),
            NewSprite(Biomes[game.board.biomes[18].type],appWidth/2 + cell_hor_offset, appHeight/2 + 2*cell_ver_offset),
        ]

        for (let i = 0; i < sprites.length; i++) {
            g.addChild(sprites[i])
            if (game.board.biomes[i].token !== 0) {
                let token = new PIXI.Graphics();
                token.beginFill(0xe8a85a);
                token.drawCircle(sprites[i].x, sprites[i].y, 20);
                token.endFill();

                let text  = new PIXI.Text(game.board.biomes[i].token, {fontFamily: "Arial", fontSize: 16, fill: (game.board.biomes[i].token === 8) ? "red" : "white"});
                text.anchor.set(0.5);
                text.position.set(sprites[i].x, sprites[i].y);
                token.addChild(text);
    
                g.addChild(token)
            }
        }

        let start_width = 320;
        let free_nodes_set = new Set(me.free_nodes)
        for (let i = 0; i < 12; i++) {
            for (let j = borders[i][0]; j <= borders[i][1]; j+=2) {
                let node = new PIXI.Graphics(), id = `${i},${j}`, player_i = -1

                for (let k = 0; k < game.players.length; k++) {
                    let villages_set = new Set(game.players[k].villages)
                    if (villages_set.has(id)) {
                        player_i = k
                        break
                    }
                }
                if (player_i === -1) {
                    if (buildmode) {
                        if (free_nodes_set.has(id)) {
                            node.beginFill(selectedPoint && selectedPoint.id === id ? 0xffff00 : 0xffffff)
                            node.interactive = true
                            node.on("pointerdown", () => {
                                setSelectedPoint({id:id, type:'Node'})
                                console.log(selectedPoint)
                            })
                        } else {
                            node.beginFill(0xaaaaaa)
                        }
                    }
                } else {
                    node.beginFill(PlayersColors[player_i])
                }
                node.drawCircle(start_width + (j*(cell_hor_offset-4)/2), 76 + (24 * (i%2)) + (Math.floor(i/2) * cell_ver_offset), 15)
                node.endFill()

                g.addChild(node)
                //nodes.add(id)
            }
        }


        let arr_nodes = [...nodes], n = [0, arr_nodes.length-1]
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < (3+i); j++) {
                // Upper part:
                let coords = arr_nodes[n[0]].split(','), x = parseInt(coords[0]), y = parseInt(coords[1])
                // -- Road(x+1,y-1)
                g.addChild(create_road(`${coords}:${ncoor_toString({x:x+1, y:y-1})}`, 448+(113*j)-(57*i), 78+100*i, selectedPoint, setSelectedPoint))
                // -- Road(x+1,y+1)
                g.addChild(create_road(`${coords}:${ncoor_toString({x:x+1, y:y+1})}`, 505+(113*j)-(57*i), 78+100*i, selectedPoint, setSelectedPoint))
                n[0]++
                // Bottom part:
                coords = arr_nodes[n[1]].split(','); x = parseInt(coords[0]); y = parseInt(coords[1])
                // -- Road(x-1,y+1)
                g.addChild(create_road(`${ncoor_toString({x:x-1, y:y+1})}:${coords}`, 730-(112*j)+(57*i), 78+(101*(5-i)), selectedPoint, setSelectedPoint))
                // -- Road(x-1,y-1)
                g.addChild(create_road(`${ncoor_toString({x:x-1, y:y-1})}:${coords}`, 673-(112*j)+(57*i), 78+(101*(5-i)), selectedPoint, setSelectedPoint))
                n[1]--
            }
            for (let j = 0; j < (4+i); j++) {
                // Upper part:
                let coords = arr_nodes[n[0]].split(','), x = parseInt(coords[0]), y = parseInt(coords[1])
                // -- Road(x+1,y)
                g.addChild(create_road(`${coords}:${ncoor_toString({x:x+1, y:y})}`, 419+(115*j)-(58*i), 129+(100*i), selectedPoint, setSelectedPoint))
                n[0]++
                // Bottom part:
                coords = arr_nodes[n[1]].split(','); x = parseInt(coords[0]); y = parseInt(coords[1])
                // -- Road(x-1,y)
                g.addChild(create_road(`${ncoor_toString({x:x-1, y:y})}:${coords}`, 419+(115*j)-(58*i), 129+(100*(4-i)), selectedPoint, setSelectedPoint))
                n[1]--
            }
        }

    }, [buildmode, gameChanged, selectedPoint])*/


    const draw_UI2 = useCallback((g) => {
        game    = JSON.parse(sessionStorage.getItem('game'))
        let players = game.players
        let me      = game.players[sessionStorage.getItem('my-turn')]
        let user = JSON.parse(sessionStorage.getItem('user')).name; 
        let index = game.players.findIndex(player => player.name === user);
        
        // PLAYER 1:
        let PLAYER_BOX = new PIXI.Graphics();
        PLAYER_BOX.beginFill((game.current_turn === 0) ? color_1 : color_1_2)
        PLAYER_BOX.drawRoundedRect(-20, 20, 250, 50, 5)
        PLAYER_BOX.endFill()

        let PLAYER = new PIXI.Text(players[0].name, {
            fontFamily: 'Arial',
            fontSize:   20,
            fill:       0xffffff,
            align:      'center'
        })
        PLAYER.anchor.set(0.5); // Establece el anclaje en el punto medio horizontal y vertical
        PLAYER.position.set(105, 45); // Establece la posición del texto dentro del rectángulo
        PLAYER_BOX.addChild(PLAYER)
        g.addChild(PLAYER_BOX);

        // PLAYER 2:
        PLAYER_BOX = new PIXI.Graphics();
        PLAYER_BOX.beginFill((game.current_turn === 1) ? color_2 : color_2_2)
        PLAYER_BOX.drawRoundedRect(-20, 80, 250, 50, 5)
        PLAYER_BOX.endFill()

        PLAYER = new PIXI.Text(players[1].name, {
            fontFamily: 'Arial',
            fontSize:   20,
            fill:       0xffffff,
            align:      'center'
        })
        PLAYER.anchor.set(0.5); // Establece el anclaje en el punto medio horizontal y vertical
        PLAYER.position.set(105, 105); // Establece la posición del texto dentro del rectángulo
        PLAYER_BOX.addChild(PLAYER)
        g.addChild(PLAYER_BOX);
    

        // PLAYER 3:
        PLAYER_BOX = new PIXI.Graphics();
        PLAYER_BOX.beginFill((game.current_turn === 2) ? color_3 : color_3_2)
        PLAYER_BOX.drawRoundedRect(-20, 140, 250, 50, 5)
        PLAYER_BOX.endFill()

        PLAYER = new PIXI.Text(players[2].name, {
            fontFamily: 'Arial',
            fontSize:   20,
            fill:       0xffffff,
            align:      'center'
        })
        PLAYER.anchor.set(0.5); // Establece el anclaje en el punto medio horizontal y vertical
        PLAYER.position.set(105, 165); // Establece la posición del texto dentro del rectángulo
        PLAYER_BOX.addChild(PLAYER)
        g.addChild(PLAYER_BOX);

        // PLAYER 4:
        PLAYER_BOX = new PIXI.Graphics();
        PLAYER_BOX.beginFill((game.current_turn === 3) ? color_4 : color_4_2)
        PLAYER_BOX.drawRoundedRect(-20, 200, 250, 50, 5)
        PLAYER_BOX.endFill()

        PLAYER = new PIXI.Text(players[3].name, {
            fontFamily: 'Arial',
            fontSize:   20,
            fill:       0xffffff,
            align:      'center'
        })
        PLAYER.anchor.set(0.5); // Establece el anclaje en el punto medio horizontal y vertical
        PLAYER.position.set(105, 225); // Establece la posición del texto dentro del rectángulo
        PLAYER_BOX.addChild(PLAYER)
        g.addChild(PLAYER_BOX);

        // --- BUTTONS ---
        if (!buildmode) {
            // Build button
            let BUTTON = null
            console.log('turnEnd: ', turnEnd)
            if (players[game.current_turn].name === JSON.parse(sessionStorage.getItem('user')).name && !turnEnd) {
                BUTTON = NewSprite(ButtonBuild, 1100, 410, 0.1)
                BUTTON.interactive = true;
                BUTTON.buttonMode = true;
                BUTTON.on('pointerdown', () => {
                    setBuildMode(true)
                    setSelectedPoint(null)
                })
            } else {
                BUTTON = NewSprite(ButtonBuildD, 1100, 410, 0.1)
            }
            g.addChild(BUTTON);

            // Dice button
            if (players[game.current_turn].name === JSON.parse(sessionStorage.getItem('user')).name && !throwDices && game.phase === 3) {
                BUTTON = NewSprite(ButtonDices, 1100, 505, 0.1)
                BUTTON.interactive = true
                BUTTON.buttonMode  = true
                BUTTON.on('pointerdown', () => {
                    setThrowDices(true)
                    socket.emit('move', JSON.parse(sessionStorage.getItem('user')).accessToken, game.code, { id : MoveType.roll_dices })

                })
            } else {
                BUTTON = NewSprite(ButtonDicesD, 1100, 505, 0.1)
            }

            g.addChild(BUTTON);

            // Next turn button
            if (players[game.current_turn].name === JSON.parse(sessionStorage.getItem('user')).name && (game.phase !==3 && turnEnd)) {
                BUTTON = NewSprite(ButtonNextTurn, 1100, 600, 0.1)
                BUTTON.interactive = true;
                BUTTON.buttonMode = true;
                BUTTON.on('pointerdown', () => {
                    console.log('Siguiente turno: ', game.current_turn); 
                    socket.emit('move', JSON.parse(sessionStorage.getItem('user')).accessToken, game.code, { id : MoveType.next_turn })
                    setTurnEnd(false)
                    setBuiltVillage(false)
                })
            } else {
                BUTTON = NewSprite(ButtonNextTurnD, 1100, 600, 0.1)
            }
            g.addChild(BUTTON)

            let BLACK_BOX = new PIXI.Graphics();
            BLACK_BOX.beginFill(0x000000)
            BLACK_BOX.drawRect(1005 - BUTTON.width/2, 600 - BUTTON.height/2, BUTTON.width, BUTTON.height)
            BLACK_BOX.endFill()
            g.addChild(BLACK_BOX)

        } else {
            // Build button on buildmode
            let BUTTON = NewSprite(ButtonBuildCancel, 1100, 505, 0.1)
            BUTTON.interactive = true;
            BUTTON.buttonMode = true;
            BUTTON.on('pointerdown', () => {
                if (players[game.current_turn].name === JSON.parse(sessionStorage.getItem('user')).name) {
                    setBuildMode(false)
                    setSelectedPoint(null)
                }
            })
            g.addChild(BUTTON);

            let BLACK_BOX = new PIXI.Graphics();
            BLACK_BOX.beginFill(0x000000)
            BLACK_BOX.drawRect(1100 - BUTTON.width/2, 410 - BUTTON.height/2, BUTTON.width, BUTTON.height)
            BLACK_BOX.endFill()
            g.addChild(BLACK_BOX)

            BLACK_BOX = new PIXI.Graphics();
            BLACK_BOX.beginFill(0x000000)
            BLACK_BOX.drawRect(1005 - BUTTON.width/2, 600 - BUTTON.height/2, BUTTON.width, BUTTON.height)
            BLACK_BOX.endFill()
            g.addChild(BLACK_BOX)

            BLACK_BOX = new PIXI.Graphics();
            BLACK_BOX.beginFill(0x000000)
            BLACK_BOX.drawRect(1100 - BUTTON.width/2, 600 - BUTTON.height/2, BUTTON.width, BUTTON.height)
            BLACK_BOX.endFill()
            g.addChild(BLACK_BOX)

            
            if (selectedPoint && ((new Set(me.free_nodes)).has(selectedPoint.id)||(new Set(me.free_roads)).has(selectedPoint.id))) {
                BUTTON = NewSprite(ButtonCancel, 1005, 600, 0.1)
                BUTTON.interactive = true;
                BUTTON.buttonMode = true;
                BUTTON.on('pointerdown', () => {
                    setSelectedPoint(null)
                })
                g.addChild(BUTTON);

                BUTTON = NewSprite(ButtonConfirm, 1100, 600, 0.1)
                BUTTON.interactive = true;
                BUTTON.buttonMode = true;
                BUTTON.on('pointerdown', () => {
                    console.log("CONSTRUYO EN ", selectedPoint)
                    if (selectedPoint.type === 'Node') {
                        socket.emit('move', JSON.parse(sessionStorage.getItem('user')).accessToken, game.code, { id : MoveType.build_village, coords: selectedPoint.id })
                        setBuiltVillage(true)                        
                    } else if (selectedPoint.type === 'Road') {
                        socket.emit('move', JSON.parse(sessionStorage.getItem('user')).accessToken, game.code, {id : MoveType.build_road, coords: selectedPoint.id})
                        setTurnEnd(true)
                    }
                        setBuildMode(false)
                        setSelectedPoint(null)
                })
                g.addChild(BUTTON);
            }
        }

        /*
        const container = new PIXI.Container();
        const texture1 = PIXI.Texture.from(ButtonNextTurn);
        const button = new PIXI.Sprite(texture1);
        button.x = 0;
        button.y = 0;
        button.position.set(1100, 570);
        button.anchor.set(0.5);
        button.scale.set(0.1, 0.1);
        container.addChild(button);
        g.addChild(container)

        // Agrega un evento de escucha al botón
        button.interactive = true;
        button.buttonMode = true;
        button.on('pointerdown', () => 
            onButtonClick()
        );*/
        

        
        const routesCartas = ['wheat_card.svg','lumber_card.svg', 'brick_card.svg', 'stone_card.svg', 'sheep_card.svg'];
        const routesDesarrollo = [Caballero,ConstruccionCarreteras, AgnoAbundancia, Monopoly, PuntosVictoria]
        const ordenRecursos = ['Trigo', 'Madera', 'Ladrillo', 'Piedra', 'Lana'];
        const ordenCartas = ['Caballeros', 'Carreteras', 'Descubrimientos', 'Monopolios', 'Puntos'];
        const sprites = [];
        const texts = [];
        let originalTexturesShowing = true;
        
        const width = 380;
        const height = 110;
        const cornerRadius = 10;
        const gradientTexture = PIXI.Texture.from('gradient.png');
        const circleRadius = 15; // Define el radio del círculo
        const circleYOffset = 20; // Define cuánto espacio quieres entre el rectángulo y el círculo

        
        const rectangleForResources = new PIXI.Graphics();
        rectangleForResources.beginFill(0x420001);
        rectangleForResources.drawRoundedRect(30, 540, width, height, cornerRadius);
        rectangleForResources.endFill();
        
        g.addChild(rectangleForResources);
        
        const horizontalRectangles = [];
        const totalRects = 5;
        const rectSpacing = 25;
        const totalSpacing = rectSpacing * (totalRects + 1); // +1 to account for the additional spacing at start and end
        const rectWidth = (width - totalSpacing) / totalRects;
        const rectHeight = 66;
        const rectY = 555;
        
        for (let i = 0; i < totalRects; i++) {
            const rectX = 30 + rectSpacing + (i * (rectWidth + rectSpacing)); // + rectSpacing to add a space at the start
            const rectangle = new PIXI.Graphics();
            rectangle.beginFill(0x420001);
            rectangle.drawRect(rectX, rectY, rectWidth, rectHeight);
            rectangle.endFill();
            g.addChild(rectangle);
            horizontalRectangles.push(rectangle);
          
            // Cargar el SVG como textura
            const svgTexture = PIXI.Texture.from(routesCartas[i]); // Reemplaza 'ruta_al_archivo.svg' con la ruta correcta a tu archivo SVG
            
            // Crear el sprite con la textura del SVG
            const svgSprite = new PIXI.Sprite(svgTexture);
            svgSprite.width = rectWidth;
            svgSprite.height = rectHeight;
            svgSprite.position.set(rectX, rectY);
            g.addChild(svgSprite);
  
            sprites.push(svgSprite);
            
            const circleX = rectX + rectWidth / 2; // Centrar el círculo debajo del rectángulo
            const circleY = rectY + rectHeight + circleYOffset - 20; // Posicionar el círculo debajo del rectángulo
            const circle = new PIXI.Graphics();
            circle.beginFill(0xe8a85a); // Cambia este valor al color que desees para el círculo
            circle.drawCircle(circleX, circleY, circleRadius);
            circle.endFill();
            g.addChild(circle);
  
            const style = new PIXI.TextStyle({
              fontSize: 14, // Ajusta este valor al tamaño de fuente que desees
              fill: '#000000', // Cambia este valor al color que desees para el texto
              align: 'center'
          });
  
          const text = new PIXI.Text(game.players[index].resources[ordenRecursos[i]], style); // i+1 será el número que se mostrará en el círculo
            
          // Posicionar el texto en el centro del círculo
          text.x = circleX - text.width / 2;
          text.y = circleY - text.height / 2;
          g.addChild(text);
          texts.push(text);
  
          }
          
          const circleRightX = 30 + width; // Posicionar el centro del círculo en el borde derecho del rectángulo
          const circleRightY = 540 + height / 2; // Posicionar el centro del círculo en el centro vertical del rectángulo
          const circleRight = new PIXI.Graphics();
          circleRight.beginFill(0xaaaa00); // Cambia este valor al color que desees para el círculo
          circleRight.drawCircle(circleRightX, circleRightY, circleRadius);
          circleRight.endFill();
          g.addChild(circleRight);
          circleRight.interactive = true;
          circleRight.buttonMode = true;
          circleRight.on('pointerdown', function() {
              originalTexturesShowing = !originalTexturesShowing;
              // Cambiar las texturas de los sprites cuando se haga clic en el círculo
              for (let i = 0; i < sprites.length; i++) {
                  if (originalTexturesShowing) {
                      texts[i].text = game.players[index].resources[ordenRecursos[i]];
                      sprites[i].texture = PIXI.Texture.from(routesCartas[i]);
                    } else {
                      texts[i].text = game.players[index].growth_cards[ordenCartas[i]];
                      sprites[i].texture = PIXI.Texture.from(routesDesarrollo[i]);
                    } 
              }
              
          });
          
  
      }, [buildmode, selectedPoint, throwDices, game, turnEnd])

    /*
    function onButtonClick() {
        // Código que se ejecuta cuando el botón es pulsado
        game = JSON.parse(sessionStorage.getItem('game'))
        let user = JSON.parse(sessionStorage.getItem('user')).name; 
        console.log(MoveType.next_turn)
        console.log(MoveType)
        let move = {
            id : MoveType.next_turn,
            }
        if(JSON.parse(sessionStorage.getItem('players'))[game.current_turn] === user.name){
            console.log('Cambio de turno(CurrentTurn): ', game.current_turn); 
        
            socket.emit('move', JSON.parse(sessionStorage.getItem('user')).accessToken, game.code, move)
            //Cambiar turno
        }else{
            console.log('No es tu turno(CurrentTurn): ', game.current_turn);
        }
      }
      
*/
    
    const listaDados = [
        Dice1,
        Dice2,
        Dice3,
        Dice4,
        Dice5,
        Dice6
    ]

    // provisional para ver como queda
    const [dado1, setDado1] = useState(listaDados[0])
    const [dado2, setDado2] = useState(listaDados[0])

    const draw_Dice = useCallback((g) => {

        const container1 = new PIXI.Container();
        const texture1 = PIXI.Texture.from(dado1);
        const Dado1 = new PIXI.Sprite(texture1);
        Dado1.x = 0;
        Dado1.y = 0;
        container1.addChild(Dado1);
        const mask1 = new PIXI.Graphics();
        mask1.beginFill(0xffffff);
        mask1.drawRoundedRect(0, 0, 64, 64, 20);
        mask1.endFill();
        container1.mask = mask1;
        container1.addChild(mask1);
 
        // Crear el contenedor para el dado 2
        const container2 = new PIXI.Container();
        const texture2 = PIXI.Texture.from(dado2);
        const Dado2 = new PIXI.Sprite(texture2);
        Dado2.x = 0;
        Dado2.y = 0;
        container2.addChild(Dado2);
        const mask2 = new PIXI.Graphics();
        mask2.beginFill(0xffffff);
        mask2.drawRoundedRect(0, 0, 64, 64, 20);
        mask2.endFill();
        container2.mask = mask2;
        container2.addChild(mask2);
 
        // Ajusta la posición de los contenedores de los dados
        container1.x = 945;
        container1.y = 40;
        container2.x = 1010;
        container2.y = 40;
 
        // Añade los contenedores de los dados al contenedor principal
        g.addChild(container1);
        g.addChild(container2);
 
     }, [dado1,dado2])
     

    return (
        <div id="game-header">
            <Stage width={appWidth} height={appHeight}>
                <Graphics draw={draw_game} />
                <Graphics draw={draw_UI2} />
            </Stage>
        </div>
    );
}

export default Game
