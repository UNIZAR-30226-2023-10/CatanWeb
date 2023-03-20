import '../styles/Game.css'
import '../styles/Common.css'
import * as PIXI from 'pixi.js'
import React, { useEffect, useRef, useState } from "react";

function draw_hexagon(radius, x, y) {

    let width = radius * Math.sqrt(3);
    let hexagon = new PIXI.Graphics();

    //hexagon.beginFill(0xffffff);
    hexagon.lineStyle(2, 0xffffff, 1);
    hexagon.drawPolygon([
        0, -radius,
        width/2, -radius/2,
        width/2, radius/2,
        0, radius,
        -width/2, radius/2,
        -width/2, -radius/2,
    ]);
    hexagon.x = x;
    hexagon.y = y;
    return hexagon;
}


function Game() {
    /*
    return (
        <div className="Game-header | Common-Header" >
            <div className='Game-board-statics'>
                <div className='Game-board-statics-name'>
                        USUARIO1&nbsp;&nbsp;&nbsp;&nbsp;Recursos:X
                    </div>
                    <div className='Game-board-statics-name'>
                        Desarrollos:X&nbsp;Caballeros:X
                    </div>
                    <div className='Game-board-statics-name'>
                        Carreteras:X&nbsp;Puntos:X
                    </div>
                </div>  
            <div className='Game-board-row'>
            <div className='Game-board-statics'>
                <div className='Game-board-statics-name'>
                        USUARIO2&nbsp;&nbsp;&nbsp;&nbsp;Recursos:X
                    </div>
                    <div className='Game-board-statics-name'>
                        Desarrollos:X&nbsp;Caballeros:X
                    </div>
                    <div className='Game-board-statics-name'>
                        Carreteras:X&nbsp;Puntos:X
                    </div>
                </div>  
                <div className='Game-board'>
                    <div className='Game-board-row'>
                        <div className='Game-board-cell'>
                            <div className='Game-board-number'>8</div>
                        </div>
                        <div className='Game-board-cell'>
                            <div className='Game-board-number'>8</div>
                        </div>
                        <div className='Game-board-cell'>
                            <div className='Game-board-number'>8</div>
                        </div>
                    </div>
                    <div className='Game-board-row'>
                        <div className='Game-board-cell'>
                            <div className='Game-board-number'>8</div>
                        </div>
                        <div className='Game-board-cell'>
                            <div className='Game-board-number'>8</div>
                        </div>
                        <div className='Game-board-cell'>
                            <div className='Game-board-number'>8</div>
                        </div>
                        <div className='Game-board-cell'>
                            <div className='Game-board-number'>8</div>
                        </div>
                    </div>
                    <div className='Game-board-row'>
                        <div className='Game-board-cell'>
                            <div className='Game-board-number'>8</div>
                        </div>
                        <div className='Game-board-cell'>
                            <div className='Game-board-number'>8</div>
                        </div>
                        <div className='Game-board-cell'>
                            <div className='Game-board-number'>8</div>
                        </div>
                        <div className='Game-board-cell'>
                            <div className='Game-board-number'>8</div>
                        </div>
                        <div className='Game-board-cell'>
                            <div className='Game-board-number'>8</div>
                        </div>
                    </div>
                    <div className='Game-board-row'>
                        <div className='Game-board-cell'>
                            <div className='Game-board-number'>8</div>
                        </div>
                        <div className='Game-board-cell'>
                            <div className='Game-board-number'>8</div>
                        </div>
                        <div className='Game-board-cell'>
                            <div className='Game-board-number'>8</div>
                        </div>
                        <div className='Game-board-cell'>
                            <div className='Game-board-number'>8</div>
                        </div>
                    </div>
                    <div className='Game-board-row'>
                        <div className='Game-board-cell'>
                            <div className='Game-board-number'>8</div>
                        </div>
                        <div className='Game-board-cell'>
                            <div className='Game-board-number'>8</div>
                        </div>
                        <div className='Game-board-cell'>
                            <div className='Game-board-number'>8</div>
                        </div>
                    </div>
                    
                </div>
                <div className='Game-board-statics'>
                <div className='Game-board-statics-name'>
                        USUARIO3&nbsp;&nbsp;&nbsp;&nbsp;Recursos:X
                    </div>
                    <div className='Game-board-statics-name'>
                        Desarrollos:X&nbsp;Caballeros:X
                    </div>
                    <div className='Game-board-statics-name'>
                        Carreteras:X&nbsp;Puntos:X
                    </div>
                </div>  
                
            </div>
            <div className='Game-board-rec'>
                <div className='Game-board-resources'>
                X
                    <div className='Game-board-resources-name'>Madera</div>
                </div>
                <div className='Game-board-resources'>
                X
                    <div className='Game-board-resources-name'>Trigo</div>
                </div>
                <div className='Game-board-resources'>
                X
                    <div className='Game-board-resources-name'>Barro</div>
                </div>
                <div className='Game-board-resources'>
                    X
                    <div className='Game-board-resources-name'>Oveja</div>
                </div>
                <div className='Game-board-resources'>
                X
                    <div className='Game-board-resources-name'>Piedra</div>
                </div> 
                <div className='Game-board-statics'>
                <div className='Game-board-statics-name'>
                        USUARIO2&nbsp;&nbsp;&nbsp;&nbsp;Recursos:X
                    </div>
                    <div className='Game-board-statics-name'>
                        Desarrollos:X&nbsp;Caballeros:X
                    </div>
                    <div className='Game-board-statics-name'>
                        Carreteras:X&nbsp;Puntos:X
                    </div>
                </div>     
            </div>
            <div className='Game-board-rec'>

                

                

                

                

                
  
            </div>


        </div>
        
    )
    */

    const [squares, setSquares] = useState([
        { id: "1", selected: false },
        { id: "2", selected: false },
        { id: "3", selected: false },
        { id: "4", selected: false },
    ]);
  // Función que se ejecuta cuando se hace clic en una casilla
  function handleClick(squareId) {
    // Creamos una copia del array de casillas
    const newSquares = [...squares];
    // Buscamos la casilla correspondiente y actualizamos su estado a "true"
    for (let square of newSquares) {
        if (square.id === squareId) {
            square.selected = true
        } else {
            square.selected = false
        }
    }
    // Actualizamos el estado del tablero con las casillas actualizadas
    setSquares(newSquares);
  }

  const renderSquare = square => (
    <div
      key={square.id}
      className={`Game-board-cell${square.selected ? " Game-board-cell-selected" : ""}`}
      onClick={() => handleClick(square.id)}
    />
  );

    const appWidth = 1200, appHeight = 675, resolution = window.devicePixelRatio || 1
    //app.renderer.autoDensity = true
    

    const gameContainer = useRef(null);
    useEffect(() => {
        const app = new PIXI.Application({
            width: appWidth,
            height: appHeight,
            backgroundColor: 0x9e8668, // opcional, cambia el color de fondo
            //resolution: resolution
        });
        //app.renderer.resize(appWidth * resolution, appHeight * resolution)
        gameContainer.current.appendChild(app.view)

        // Agrega el hexágono a la aplicación
        app.stage.addChild(draw_hexagon(60, app.screen.width/2 - 120, app.screen.height/2 - 210));
        app.stage.addChild(draw_hexagon(60, app.screen.width/2      , app.screen.height/2 - 210));
        app.stage.addChild(draw_hexagon(60, app.screen.width/2 + 120, app.screen.height/2 - 210));

        app.stage.addChild(draw_hexagon(60, app.screen.width/2 - 60 , app.screen.height/2 - 105));
        app.stage.addChild(draw_hexagon(60, app.screen.width/2 + 60 , app.screen.height/2 - 105));
        app.stage.addChild(draw_hexagon(60, app.screen.width/2 - 180, app.screen.height/2 - 105));
        app.stage.addChild(draw_hexagon(60, app.screen.width/2 + 180, app.screen.height/2 - 105));

        app.stage.addChild(draw_hexagon(60, app.screen.width/2      , app.screen.height/2));
        app.stage.addChild(draw_hexagon(60, app.screen.width/2 - 120, app.screen.height/2));
        app.stage.addChild(draw_hexagon(60, app.screen.width/2 + 120, app.screen.height/2));
        app.stage.addChild(draw_hexagon(60, app.screen.width/2 - 240, app.screen.height/2));
        app.stage.addChild(draw_hexagon(60, app.screen.width/2 + 240, app.screen.height/2));

        app.stage.addChild(draw_hexagon(60, app.screen.width/2 - 60 , app.screen.height/2 + 105));
        app.stage.addChild(draw_hexagon(60, app.screen.width/2 + 60 , app.screen.height/2 + 105));
        app.stage.addChild(draw_hexagon(60, app.screen.width/2 - 180, app.screen.height/2 + 105));
        app.stage.addChild(draw_hexagon(60, app.screen.width/2 + 180, app.screen.height/2 + 105));

        app.stage.addChild(draw_hexagon(60, app.screen.width/2 - 120, app.screen.height/2 + 210));
        app.stage.addChild(draw_hexagon(60, app.screen.width/2      , app.screen.height/2 + 210));
        app.stage.addChild(draw_hexagon(60, app.screen.width/2 + 120, app.screen.height/2 + 210));
        return () => {
            // Destruye aquí los elementos de Pixi.js al desmontar el componente
            app.destroy(true);
          };
    }, []);


    return (
        <div className="Game-header | Common-Header" ref={gameContainer}></div>
    )
}

export default Game