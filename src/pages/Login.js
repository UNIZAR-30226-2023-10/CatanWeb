import React from 'react';
import {Link} from 'react-router-dom'
import logo from '../Catan-logo-1.png'
import '../styles/Login.css'
import '../styles/Common.css'

function Login() {

    function handleSubmit(event) {
        event.preventDefault(); // Evita que el formulario se envíe de manera predeterminada
      
        // Aquí se pueden agregar otras validaciones de entrada antes de enviar el formulario
        // Si algo no es válido, se puede detener la ejecución de esta función o mostrar un mensaje de error
      
        const form = document.getElementById('logFormId'); // Obtiene la referencia del formulario que se envió
        const formData = new FormData(form); // Crea una instancia de FormData para los valores de los campos de entrada
        const plainFormData = Object.fromEntries(formData.entries());
        const formDataJsonString = JSON.stringify(plainFormData);
      
        // Enviar los datos del formulario a través de una solicitud
        fetch('/login', {
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
        <div className='Login-header | Common-Header'>
            <div className='Login-container'>
                <img src={logo} className="Login-logo" alt="logo" />
                <div>
                  <Link to='/main'>HOOOOOOOOOOOOOOOOOOOOOOOOOOOOL</Link>
                </div>
                <form id='logFormId' onSubmit={handleSubmit} className='login-form'>
                    <div className="cover">
                        <h1>Log In</h1>
                        <input type="text" placeholder="EMAIL" name='email' id='email' required />
                        <input type="password" placeholder="PASSWORD" name='password' id='password' required />
                        <Link to='/register' className='linkado'>
                            <a>Register here</a>
                        </Link>
                        <button type='submit' className='login-btn'>
                            <a className='linkado'>Log In</a>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;
