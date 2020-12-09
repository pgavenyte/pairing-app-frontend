import { Component } from 'react';
import Button from '../../components/UI/Button/Button';
import classes from './Auth.module.css';
import axios from 'axios';

class Auth extends Component {
  state = {
    isSignUp: false,
    error: false,
    username: "",
    password: ""
  }

  onChangeHandler = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  onSubmitHander = (event) => {
    event.preventDefault();
    // real code:
    // const body = {
    //   username: this.state.username,
    //   password: this.state.password
    // };

    //I'm really lazy, so made dummy version
    const body = {
      username: "test@example.com",
      password: "test"
    };
    if(this.state.isSignUp) {
      this.sendSignupRequest(body);
    } else {
      this.sendLoginRequest(body);
    }
  }

  sendSignupRequest = (body) => {
    const url = 'http://localhost:8080/users/sign-up';
    axios.post(url, body)
      .then(response => {
        console.log(response);
        console.log("User created")
        this.sendLoginRequest(body)
      })
  }

  sendLoginRequest = (body) => {
    const url = 'http://localhost:8080/login';
    axios.post(url, body)
      .then(response => {
        console.log(response);
        const jwt = response.headers.authorization.split(" ")[1];
        //get user details from response data, definitely easier way to do this
        let responseData = response.data;
        responseData = responseData.substr(1).slice(0, -1);
        let properties = responseData.split(", ")
        const id = parseInt(properties[0].split("=")[1], 10);
        const username = properties[1].split("=")[1].substr(1).slice(0, -1);
        const user = {
          id: id,
          username: username
        }
        this.props.saveCredentials(jwt, user);
      })
  }

  toggleAuthMode = () => {
    let currentAuthMode = this.state.isSignUp;
    this.setState({
      isSignUp: !currentAuthMode
    })
  }

  render() {
    return(
      <div className={classes.Auth}>
        <form onSubmit={this.onSubmitHander}> 
          <input 
            type="text" 
            placeholder="Username" 
            name="username" 
            onChange={(event) => this.onChangeHandler(event)}/>
          <input 
            type="password" 
            placeholder="Password" 
            name="password" 
            onChange={(event) => this.onChangeHandler(event)} />
          <Button btnType="Success">
            {this.state.isSignUp ? "Create Account" : "Log In"}
          </Button><br/>
        </form>
        <Button 
          btnType="Neutral" 
          clicked={this.toggleAuthMode}>
          {this.state.isSignUp ? 'Already Signed Up?' : 'Sign Up Now'}
        </Button>
      </div>
    )
  }
}

export default Auth;