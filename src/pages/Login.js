import React , { useState }from 'react';
import { Link, useNavigate  } from 'react-router-dom'
import logo from '../Catan-logo-1.png'
import '../styles/Login.css'
import '../styles/Common.css'

function Login() {

  const [errorMessage, setErrorMessage] = useState("")
  const navigate = useNavigate()


  function handleSubmit(event) {
    event.preventDefault(); // Evita que el formulario se envíe de manera predeterminada

    // Aquí se pueden agregar otras validaciones de entrada antes de enviar el formulario
    // Si algo no es válido, se puede detener la ejecución de esta función o mostrar un mensaje de error

    const form = document.getElementById('logFormId'); // Obtiene la referencia del formulario que se envió
    const formData = new FormData(form); // Crea una instancia de FormData para los valores de los campos de entrada
    const plainFormData = Object.fromEntries(formData.entries());
    const formDataJsonString = JSON.stringify(plainFormData);

    // Enviar los datos del formulario a través de una solicitud
    fetch('/api/login', {
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
          return response.json().then(err => { throw new Error(err.error.message) })
        }
      })
      .then(data => {
          navigate("/main")
      })
      .catch(error => {
        setErrorMessage(error.toString())
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

            {errorMessage && (
              <p style={{ color: 'red' }}> {errorMessage} </p>
            )}

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
