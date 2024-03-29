// React
import React, { useCallback, useContext, useEffect, useState } from "react"
import io from 'socket.io-client';
import * as PIXI from 'pixi.js'
import { SocketContext } from './App'

import Background from './images/game-bg2.png'
import Victory from './images/victory.png'
import Defeat from './images/defeat.png'

// Board
import Dice0 from './images/Dice00.png'
import Dice1 from './images/Dice01.png'
import Dice2 from './images/Dice02.png'
import Dice3 from './images/Dice03.png'
import Dice4 from './images/Dice04.png'
import Dice5 from './images/Dice05.png'
import Dice6 from './images/Dice06.png'

import VillageSprite from './images/pieces/Village.png'
import VillageSSprite from './images/pieces/VillageSelected.png'
import RedVillageSprite from './images/pieces/RedVillage.png'
import RedVillageUSprite from './images/pieces/RedVillageUpgradable.png'
import GreenVillageSprite from './images/pieces/GreenVillage.png'
import GreenVillageUSprite from './images/pieces/GreenVillageUpgradable.png'
import BlueVillageSprite from './images/pieces/BlueVillage.png'
import BlueVillageUSprite from './images/pieces/BlueVillageUpgradable.png'
import YellowVillageSprite from './images/pieces/YellowVillage.png'
import YellowVillageUSprite from './images/pieces/YellowVillageUpgradable.png'

import RedCitySprite from './images/pieces/RedCity.png'
import GreenCitySprite from './images/pieces/GreenCity.png'
import BlueCitySprite from './images/pieces/BlueCity.png'
import YellowCitySprite from './images/pieces/YellowCity.png'

import VerRoad from './images/pieces/VerRoad.png'
import VerRoadS from './images/pieces/VerRoadSelected.png'
import RightDiagRoad from './images/pieces/RightDiagRoad.png'
import RightDiagRoadS from './images/pieces/RightDiagRoadSelected.png'
import LeftDiagRoad from './images/pieces/LeftDiagRoad.png'
import LeftDiagRoadS from './images/pieces/LeftDiagRoadSelected.png'

import RedVerRoad from './images/pieces/RedVerRoad.png'
import RedRightDiagRoad from './images/pieces/RedRightDiagRoad.png'
import RedLeftDiagRoad from './images/pieces/RedLeftDiagRoad.png'

import GreenVerRoad from './images/pieces/GreenVerRoad.png'
import GreenRightDiagRoad from './images/pieces/GreenRightDiagRoad.png'
import GreenLeftDiagRoad from './images/pieces/GreenLeftDiagRoad.png'

import BlueVerRoad from './images/pieces/BlueVerRoad.png'
import BlueRightDiagRoad from './images/pieces/BlueRightDiagRoad.png'
import BlueLeftDiagRoad from './images/pieces/BlueLeftDiagRoad.png'

import YellowVerRoad from './images/pieces/YellowVerRoad.png'
import YellowRightDiagRoad from './images/pieces/YellowRightDiagRoad.png'
import YellowLeftDiagRoad from './images/pieces/YellowLeftDiagRoad.png'

import RedVillage from './images/pieces/red_village.png'
import GreenVillage from './images/pieces/green_village.png'
import BlueVillage from './images/pieces/blue_village.png'
import YellowVillage from './images/pieces/yellow_village.png'

import RedCity from './images/pieces/red_city.png'
import GreenCity from './images/pieces/green_city.png'
import BlueCity from './images/pieces/blue_city.png'
import YellowCity from './images/pieces/yellow_city.png'

import RedRoad from './images/pieces/red_road.png'
import GreenRoad from './images/pieces/green_road.png'
import BlueRoad from './images/pieces/blue_road.png'
import YellowRoad from './images/pieces/yellow_road.png'

import { Stage, Graphics } from '@pixi/react'
import Ocean from './images/Ocean.png'
import Desert   from './images/desert.png'
import Farmland from './images/field.png'
import Forest   from './images/forest.png'
import Hill     from './images/hill.png'
import Mountain from './images/mountain.png'
import Harbor    from './images/harbor.png'
import Pasture  from './images/pasture.png'
import CardBackground from './images/card_background.png'

import TheRobber  from './images/the_robber.png'
import KnightIcon from './images/knight.png'
import RoadsIcon from './images/roads_icon.png'

import Frame_2 from './images/frame-2.png'
import Frame_3 from './images/frame-3.png'
import Frame_4 from './images/frame-4.png'
import Frame_5 from './images/frame-5.png'
import Frame_6 from './images/frame-6.png'

// Tokens
import A from './images/tokens/A5.png'
import B from './images/tokens/B2.png'
import C from './images/tokens/C6.png'
import D from './images/tokens/D3.png'
import E from './images/tokens/E8.png'
import F from './images/tokens/F10.png'
import G from './images/tokens/G9.png'
import H from './images/tokens/H12.png'
import I from './images/tokens/I11.png'
import J from './images/tokens/J4.png'
import K from './images/tokens/K8.png'
import L from './images/tokens/L10.png'
import M from './images/tokens/M9.png'
import N from './images/tokens/N4.png'
import O from './images/tokens/O5.png'
import P from './images/tokens/P6.png'
import Q from './images/tokens/Q3.png'
import R from './images/tokens/R11.png'

// Resources
import Wheat from './images/resources_wheat.png'
import WheatD from './images/resources_wheat_d.png'
import Lumber from './images/resources_lumber.png'
import LumberD from './images/resources_lumber_d.png'
import Brick from './images/resources_brick.png'
import BrickD from './images/resources_brick_d.png'
import Stone from './images/resources_ore.png'
import StoneD from './images/resources_ore_d.png'
import Wool from './images/resources_wool.png'
import WoolD from './images/resources_wool_d.png'

// Develop cards
import Knight        from './images/dcs_knight.png'
import KnightD       from './images/dcs_knight_d.png'
import Monopoly      from './images/dcs_monopoly.png'
import MonopolyD     from './images/dcs_monopoly_d.png'
import RoadBuilding  from './images/dcs_roadBuilding.png'
import RoadBuildingD from './images/dcs_roadBuilding_d.png'
import YearOfPlenty  from './images/dcs_yearOfPlenty.png'
import YearOfPlentyD from './images/dcs_yearOfPlenty_d.png'

import Chapel       from './images/dcs_chapel.png'
import ChapelD      from './images/dcs_chapel_d.png'
import Library      from './images/dcs_library.png'
import LibraryD     from './images/dcs_library_d.png'
import Market       from './images/dcs_market.png'
import MarketD      from './images/dcs_market_d.png'
import Palace       from './images/dcs_palace.png'
import PalaceD      from './images/dcs_palace_d.png'
import University   from './images/dcs_university.png'
import UniversityD  from './images/dcs_university_d.png'

// Buttons
import ButtonBuild from './images/button_build.png'
import ButtonBuildD from './images/button_build_d.png'
import ButtonBuildCancel from './images/button_build-cancel.png'
import ButtonBuy from './images/button_buy.png'
import ButtonBuyD from './images/button_buy_d.png'
import ButtonCancel  from './images/button_cancel.png'
import ButtonConfirm from './images/button_confirm.png'
import ButtonDices from './images/button_dices.png'
import ButtonDicesD from './images/button_dices_d.png'
import ButtonNextTurn from './images/button_next-turn.png'
import ButtonNextTurnD from './images/button_next-turn_d.png'
import ButtonQuitResource from './images/button_quit_resource.png'
import ButtonTrade from './images/button_trade.png'
import ButtonTradeD from './images/button_trade_d.png'
import ButtonTradeCancel from './images/button_trade_cancel.png'
import TradeIcon from './images/trade_icon.png'

// Sounds
import BrickSound from './audio/effects/Brick.mp3'
import BuildSound from './audio/effects/Build.mp3'
import BuySound from './audio/effects/Buy.mp3'
import CardSound from './audio/effects/Card.mp3'
import Click from './audio/effects/Click_1.mp3'
import DiceSound from './audio/effects/Dices.mp3'
import HarborSound from './audio/effects/Harbor.mp3'
import KnightSound from './audio/effects/Knight.mp3'
import LumberSound from './audio/effects/Lumber.mp3'
import StoneSound from './audio/effects/Stone.mp3'
import TradeSound from './audio/effects/Trade.mp3'
import TradeCancelSound from './audio/effects/TradeCancel.mp3'
import WheatSound from './audio/effects/Wheat.mp3'
import WoolSound from './audio/effects/Wool.mp3'


const MoveType = require( './services/movesTypes.js')

const ColorVillages = [RedVillage, GreenVillage, BlueVillage, YellowVillage]
const ColorVillagesSprites = [ RedVillageSprite, GreenVillageSprite, BlueVillageSprite, YellowVillageSprite ]
const ColorVillagesUSprites = [ RedVillageUSprite, GreenVillageUSprite, BlueVillageUSprite, YellowVillageUSprite]

const ColorCities   = [RedCity, GreenCity, BlueCity, YellowCity]
const ColorCitiesSprites   = [ RedCitySprite, GreenCitySprite, BlueCitySprite, YellowCitySprite]

const ColorRoads    = [RedRoad, GreenRoad, BlueRoad, YellowRoad]
const RoadsDirections  = [VerRoad, RightDiagRoad, LeftDiagRoad]
const RoadsDirectionsS = [VerRoadS, RightDiagRoadS, LeftDiagRoadS] 
const ColorRoadsDirections = [
    [RedVerRoad, RedRightDiagRoad, RedLeftDiagRoad],
    [GreenVerRoad, GreenRightDiagRoad, GreenLeftDiagRoad],
    [BlueVerRoad, BlueRightDiagRoad, BlueLeftDiagRoad],
    [YellowVerRoad, YellowRightDiagRoad, YellowLeftDiagRoad]
]


const Biomes = {
    'Desierto': Desert,
    'Cultivo': Farmland,
    'Bosque': Forest,
    'Colina': Hill,
    'Monte': Mountain,
    'Puerto': Harbor,
    'Pasto': Pasture
}
// Fichas numericas  5  2  6  3  8 10  9 12 11  4  8 10  9  4  5  6  3 11
const Tokens = {
    'A': A, 
    'B': B, 
    'C': C,
    'D': D,
    'E': E,
    'F': F,
    'G': G,
    'H': H,
    'I': I,
    'J': J,
    'K': K,
    'L': L,
    'M': M,
    'N': N,
    'O': O,
    'P': P,
    'Q': Q,
    'R': R
}
const ResourcesSprite = {
    'Trigo': Wheat,
    'Madera': Lumber,
    'Ladrillo': Brick,
    'Piedra': Stone,
    'Lana': Wool
}
const Resources = [ Wheat, Lumber, Brick, Stone, Wool ]
const Dices = [ Dice0, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 ]
const PointsNames = ['Capilla', 'Biblioteca', 'Mercado', 'Palacio', 'Universidad']
const biomesResources   = ['Trigo', 'Madera', 'Ladrillo', 'Piedra', 'Lana', 'None']
const Points = [Chapel, Library, Market, Palace, University]
const PointsD = [ChapelD, LibraryD, MarketD, PalaceD, UniversityD]

const UIColor = 0x420001
const PlayersColors  = [0xd60000, 0x06b300, 0x005bb5, 0xd4b700]
const PlayersColorsD = [0x330b0b, 0x1a3019, 0x1c2936, 0x332e03]

// TODO:
// Puntuacion
//      Suma de puntos
//      Visualizacion de los jugadores y sus puntos
//      Ganar y proceso desde ganar a volver al menu
// Intercambios (opcional)
//      Con la maquina
//      Con un jugador

// ============================================================================
// AUXILIAR FUNCTIONS
// ============================================================================

/*
function random(min, max) {
    return Math.floor(Math.random() * max) + min;
}
*/

/*
function ncoor_toString(coords) {
    return coords.x.toString() + "," + coords.y.toString()
}
*/

function parseBool(string) {
    return (string === 'true') ? true : false
}

function parseBoolArr(arr) {
    let bool_arr = []
    for (let i of arr.split(',')) {
        bool_arr.push((i === 'true') ? true : false)
    }
    return bool_arr
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
// Auxiliar variables
// ============================================================================
const appWidth = 1200, appHeight = 675
const cell_hor_offset = 115, cell_ver_offset = 100;

const BiomesOrder = [0,1,2,11,12,13,3,10,17,18,14,4,9,16,15,5,8,7,6]
const BiomesPos = [
    [appWidth/2 - cell_hor_offset, appHeight/2 - 2*cell_ver_offset - 30],
    [appWidth/2, appHeight/2 - 2*cell_ver_offset - 30],
    [appWidth/2 + cell_hor_offset, appHeight/2 - 2*cell_ver_offset -30],
    [appWidth/2 - 1.5*cell_hor_offset, appHeight/2 - cell_ver_offset - 30],
    [appWidth/2 - 0.5*cell_hor_offset, appHeight/2 - cell_ver_offset - 30],
    [appWidth/2 + 0.5*cell_hor_offset, appHeight/2 - cell_ver_offset - 30],
    [appWidth/2 + 1.5*cell_hor_offset, appHeight/2 - cell_ver_offset - 30],
    [appWidth/2 - 2*cell_hor_offset, appHeight/2 - 30],
    [appWidth/2 - cell_hor_offset, appHeight/2 - 30],
    [appWidth/2,appHeight/2 - 30],
    [appWidth/2 + cell_hor_offset, appHeight/2 - 30],
    [appWidth/2 + 2*cell_hor_offset, appHeight/2 - 30],
    [appWidth/2 - 1.5*cell_hor_offset, appHeight/2 + cell_ver_offset - 30],
    [appWidth/2 - 0.5*cell_hor_offset, appHeight/2 + cell_ver_offset - 30],
    [appWidth/2 + 0.5*cell_hor_offset, appHeight/2 + cell_ver_offset - 30],
    [appWidth/2 + 1.5*cell_hor_offset, appHeight/2 + cell_ver_offset - 30],
    [appWidth/2 - cell_hor_offset, appHeight/2 + 2*cell_ver_offset - 30],
    [appWidth/2, appHeight/2 + 2*cell_ver_offset - 30],
    [appWidth/2 + cell_hor_offset, appHeight/2 + 2*cell_ver_offset - 30]
]

const NodesId  = [
    '0,3',
    '0,5',
    '0,7',
    '1,2',
    '1,4',
    '1,6',
    '1,8',
    '2,2',
    '2,4',
    '2,6',
    '2,8',
    '3,1',
    '3,3',
    '3,5',
    '3,7',
    '3,9',
    '4,1',
    '4,3',
    '4,5',
    '4,7',
    '4,9',
    '5,0',
    '5,2',
    '5,4',
    '5,6',
    '5,8',
    '5,10',
    '6,0',
    '6,2',
    '6,4',
    '6,6',
    '6,8',
    '6,10',
    '7,1',
    '7,3',
    '7,5',
    '7,7',
    '7,9',
    '8,1',
    '8,3',
    '8,5',
    '8,7',
    '8,9',
    '9,2',
    '9,4',
    '9,6',
    '9,8',
    '10,2',
    '10,4',
    '10,6',
    '10,8',
    '11,3',
    '11,5',
    '11,7'
]

const NodesPos = [
    [appWidth/2-115, 40],
    [appWidth/2, 40],
    [appWidth/2+115, 40],

    [appWidth/2-172, 60],
    [appWidth/2-58, 60],
    [appWidth/2+58, 60],
    [appWidth/2+172, 60],

    [appWidth/2-173, 140],
    [appWidth/2-58, 140],
    [appWidth/2+58, 140],
    [appWidth/2+173, 140],

    [appWidth/2-230, 160],
    [appWidth/2-115, 160],
    [appWidth/2, 160],
    [appWidth/2+115, 160],
    [appWidth/2+230, 160],

    [appWidth/2-230, 240],
    [appWidth/2-115, 240],
    [appWidth/2, 240],
    [appWidth/2+115, 240],
    [appWidth/2+230, 240],

    [appWidth/2-289, 260],
    [appWidth/2-173, 260],
    [appWidth/2-58, 260],
    [appWidth/2+58, 260],
    [appWidth/2+173, 260],
    [appWidth/2+289, 260],

    [appWidth/2-289, 340],
    [appWidth/2-173, 340],
    [appWidth/2-58, 340],
    [appWidth/2+58, 340],
    [appWidth/2+173, 340],
    [appWidth/2+289, 340],

    [appWidth/2-230, 360],
    [appWidth/2-115, 360],
    [appWidth/2, 360],
    [appWidth/2+115, 360],
    [appWidth/2+230, 360],

    [appWidth/2-230, 440],
    [appWidth/2-115, 440],
    [appWidth/2, 440],
    [appWidth/2+115, 440],
    [appWidth/2+230, 440],

    [appWidth/2-173, 460],
    [appWidth/2-58, 460],
    [appWidth/2+58, 460],
    [appWidth/2+173, 460],

    [appWidth/2-172, 540],
    [appWidth/2-58, 540],
    [appWidth/2+58, 540],
    [appWidth/2+172, 540],

    [appWidth/2-115, 560],
    [appWidth/2, 560],
    [appWidth/2+115, 560],

]

const RoadsInfo = [
    [2,'0,3:1,2', appWidth/2 - 150, 60],
    [1,'0,3:1,4', appWidth/2 - 80, 60],
    [2,'0,5:1,4', appWidth/2 - 35, 60],
    [1,'0,5:1,6', appWidth/2 + 35, 60],
    [2,'0,7:1,6', appWidth/2 + 80, 60],
    [1,'0,7:1,8', appWidth/2 + 150, 60],

    [0,'1,2:2,2', appWidth/2 - 173, 105],
    [0,'1,4:2,4', appWidth/2 - 58, 105],
    [0,'1,6:2,6', appWidth/2 + 58, 105],
    [0,'1,8:2,8', appWidth/2 + 173, 105],

    [2,'2,2:3,1', appWidth/2 - 200, 153],
    [1,'2,2:3,3', appWidth/2 - 150, 153],
    [2,'2,4:3,3', appWidth/2 - 80, 153],
    [1,'2,4:3,5', appWidth/2 - 35, 153],
    [2,'2,6:3,5', appWidth/2 + 35, 153],
    [1,'2,6:3,7', appWidth/2 + 80, 153],
    [2,'2,8:3,7', appWidth/2 + 150, 153],
    [1,'2,8:3,9', appWidth/2 + 200, 153],

    [0,'3,1:4,1', appWidth/2 - 230, 200],
    [0,'3,3:4,3', appWidth/2 - 115, 200],
    [0,'3,5:4,5', appWidth/2, 200],
    [0,'3,7:4,7', appWidth/2 + 115, 200],
    [0,'3,9:4,9', appWidth/2 + 230, 200],

    [2,'4,1:5,0', appWidth/2 - 262, 258],
    [1,'4,1:5,2', appWidth/2 - 200, 258],
    [2,'4,3:5,2', appWidth/2 - 150, 258],
    [1,'4,3:5,4', appWidth/2 - 80,  258],
    [2,'4,5:5,4', appWidth/2 - 35,  258],
    [1,'4,5:5,6', appWidth/2 + 35,  258],
    [2,'4,7:5,6', appWidth/2 + 80,  258],
    [1,'4,7:5,8', appWidth/2 + 150, 258],
    [2,'4,9:5,8', appWidth/2 + 200, 258],
    [1,'4,9:5,10', appWidth/2 + 262, 258],

    [0,'5,0:6,0', appWidth/2 - 289, 300],
    [0,'5,2:6,2', appWidth/2 - 173, 300],
    [0,'5,4:6,4', appWidth/2 - 58, 300],
    [0,'5,6:6,6', appWidth/2 + 58, 300],
    [0,'5,8:6,8', appWidth/2 + 173, 300],
    [0,'5,10:6,10', appWidth/2 + 289, 300],

    [1,'6,0:7,1', appWidth/2 - 265, 353],
    [2,'6,2:7,1', appWidth/2 - 198, 353],
    [1,'6,2:7,3', appWidth/2 - 150, 353],
    [2,'6,4:7,3', appWidth/2 - 80,  353],
    [1,'6,4:7,5', appWidth/2 - 35,  353],
    [2,'6,6:7,5', appWidth/2 + 35,  353],
    [1,'6,6:7,7', appWidth/2 + 80,  353],
    [2,'6,8:7,7', appWidth/2 + 150, 353],
    [1,'6,8:7,9', appWidth/2 + 198, 353],
    [2,'6,10:7,9', appWidth/2 + 265, 353],

    [0,'7,1:8,1', appWidth/2 - 230, 400],
    [0,'7,3:8,3', appWidth/2 - 115, 400],
    [0,'7,5:8,5', appWidth/2, 400],
    [0,'7,7:8,7', appWidth/2 + 115, 400],
    [0,'7,9:8,9', appWidth/2 + 230, 400],

    [1,'8,1:9,2', appWidth/2 - 200, 457],
    [2,'8,3:9,2', appWidth/2 - 150, 457],
    [1,'8,3:9,4', appWidth/2 - 80, 457],
    [2,'8,5:9,4', appWidth/2 - 35, 457],
    [1,'8,5:9,6', appWidth/2 + 35, 457],
    [2,'8,7:9,6', appWidth/2 + 80, 457],
    [1,'8,7:9,8', appWidth/2 + 150, 457],
    [2,'8,9:9,8', appWidth/2 + 200, 457],

    [0,'9,2:10,2', appWidth/2 - 173, 500],
    [0,'9,4:10,4', appWidth/2 - 58, 500],
    [0,'9,6:10,6', appWidth/2 + 58, 500],
    [0,'9,8:10,8', appWidth/2 + 173, 500],

    [1,'10,2:11,3', appWidth/2 - 150, 553],
    [2,'10,4:11,3', appWidth/2 - 80, 553],
    [1,'10,4:11,5', appWidth/2 - 35, 553],
    [2,'10,6:11,5', appWidth/2 + 35, 553],
    [1,'10,6:11,7', appWidth/2 + 80, 553],
    [2,'10,8:11,7', appWidth/2 + 150, 553]
]

// ============================================================================
// GAME
// ============================================================================
function Game({gameChanged, gameExit}) {

    let socket = useContext(SocketContext)
   //const [gameChanged, setGameChanged] = useState(props[0])
   //const [socket, setSocket] = useState(useContext(SocketContext))
   //useEffect(() => {
   //    if (socket == null) {
   //        let new_socket = io('http://ec2-3-8-165-26.eu-west-2.compute.amazonaws.com:8080/')
   //        new_socket.on('error',  (err)  => { console.log('SOCKET ERROR:', err) })
   //        new_socket.on('update', (game) => {
   //            sessionStorage.setItem('game', JSON.stringify(game))
   //            setGameChanged(prevStatus => {
   //                return !prevStatus
   //            })
   //            console.log("LA PARTIDA/TABLERO: ", game)
   //        });
   //        setSocket(new_socket)
   //    }
   //}, [socket]);
    //socket.on('notify', (data) => {
    //    console.log(data)
    //})

    // Game states:
    // Build state: select node to build the correspondant building on
    const [buildMode,  setBuildMode]              = useState(parseBool(sessionStorage.getItem('build-mode')))
    // Initial condition for the first two phases
    const [hasToBuild, setHasToBuild]             = useState(parseBoolArr(sessionStorage.getItem('has-to-build')))
    // Change (Trading) state: select card to trade and the one that you want to receive
    const [changeMode, setChangeMode]             = useState(parseBool(sessionStorage.getItem('change-mode')))
    // Knight state: select biome to put the robber on
    const [knightMode, setKnightMode]             = useState(parseBool(sessionStorage.getItem('knight-mode')))
    // Building roads state: 
    const [buildRoads, setBuildRoads]             = useState(parseBool(sessionStorage.getItem('build-roads')))
    // Monopoly state:
    const [monopolyMode, setMonopolyMode]         = useState(parseBool(sessionStorage.getItem('monopoly-mode')))
    // Selected point: current point selected for the current state
    const [selectedPoint, setSelectedPoint]       = useState(null);
    // Throw dices state: throw the dices
    const [throwDices, setThrowDices]             = useState(parseBool(sessionStorage.getItem('throw-dices')))
    // Year of plenty state:
    const [yearOfPlentyMode, setYearOfPlentyMode] = useState(parseBool(sessionStorage.getItem('year-of-plenty-mode')))
    //const [isClicked, setIsClicked] = useState(false);

    // Game sounds:
    const [brickSound]        = useState(new Audio(BrickSound))
    const [buildSound]        = useState(new Audio(BuildSound))
    const [buySound]          = useState(new Audio(BuySound))
    const [cardSound]         = useState(new Audio(CardSound))
    const [click]             = useState(new Audio(Click)) 
    const [diceSound]         = useState(new Audio(DiceSound))
    const [harborSound]       = useState(new Audio(HarborSound))
    const [knightSound]       = useState(new Audio(KnightSound))
    const [lumberSound]       = useState(new Audio(LumberSound))
    const [stoneSound]        = useState(new Audio(StoneSound))
    const [tradeSound]        = useState(new Audio(TradeSound))
    const [tradeCancelSound]  = useState(new Audio(TradeCancelSound))
    const [wheatSound]        = useState(new Audio(WheatSound))
    const [woolSound]         = useState(new Audio(WoolSound))
    // ========================================================================
    // INITIAL PHASE
    // ========================================================================
    function DrawNodes_Init(g, players, free_nodes_set, id, x, y) {
        let p_i = -1
        for (let p = 0; p < players.length; p++) {
            if ((new Set(players[p].villages)).has(id)) {
                p_i = p
                break
            }
        }
        if (p_i === -1) {
            if (free_nodes_set.size > 0) {
                if (hasToBuild[0] && free_nodes_set.has(id) && JSON.parse(sessionStorage.getItem('game')).current_turn === parseInt(sessionStorage.getItem('my-turn'))) {
                    //let node = Draw(selectedPoint && selectedPoint.id === id ? 0xffff00 : 0xffffff, 'Circle', x, y, 15)
                    let node = DrawSprite(selectedPoint && selectedPoint.id === id ? VillageSSprite : VillageSprite, x, y, 0.35)
                    
                    node.interactive = true 
                    node.on("pointerdown", () => {
                        setSelectedPoint({id:id, type:'Node'})
                    })
                    g.addChild(node)
                }
            }

        } else {
            g.addChild(DrawSprite(ColorVillagesSprites[p_i], x, y, 0.35))
        }
    }

    function DrawRoads_Init(g, players, free_roads_set, orientation, id, x, y) {
        let p_i = -1
        for (let p = 0; p < players.length; p++) {
            if ((new Set(players[p].roads)).has(id)) {
                p_i = p
            }
        }
        if (p_i === -1) {
            if (free_roads_set.size > 0) {
                if (hasToBuild[1] && free_roads_set.has(id) && JSON.parse(sessionStorage.getItem('game')).current_turn === parseInt(sessionStorage.getItem('my-turn'))) {
                    let road = DrawSprite((selectedPoint && selectedPoint.id === id) ? RoadsDirectionsS[orientation] : RoadsDirections[orientation], x, y, 0.45)
                    road.interactive = true
                    road.on("pointertap", () => {setSelectedPoint({id:id, type:'Road'})})
                    g.addChild(road)
                }
            }

        } else {
            g.addChild(DrawSprite(ColorRoadsDirections[p_i][orientation], x, y, 0.45))
        }
    }

    // ========================================================================
    // DEFAULT MODE
    // ========================================================================
    function DrawBiomes_Default(g, biomes, id, x, y) {
        let sprite = DrawSprite(Biomes[biomes[id].type], x, y, 0.26)
        g.addChild(sprite)
        if (biomes[id].token.letter !== 'S') {
            g.addChild(DrawSprite(Tokens[biomes[id].token.letter], sprite.x, sprite.y, 0.3))
        }
    }

    function DrawNodes_Default(g, players, id, x, y) {
        let p_i = -1
        // If any player has the node as a village
        for (let p = 0; p < players.length; p++) {
            let villages_set = (players[p].villages.length > 0) ? new Set(players[p].villages) : new Set()
            if (villages_set.has(id)) {
                p_i = p
                break
            }
        }
        if (p_i !== -1) {
            g.addChild(DrawSprite(ColorVillagesSprites[p_i], x, y, 0.35))
            return
        }

        // If any player has the node as a city
        for (let p = 0; p < players.length; p++) {
            let cities_set = (players[p].cities.length > 0) ? new Set(players[p].cities) : new Set()
            if (cities_set.has(id)) {
                p_i = p
                break
            }
        }
        if (p_i !== -1) {
            g.addChild(DrawSprite(ColorCitiesSprites[p_i], x, y-10, 0.4))
        }
    }

    function DrawRoads_Default(g, players, orientation, id, x, y) {
        let p_i = -1
        // If any player has the road
        for (let p = 0; p < players.length; p++) {
            let roads_set = (players[p].roads.length > 0) ? new Set(players[p].roads) : new Set()
            if (roads_set.has(id)) {
                p_i = p
            }
        }
        if (p_i !== -1) {
            g.addChild(DrawSprite(ColorRoadsDirections[p_i][orientation], x, y, 0.45))
        }
    }

    // ========================================================================
    // BUILD MODE
    // ========================================================================
    function DrawBiomes_Build(g, biomes, id, x, y) {
        let sprite = DrawSprite(Biomes[biomes[id].type], x, y, 0.26)
        g.addChild(sprite)
        if (biomes[id].token.letter !== 'S') {
            g.addChild(DrawSprite(Tokens[biomes[id].token.letter], sprite.x, sprite.y, 0.3))
        }
    }

    function DrawNodes_Build(g, me, players, free_nodes_set, id, x, y) {

        let p_i = -1
        // If any player has the node as a village
        for (let p = 0; p < players.length; p++) {
            let villages_set = (players[p].villages.length > 0) ? new Set(players[p].villages) : new Set()
            if (villages_set.has(id)) {
                p_i = p
                break
            }
        }
        if (p_i !== -1) {
            if (p_i === parseInt(sessionStorage.getItem('my-turn')) && me.can_build[1]) {
                let node = DrawSprite((selectedPoint && selectedPoint.id === id) ? VillageSSprite : ColorVillagesUSprites[p_i], x, y, 0.35) 
                node.interactive = true
                node.on('pointerdown', () => {
                    setSelectedPoint({id:id, type:'Village'})
                })
                g.addChild(node)
            } else {
                g.addChild(DrawSprite(ColorVillagesSprites[p_i], x, y, 0.35))
            }
            return
        }

        // If any player has the node as a city
        for (let p = 0; p < players.length; p++) {
            let cities_set = (players[p].cities.length > 0) ? new Set(players[p].cities) : new Set()
            if (cities_set.has(id)) {
                p_i = p
                break
            }
        }
        if (p_i !== -1) {
            g.addChild(DrawSprite(ColorCitiesSprites[p_i], x, y-10, 0.4))
            return
        }

        // If any player have not the node, then is a free node
        if (free_nodes_set.has(id) && me.can_build[0]) {
            let node = DrawSprite((selectedPoint && selectedPoint.id === id) ? VillageSSprite : VillageSprite, x, y, 0.35) 
            node.interactive = true 
            node.on("pointerdown", () => {
                setSelectedPoint({id:id, type:'Node'})
            })
            g.addChild(node)
        }
    }

    function DrawRoads_Build(g, me, players, free_roads_set, orientation, id, x, y) {

        let p_i = -1
        // If any player has the road
        for (let p = 0; p < players.length; p++) {
            let roads_set = (players[p].roads.length > 0) ? new Set(players[p].roads) : new Set()
            if (roads_set.has(id)) {
                p_i = p
            }
        }
        if (p_i !== -1) {
            g.addChild(DrawSprite(ColorRoadsDirections[p_i][orientation], x, y, 0.45))
            return
        }

        if (free_roads_set.size > 0 && me.can_build[2]) {
            if ((buildMode || buildRoads)  && !knightMode && free_roads_set.has(id)) {
                let road = DrawSprite((selectedPoint && selectedPoint.id === id) ? RoadsDirectionsS[orientation] : RoadsDirections[orientation], x, y, 0.45)
                road.interactive = true
                road.on("pointertap", () => {setSelectedPoint({id:id, type:'Road'})})
                g.addChild(road)
            }
        }
        
    }

    // ========================================================================
    // KNIGHT MODE
    // ========================================================================
    function DrawBiomes_Knight(g, board, id, x, y) {

        let sprite = DrawSprite(Biomes[board.biomes[id].type], x, y, selectedPoint && selectedPoint.id === id ? 0.3 : 0.26)
        if (id !== board.robber_biome) {
            sprite.interactive = true
            sprite.on('pointerdown', () => {
                if (!selectedPoint || (selectedPoint && selectedPoint.id !== id)) {
                    setSelectedPoint({id:id, type:'Biome'})
                } else {
                    setSelectedPoint(null)
                }
            })
        }

        g.addChild(sprite)

        if (board.biomes[id].token.letter !== 'S' && (!selectedPoint || (selectedPoint && selectedPoint.id !== id))) {
            g.addChild(DrawSprite(Tokens[board.biomes[id].token.letter], sprite.x, sprite.y, 0.3))
        }
    }

    function DrawNodes_Knight(g, players, id, x, y) {
        let p_i = -1
        // If any player has the node as a village
        for (let p = 0; p < players.length; p++) {
            let villages_set = (players[p].villages.length > 0) ? new Set(players[p].villages) : new Set()
            if (villages_set.has(id)) {
                p_i = p
                break
            }
        }
        if (p_i !== -1) {
            g.addChild(DrawSprite(ColorVillagesSprites[p_i], x, y, 0.35))
            return
        }

        // If any player has the node as a city
        for (let p = 0; p < players.length; p++) {
            let cities_set = (players[p].cities.length > 0) ? new Set(players[p].cities) : new Set()
            if (cities_set.has(id)) {
                p_i = p
                break
            }
        }
        if (p_i !== -1) {
            g.addChild(DrawSprite(ColorCitiesSprites[p_i], x, y-10, 0.4))
        }
    }

    // ========================================================================
    // ROAD BUILDING MODE
    // ========================================================================
    function DrawNodes_RoadBuilding(g, players, id, x, y) {
        let p_i = -1
        // If any player has the node as a village
        for (let p = 0; p < players.length; p++) {
            let villages_set = (players[p].villages.length > 0) ? new Set(players[p].villages) : new Set()
            if (villages_set.has(id)) {
                p_i = p
                break
            }
        }
        if (p_i !== -1) {
            g.addChild(DrawSprite(ColorVillagesSprites[p_i], x, y, 0.35))
            return
        }

        // If any player has the node as a city
        for (let p = 0; p < players.length; p++) {
            let cities_set = (players[p].cities.length > 0) ? new Set(players[p].cities) : new Set()
            if (cities_set.has(id)) {
                p_i = p
                break
            }
        }
        if (p_i !== -1) {
            g.addChild(DrawSprite(ColorCitiesSprites[p_i], x, y-10, 0.4))
        }
    }

    function DrawRoads_RoadBuilding(g, players, free_roads_set, orientation, id, x, y) {

        let p_i = -1
        // If any player has the road
        for (let p = 0; p < players.length; p++) {
            let roads_set = (players[p].roads.length > 0) ? new Set(players[p].roads) : new Set()
            if (roads_set.has(id)) {
                p_i = p
            }
        }
        if (p_i !== -1) {
            g.addChild(DrawSprite(ColorRoadsDirections[p_i][orientation], x, y, 0.45))
            return
        }

        if (free_roads_set.size > 0) {
            if ((buildMode || buildRoads)  && !knightMode && free_roads_set.has(id)) {
                let road = DrawSprite(selectedPoint && selectedPoint.id === id ? RoadsDirectionsS[orientation] : RoadsDirections[orientation], x, y, 0.45)
                road.interactive = true
                road.on("pointertap", () => {setSelectedPoint({id:id, type:'Road'})})
                g.addChild(road)
            }
        }
        
    }

    // ========================================================================
    // GAME PHASES
    // ========================================================================
    function game_phase_first_rolls(g, game, players, me) {

        let BUTTON = null

        g.addChild(DrawSprite(RoadBuildingD, 120, 240, 0.35))
        g.addChild(DrawSprite(KnightD, 150, 150, 0.35))
        g.addChild(DrawSprite(MonopolyD, 230, 100, 0.35))
        g.addChild(DrawSprite(YearOfPlentyD, 290, 130, 0.35))

        // Drawing the biomes:
        for (let i = 0; i < 19; i++) {
            DrawBiomes_Default(g, game.board.biomes, BiomesOrder[i], ...BiomesPos[i])
        }
        // Dice button
        g.addChild(DrawSprite(Dices[me.first_rolls[0]], appWidth-300, 80, 1))
        g.addChild(DrawSprite(Dices[me.first_rolls[1]], appWidth-230, 80, 1))
        
        if (players[game.current_turn].name === JSON.parse(sessionStorage.getItem('user')).name && !throwDices) {
            BUTTON = DrawSprite(ButtonDices, 1015, 115, 0.1)
            BUTTON.interactive = true
            BUTTON.buttonMode  = true
            BUTTON.on('pointerdown', () => {
                diceSound.play()
                setThrowDices(true)
                sessionStorage.setItem('throw-dices', true)
                socket.emit('move', JSON.parse(sessionStorage.getItem('user')).accessToken, game.code, { id : MoveType.roll_dices })
            })
        } else {
            BUTTON = DrawSprite(ButtonDicesD, 1015, 115, 0.1)
        }
        g.addChild(BUTTON);
        // Next turn button
        if (players[game.current_turn].name === JSON.parse(sessionStorage.getItem('user')).name && throwDices) {
            BUTTON = DrawSprite(ButtonNextTurn, 1065, 490, 0.1)
            BUTTON.interactive = true;
            BUTTON.buttonMode = true;
            BUTTON.on('pointerdown', () => {
                click.play()
                socket.emit('move', JSON.parse(sessionStorage.getItem('user')).accessToken, game.code, { id : MoveType.next_turn })
                setThrowDices(false)
                sessionStorage.setItem('throw-dices', false)
            })
        } else {
            BUTTON = DrawSprite(ButtonNextTurnD, 1065, 490, 0.1)
        }
        g.addChild(BUTTON)
    }

    function game_phase_init(g, game, players, me) {

        let BUTTON = null

        g.addChild(DrawSprite(RoadBuildingD, 105, 260, 0.35))
        g.addChild(DrawSprite(KnightD, 120, 170, 0.35))
        g.addChild(DrawSprite(MonopolyD, 190, 100, 0.35))
        g.addChild(DrawSprite(YearOfPlentyD, 265, 120, 0.35))

        // Drawing the biomes:
        for (let i = 0; i < 19; i++) {
            DrawBiomes_Default(g, game.board.biomes, BiomesOrder[i], ...BiomesPos[i])
        }

        // Drawing the road nodes:
        let free_roads_set = new Set(me.first_roads)
        for (let road_info of RoadsInfo) {
            DrawRoads_Init(g, players, free_roads_set, ...road_info)
        }

        // Drawing the building nodes:
        let free_nodes_set = new Set(me.free_nodes)
        for (let i = 0; i < NodesPos.length; i++) {
            DrawNodes_Init(g, players, free_nodes_set, NodesId[i], ...NodesPos[i])
        }

        if (game.current_turn === parseInt(sessionStorage.getItem('my-turn'))) {
            // Only if player has selected a place to build
            if (hasToBuild[0] || hasToBuild[1]) {
                if (selectedPoint) {
                    // Cancel building selection
                    BUTTON = DrawSprite(ButtonCancel, 1015, 510, 0.1)
                    BUTTON.interactive = true;
                    BUTTON.buttonMode = true;
                    BUTTON.on('pointerdown', () => {
                        click.play()
                        setSelectedPoint(null)
                    })
                    g.addChild(BUTTON);

                    // Confirm building selection
                    BUTTON = DrawSprite(ButtonConfirm, 1110, 510, 0.1)
                    BUTTON.interactive = true;
                    BUTTON.buttonMode = true;
                    BUTTON.on('pointerdown', () => {
                        buildSound.play()
                        if (selectedPoint.type === 'Node') {
                            socket.emit('move', JSON.parse(sessionStorage.getItem('user')).accessToken, game.code, { id : MoveType.build_village, coords: selectedPoint.id })
                        } else if (selectedPoint.type === 'Road') {
                            socket.emit('move', JSON.parse(sessionStorage.getItem('user')).accessToken, game.code, {id : MoveType.build_road, coords: selectedPoint.id})
                        }
                        if (hasToBuild[0]) {
                            setHasToBuild([false, true])
                            sessionStorage.setItem('has-to-build', [false, true])
                        } else if (hasToBuild[1]) {
                            setHasToBuild([false, false])
                            sessionStorage.setItem('has-to-build', [false, false])
                            setBuildMode(false)
                            sessionStorage.setItem('build-mode', false)
                        }
                        setSelectedPoint(null)
                    })
                    g.addChild(BUTTON);
                }
            } else {
                // Next turn button
                BUTTON = DrawSprite(ButtonNextTurn, 1063, 510, 0.1)
                BUTTON.interactive = true;
                BUTTON.buttonMode  = true;
                BUTTON.on('pointerdown', () => {
                    click.play()
                    socket.emit('move', JSON.parse(sessionStorage.getItem('user')).accessToken, game.code, { id : MoveType.next_turn })
                    setHasToBuild([true, false])
                    sessionStorage.setItem('has-to-build', [true, false])
                    if (game.current_turn === 0 && game.phase === 2) {
                        setBuildMode(false)
                        sessionStorage.setItem('build-mode', false)
                    }
                })
                g.addChild(BUTTON)
            }
        }
    }

    function game_phase_post(g, game, players, me) {

        let BUTTON = null
        let used_develop_cards = game.players[game.current_turn].used_develop_cards

        // Drawing develop cards box
        // Build road 
        if (players[game.current_turn].name === JSON.parse(sessionStorage.getItem('user')).name && me.develop_cards['Carreteras'] > 0 && throwDices && used_develop_cards === 0) {
            if (!buildRoads) {
                BUTTON = DrawSprite(RoadBuilding, 105, 260, 0.35)
                if (!buildMode && !me.force_knight) {
                    BUTTON.interactive = true
                    BUTTON.on('pointerdown', () => {
                        cardSound.play()
                        setBuildRoads(true)
                        sessionStorage.setItem('build-roads', true)
                        setKnightMode(false)
                        sessionStorage.setItem('knight-mode', false)
                        setMonopolyMode(false)
                        sessionStorage.setItem('monopoly-mode', false)
                        setYearOfPlentyMode(false)
                        sessionStorage.setItem('year-of-plenty-mode', false)
                        setChangeMode(false)
                        sessionStorage.setItem('change-mode', false)
                        setSelectedPoint(null)
                    })
                }
                g.addChild(BUTTON)
            }
        } else {
            g.addChild(DrawSprite(RoadBuildingD, 105, 260, 0.35))
        }

        if (players[game.current_turn].name === JSON.parse(sessionStorage.getItem('user')).name && me.develop_cards['Caballeros'] > 0 && used_develop_cards === 0) {
            if (!knightMode && !me.force_knight) {
                BUTTON = DrawSprite(Knight, 120, 170, 0.35)
                if (!buildMode && me.roads_build_4_free === 0) {
                    BUTTON.interactive = true
                    BUTTON.on('pointerdown', () => {
                        cardSound.play()
                        setKnightMode(true)
                        sessionStorage.setItem('knight-mode', true)
                        setBuildRoads(false)
                        sessionStorage.setItem('build-roads', false)
                        setMonopolyMode(false)
                        sessionStorage.setItem('monopoly-mode', false)
                        setYearOfPlentyMode(false)
                        sessionStorage.setItem('year-of-plenty-mode', false)
                        setChangeMode(false)
                        sessionStorage.setItem('change-mode', false)
                        setSelectedPoint(null)
                    })
                }
                g.addChild(BUTTON)
            }
        } else {
            g.addChild(DrawSprite(KnightD, 120, 170, 0.35))
        }

        if (players[game.current_turn].name === JSON.parse(sessionStorage.getItem('user')).name && me.develop_cards['Monopolios'] > 0 && throwDices && used_develop_cards === 0) {
            if (!monopolyMode) {
                BUTTON = DrawSprite(Monopoly, 190, 100, 0.35)
                if (!buildMode && me.roads_build_4_free === 0 && !me.force_knight) {
                    BUTTON.interactive = true
                    BUTTON.on('pointerdown', () => {
                        cardSound.play()
                        setMonopolyMode(true)
                        sessionStorage.setItem('monopoly-mode', true)
                        setBuildRoads(false)
                        sessionStorage.setItem('build-roads', false)
                        setKnightMode(false)
                        sessionStorage.setItem('knight-mode', false)
                        setYearOfPlentyMode(false)
                        sessionStorage.setItem('year-of-plenty-mode', false)
                        setChangeMode(false)
                        sessionStorage.setItem('change-mode', false)
                        setSelectedPoint(null)
                    })
                }
                g.addChild(BUTTON)
            }
        } else {
            g.addChild(DrawSprite(MonopolyD, 190, 100, 0.35))
        }

        if (players[game.current_turn].name === JSON.parse(sessionStorage.getItem('user')).name && (me.develop_cards['Descubrimientos'] /*- me.drawn_cards['Descubrimientos']*/) > 0 && throwDices && used_develop_cards === 0) {
            if (!yearOfPlentyMode) {
                BUTTON = DrawSprite(YearOfPlenty, 265, 120, 0.35)
                if (!buildMode && me.roads_build_4_free === 0 && !me.force_knight) {
                    BUTTON.interactive = true
                    BUTTON.on('pointerdown', () => {
                        cardSound.play()
                        setYearOfPlentyMode(true)
                        sessionStorage.setItem('year-of-plenty-mode', true)
                        setBuildRoads(false)
                        sessionStorage.setItem('build-roads', false)
                        setKnightMode(false)
                        sessionStorage.setItem('knight-mode', false)
                        setMonopolyMode(false)
                        sessionStorage.setItem('monopoly-mode', false)
                        setChangeMode(false)
                        sessionStorage.setItem('change-mode', false)
                        setSelectedPoint(null)
                    })
                }
                g.addChild(BUTTON)
            }
        } else {
            g.addChild(DrawSprite(YearOfPlentyD, 265, 120, 0.35))
        }

        // Use build mode:
        if (buildMode) {

            // Drawing the biomes
            for (let i = 0; i < 19; i++) {
                DrawBiomes_Build(g, game.board.biomes, BiomesOrder[i], ...BiomesPos[i])
            }

            // Drawing the road nodes:
            let free_roads_set = (me.free_roads.length > 0) ? new Set(me.free_roads) : new Set()
            for (let road_info of RoadsInfo) {
                DrawRoads_Build(g, me, players, free_roads_set, ...road_info)
            }

            // Drawing the nodes
            let free_nodes_set = (me.free_nodes.length > 0) ? new Set(me.free_nodes) : new Set()
            for (let i = 0; i < NodesId.length; i++) {
                DrawNodes_Build(g, me, players, free_nodes_set, NodesId[i], ...NodesPos[i])
            }
        
            // Build button cancel
            BUTTON = DrawSprite(ButtonBuildCancel, 920, 475, 0.1)
            BUTTON.interactive = true;
            BUTTON.buttonMode = true;
            BUTTON.on('pointerdown', () => {
                click.play()
                setBuildMode(false)
                sessionStorage.setItem('build-mode', false)
                setSelectedPoint(null)
            })
            g.addChild(BUTTON)

            // Only if player has selected a place to build
            if (selectedPoint) {
                // Cancel building selection
                BUTTON = DrawSprite(ButtonCancel, 1005, 510, 0.1)
                BUTTON.interactive = true;
                BUTTON.buttonMode = true;
                BUTTON.on('pointerdown', () => {
                    setSelectedPoint(null)
                })
                g.addChild(BUTTON);

                // Confirm building selection
                BUTTON = DrawSprite(ButtonConfirm, 1100, 510, 0.1)
                BUTTON.interactive = true;
                BUTTON.buttonMode = true;
                BUTTON.on('pointerdown', () => {
                    buildSound.play()
                    if (selectedPoint.type === 'Node') {
                        socket.emit('move', JSON.parse(sessionStorage.getItem('user')).accessToken, game.code, { id : MoveType.build_village, coords: selectedPoint.id })
                    } else if (selectedPoint.type === 'Road') {
                        socket.emit('move', JSON.parse(sessionStorage.getItem('user')).accessToken, game.code, {id : MoveType.build_road, coords: selectedPoint.id})
                    } else if (selectedPoint.type === 'Village') {
                        socket.emit('move', JSON.parse(sessionStorage.getItem('user')).accessToken, game.code, {id : MoveType.build_city, coords: selectedPoint.id})
                    }
                    setBuildMode(false)
                    sessionStorage.setItem('build-mode', false)
                    setSelectedPoint(null)
                })
                g.addChild(BUTTON);
            }


            return
        }

        // Use knight mode:
        if (me.force_knight || knightMode) {

            BUTTON = DrawSprite(Knight, 150, 150, 0.45)
            BUTTON.interactive = true
            BUTTON.on('pointerdown', () => {
                setKnightMode(false)
                sessionStorage.setItem('knight-mode', false)
                setSelectedPoint(null)
            })
            g.addChild(BUTTON)

            if (!selectedPoint) {
                // Drawing the biomes
                for (let i = 0; i < 19; i++) {
                    DrawBiomes_Knight(g, game.board, BiomesOrder[i], ...BiomesPos[i])
                }

                // Drawing the nodes
                for (let i = 0; i < NodesId.length; i++) {
                    DrawNodes_Knight(g, players, NodesId[i], ...NodesPos[i])
                }

                // Drawing the robber
                if (game.board.robber_biome !== -1) {
                    let i = BiomesOrder.findIndex(x => x === game.board.robber_biome)
                    g.addChild(DrawSprite(TheRobber, BiomesPos[i][0], BiomesPos[i][1]-10, 0.35))
                }

            // Some biome was selected
            } else { 
                // Drawing the biomes
                let biome = 0
                for (let i = 0; i < 19; i++) {
                    if (BiomesOrder[i] !== selectedPoint.id) {
                        DrawBiomes_Knight(g, game.board, BiomesOrder[i], ...BiomesPos[i])
                    } else {
                        biome = i
                    }
                }

                // Drawing the nodes
                for (let i = 0; i < NodesId.length; i++) {
                    DrawNodes_Knight(g, players, NodesId[i], ...NodesPos[i])
                }

                // Drawing the robber
                if (game.board.robber_biome !== -1) {
                    let i = BiomesOrder.findIndex(x => x === game.board.robber_biome)
                    g.addChild(DrawSprite(TheRobber, BiomesPos[i][0], BiomesPos[i][1]-10, 0.35))
                }

                // Drawing the selected biome
                DrawBiomes_Knight(g, game.board, BiomesOrder[biome], ...BiomesPos[biome])

                // Cancel building selection
                BUTTON = DrawSprite(ButtonCancel, 1015, 510, 0.1)
                BUTTON.interactive = true;
                BUTTON.buttonMode = true;
                BUTTON.on('pointerdown', () => {
                    click.play()
                    setSelectedPoint(null)
                })
                g.addChild(BUTTON);

                // Confirm the robber biome selection
                BUTTON = DrawSprite(ButtonConfirm, 1110, 510, 0.1)
                BUTTON.interactive = true;
                BUTTON.buttonMode = true;
                BUTTON.on('pointerdown', () => {
                    knightSound.play()
                    socket.emit('move', JSON.parse(sessionStorage.getItem('user')).accessToken, game.code, { id: MoveType.use_knight, robber_biome: selectedPoint.id})
                    setKnightMode(false)
                    sessionStorage.setItem('knight-mode', false)
                    setSelectedPoint(null)
                })
                g.addChild(BUTTON);
            }
            return
        }

        // Use change resource mode:
        if (changeMode) {

            // Drawing the biomes
            for (let i = 0; i < 19; i++) {
                DrawBiomes_Default(g, game.board.biomes, BiomesOrder[i], ...BiomesPos[i])
            }

            // Drawing the road nodes:
            for (let road_info of RoadsInfo) {
                DrawRoads_Default(g, players, ...road_info)
            }

            // Drawing the nodes
            for (let i = 0; i < NodesId.length; i++) {
                DrawNodes_Default(g, players, NodesId[i], ...NodesPos[i])
            }

            BUTTON = DrawSprite(ButtonTradeCancel, 300, 510, 0.1)
            BUTTON.interactive = true;
            BUTTON.buttonMode = true;
            BUTTON.on('pointerdown', () => {
                tradeCancelSound.play()
                setChangeMode(false)
                sessionStorage.setItem('change-mode', false)
                setSelectedPoint(null)
            })
            g.addChild(BUTTON)


            g.addChild(DrawSpritePro(Frame_4, appWidth/2 - 360, appHeight/2 - 260, 720, 280))
            BUTTON = DrawSprite(Wheat, 335, 215, 0.4)
            BUTTON.interactive = true
            BUTTON.on('pointerdown', () => {
                wheatSound.play()
                if (!selectedPoint) {
                    setSelectedPoint(['Trigo'])
                } else if (selectedPoint.length < 2) {
                    setSelectedPoint(prevState => {
                        let nextState = [...prevState]
                        nextState.push('Trigo')
                        return nextState
                    })
                }
            })
            if (!me.can_change[0] && !selectedPoint){
                g.addChild(DrawSprite(WheatD, 335, 215, 0.4))
            } else{
                g.addChild(BUTTON)
            }
            
            BUTTON = DrawSprite(Lumber, 468, 215, 0.4)
            BUTTON.interactive = true
            BUTTON.on('pointerdown', () => {
                lumberSound.play()
                if (!selectedPoint) {
                    setSelectedPoint(['Madera'])
                } else if (selectedPoint.length < 2) {
                    setSelectedPoint(prevState => {
                        let nextState = [...prevState]
                        nextState.push('Madera')
                        return nextState
                    })
                }
            })
            if(!me.can_change[1] && !selectedPoint){
                g.addChild(DrawSprite(LumberD, 468, 215, 0.4))
            }else{
                g.addChild(BUTTON)
            }

            BUTTON = DrawSprite(Brick, 602, 215, 0.4)
            BUTTON.interactive = true
            BUTTON.on('pointerdown', () => {
                brickSound.play()
                if (!selectedPoint) {
                    setSelectedPoint(['Ladrillo'])
                } else if (selectedPoint.length < 2) {
                    setSelectedPoint(prevState => {
                        let nextState = [...prevState]
                        nextState.push('Ladrillo')
                        return nextState
                    })
                }
            })
            if (!me.can_change[2] && !selectedPoint){
                g.addChild(DrawSprite(BrickD, 602, 215, 0.4))
            } else {
                g.addChild(BUTTON)
            }

            BUTTON = DrawSprite(Stone, 735, 215, 0.4)
            BUTTON.interactive = true
            BUTTON.on('pointerdown', () => {
                stoneSound.play()
                if (!selectedPoint) {
                    setSelectedPoint(['Piedra'])
                } else if (selectedPoint.length < 2) {
                    setSelectedPoint(prevState => {
                        let nextState = [...prevState]
                        nextState.push('Piedra')
                        return nextState
                    })
                }
            })
            if(!me.can_change[3] && !selectedPoint){
                g.addChild(DrawSprite(StoneD, 735, 215, 0.4))
            }else{
                g.addChild(BUTTON)
            }

            BUTTON = DrawSprite(Wool, 867, 215, 0.4)
            BUTTON.interactive = true
            BUTTON.on('pointerdown', () => {
                woolSound.play()
                if (!selectedPoint) {
                    setSelectedPoint(['Lana'])
                } else if (selectedPoint.length < 2) {
                    setSelectedPoint(prevState => {
                        let nextState = [...prevState]
                        nextState.push('Lana')
                        return nextState
                    })
                }
            })
            if(!me.can_change[4] && !selectedPoint){
                g.addChild(DrawSprite(WoolD, 867, 215, 0.4))
            }else{
                g.addChild(BUTTON)
            }

            if (selectedPoint) {

                g.addChild(DrawSpritePro(Frame_4, 240, appHeight/2 - 25, 720, 250))
                let r_i = biomesResources.findIndex(curr_resource => curr_resource === selectedPoint[0])
                
                for (let i = 0; i < me.trade_costs[r_i]; i++) {
                    g.addChild(DrawSprite(ResourcesSprite[selectedPoint[0]], appWidth/5 + 150 + 20*i, appHeight/2 + 100, 0.42))
                }
                if (selectedPoint.length > 1){
                    g.addChild(DrawSprite(ResourcesSprite[selectedPoint[1]], 730, appHeight/2 + 100 , 0.42))
                }
                g.addChild(DrawSprite(TradeIcon, 590, appHeight/2 + 100 , 1.2))
                // Quitar recurso:
                BUTTON = DrawSprite(ButtonQuitResource, appWidth/2 +273, appHeight/2 + 55, 0.1)
                BUTTON.interactive = true
                BUTTON.on('pointerdown', () => {
                    click.play()
                    if (selectedPoint.length === 1) {
                        setSelectedPoint(null)
                    } else if (selectedPoint.length === 2) {
                        setSelectedPoint(prevState => {
                            let nextState = [...prevState]
                            nextState.pop()
                            return nextState
                        })
                    }
                })
                g.addChild(BUTTON);

                if (selectedPoint.length === 2) {
                    BUTTON = DrawSprite(ButtonConfirm, appWidth/2 + 273, appHeight/2 + 145, 0.1)
                    BUTTON.interactive = true
                    BUTTON.on('pointerdown', () => {
                        harborSound.play()
                        socket.emit('move', JSON.parse(sessionStorage.getItem('user')).accessToken, game.code, { id: MoveType.change_resource, resource: selectedPoint})
                        setChangeMode(false)
                        setSelectedPoint(null)
                    })
                    g.addChild(BUTTON);
                }
            }
            return
        }

        // Use monopoly mode:
        if (monopolyMode) {

            // Drawing the biomes
            for (let i = 0; i < 19; i++) {
                DrawBiomes_Default(g, game.board.biomes, BiomesOrder[i], ...BiomesPos[i])
            }

            // Drawing the road nodes:
            for (let road_info of RoadsInfo) {
                DrawRoads_Default(g, players, ...road_info)
            }

            // Drawing the nodes
            for (let i = 0; i < NodesId.length; i++) {
                DrawNodes_Default(g, players, NodesId[i], ...NodesPos[i])
            }

            BUTTON = DrawSprite(Monopoly, 230, 100, 0.45)
            BUTTON.interactive = true
            BUTTON.on('pointerdown', () => {
                setMonopolyMode(false)
                sessionStorage.setItem('monopoly-mode', false)
                setSelectedPoint(null)
            })
            g.addChild(BUTTON)

            g.addChild(DrawSpritePro(Frame_4, appWidth/2 - 360, appHeight/2 - 260, 720, 280))
            // Wheat option
            if (selectedPoint && selectedPoint === 'Trigo') {
                BUTTON = DrawSprite(Wheat, 335, 215, 0.4)
            } else {
                BUTTON = DrawSprite(WheatD, 335, 215, 0.4)
            }
            BUTTON.interactive = true
            BUTTON.on('pointerdown', () => {
                if (!selectedPoint || (selectedPoint && selectedPoint !== 'Trigo')) {
                    wheatSound.play()
                    setSelectedPoint('Trigo')
                } else {
                    setSelectedPoint(null)
                }
            })
            g.addChild(BUTTON)
            
            // Lumber option
            if (selectedPoint && selectedPoint === 'Madera') {
                BUTTON = DrawSprite(Lumber, 468, 215, 0.4)
            } else {
                BUTTON = DrawSprite(LumberD, 468, 215, 0.4)
            }
            BUTTON.interactive = true
            BUTTON.on('pointerdown', () => {
                if (!selectedPoint || (selectedPoint && selectedPoint !== 'Madera')) {
                    lumberSound.play()
                    setSelectedPoint('Madera')
                } else {
                    setSelectedPoint(null)
                }
            })
            g.addChild(BUTTON)

            // Brick option
            if (selectedPoint && selectedPoint === 'Ladrillo') {
                BUTTON = DrawSprite(Brick, 602, 215, 0.4)
            } else {
                BUTTON = DrawSprite(BrickD, 602, 215, 0.4)
            }
            BUTTON.interactive = true
            BUTTON.on('pointerdown', () => {
                if (!selectedPoint || (selectedPoint && selectedPoint !== 'Ladrillo')) {
                    brickSound.play()
                    setSelectedPoint('Ladrillo')
                } else {
                    setSelectedPoint(null)
                }
            })
            g.addChild(BUTTON)

            // Stone option
            if (selectedPoint && selectedPoint === 'Piedra') {
                BUTTON = DrawSprite(Stone, 735, 215, 0.4)
            } else {
                BUTTON = DrawSprite(StoneD, 735, 215, 0.4)
            }
            BUTTON.interactive = true
            BUTTON.on('pointerdown', () => {
                if (!selectedPoint || (selectedPoint && selectedPoint !== 'Piedra')) {
                    stoneSound.play()
                    setSelectedPoint('Piedra')
                } else {
                    setSelectedPoint(null)
                }
            })
            g.addChild(BUTTON)

            // Wool option
            if (selectedPoint && selectedPoint === 'Lana') {
                BUTTON = DrawSprite(Wool, 867, 215, 0.4)
            } else {
                BUTTON = DrawSprite(WoolD, 867, 215, 0.4)
            }
            BUTTON.interactive = true
            BUTTON.on('pointerdown', () => {
                if (!selectedPoint || (selectedPoint && selectedPoint !== 'Lana')) {
                    woolSound.play()
                    setSelectedPoint('Lana')
                } else {
                    setSelectedPoint(null)
                }
            })
            g.addChild(BUTTON)

            if (selectedPoint) {
                // Cancel building selection
                BUTTON = DrawSprite(ButtonCancel, appWidth/2 - 60, appHeight/2 + 15, 0.1)
                BUTTON.interactive = true;
                BUTTON.buttonMode = true;
                BUTTON.on('pointerdown', () => {
                    click.play()
                    setSelectedPoint(null)
                })
                g.addChild(BUTTON);

                // Confirm building selection
                BUTTON = DrawSprite(ButtonConfirm, appWidth/2 + 60, appHeight/2 + 15, 0.1)
                BUTTON.interactive = true;
                BUTTON.buttonMode = true;
                BUTTON.on('pointerdown', () => {

                    socket.emit('move', JSON.parse(sessionStorage.getItem('user')).accessToken, game.code, { id: MoveType.use_monopoly, resource: selectedPoint })
                    setMonopolyMode(false)
                    sessionStorage.setItem('monopoly-mode', false)
                    setSelectedPoint(null)
                })
                g.addChild(BUTTON);
            }
            return
        }

        // Use building roads mode:
        if (buildRoads) {

            // Drawing the biomes
            for (let i = 0; i < 19; i++) {
                DrawBiomes_Default(g, game.board.biomes, BiomesOrder[i], ...BiomesPos[i])
            }

            // Drawing the road nodes:
            let free_roads_set = (me.free_roads.length > 0) ? new Set(me.free_roads) : new Set()
            for (let road_info of RoadsInfo) {
                DrawRoads_RoadBuilding(g, players, free_roads_set, ...road_info)
            } 

            // Drawing the nodes
            for (let i = 0; i < NodesId.length; i++) {
                DrawNodes_RoadBuilding(g, players, NodesId[i], ...NodesPos[i])
            }

            BUTTON = DrawSprite(RoadBuilding, 120, 240, 0.45)
            if (me.roads_build_4_free === 0) {
                BUTTON.interactive = true
                BUTTON.on('pointerdown', () => {
                    setBuildRoads(false)
                    sessionStorage.setItem('build-roads', false)
                    setSelectedPoint(null)
                })
            }
            g.addChild(BUTTON)


            if (selectedPoint) {
                // Cancel building selection
                BUTTON = DrawSprite(ButtonCancel, 1015, 510, 0.1)
                BUTTON.interactive = true;
                BUTTON.buttonMode = true;
                BUTTON.on('pointerdown', () => {
                    setSelectedPoint(null)
                })
                g.addChild(BUTTON)

                // Confirm building selection
                BUTTON = DrawSprite(ButtonConfirm, 1110, 510, 0.1)
                BUTTON.interactive = true;
                BUTTON.buttonMode = true;
                BUTTON.on('pointerdown', () => {
                    socket.emit('move', JSON.parse(sessionStorage.getItem('user')).accessToken, game.code, { id: MoveType.use_roads_build_4_free, coords: selectedPoint.id})                
                    if (me.roads_build_4_free === 1) {
                        setBuildRoads(false)
                        sessionStorage.setItem('build-roads', false)
                    }
                    setSelectedPoint(null)
                })
                g.addChild(BUTTON)
            }
            return
        }

        // Use Year of plenty mode:
        if (yearOfPlentyMode) {

            BUTTON = DrawSprite(YearOfPlenty, 290, 130, 0.45)
            BUTTON.interactive = true
            BUTTON.on('pointerdown', () => {
                setYearOfPlentyMode(false)
                sessionStorage.setItem('year-of-plenty-mode', false)
                setSelectedPoint(null)
            })
            g.addChild(BUTTON)

            // Drawing the biomes
            for (let i = 0; i < 19; i++) {
                DrawBiomes_Default(g, game.board.biomes, BiomesOrder[i], ...BiomesPos[i])
            }

            // Drawing the road nodes:
            for (let road_info of RoadsInfo) {
                DrawRoads_Default(g, players, ...road_info)
            }

            // Drawing the nodes
            for (let i = 0; i < NodesId.length; i++) {
                DrawNodes_Default(g, players, NodesId[i], ...NodesPos[i])
            }

            g.addChild(DrawSpritePro(Frame_4, appWidth/2 - 360, appHeight/2 - 260, 720, 280))
            BUTTON = DrawSprite(Wheat, 335, 215, 0.4)
            BUTTON.interactive = true
            BUTTON.on('pointerdown', () => {
                wheatSound.play()
                if (!selectedPoint) {
                    setSelectedPoint(['Trigo'])
                } else if (selectedPoint.length < 2) {
                    setSelectedPoint(prevState => {
                        let nextState = [...prevState]
                        nextState.push('Trigo')
                        return nextState
                    })
                }
            })
            g.addChild(BUTTON)

            BUTTON = DrawSprite(Lumber, 468, 215, 0.4)
            BUTTON.interactive = true
            BUTTON.on('pointerdown', () => {
                lumberSound.play()
                if (!selectedPoint) {
                    setSelectedPoint(['Madera'])
                } else if (selectedPoint.length < 2) {
                    setSelectedPoint(prevState => {
                        let nextState = [...prevState]
                        nextState.push('Madera')
                        return nextState
                    })
                }
            })
            g.addChild(BUTTON)

            BUTTON = DrawSprite(Brick, 602, 215, 0.4)
            BUTTON.interactive = true
            BUTTON.on('pointerdown', () => {
                brickSound.play()
                if (!selectedPoint) {
                    setSelectedPoint(['Ladrillo'])
                } else if (selectedPoint.length < 2) {
                    setSelectedPoint(prevState => {
                        let nextState = [...prevState]
                        nextState.push('Ladrillo')
                        return nextState
                    })
                }
            })
            g.addChild(BUTTON)

            BUTTON = DrawSprite(Stone, 735, 215, 0.4)
            BUTTON.interactive = true
            BUTTON.on('pointerdown', () => {
                stoneSound.play()
                if (!selectedPoint) {
                    setSelectedPoint(['Piedra'])
                } else if (selectedPoint.length < 2) {
                    setSelectedPoint(prevState => {
                        let nextState = [...prevState]
                        nextState.push('Piedra')
                        return nextState
                    })
                }
            })
            g.addChild(BUTTON)

            BUTTON = DrawSprite(Wool, 867, 215, 0.4)
            BUTTON.interactive = true
            BUTTON.on('pointerdown', () => {
                woolSound.play()
                if (!selectedPoint) {
                    setSelectedPoint(['Lana'])
                } else if (selectedPoint.length < 2) {
                    setSelectedPoint(prevState => {
                        let nextState = [...prevState]
                        nextState.push('Lana')
                        return nextState
                    })
                }
            })
            g.addChild(BUTTON)

            if (selectedPoint) {

                g.addChild(DrawSpritePro(Frame_5, appWidth/2, appHeight/2-12, 400, 250))

                for (let i = 0; i < selectedPoint.length; i++) {
                    g.addChild(DrawSprite(ResourcesSprite[selectedPoint[i]], appWidth/2 + 110 + 70*i, appHeight/2 + 105 + 15*i, 0.42))
                }

                // Quitar recurso:
                BUTTON = DrawSprite(ButtonQuitResource, appWidth/2 + 323, appHeight/2 + 65, 0.1)
                BUTTON.interactive = true
                BUTTON.on('pointerdown', () => {
                    click.play()
                    if (selectedPoint.length === 1) {
                        setSelectedPoint(null)
                    } else if (selectedPoint.length === 2) {
                        setSelectedPoint(prevState => {
                            let nextState = [...prevState]
                            nextState.pop()
                            return nextState
                        })
                    }
                })
                g.addChild(BUTTON);

                if (selectedPoint.length === 2) {
                    // Confirm building selection
                    BUTTON = DrawSprite(ButtonConfirm, appWidth/2 + 323, appHeight/2 + 165, 0.1)
                    BUTTON.interactive = true
                    BUTTON.on('pointerdown', () => {
                        click.play()
                        socket.emit('move', JSON.parse(sessionStorage.getItem('user')).accessToken, game.code, { id: MoveType.use_year_of_plenty, resource: selectedPoint})
                        setYearOfPlentyMode(false)
                        sessionStorage.setItem('year-of-plenty-mode', false)
                        setSelectedPoint(null)
                    })
                    g.addChild(BUTTON);
                }
            }
            return
        }

        // Drawing cards quantity indicators
        g.addChild(Draw(0xe8a85a, 'Circle', 26, 190, 15))
        g.addChild(DrawText(me.develop_cards['Carreteras'], 'EBGaramond', 20, 'black', 'center', {x:26, y:190}, 0.5))
        g.addChild(Draw(0xe8a85a, 'Circle', 70, 80, 15))
        g.addChild(DrawText(me.develop_cards['Caballeros'], 'EBGaramond', 20, 'black', 'center', {x:70, y:80}, 0.5))
        g.addChild(Draw(0xe8a85a, 'Circle', 110, 22, 15))
        g.addChild(DrawText(me.develop_cards['Monopolios'], 'EBGaramond', 20, 'black', 'center', {x:110, y:22}, 0.5))
        g.addChild(Draw(0xe8a85a, 'Circle', 280, 20, 15))
        g.addChild(DrawText(me.develop_cards['Descubrimientos'], 'EBGaramond', 20, 'black', 'center', {x:280, y:20}, 0.5))

        // Drawing the biomes
        for (let i = 0; i < 19; i++) {
            DrawBiomes_Default(g, game.board.biomes, BiomesOrder[i], ...BiomesPos[i])
        }

        // Drawing the road nodes
        for (let road_info of RoadsInfo) {
            DrawRoads_Default(g, players, ...road_info)
        }
        
        // Drawing the building nodes
        for (let i = 0; i < NodesId.length; i++) {
            DrawNodes_Default(g, players, NodesId[i], ...NodesPos[i])
        }

        // Drawing the robber
        if (game.board.robber_biome !== -1) {
            let i = BiomesOrder.findIndex(x => x === game.board.robber_biome)
            g.addChild(DrawSprite(TheRobber, BiomesPos[i][0], BiomesPos[i][1]-10, 0.35))
        }
        
        // Drawing the buttons
        BUTTON = null
        // Build button
        if (players[game.current_turn].name === JSON.parse(sessionStorage.getItem('user')).name && (me.can_build[0] || me.can_build[1] || me.can_build[2]) && throwDices) {
            BUTTON = DrawSprite(ButtonBuild, 920, 475, 0.1)
            BUTTON.interactive = true;
            BUTTON.buttonMode = true;
            BUTTON.on('pointerdown', () => {
                click.play()
                setBuildMode(true)
                sessionStorage.setItem('build-mode', true)
                setSelectedPoint(null)
            })
        } else {
            BUTTON = DrawSprite(ButtonBuildD, 920, 475, 0.1)
        }
        g.addChild(BUTTON)

        // Drawing the buttons
        BUTTON = null
        // Change button
        if (players[game.current_turn].name === JSON.parse(sessionStorage.getItem('user')).name  && throwDices && (me.can_change[0] || me.can_change[1] || me.can_change[2] || me.can_change[3] || me.can_change[4])) {
            BUTTON = DrawSprite(ButtonTrade, 300, 510, 0.1)
            BUTTON.interactive = true;
            BUTTON.buttonMode = true;
            BUTTON.on('pointerdown', () => {
                tradeSound.play()
                setChangeMode(true)
                sessionStorage.setItem('change-mode', true)
                setSelectedPoint(null)
            })
        } else {
            BUTTON = DrawSprite(ButtonTradeD, 300, 510, 0.1)
        }
        g.addChild(BUTTON)

        // Buy button
        if (players[game.current_turn].name === JSON.parse(sessionStorage.getItem('user')).name && me.can_buy && throwDices) {
            BUTTON = DrawSprite(ButtonBuy, 1063, appHeight/2-10-2*(game.develop_cards.length), 0.1)
            BUTTON.interactive = true;
            BUTTON.buttonMode = true;
            BUTTON.on('pointerdown', () => {  
                buySound.play()  
                socket.emit('move', JSON.parse(sessionStorage.getItem('user')).accessToken, game.code, { id : MoveType.buy_cards })
            })
        } else {
            BUTTON = DrawSprite(ButtonBuyD, 1063, appHeight/2-10-2*(game.develop_cards.length), 0.1)
        }
        g.addChild(BUTTON)

        // Next turn button
        if (players[game.current_turn].name === JSON.parse(sessionStorage.getItem('user')).name && throwDices) {
            BUTTON = DrawSprite(ButtonNextTurn, 1065, 490, 0.1)
            BUTTON.interactive = true;
            BUTTON.buttonMode = true;
            BUTTON.on('pointerdown', () => {
                click.play()
                socket.emit('move', JSON.parse(sessionStorage.getItem('user')).accessToken, game.code, { id : MoveType.next_turn })
                setThrowDices(false)
                sessionStorage.setItem('throw-dices', false)
            })
        } else {
            BUTTON = DrawSprite(ButtonNextTurnD, 1065, 490, 0.1)
        }
        g.addChild(BUTTON)

        // Dice button
        g.addChild(DrawSprite(Dices[game.dices_res[0]], appWidth-300, 80, 1))
        g.addChild(DrawSprite(Dices[game.dices_res[1]], appWidth-230, 80, 1))
        if (players[game.current_turn].name === JSON.parse(sessionStorage.getItem('user')).name && !throwDices) {
            BUTTON = DrawSprite(ButtonDices, 1015, 115, 0.1)
            BUTTON.interactive = true
            BUTTON.buttonMode  = true
            BUTTON.on('pointerdown', () => {
                diceSound.play()
                setThrowDices(true)
                sessionStorage.setItem('throw-dices', true)
                socket.emit('move', JSON.parse(sessionStorage.getItem('user')).accessToken, game.code, { id : MoveType.roll_dices })
            })
        } else {
            BUTTON = DrawSprite(ButtonDicesD, 1015, 115, 0.1)
        }
        g.addChild(BUTTON);

    }

    function game_phase_final(g, game, me) {
        if(game.winner === me.name){
            g.addChild(DrawSpritePro(Victory, 0, 0, appWidth, appHeight))
        }else{
            g.addChild(DrawSpritePro(Defeat, 0, 0, appWidth, appHeight))
        }
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

        if (game.phase !== 4) {
            // Drawing the board and the UI
            g.addChild(DrawSpritePro(Background, 0, 0, appWidth, appHeight))
            g.addChild(DrawSprite(Ocean, appWidth/2, appHeight/2-30, 0.43))
            // Drawing the develop cards deck
            for (let i = 0; i < game.develop_cards.length; i++) {
                g.addChild(DrawSprite(CardBackground, appWidth-140, appHeight/2-10 - 2*i, 0.2))
            }

            g.addChild(Draw(0xe8a85a, 'Circle', appWidth-40, 430, 15))
            g.addChild(DrawText(game.develop_cards.length, 'EBGaramond', 22, 'black', 'center', {x:appWidth-40, y:430}, 0.5))

            g.addChild(DrawSprite(ColorVillages[parseInt(sessionStorage.getItem('my-turn'))], 965, 500, 0.3))
            g.addChild(Draw(0xe8a85a, 'Circle', 1000, 525, 15))
            g.addChild(DrawText(me.buildings['Villages'], 'EBGaramond', 22, 'black', 'center', {x:1000,y:525}, 0.5))
            
            g.addChild(DrawSprite(ColorCities[parseInt(sessionStorage.getItem('my-turn'))], 890, 500, 0.3))
            g.addChild(Draw(0xe8a85a, 'Circle', 840, 530, 15))
            g.addChild(DrawText(me.buildings['Cities'], 'EBGaramond', 22, 'black', 'center', {x:840,y:530}, 0.5))
            
            g.addChild(DrawSprite(ColorRoads[parseInt(sessionStorage.getItem('my-turn'))], 920 , 445, 0.3))
            g.addChild(Draw(0xe8a85a, 'Circle', 890, 400, 15))
            g.addChild(DrawText(me.buildings['Roads'], 'EBGaramond', 22, 'black', 'center', {x:890,y:400}, 0.5))

            // Drawing the player list:
            let boxes = 0
            let puntos
            let misPuntos
            for (let p = 0; p < players.length; p++) {
                
                if (p !== parseInt(sessionStorage.getItem('my-turn'))) {
                    puntos = players[p].puntos
                    
                    g.addChild(DrawSpritePro(Frame_3, 32, 500 - 45*(boxes+1), 210, 35))
                    g.addChild(Draw((p === game.current_turn) ? PlayersColors[p] : PlayersColorsD[p],  'RoundedRect', 38, 505 - 45*(boxes+1), 197, 25, 2))
                    g.addChild(DrawText(game.players[p].name, 'EBGaramond', 15, (p === game.current_turn) ? 'white' : 'gray', 'left', {x:47, y:(514 - 47*(boxes+1))}, 0))
                    g.addChild(DrawText('PTS: '+puntos, 'EBGaramond', 15, 'white', 'left', {x:185, y:(514 - 47*(boxes+1))}, 0))
                    if(game.board.player_max_knights == game.players[p].name){
                        g.addChild(DrawSprite(KnightIcon, 170, 520 - 47*(boxes+1), 0.04))
                    }
                    if(game.board.player_max_roads == game.players[p].name){

                        g.addChild(DrawSprite(RoadsIcon, 145, 520 - 47*(boxes+1), 0.06))
                    }
                    boxes++
                }else{
                    misPuntos = players[p].puntos
                }
            }

            // Drawing the player box
            g.addChild(DrawSpritePro(Frame_2, 0, appHeight-60, appWidth, 60))
            g.addChild(DrawSpritePro(Frame_3, 32, appHeight-170, 210, 35))
            if (players[game.current_turn].name === JSON.parse(sessionStorage.getItem('user')).name) {
                g.addChild(Draw(PlayersColors[sessionStorage.getItem('my-turn')], 'RoundedRect', 38, appHeight-165, 197, 25, 2))
                g.addChild(DrawText(me.name, 'EBGaramond', 22, 'white', 'left', {x: 44, y:appHeight-165}, 0))
                
            } else {
                g.addChild(Draw(PlayersColorsD[sessionStorage.getItem('my-turn')], 'RoundedRect', 38, appHeight-165, 197, 25, 5))
                g.addChild(DrawText(me.name, 'EBGaramond', 22, 'gray', 'left', {x: 44, y:appHeight-165}, 0))
                
            }
            if (game.board.player_max_knights == JSON.parse(sessionStorage.getItem('user')).name){
                g.addChild(DrawSprite(KnightIcon, 170, appHeight-152, 0.04))
            }
            if (game.board.player_max_roads == JSON.parse(sessionStorage.getItem('user')).name){
                g.addChild(DrawSprite(RoadsIcon, 145, appHeight-152, 0.06))
            }
            g.addChild(DrawText('PTS: '+misPuntos, 'EBGaramond', 15, 'white', 'left', {x: 185, y:appHeight-160}, 0))
            for (let i = 0; i < 5; i++) {
                g.addChild(DrawSpritePro(Frame_6, 27+(71*i), 562, 66, 94))
                g.addChild(DrawSpritePro(Resources[i], 31+(71*i), 566, 58, 85))
                g.addChild(Draw(0xe8a85a, 'Circle', 60+(71*i), 650, 15))
                g.addChild(DrawText(Object.values(me.resources)[i], 'EBGaramond', 14, 'black', 'center', {x:60+(71*i), y:650}, 0.5))
            }

            // Draw special points
            for (let i = 0; i < 5; i++) {
                g.addChild(DrawSpritePro(Frame_6, appWidth-28-(71*(i+1)), 562, 66, 94))
                if (me.develop_cards[PointsNames[4-i]] > 0) {
                    g.addChild(DrawSpritePro(Points[4-i], appWidth-24-(71*(i+1)), 566, 58, 85))
                } else {
                    g.addChild(DrawSpritePro(PointsD[4-i], appWidth-24-(71*(i+1)), 566, 58, 85))
                }
            }

            if (game.phase === 0) {
                game_phase_first_rolls(g, game, players, me)
            } else if (game.phase < 3) {
                game_phase_init(g, game, players, me)
            } else if (game.phase === 3) {
                game_phase_post(g, game, players, me)
            }

            //for (let road_info of RoadsInfo) {
            //    g.addChild(DrawSprite(RoadsDirections[road_info[0]], road_info[2], road_info[3], 0.45))
            //}

            //for (let node_pos of NodesPos) {
            //    g.addChild(DrawSprite(VillageSprite, ...node_pos, 0.35))
            //}

        } else {
            game_phase_final(g, game, me)
        }

    }, [buildMode, buildRoads, knightMode, monopolyMode, yearOfPlentyMode, hasToBuild, selectedPoint, gameChanged, changeMode])
    
    const handleClick = () => {
        let game    = JSON.parse(sessionStorage.getItem('game'))
        if(game.phase ===4){
            gameExit('main-menu'); // Llamar a la función pasada como prop para actualizar activeMenu
        }
    };

    return (
        <div id="game-header" onClick={handleClick}>
            <Stage width={appWidth} height={appHeight}>
                <Graphics draw={draw_game}/>
            </Stage>
        </div>
    );
}

export default Game
