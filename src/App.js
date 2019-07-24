import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import './app.css'
import api from './utils/api'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.logout = this.logout.bind(this)

    api.setupAuthInterceptor(props.history)

    this.state = {
      token: localStorage.getItem('token'),
    }
  }

  logout(e) {
    e.preventDefault()

    const { history } = this.props

    localStorage.removeItem('token')
    this.setState({ token: null })

    history.push('/login')
  }

  render() {
    const { children } = this.props
    const { token } = this.state

    return (
      <Fragment>
        <nav className="navbar navbar-light bg-light">
          <Link className="navbar-brand mb-0 h1" to="/">
            Test technique Totem
          </Link>
          {!token && (
            <Link className="navbar-brand mb-0 h1" to="/login">
              Login
            </Link>
          )}
          {token && (
            <a className="navbar-brand mb-0 h1" href="#" onClick={this.logout}>
              Logout
            </a>
          )}
        </nav>
        {children}
        <div className="container">
          <footer className="footer">&copy; 2017 - Totem by Ingima</footer>
        </div>
      </Fragment>
    )
  }
}
