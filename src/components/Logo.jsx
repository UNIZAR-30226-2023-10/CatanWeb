
import React, { Component } from 'react'
import styled from 'styled-components'

import logo from '../logo.svg'

const Wrapper = styled.a.attrs({
    className: 'navbar-brand',
})``

class Logo extends Component {
    render() {
        return (
            <Wrapper href="http://localhost:3000">
                <img src={logo} width="50" height="50" alt="Logo" />
            </Wrapper>
        )
    }
}

export default Logo