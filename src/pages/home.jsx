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
    MDBInput
} from "mdb-react-ui-kit";
  
import {
    setUser,
    unsetUser,
    connectionEstablished,
    startConnecting,
    selectCurrentUsername,
    selectCurrentRoom,
    selectCurrentStatus,
    selectCurrentIsConnected,
    selectCurrentNickname,
    unsetNickname,
    updateStatus,
    unsetConnection,
    setNickname
  } from '../reducers/user/userSlice.js';
  
  import {
      setRoom,
      unsetRoom,
      addUser,
      resetNotif,
      setNicknames,
      selectCurrentRoomId,
      selectCurrentRoomUsers,
      selectCurrentRoomNicknames
  } from '../reducers/room/roomSlice.js';
  
  import {
      setConversation,
      unsetConversation,
      setReceiver,
      submitMessage,
      selectCurrentMessageList,
      selectCurrentConversation,
      selectCurrentReceiver
  } from '../reducers/messages/messagesSlice.js';
  
  import { useSelector, useDispatch } from 'react-redux';
  
  import { useEffect, useState, useRef } from 'react';
  
  import { useNavigate } from 'react-router-dom';
  
  import Axios from 'axios';
  
  
  
  
  export const Home = () => {
  
      //const { username } = useSelector(state => state.user);
      const { userdata, setUserData } = useState({
          username: "",
          receiverName: "",
          connected: false,
          message: ""
      });
  
      const dispatch = useDispatch();
      const navigate = useNavigate();
  
      const [ content, setContent ] = useState("");
      const [ newNick, setNewNick ] = useState("");
      const [ userStatus, setUserStatus ] = useState("ONLINE");
      const messagesRef = useRef(null)
  
  
      let socket;
      let stompClient;
      const username = useSelector(selectCurrentUsername);
      const nickname = useSelector(selectCurrentNickname);
      const status = useSelector(selectCurrentStatus);
      const room = useSelector(selectCurrentRoom);
      const isConnected = useSelector(selectCurrentIsConnected);
  
      const roomId = useSelector(selectCurrentRoomId);
      const roomNicknames = useSelector(selectCurrentRoomNicknames);
  
      const messages = useSelector(selectCurrentMessageList);
      const conversation = useSelector(selectCurrentConversation);
      const receiver = useSelector(selectCurrentReceiver);
  
      const openConversation = (nick) => {
          console.log("OPEN CONVERSATION WITH: ");
          console.log(nick);
          dispatch(setReceiver({
              receiver: nick
          }));
          let newNicks = [];
          for (let i = 0; i < roomNicknames.length; i++) {
              if (roomNicknames[i].nickname == nick) {
                  newNicks.push({
                      nickname: nick,
                      status: roomNicknames[i].status,
                      notif: 0
                  });
              } else {
                  newNicks.push(roomNicknames[i]);
              }
          }
          dispatch(setNicknames({
              nicknames: newNicks
          }));
  
          console.log(roomId);
          Axios.post("http://localhost:9090/open_conversation",
          {
              id: "",
              roomId: roomId,
              user1: username,
              user2: nick,
              messages: []
          }).then(function (response) {
              console.log(response.data);
              dispatch(setConversation({
                  conversation: response.data.id,
                  selectedNickname: nick,
                  messageList: response.data.messages
                }));
              
          }).catch(function (error) {
              console.log(error);
          });
  
          dispatch(resetNotif());
          
      };
  
      useEffect(() => {
          if (!isConnected) {
              console.log("ROOM NICKNAMES");
              console.log(roomNicknames);
          }
      }, []);

    
    const listStyle = {
        
    };

    const notifIndicator = {
        width: "50px",
        height: "50px",
        background: {},
        "MozBorderRadius": "50px",
        "WebkitBorderRadius": "50px",
        "borderRadius": "50px",
        "marginRight": "10px"
    }

  
  
    return (
          <div style={{
            marginLeft: "auto",
            marginRight: "auto",
            maxWidth: "1000px",
            color: "white"
          }}>
              
              

              <MDBContainer 
                style={{
                    width: "100%",
                    margin: "0",
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
                                width: "100%",
                                backgroundColor: "black"
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
                                }}
                            >
                                <p className="mb-0"><b>ROOM ID:</b> {roomId}</p>
                                <p className="mb-0"><b>USER:</b> {username}</p>
                                <p className="mb-10"><b>NICKNAME:</b> {nickname}</p>
                                
                                <div style={{
                                    display: "inline-flex",
                                    width: "100%"
                                }}>
                                    <div style={{
                                        width: "50%",
                                        display: "inline-flex"
                                    }}>
                                        <p><b>STATUS:</b></p>
                                        <select name="Status" class="form-select" aria-label="Default select example" id="status_select"
                                        style={{
                                            marginLeft: "10px",
                                            marginRight: "20%",
                                            backgroundColor: "#1A3844",
                                            color: "white"
                                        }}
                                        onChange={
                                            (e) => {
                                                dispatch(updateStatus({
                                                    nickname: nickname,
                                                    status: e.target.value
                                                }));
                                                setUserStatus(e.target.value);
                            
                                            }}>
                                            <option value="ONLINE">ONLINE</option>
                                            <option value="AWAY">AWAY</option>
                                            <option value="OFFLINE">OFFLINE</option>
                                        </select>
                                    </div>
                                    
                                    <div style={{
                                        width: "50%",
                                        textAlign: "right"
                                    }}>
                                        <button
                                            style={{
                                                marginRight: "10px",
                                                borderRadius: "7px",
                                                paddingTop: "7px",
                                                paddingBottom: "7px",
                                                backgroundColor: "#394BA5",
                                                color: "white"
                                            }}
                                            className="btn btn-primary"
                                            onClick={() => {
                                                dispatch(updateStatus({
                                                    nickname: nickname,
                                                    status: "OFFLINE"
                                                }));
                                                dispatch(unsetRoom());
                                                dispatch(unsetConversation());
                                                dispatch(unsetUser());
                                                dispatch(unsetConnection());
                                                navigate("/login");
                                            }}>
                                            Log Out
                                        </button>
                            
                                        <button
                                        style={{
                                            marginRight: "10px",
                                            borderRadius: "7px",
                                            paddingTop: "7px",
                                            paddingBottom: "7px",
                                            backgroundColor: "#394BA5",
                                            color: "white"
                                        }}
                                            className="btn btn-primary"
                                            onClick={() => {
                                                dispatch(updateStatus({
                                                    nickname: nickname,
                                                    status: "OFFLINE"
                                                }));
                                                dispatch(unsetRoom());
                                                dispatch(unsetConversation());
                                                dispatch(unsetNickname());
                                                dispatch(unsetConnection());
                                                navigate("/lobby");
                                            }}>
                                            Exit Room
                                        </button>
                                    </div>
                                </div>
                                
                    
                               

                            </MDBCardHeader>

                            
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
            

            <div style={{
                display: "inline-flex",
                width: "100%",
                marginTop: "10px",
                textAlign: "left"
            }}>
              <MDBContainer style={{
                maxWidth: "300px",
                padding : "0"
              }}>
                <div
                style={{
                    padding: "0",
                    marginRight: "10px",
                    width: "100%"
                }}>
                    <MDBCol 
                    style={{
                        padding: "0"
                    }}>
                        <MDBCard id="chat1" style={{
                                borderRadius: "15px",
                                width: "100%",
                                backgroundColor: "#1982C4",
                                margin: "0",
                                padding: "0"
                            }}>
                            <MDBCardHeader
                                className="d-flex justify-content-between align-items-center p-3 text-white border-bottom-0"
                                style={{
                                    borderTopLeftRadius: "15px",
                                    borderTopRightRadius: "15px",
                                    backgroundColor: "#1A2737"
                                }}
                            >
                            <MDBIcon fas icon="angle-left" />
                                <p className="mb-0 fw-bold">Room members</p>
                                <MDBIcon fas icon="times" />
                            </MDBCardHeader>

                            <MDBCardBody style={{
                                backgroundColor: "#1A3844",
                                borderBottomRightRadius: "15px",
                                borderBottomLeftRadius: "15px",
                                minHeight: "490px"
                            }}>

                                {roomNicknames.length == 1 ? (
                                    <div>
                                        <p>No other users in the room.</p>
                                    </div>
                                ) : (
                                    <ul style={{
                                        "listStyleType": "none",
                                        padding: 0,
                                        margin: 0,
                                        height: "460px",
                                        overflow: "auto",
                                        overflowY: "scroll"
                                    }}>
                                        {roomNicknames.map((nick) => {
                                            let statusColor = nick.status == "ONLINE" ? "#277745" : (nick.status == "OFFLINE" ? "#99403F" : "#8B7200");
                                            let notifColor = nick.status == "AWAY" ? "black" : "white";
                                            if (nick.nickname != nickname) {
                                                return <li
                                                    key={nick.nickname}
                                                    >
                                                    <div className="d-flex flex-row justify-content-left mb-4"
                                                        onClick={() => {
                                                            openConversation(nick.nickname);
                                                            }}>
                                                        <div style={{
                                                            width: "50px",
                                                            height: "50px",
                                                            background: statusColor,
                                                            "MozBorderRadius": "50px",
                                                            "WebkitBorderRadius": "50px",
                                                            "borderRadius": "50px",
                                                            "marginRight": "10px",
                                                            color: notifColor,
                                                            fontSize: "30px",
                                                            textAlign: "center"
                                                        }}>
                                                            {nick.notif != 0 ? nick.notif : ""}
                                                        </div>
                                                        <div
                                                            className="p-3 me-3 border"
                                                            style={{
                                                                borderRadius: "15px",
                                                                backgroundColor: "#53505D",
                                                                color: "white",
                                                                borderColor: "#53505D"
                                                            }}
                                                        >
                                                            <p className="small mb-0">
                                                                {nick.status} {nick.nickname}
                                                            </p>
                                                        </div>
                                                        
                                                    </div>
                                                    </li>
                                            }
                                        })}
                                    </ul>
                                )}

                                

                                
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </div>
            </MDBContainer>
  



            <MDBContainer style={{
                padding: "0"
              }}>
                <MDBRow className="justify-content-center">
                    <MDBCol 
                    style={{
                        width: "100%",
                        marginLeft: "10px"
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
                                }}>Chat with: {receiver}</p>
                            </MDBCardHeader>

                            <MDBCardBody style={{
                                backgroundColor: "#1A3844",
                                borderBottomRightRadius: "15px",
                                borderBottomLeftRadius: "15px",
                                color: "white"
                                
                            }}>

                                {conversation == "" ? (
                                    <div>
                                        <p>No conversation selected.</p>
                                    </div>
                                ) : (messages.length == 0 ? (
                                    <div>
                                        <p>No messages yet.</p>
                                    </div>
                                ) : (
                                    
                                    <div>

                                    <ul style={{
                                        "listStyleType": "none",
                                        padding: 0,
                                        margin: 0,
                                        height: "350px",
                                        overflow: "auto",
                                        overflowY: "scroll"
                                    }}>
                                    {messages.map((message, i) => {
                                        let sender = message.senderName == username ? nickname : receiver;
                                        
                                        
                                        return sender == receiver ? (
                                            <li key={i}>
                                            <div className="d-flex flex-row justify-content-start mb-4">
                                                <div>
                                                    <p>{sender}</p>
                                                </div>
                                                <div
                                                    className="p-3 ms-3"
                                                    style={{
                                                        borderRadius: "15px",
                                                        backgroundColor: "#3D444D",
                                                        borderColor: "#3D444D"
                                                }}
                                                >
                                                    <p className="small mb-0">
                                                        {message.message}
                                                    </p>
                                                </div>
                                            </div>
                                            </li>
                                        ) : (
                                            <li key={i}>
                                            <div className="d-flex flex-row justify-content-end mb-4"
                                                style={{
                                                    marginRight: "20px"
                                                }}>
                                                <div
                                                    className="p-3 me-3 border"
                                                    style={{
                                                        borderRadius: "15px",
                                                        backgroundColor: "#2F5847",
                                                        borderColor: "#2F5847"
                                                    }}
                                                >
                                                    <p className="small mb-0">
                                                        {message.message}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p>{sender}</p>
                                                </div>
                                            </div>
                                            </li>
                                        );
                                    })}
                                    </ul>
                                    </div>
                                ))}

                                <MDBTextArea
                                    className="form-outline"
                                    id="textAreaExample"
                                    rows={2}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    wrapperclass='mb-4'
                                    type='text'
                                    style={{
                                        backgroundColor: "#3F5269",
                                        color: "white",
                                        marginBottom: "10px"
                                    }}
                                />
                                <button
                                    style={{
                                        marginRight: "10px",
                                        borderRadius: "7px",
                                        paddingTop: "7px",
                                        paddingBottom: "7px",
                                        backgroundColor: "#394BA5",
                                        color: "white"
                                    }}
                                    className="btn btn-primary"
                                    onClick={() => {
                                        let date = new Date();
                                        dispatch(submitMessage({
                                            roomId: roomId,
                                            senderName: username,
                                            receiverName: receiver,
                                            message: content,
                                            date: date.toString()
                                        }));
                                        setContent("");
                                    }}>
                                    Send message
                                </button>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>

            </div>
  
  
          </div>
    
    );
  }