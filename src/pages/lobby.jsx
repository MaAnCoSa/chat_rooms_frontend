import React from 'react';
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardHeader,
    MDBCardBody,
    MDBIcon,
    MDBTextArea,
    MDBInput,
    MDBBtn
} from "mdb-react-ui-kit";

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

import Cookies from 'universal-cookie';
import Axios from 'axios';


import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';




export const Lobby = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [ nick, setNick ] = useState("");
    const [ newNickname, setNewNickname ] = useState("");
    const [ code, setCode ] = useState("");

    const username = useSelector(selectCurrentUsername);
    const nicknames = useSelector(selectCurrentRoomNicknames);

    const cookies = new Cookies();

    const createChat = () => {
        console.log("create chat");
        Axios.post("http://localhost:9090/create_room",
        {
            username: username,
            nickname: nick
        }).then(function (response) {
            console.log(response.data);
            let roomId = response.data.roomId;
            console.log(roomId);
            dispatch(setNickname({
                nickname: nick
            }));
            let newNicknameList = [{
                nickname: nick,
                status: "ONLINE",
                notif: 0
            }];
            dispatch(setRoom({
                id: response.data.roomId,
                users: username,
                nicknames: newNicknameList
            }));
            dispatch(startConnecting());

            let today = new Date();
            let tomorrow = today.getDate() + 1;
            cookies.set('roomId', roomId, { path: '/', maxAge: tomorrow });

            navigate("/home");

        }).catch(function (error) {
            console.log(error);
        });
    };

    const joinChat = () => {
        console.log("join chat");
        
        Axios.post("http://localhost:9090/join_room", {
            username: username,
            id: code,
            nickname: newNickname,
            byCookie: false
        }).then(function (response) {
            console.log(response.data);

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
                id: code,
                users: response.data.users,
                nicknames: newNickList
            }));

            

            dispatch(setNickname({
                nickname: response.data.nickname
            }));
            
            console.log("navigating home");
            dispatch(startConnecting());

            cookies.set('roomId', code, { path: '/', expires: new Date(Date.now()+(1000*60*60*24))});

            navigate("/home");

        }).catch(function (error) {
            console.log(error);
        });
    };

    return (
        <div>

            <MDBContainer 
                style={{
                    width: "100%",
                    padding: "50px 0px 0px 0px",

              }}>
                <MDBRow className="justify-content-center"
                    style={{
                        width: "100%",
                        margin: "0",
                        padding: "0"
                }}>
                    <MDBCol 
                    style={{
                        minWidth: "100%",
                        padding: "0"
                    }}>
                        <MDBCard id="chat1"
                            style={{
                                borderRadius: "15px",
                                width: "100%"
                        }}>
                            <MDBCardHeader
                                className="justify-content-between align-items-center p-3 text-white border-bottom-0"
                                style={{
                                    borderTopLeftRadius: "15px",
                                    borderTopRightRadius: "15px",
                                    borderBottomLeftRadius: "15px",
                                    borderBottomRightRadius: "15px",
                                    display: "block",
                                    fontSize: "18px",
                                    backgroundColor: "#1A2737"
                                }}>
                                
                                <div style={{
                                    display: "inline-flex",
                                    width: "100%"
                                }}>
                                    <div style={{
                                        width: "50%",
                                        display: "inline-flex"
                                    }}>
                                        <p className="mb-0"
                                        style={{
                                            fontSize: "30px"
                                        }}><b>Welcome, {username}</b></p>

                                    </div>
                                    
                                    <div style={{
                                        width: "50%",
                                        textAlign: "right"
                                    }}>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => {
                                                dispatch(unsetUser());
                                                navigate("/login");
                                            }}
                                            style={{
                                                borderRadius: "7px",
                                                paddingTop: "7px",
                                                paddingBottom: "7px",
                                                backgroundColor: "#394BA5",
                                                color: "white"
                                            }}>
                                            Log Out
                                        </button>
                                    </div>
                                </div>
                                
                    
                               

                            </MDBCardHeader>

                            
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>



            <MDBContainer style={{
                padding: "0",
                marginTop: "20px"
              }}>
                <MDBRow className="justify-content-center">
                    <MDBCol 
                    style={{
                        width: "100%",
                        marginLeft: "10px",
                        padding: "0"
                    }}>
                        <MDBCard id="chat1" style={{
                            borderRadius: "15px"
                        }}>
                            <MDBCardHeader
                                className="justify-content-between align-items-center p-3 text-white border-bottom-0"
                                style={{
                                    borderTopLeftRadius: "15px",
                                    borderTopRightRadius: "15px",
                                    backgroundColor: "#1A2737"
                                }}
                            >
                            <p className="mb-0 fw-bold"
                                style={{
                                    textAlign: "center"
                                }}>Create new chat room</p>
                            </MDBCardHeader>

                            <MDBCardBody style={{
                                backgroundColor: "#1A3844",
                                borderBottomRightRadius: "15px",
                                borderBottomLeftRadius: "15px",
                                color: "white"
                                
                            }}>

                                <p>Introduce nickname for new chat room:</p>
                                        <MDBInput value={nick}
                                            onChange={(e) => setNick(e.target.value)}
                                            wrapperClass='mb-4'
                                            label='New nickname'
                                            id='form2'
                                            type='text'
                                            style={{
                                                backgroundColor: "#3F5269",
                                                color: "white"
                                            }}/>
                                
                                
                                        <button onClick={createChat}
                                            className="mb-4"
                                            type="submit"
                                            style={{
                                                borderRadius: "7px",
                                                paddingTop: "7px",
                                                paddingBottom: "7px",
                                                backgroundColor: "#394BA5",
                                                color: "white"
                                            }}>
                                                Create new chat
                                        </button>
                                
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>


            <MDBContainer style={{
                padding: "0",
                marginTop: "20px"
              }}>
                <MDBRow className="justify-content-center">
                    <MDBCol 
                    style={{
                        width: "100%",
                        marginLeft: "10px",
                        padding: "0"
                    }}>
                        <MDBCard id="chat1" style={{
                            borderRadius: "15px"
                        }}>
                            <MDBCardHeader
                                className="justify-content-between align-items-center p-3 text-white border-bottom-0"
                                style={{
                                    borderTopLeftRadius: "15px",
                                    borderTopRightRadius: "15px",
                                    backgroundColor: "#1A2737"
                                }}
                            >
                            <p className="mb-0 fw-bold"
                                style={{
                                    textAlign: "center"
                                }}>Join existing chat room</p>
                            </MDBCardHeader>

                            <MDBCardBody style={{
                                backgroundColor: "#1A3844",
                                borderBottomRightRadius: "15px",
                                borderBottomLeftRadius: "15px",
                                color: "white"
                                
                            }}>

                                <p>Introduce code for the chat room:</p>
                                <MDBInput value={newNickname}
                                    onChange={(e) => setNewNickname(e.target.value)}
                                    wrapperClass='mb-4'
                                    label='New nickname'
                                    id='form2'
                                    type='text'
                                    style={{
                                        backgroundColor: "#3F5269",
                                        color: "white"
                                    }}/>
                                <MDBInput value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    wrapperClass='mb-4'
                                    label='Room ID'
                                    id='form2'
                                    type='text'
                                    style={{
                                        backgroundColor: "#3F5269",
                                        color: "white"
                                    }}/>
                        
                        
                                <button onClick={joinChat}
                                    className="mb-4"
                                    type="submit"
                                    style={{
                                        borderRadius: "7px",
                                        paddingTop: "7px",
                                        paddingBottom: "7px",
                                        backgroundColor: "#394BA5",
                                        color: "white"
                                    }}>
                                        Join chat room
                                </button>
                                
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
            

            


            
        </div>
    );
}