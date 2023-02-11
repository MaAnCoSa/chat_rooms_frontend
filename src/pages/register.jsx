import React from 'react';
import {
  MDBContainer,
  MDBInput,
  MDBBtn
}
from 'mdb-react-ui-kit';
import { useState } from 'react';
import Axios from 'axios';

import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../reducers/user/userSlice.js';

export const Register = () => {
    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const regClick = () => {
        console.log("Username " + username);
        console.log("Password " + password);
        Axios.post("http://localhost:9090/register", {
            username: username,
            password: password
        }).then(function (response) {
            console.log(response.data);
            dispatch(setUser({
                username: username
            }))
            navigate("/lobby");

        }).catch(function (error) {
            console.log(error);
        });
        dispatch(setUser({
            username: username,
            password: password
        }));
    };

    const toLogin = () => {
        navigate("/login");
    }

    return (
        <div
        style={{
            color: "white",
            marginLeft: "auto",
            marginRight: "auto",
            marginBottom: "0px",

            paddingTop: "100px",
            paddingBotom: "1000px",
            height: "100%",
            width: "50%",
            display: "flex",
            flexFlow: "column",
        }}>
        
            <h1>
                Register
            </h1>
            <MDBInput value={username}
                onChange={(e) => setUsername(e.target.value)}
                wrapperClass='mb-4'
                label='Username'
                id='form1'
                type='text'
                style={{
                    backgroundColor: "#3F5269",
                    color: "white"
                }}/>
            <MDBInput value={password}
                onChange={(e) => setPassword(e.target.value)}
                wrapperClass='mb-4'
                label='Password'
                id='form2'
                type='password'
                style={{
                    backgroundColor: "#3F5269",
                    color: "white"
                }}/>
    
    
            <button onClick={regClick}
                className="mb-4"
                type="submit"
                style={{
                    borderRadius: "7px",
                    paddingTop: "7px",
                    paddingBottom: "7px",
                    backgroundColor: "#394BA5",
                    color: "white"
                }}>
                    Sign up
            </button>

            <button onClick={toLogin}
                className="mb-4"
                type="submit"
                style={{
                    borderRadius: "7px",
                    paddingTop: "7px",
                    paddingBottom: "7px",
                    backgroundColor: "#394BA5",
                    color: "white"
                }}>
                    Already a user
            </button>


            <div style={{
                paddingTop: "300px",
                marginTop: "auto",
                marginBottom: "100px",
                textAlign: "center"
            }}>
                <p>By Manuel Cota</p>
            </div>

    
        </div>
      );
}