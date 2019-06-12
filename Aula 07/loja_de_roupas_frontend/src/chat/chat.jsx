import React from 'react'
import ChatTitle from './chatTitle';
import ChatList from './chatList';
import ChatStruture from './chatStruture';
import ChatSend from './chatSend';

export default props => (
    <ChatStruture>
        <ChatTitle nome="Chat" />
        <ChatList />
        <ChatSend />
    </ChatStruture>
)