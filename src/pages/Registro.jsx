import React, { Component } from 'react'

class Registro extends Component {
    render() {
        return (
            <div className="Auth-form-container">
                <form className="Auth-form">
                    <div className="Auth-form-content">

                        {/* Cabecera */}
                        <h3 className="Auth-form-title">Inicio de sesión</h3>

                        {/* Campo email */}
                        <div className="form-group mt-3">
                            <label>Correo electrónico</label>
                            <input
                                type="email"
                                className="form-control mt-1"
                                placeholder="Introducir correo"
                            />
                        </div>

                        { /* Campo contraseña */}
                        <div className="form-group mt-3">
                            <label>Contraseña</label>
                            <input
                                type="password"
                                className="form-control mt-1"
                                placeholder="Introducir contraseña"
                            />
                        </div>

                        { /* Campo contraseña repetido */}
                        <div className="form-group mt-3">
                            <label>Verificar contraseña</label>
                            <input
                                type="password"
                                className="form-control mt-1"
                                placeholder="Repetir contraseña"
                            />
                        </div>

                        {/* Boton registro debe enviar registro */}
                        <div className="d-grid gap-2 mt-3">
                            <button type="button" className="btn btn-primary">
                                Registrarte
                            </button>
                        </div>

                    </div>
                </form>
            </div>
        )
    }
}

export default Registro