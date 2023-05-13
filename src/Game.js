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

// Buttons
import ButtonBuild from './images/button_build.png'
import nextTurn from './images/next_boton.png'
import './styles/boton.css'
import { SocketContext } from './App';

const MoveType = require( './services/movesTypes.js')
/*
function random(min, max) {
    return Math.floor(Math.random() * max) + min;
}
*/

const Biomes_sprites = {
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

function Game() {
    //const socket = useContext(SocketContext);
    //console.log(socket)
    let socket = useContext(SocketContext);

    console.log("PARTIDA: ", JSON.parse(sessionStorage.getItem('game')));
    //socket.on('notify', (data) => {
    //    console.log(data)
    //})


    const appWidth = 1200, appHeight = 675
    const cell_hor_offset = 115, cell_ver_offset = 100;

    const [buildmode, setBuildMode] = useState(null)
    const [selected_point, set_selected_point] = useState(null);

    const nodes = useMemo(() => new Set(), []);
    const draw_board = useCallback((g) => {
        let game  = JSON.parse(sessionStorage.getItem('game'))
        let me    = null
        for (let i of game.players) {
            if (i.name === JSON.parse(sessionStorage.getItem('user')).name) {
                me = i
                break
            }
        }
        console.log(me) 

        const sprites = [
            NewSprite(Biomes_sprites[game.board.biomes[0].type], appWidth/2 - cell_hor_offset, appHeight/2 - 2*cell_ver_offset),
            NewSprite(Biomes_sprites[game.board.biomes[1].type], appWidth/2, appHeight/2 - 2*cell_ver_offset),
            NewSprite(Biomes_sprites[game.board.biomes[2].type], appWidth/2 + cell_hor_offset, appHeight/2 - 2*cell_ver_offset),

            NewSprite(Biomes_sprites[game.board.biomes[11].type], appWidth/2 - 1.5*cell_hor_offset, appHeight/2 - cell_ver_offset),
            NewSprite(Biomes_sprites[game.board.biomes[12].type], appWidth/2 - 0.5*cell_hor_offset, appHeight/2 - cell_ver_offset),
            NewSprite(Biomes_sprites[game.board.biomes[13].type], appWidth/2 + 0.5*cell_hor_offset, appHeight/2 - cell_ver_offset),
            NewSprite(Biomes_sprites[game.board.biomes[3].type], appWidth/2 + 1.5*cell_hor_offset, appHeight/2 - cell_ver_offset),

            NewSprite(Biomes_sprites[game.board.biomes[10].type], appWidth/2 - 2*cell_hor_offset, appHeight/2),
            NewSprite(Biomes_sprites[game.board.biomes[17].type], appWidth/2 - cell_hor_offset, appHeight/2),
            NewSprite(Biomes_sprites[game.board.biomes[18].type], appWidth/2,appHeight/2),
            NewSprite(Biomes_sprites[game.board.biomes[14].type],appWidth/2 + cell_hor_offset, appHeight/2),
            NewSprite(Biomes_sprites[game.board.biomes[4].type],appWidth/2 + 2*cell_hor_offset, appHeight/2),

            NewSprite(Biomes_sprites[game.board.biomes[9].type],appWidth/2 - 1.5*cell_hor_offset, appHeight/2 + cell_ver_offset),
            NewSprite(Biomes_sprites[game.board.biomes[16].type],appWidth/2 - 0.5*cell_hor_offset, appHeight/2 + cell_ver_offset),
            NewSprite(Biomes_sprites[game.board.biomes[15].type],appWidth/2 + 0.5*cell_hor_offset, appHeight/2 + cell_ver_offset),
            NewSprite(Biomes_sprites[game.board.biomes[5].type],appWidth/2 + 1.5*cell_hor_offset, appHeight/2 + cell_ver_offset),

            NewSprite(Biomes_sprites[game.board.biomes[8].type],appWidth/2 - cell_hor_offset, appHeight/2 + 2*cell_ver_offset),
            NewSprite(Biomes_sprites[game.board.biomes[7].type],appWidth/2, appHeight/2 + 2*cell_ver_offset),
            NewSprite(Biomes_sprites[game.board.biomes[6].type],appWidth/2 + cell_hor_offset, appHeight/2 + 2*cell_ver_offset),
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
                let node = new PIXI.Graphics(), id = `${i},${j}`
                node.id = id
                if (!buildmode) {
                    node.beginFill(0xaaaaaa)
                } else {
                    node.beginFill(selected_point && selected_point.id === id ? 0xffff00 : 0xffffff)
                } 
                node.drawCircle(start_width + (j*(cell_hor_offset-4)/2), 76 + (24 * (i%2)) + (Math.floor(i/2) * cell_ver_offset), 15)
                node.endFill()
                if (buildmode && free_nodes_set.has(id)) {
                    node.interactive = true
                    node.on("pointertap", () => set_selected_point({id:id, type:'Node'}))
                }
                g.addChild(node)
                nodes.add(id)
            }
        }

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

    }, [buildmode, selected_point])

    const draw_UI = useCallback((g) => {
        let game    = JSON.parse(sessionStorage.getItem('game'))
        let players = game.players
        
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
        // Build button
        let BUTTON = NewSprite(ButtonBuild, 1100, 505, 0.1)
        BUTTON.interactive = true;
        BUTTON.buttonMode = true;
        BUTTON.on('pointerdown', () => {
            if (players[game.current_turn].name === JSON.parse(sessionStorage.getItem('user')).name) {
                setBuildMode(prevStatus => {
                    console.log("BUILD MODE: ", !prevStatus)
                    return !prevStatus
                })
            } else {
                console.log("CURRENT TURN: ", players[game.current_turn].name, "ME: ", JSON.parse(sessionStorage.getItem('user')).name)
            }

        })
        g.addChild(BUTTON);

        // Next turn button
        BUTTON = NewSprite(nextTurn, 1100, 600, 0.1)
        BUTTON.interactive = true;
        BUTTON.buttonMode = true;
        BUTTON.on('pointerdown', () => {
            if (players[game.current_turn].name === JSON.parse(sessionStorage.getItem('user')).name) {
                console.log('Siguiente turno: ', game.current_turn); 
                socket.emit('move', JSON.parse(sessionStorage.getItem('user')).accessToken, game.code, { id : MoveType.next_turn })
            } else {
                console.log("CURRENT TURN: ", players[game.current_turn].name, "ME: ", JSON.parse(sessionStorage.getItem('user')).name)
            }
        })
        g.addChild(BUTTON)


        /*
        const container = new PIXI.Container();
        const texture1 = PIXI.Texture.from(nextTurn);
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
        );
        */
          

    }, [])

    /*
    function onButtonClick() {
        // Código que se ejecuta cuando el botón es pulsado
        game = JSON.parse(sessionStorage.getItem('game'))
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
                <Graphics draw={draw_board} />
                <Graphics draw={draw_UI} />
            </Stage>
        </div>
    );
}

export default Game
