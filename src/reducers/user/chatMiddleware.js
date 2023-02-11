import * as SockJS from "sockjs-client";
import * as Stomp from "stompjs";

import {
    connectionEstablished,
    startConnecting,
    unsetConnection,
    updateUser,
    updateStatus
} from './userSlice.js';

import {
    setRoom,
    selectCurrentRoomId,
    setNicknames,
    resetNotif
} from '../room/roomSlice.js';

import {
    submitMessage,
    setConversation
} from '../messages/messagesSlice.js';


const chatMiddleware = (store) => {

    let stompClient;

    return (next) => (action) => {
        const isConnectionEstablished = store.getState().user.isConnected;
        console.log(isConnectionEstablished);
        console.log(action);
        if (startConnecting.match(action) && !isConnectionEstablished) {
            const connect = () => {
                let sockJS = new SockJS("http://localhost:9090/ws");
                stompClient = Stomp.over(sockJS);
                stompClient.connect(
                    {
                        username: store.getState().user.username,
                        status: store.getState().user.status,
                        room: store.getState().user.room
                    },
                    onConnected,
                    onError
                );
            }

            const onMessageReceived = (data) => {
                console.log("MESSAGE RECEIVED")
                console.log(data);
                let res = JSON.parse(data.body);
                console.log(res);

                store.dispatch(setConversation({
                    conversation: res.id,
                    selectedNickname: store.getState().messages.selectedNickname,
                    messageList: res.messages
                }));
                let stats = store.getState().room.nicknames;
                let newStats = [];
                console.log(stats);
                for (let i = 0; i < stats.length; i++) {
                    let newNotif;

                    let isUser1 = stats[i].nickname == res.user1 && res.user1 != store.getState().user.nickname;
                    let isUser2 = stats[i].nickname == res.user2 && res.user2 != store.getState().user.nickname;
                    if (isUser1 || isUser2) {
                        if (isUser1) {
                            newNotif = res.notif1;
                        } else {
                            newNotif = res.notif2;
                        }
                        newStats.push({
                            nickname: stats[i].nickname,
                            status: stats[i].status,
                            notif: parseInt(newNotif)
                        });
                    } else {
                        newStats.push(stats[i]);
                    }
                }
                console.log("OLD STATS:");
                console.log(stats);
                console.log("NEW STATS:");
                console.log(newStats);

                console.log(store.getState().room.nicknames);

                store.dispatch(setNicknames({
                    nicknames: newStats
                }));
                
            };

            const onUpdateReceived = (data) => {
                console.log("USER UPDATE RECEIVED!!")

                let res = JSON.parse(data.body);
                console.log(res);
                for (let i = 0; i < res.length; i++) {
                    if (typeof res[i].notif === 'string' || res[i].notif instanceof String) {
                        res[i].notif = parseInt(res[i].notif);
                    }
                }
                
                store.dispatch(setNicknames({
                    nicknames: res
                }))
                console.log(data);
            }
            
            const onConnected = () => {
                console.log("Connected");
                store.dispatch(connectionEstablished());
            
                stompClient.subscribe(
                    "/user/" + store.getState().room.id + "/" + store.getState().user.username,
                    onMessageReceived
                );

                stompClient.subscribe(
                    "/user_updates/" + store.getState().room.id,
                    onUpdateReceived
                );

                console.log("updating user");
                stompClient.send(
                    "/app/room/" + store.getState().room.id + "/" + store.getState().user.username,
                    {},
                    JSON.stringify(
                        store.getState().room.nicknames
                    )
                );
            };
            
            const onError = (error) => {
                console.log(error);
            };

            connect();
        }

        if (unsetConnection.match(action) && isConnectionEstablished) {
            stompClient.disconnect();
        }

        if (updateStatus.match(action) && isConnectionEstablished) {
            console.log("middleware");
            let newNicknames = [];
            let oldNicknames = store.getState().room.nicknames;
            console.log("PAYLOAD STATUS:")
            console.log(action.payload.status);

            console.log(oldNicknames);
            let len = oldNicknames.length;
            for (let i = 0; i < len; i++) {
                if (oldNicknames[i].nickname == store.getState().user.nickname) {
                    newNicknames.push({
                        nickname: oldNicknames[i].nickname,
                        status: action.payload.status,
                        notif: action.payload.notif
                    });
                } else {
                    newNicknames.push(oldNicknames[i]);
                }
            }
            
            console.log(newNicknames);
            stompClient.send(
                "/app/room/" + store.getState().room.id + "/" + store.getState().user.username + "/update_statuses",
                {},
                JSON.stringify(
                    newNicknames
                )
            );
        }

        if (resetNotif.match(action) && isConnectionEstablished) {
            console.log("middleware");
            
            stompClient.send(
                "/app/room/" + store.getState().room.id + "/" + store.getState().user.username + "/" + store.getState().messages.conversation + "/update_statuses",
                {},
                JSON.stringify(
                    store.getState().room.nicknames
                )
            );
        }

        if (submitMessage.match(action) && isConnectionEstablished) {
            console.log("middleware");
            
            stompClient.send(
                "/app/message/" + store.getState().room.id + "/" + store.getState().user.username,
                {},
                JSON.stringify(
                    action.payload
                )
            );
        }


        next(action);
    };
};


export default chatMiddleware;