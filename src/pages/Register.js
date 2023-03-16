import React from 'react';
import {Link} from 'react-router-dom'
import logo from './src/Catan-logo-1.png'
import '../styles/Register.css'
import '../styles/Common.css'

function Register() {

    function handleSubmit(event) {
        event.preventDefault(); // Evita que el formulario se envíe de manera predeterminada
      
        // Aquí se pueden agregar otras validaciones de entrada antes de enviar el formulario
        // Si algo no es válido, se puede detener la ejecución de esta función o mostrar un mensaje de error
      
        const form = document.getElementById('regFormId'); // Obtiene la referencia del formulario que se envió
        const formData = new FormData(form); // Crea una instancia de FormData para los valores de los campos de entrada
        const plainFormData = Object.fromEntries(formData.entries());
        const formDataJsonString = JSON.stringify(plainFormData);
      
        // Enviar los datos del formulario a través de una solicitud
        fetch('/register', {
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
        <div className='Register-header | Common-Header'>
            <div className='Register-container'>
                <img src={logo} className="Register-logo" alt="logo" />
                <form id='regFormId' onSubmit={handleSubmit} className='register-form'>
                    <div className="Register-cover">
                        <h1>Register</h1>
                        
                        <input type="text" placeholder="EMAIL" name='email' id='email' required/>
                        <input type="text" placeholder="USERNAME" name='username' id='username' required />
                        <input type="password" placeholder="PASSWORD" name='password' id='password' required/>
                        <input type="password" placeholder="REPEAT PASSWORD" name='confirm_password' id='confirm_password' required/>
                        <Link to='/login' className='linkado'>
                            <a>Go back to login</a>
                        </Link>
                        <button type='submit' className='Register-btn'>
                            <a className='linkado'>Register</a>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register;
