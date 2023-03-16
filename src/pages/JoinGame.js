import React from 'react';
import {Link} from 'react-router-dom'
import logo from './Catan-logo-1.png'
import './JoinGame.css'
import './Common.css'

function JoinGame() {

    function handleSubmit(event) {
        event.preventDefault(); // Evita que el formulario se envíe de manera predeterminada
      
        // Aquí se pueden agregar otras validaciones de entrada antes de enviar el formulario
        // Si algo no es válido, se puede detener la ejecución de esta función o mostrar un mensaje de error
      
        const form = document.getElementById('joinGameId'); // Obtiene la referencia del formulario que se envió
        const formData = new FormData(form); // Crea una instancia de FormData para los valores de los campos de entrada
        const plainFormData = Object.fromEntries(formData.entries());
        const formDataJsonString = JSON.stringify(plainFormData);
      
        // Enviar los datos del formulario a través de una solicitud
        fetch('/joinGame', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: formDataJsonString
        })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Error al enviar formulario');
          }
        })
        .then(data => {
          // Manejar la respuesta exitosa del servidor
          console.log('Datos recibidos:', data);
        })
        .catch(error => {
          // Manejar errores de la solicitud
          console.error('Error:', error);
        });
      }

    return (
        <div className='JoinGame-header | Common-Header'>
            <div className='JoinGame-container'>
                <img src={logo} className="JoinGame-logo" alt="logo" />
                <form id='joinGameId' onSubmit={handleSubmit} className='JoinGame-form'>
                    <div className="JoinGame-cover">
                        <h1>INSERT GAME CODE:</h1>
                        <input type="text" placeholder="" name='gamecode' id='gamecode' />
                        <button type='submit' className='Register-btn'>
                            <a className='linkado'>JOIN GAME</a>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default JoinGame;
