import React , { useState }from 'react';
import { Link, useNavigate  } from 'react-router-dom'
import logo from '../Catan-logo-1.png'
import '../styles/Login.css'
import '../styles/Common.css'
import * as operations from '../services/operations.js'
import axios from 'axios';

function Login() {

  const [errorMessage, setErrorMessage] = useState("")
  const navigate = useNavigate()

  const usuario = {
    name: "",
    accessToken: "",
  }


  function handleSubmit(event) {
    event.preventDefault(); // Evita que el formulario se envíe de manera predeterminada

    // Aquí se pueden agregar otras validaciones de entrada antes de enviar el formulario
    // Si algo no es válido, se puede detener la ejecución de esta función o mostrar un mensaje de error

    const form = document.getElementById('logFormId'); // Obtiene la referencia del formulario que se envió
    const formData = new FormData(form); // Crea una instancia de FormData para los valores de los campos de entrada
    const plainFormData = Object.fromEntries(formData.entries());
    const formDataJsonString = JSON.stringify(plainFormData);

    var email = plainFormData.email;
    var password = plainFormData.password;
    /*try {
      operations.login(plainFormData.email, plainFormData.password)
      .then(() => {
        navigate('/main');
      })
    } catch (error) {
      // Aquí manejas el error, por ejemplo mostrando un mensaje en pantalla
      console.log(error.message);
    }
    */axios
        .post("/api/login", {
          email,
          password,
        })
        .then((response) => {
          if (response.data.accessToken) {
            console.log(response.data)
            usuario.name = response.data.username;
            usuario.accessToken = response.data.accessToken;
            localStorage.setItem("user", JSON.stringify(usuario));
            navigate('/main');
          } else {
            return response.json().then(err => { throw new Error(err.error.message) })
          }
        }).catch((error) => {
            console.log(error.response.data);
            setErrorMessage(error.toString())
        });
  }


  return (
    <div className='Login-header | Common-Header'>
      <div className='Login-container'>
        <img src={logo} className="Login-logo" alt="logo" />
        <form id='logFormId' onSubmit={handleSubmit} className='login-form'>
          <div className="cover">
            <h1>Log In</h1>

            {errorMessage && (
              <p style={{ color: 'red' }}> {errorMessage} </p>
            )}

            <input className='input-login' type="text" placeholder="EMAIL" name='email' id='email' required />
            <input className='input-login' type="password" placeholder="PASSWORD" name='password' id='password' required />
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
