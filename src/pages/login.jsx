import React from 'react';
import {
  MDBContainer,
  MDBInput,
  MDBBtn
}
from 'mdb-react-ui-kit';

import {
    setUser,
    unsetUser,
    connectionEstablished,
    startConnecting,
    setNickname,
    selectCurrentUsername,
    selectCurrentRoom,
    selectCurrentStatus,
    selectCurrentIsConnected,
    updateUser,
    updateStatus
} from '../reducers/user/userSlice.js';

import {
    selectCurrentRoomNicknames,
    setRoom,
    unsetRoom
} from '../reducers/room/roomSlice.js';

import { useState } from 'react';
import Axios from 'axios';
import Cookie from 'universal-cookie';

import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

export const Login = () => {
    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const joinChat = (roomId) => {
        console.log("join chat");
        Axios.post("http://localhost:9090/join_room", {
            username: username,
            id: roomId,
            nickname: "",
            byCookie: true
        }).then(function (response) {
            console.log(response.data);
            if (response.data.customException != null) {
                navigate("/lobby");
            } else if (response.data.users.includes(username)) {
                let roomUsers = response.data.users;

                dispatch(updateStatus({
                    nickname: response.data.nickname,
                    status: "ONLINE"
                }));
                
                let newNickList = [];
                let len = response.data.nicknames.length;
                for (let i = 0; i < len; i++) {
                    newNickList.push({
                        nickname: response.data.nicknames[i],
                        status: response.data.statuses[i]
                    });
                }
                dispatch(setRoom({
                    id: roomId,
                    users: roomUsers,
                    nicknames: newNickList
                }));

                

                dispatch(setNickname({
                    nickname: response.data.nickname
                }));
    
                dispatch(startConnecting());
                navigate("/home");
            } else {
                navigate("/lobby");
            }

            

        }).catch(function (error) {
            console.log(error);
        });
    };

    const regClick = () => {
        console.log("Username " + username);
        console.log("Password " + password);
        Axios.post("http://localhost:9090/log", {
            username: username,
            password: password
        }).then(function (response) {
            //console.log(response);
            console.log(response.data);
            dispatch(setUser({
                username: username,
                status: "ONLINE",
                room: "1"
            }));

            const cookie = new Cookie();
            let id = cookie.get("roomId");
            console.log(id);
            if (id == null || id == "") {
                navigate("/lobby");
            } else {
                joinChat(id);
            }


        }).catch(function (error) {
            console.log(error);
        });
        dispatch(setUser({
            username: username,
            password: password
        }));
    };

    const toRegister = () => {
        navigate("/register");
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
                Login
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
                    Sign in
            </button>

            <button onClick={toRegister}
                className="mb-4"
                type="submit"
                style={{
                    borderRadius: "7px",
                    paddingTop: "7px",
                    paddingBottom: "7px",
                    backgroundColor: "#394BA5",
                    color: "white"
                }}>
                    Create an account
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