import * as PIXI from 'pixi.js'
import Ocean from './images/ocean.png'
import Desert from './images/desert.png'
import Farmland from './images/farmland.png'
import Forest from './images/forest.png'
import Hill from './images/hill.png'
import Mountain from './images/mountain.png'
import Pasture from './images/pasture.png'
import './styles/boton.css'
import { Texture } from 'pixi.js';
import Dice1 from './images/Dice01.png'
import Dice2 from './images/Dice02.png'
import Dice3 from './images/Dice03.png'
import Dice4 from './images/Dice04.png'
import Dice5 from './images/Dice05.png'
import Dice6 from './images/Dice06.png'
import nextTurn from './images/next_boton.png'
import io from 'socket.io-client';
import './styles/boton.css'
import { Stage, Graphics, Sprite, Text } from '@pixi/react';
import React, { useCallback, useMemo, useState, useContext } from "react";
import { SocketContext } from './App';
import { Button } from 'react-bootstrap'; // o '@material-ui/core'
const MoveType = require( './services/movesTypes.js')
/*
function random(min, max) {
    return Math.floor(Math.random() * max) + min;
}
*/


function ncoor_toString(coords) {
    return coords.x.toString() + "," + coords.y.toString()
}


const borders = [[3,7],[2,8],[2,8],[1,9],[1,9],[0,10],[0,10],[1,9],[1,9],[2,8],[2,8],[3,7]];
const color_1 = 0xd60000
const color_2 = 0x06b300
const color_3 = 0x005bb5
const color_4 = 0xd4b700

const color_1_2 = 0x7a010b
const color_2_2 = 0x154f03
const color_3_2 = 0x080152
const color_4_2 = 0x595904

let socket = io('http://localhost:8080/')


function Game() {

    const [carreteras, setCarreteras] = useState(new Map());

    function create_road(id, x, y, selected_point, set_selected_point) {
        let road = new PIXI.Graphics()
        console.log(id);
        road.id  = id
        road.beginFill(selected_point && selected_point.id === road.id ? 0x0b04cf : 0x6f5c9c)
        road.drawRoundedRect(x, y, 17, 17, 5)
        road.endFill()
        road.coordenadaX = x;
        road.coordenadaY = y;
        road.interactive = true
        road.on("pointertap", () => {set_selected_point({id:id, type:'Road'})})
        setCarreteras(prevCarreteras => new Map(prevCarreteras.set(id, road)));
        return road
    }

    const socket = useContext(SocketContext);
    console.log(socket)
    let game = JSON.parse(sessionStorage.getItem('game'))

    socket.on('update', (gameUpdate) => {
        sessionStorage.setItem('game', JSON.stringify(gameUpdate))
        game = JSON.parse(sessionStorage.getItem('game'))
        //console.log(game.board.biomes[0])
    })

    socket.on('notify', (data) => {
        console.log(data)
    })

    game = JSON.parse(sessionStorage.getItem('game'))

        

    const user = JSON.parse(sessionStorage.getItem('user'))

    const appWidth = 1200, appHeight = 675
    const cell_hor_offset = 115, cell_ver_offset = 100;
    const [nodes, setNodes] = useState(new Map());

    const [selected_point, set_selected_point] = useState(null);
    
    const crearPoblado = (id) => {
        const nodo = nodes.get(id);
        if (nodo) {
            nodo.beginFill(0x000000); // Cambiar el color de relleno a negro
            nodo.drawCircle(nodo.coordX, nodo.coordY, 15); // Asumiendo que `x` y `y` son las coordenadas del círculo
            nodo.endFill();
        }
    };
    
    const crearPobladoAleatorio = () => {
        const nodeArray = Array.from(nodes.values()); // Convertir los valores de nodes a una matriz
        const nodeAleatorio = nodeArray[Math.floor(Math.random() * nodeArray.length)]; // Obtener un elemento aleatorio de la matriz
    
        if (nodeAleatorio) {
            crearPoblado(nodeAleatorio.id); // Pasar el id del nodo en lugar del nodo en sí
        }
        console.log(carreteras);
    };
    





    const draw_nodes = useCallback((g) => {
        let start_width = 320;
        for (let i = 0; i < 12; i++) {
            for (let j = borders[i][0]; j <= borders[i][1]; j+=2) {
                let node = new PIXI.Graphics(), id = `${i},${j}`
                node.id = id
                node.beginFill(selected_point && selected_point.id === id ? 0xffff00 : 0xffffff)
                node.drawCircle(start_width + (j*(cell_hor_offset-4)/2), 76 + (24 * (i%2)) + (Math.floor(i/2) * cell_ver_offset), 15)
                node.coordX = start_width + (j*(cell_hor_offset-4)/2);  // Guardar la coordenada X
                node.coordY = 76 + (24 * (i%2)) + (Math.floor(i/2) * cell_ver_offset);  // Guardar la coordenada Y
                node.endFill()
                node.interactive = true
                node.on("pointertap", () => set_selected_point({id:id, type:'Node'}))
                g.addChild(node)
                setNodes(nodes.set(id, node));
            }
        }
        console.log(nodes);
    }, [selected_point, nodes]);


    const draw_resources = useCallback((g) => {
            
            const routes = ['sheep_card.svg', 'brick_card.svg', 'wheat_card.svg', 'stone_card.svg', 'lumber_card.svg']
            const width = 300;
            const height = 100;
            const cornerRadius = 10;
            const gradientTexture = PIXI.Texture.from('gradient.png');
        
            const rectangleForResources = new PIXI.Graphics();
            rectangleForResources.beginTextureFill({ texture: gradientTexture });
            rectangleForResources.drawRoundedRect(30, 540, width, height, cornerRadius);
            rectangleForResources.endFill();
        
            g.addChild(rectangleForResources);
        
            const horizontalRectangles = [];
            const rectSpacing = 23;
            const rectWidth = (width - (rectSpacing * 4)) / 5;
            const rectHeight = 60;
            const rectY = 560;
        
            for (let i = 0; i < 5; i++) {
              const rectX = 30 + (i * (rectWidth + rectSpacing));
              const rectangle = new PIXI.Graphics();
              rectangle.beginFill(0xffffff);
              rectangle.drawCircle(rectX, rectY, rectWidth, rectHeight);
              rectangle.endFill();
              g.addChild(rectangle);
              horizontalRectangles.push(rectangle);
        
              // Cargar el SVG como textura
              const svgTexture = PIXI.Texture.from(routes[i]); // Reemplaza 'ruta_al_archivo.svg' con la ruta correcta a tu archivo SVG
              
              // Crear el sprite con la textura del SVG
              const svgSprite = new PIXI.Sprite(svgTexture);
              svgSprite.width = rectWidth;
              svgSprite.height = rectHeight;
              svgSprite.position.set(rectX, rectY);
              g.addChild(svgSprite);
            }

    }, []);



    

    
    
    const buttonTexture = PIXI.Texture.from('./images/next_boton.png');
    

      const draw_roads = useCallback((g) => {
        let arr_nodes = Array.from(nodes.keys()), n = [0, arr_nodes.length-1];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < (3+i); j++) {
                // Upper part:
                let coords = arr_nodes[n[0]].split(','), x = parseInt(coords[0]), y = parseInt(coords[1]);
                // -- Road(x+1,y-1)
                g.addChild(create_road(`${coords}:${ncoor_toString({x:x+1, y:y-1})}`, 448+(113*j)-(57*i), 78+100*i, selected_point, set_selected_point));
                // -- Road(x+1,y+1)
                g.addChild(create_road(`${coords}:${ncoor_toString({x:x+1, y:y+1})}`, 505+(113*j)-(57*i), 78+100*i, selected_point, set_selected_point));
                n[0]++;
                // Bottom part:
                coords = arr_nodes[n[1]].split(','); x = parseInt(coords[0]); y = parseInt(coords[1]);
                // -- Road(x-1,y+1)
                g.addChild(create_road(`${ncoor_toString({x:x-1, y:y+1})}:${coords}`, 730-(112*j)+(57*i), 78+(101*(5-i)), selected_point, set_selected_point));
                // -- Road(x-1,y-1)
                g.addChild(create_road(`${ncoor_toString({x:x-1, y:y-1})}:${coords}`, 673-(112*j)+(57*i), 78+(101*(5-i)), selected_point, set_selected_point));
                n[1]--;
            }
            for (let j = 0; j < (4+i); j++) {
                // Upper part:
                let coords = arr_nodes[n[0]].split(','), x = parseInt(coords[0]), y = parseInt(coords[1]);
                // -- Road(x+1,y)
                g.addChild(create_road(`${coords}:${ncoor_toString({x:x+1, y:y})}`, 419+(115*j)-(58*i), 129+(100*i), selected_point, set_selected_point));
                n[0]++;
                // Bottom part:
                coords = arr_nodes[n[1]].split(','); x = parseInt(coords[0]); y = parseInt(coords[1]);
                // -- Road(x-1,y)
                g.addChild(create_road(`${ncoor_toString({x:x-1, y:y})}:${coords}`, 419+(115*j)-(58*i), 129+(100*(4-i)), selected_point, set_selected_point));
                n[1]--;
            }
        }
    }, [selected_point, nodes]);

    const cambiarCarreteraAleatoria = () => {
        const carreterasArray = Array.from(carreteras.values()); // Convertir los valores de carreteras a una matriz
        const carreteraAleatoria = carreterasArray[Math.floor(Math.random() * carreterasArray.length)]; // Obtener un elemento aleatorio de la matriz
    
        if (carreteraAleatoria) {
            carreteraAleatoria.beginFill(0x000000); // Cambiar el color de relleno a negro
            carreteraAleatoria.drawRoundedRect(carreteraAleatoria.coordenadaX, carreteraAleatoria.coordenadaY, 17, 17, 5);
            carreteraAleatoria.endFill();
        }
    };
    
    

    const draw_UI = useCallback((g) => {
        const players = JSON.parse(sessionStorage.getItem('players'))
        console.log(players);
        let user_rectangle = new PIXI.Graphics()
        let next_turn = new PIXI.Graphics()
        const game = JSON.parse(sessionStorage.getItem('game'))

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
        console.log(game.current_turn)
        if(game.current_turn === 0){
            user_rectangle.beginFill(color_1)
        }else{
            user_rectangle.beginFill(color_1_2)
        }
        user_rectangle.drawRoundedRect(-20, 20, 250, 50, 5)
        user_rectangle.addChild(user1)
        user_rectangle.endFill()
        g.addChild(user_rectangle)
        let user_rectangle2 = new PIXI.Graphics()
        if(game.current_turn === 1){
            user_rectangle2.beginFill(color_2)
        }else{
            user_rectangle2.beginFill(color_2_2)
        }
        user_rectangle2.drawRoundedRect(-20, 80, 250, 50, 5)
        user_rectangle2.addChild(user2)
        user_rectangle2.endFill()
        g.addChild(user_rectangle2)
        let user_rectangle3 = new PIXI.Graphics()
        if(game.current_turn === 2){
            user_rectangle3.beginFill(color_3)
        }else{
            user_rectangle3.beginFill(color_3_2)
        }
        user_rectangle3.drawRoundedRect(-20, 140, 250, 50, 5)
        user_rectangle3.addChild(user3)
        user_rectangle3.endFill()
        g.addChild(user_rectangle3)
        let user_rectangle4 = new PIXI.Graphics()
        if(game.current_turn === 3){
            user_rectangle4.beginFill(color_4)
        }else{
            user_rectangle4.beginFill(color_4_2)
        }
        user_rectangle4.drawRoundedRect(-20, 200, 250, 50, 5)
        user_rectangle4.addChild(user4)
        user_rectangle4.endFill()
        g.addChild(user_rectangle4)

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
        button.on('pointerdown', () => onButtonClick(game));  
          

    }, [])
    function onButtonClick(game) {
        // Código que se ejecuta cuando el botón es pulsado
        console.log(MoveType.next_turn)
        console.log(MoveType)
        let move = {
            id : MoveType.next_turn,
            }
        if(JSON.parse(sessionStorage.getItem('players'))[game.current_turn] === user.name){
            console.log('Cambio de turno'); 
            

            socket.emit('move', JSON.parse(sessionStorage.getItem('user')).accessToken, game.code, move)
            //Cambiar turno
        }else{
            console.log('No es tu turno');
        }
      }


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
    const [dado2, setDado2 ] = useState(listaDados[0])

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

    function biome(id){
        if(game!==null){
            console.log(game.board.biomes[id])
            if(game.board.biomes[id].type === 'Farmland'){
                return Farmland
            }else if (game.board.biomes[id].type === 'Forest'){
                return Forest
            }else if (game.board.biomes[id].type === 'Hill'){
                return Hill
            }else if (game.board.biomes[id].type === 'Mountain'){
                return Mountain
            }else if (game.board.biomes[id].type === 'Pasture'){
                return Pasture
            }else {
                return Desert
            }
        }else{
            return Desert
        }
    }

    console.log(game.players);

/*
<Text 
text={`${Math.floor(Math.random() * 11) + 2}`} // Genera un número aleatorio del 2 al 12
x={appWidth/2 - 1.5*cell_hor_offset}
y={appHeight/2 - 3*cell_ver_offset}
anchor={{ x: 0.5, y: 0.5 }} // Centra el texto
style={{ fill: 'black' }} // Establece el color del texto a blanco
/> 
*/
    return (
        <div id="game-header">
            <Stage width={appWidth} height={appHeight}>
            <Sprite image={Ocean} x={appWidth/2 - 1.5*cell_hor_offset} y={appHeight/2 - 3*cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />

                <Sprite image={Ocean}   x={appWidth/2 - 0.5*cell_hor_offset} y={appHeight/2 - 3*cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Ocean}   x={appWidth/2 + 0.5*cell_hor_offset} y={appHeight/2 - 3*cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Ocean}   x={appWidth/2 + 1.5*cell_hor_offset} y={appHeight/2 - 3*cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                
                <Sprite image={Ocean}   x={appWidth/2 - 2*cell_hor_offset} y={appHeight/2 - 2*cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={biome(0)}    x={appWidth/2 - cell_hor_offset} y={appHeight/2 - 2*cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={biome(1)}  x={appWidth/2} y={appHeight/2 - 2*cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={biome(2)}    x={appWidth/2 + cell_hor_offset} y={appHeight/2 - 2*cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Ocean}   x={appWidth/2 + 2*cell_hor_offset} y={appHeight/2 - 2*cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />

                <Sprite image={Ocean}   x={appWidth/2 - 2.5*cell_hor_offset} y={appHeight/2 - cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={biome(3)}  x={appWidth/2 - 1.5*cell_hor_offset} y={appHeight/2 - cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={biome(4)} x={appWidth/2 - 0.5*cell_hor_offset} y={appHeight/2 - cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={biome(5)}  x={appWidth/2 + 0.5*cell_hor_offset} y={appHeight/2 - cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={biome(6)} x={appWidth/2 + 1.5*cell_hor_offset} y={appHeight/2 - cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Ocean}   x={appWidth/2 + 2.5*cell_hor_offset} y={appHeight/2 - cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                
                <Sprite image={Ocean}   x={appWidth/2 - 3*cell_hor_offset} y={appHeight/2} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={biome(7)}    x={appWidth/2 - 2*cell_hor_offset} y={appHeight/2} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={biome(8)}    x={appWidth/2 - cell_hor_offset} y={appHeight/2} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={biome(9)}  x={appWidth/2} y={appHeight/2} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={biome(10)} x={appWidth/2 + cell_hor_offset} y={appHeight/2} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={biome(11)} x={appWidth/2 + 2*cell_hor_offset} y={appHeight/2} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Ocean} x={appWidth/2 + 3*cell_hor_offset} y={appHeight/2} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                
                <Sprite image={Ocean} x={appWidth/2 - 2.5*cell_hor_offset} y={appHeight/2 + cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={biome(12)} x={appWidth/2 - 1.5*cell_hor_offset} y={appHeight/2 + cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={biome(13)} x={appWidth/2 - 0.5*cell_hor_offset} y={appHeight/2 + cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={biome(14)} x={appWidth/2 + 0.5*cell_hor_offset} y={appHeight/2 + cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={biome(15)} x={appWidth/2 + 1.5*cell_hor_offset} y={appHeight/2 + cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Ocean} x={appWidth/2 + 2.5*cell_hor_offset} y={appHeight/2 + cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                
                <Sprite image={Ocean} x={appWidth/2 - 2*cell_hor_offset} y={appHeight/2 + 2*cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={biome(16)} x={appWidth/2 - cell_hor_offset} y={appHeight/2 + 2*cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={biome(17)} x={appWidth/2} y={appHeight/2 + 2*cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={biome(18)} x={appWidth/2 + cell_hor_offset} y={appHeight/2 + 2*cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Ocean} x={appWidth/2 + 2*cell_hor_offset} y={appHeight/2 + 2*cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                
                <Sprite image={Ocean} x={appWidth/2 - 1.5*cell_hor_offset} y={appHeight/2 + 3*cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Ocean} x={appWidth/2 - 0.5*cell_hor_offset} y={appHeight/2 + 3*cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Ocean} x={appWidth/2 + 0.5*cell_hor_offset} y={appHeight/2 + 3*cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                <Sprite image={Ocean} x={appWidth/2 + 1.5*cell_hor_offset} y={appHeight/2 + 3*cell_ver_offset} scale={0.5} anchor={{ x: 0.5, y: 0.5 }} />
                
                <Graphics draw={draw_Dice} />
                <Graphics draw={draw_nodes} />
                <Graphics draw={draw_roads} />
                <Graphics draw={draw_UI} />
                <Graphics draw={draw_resources} />
                
                               
            </Stage>
           
        </div>
    );
}
//<Graphics draw={(g) => draw_poblado(g, "3,5")} />
export default Game

//<Button onClick={crearPobladoAleatorio}>Crear Poblado</Button>
//<Button onClick={cambiarCarreteraAleatoria}>Cambiar Carretera</Button>