import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    Box,
    Paper,
    TextField,
    IconButton,
    Typography,
    CircularProgress,
    AppBar,
    Toolbar,
    Link,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { Link as RouterLink } from 'react-router-dom';

function Chatbot() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [conversationId, setConversationId] = useState(null);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    const handleSend = useCallback(async () => {
        if (!input.trim()) return;

        const userMessage = {
            role: 'user',
            content: input.trim()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setError(null);

        const sendMessage = async (retryCount = 0) => {
            try {
                console.log('Sending message to chatbot:', userMessage);
                const response = await fetch('https://wj8f4hnic4.execute-api.us-east-1.amazonaws.com/default/y_chatbot', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                        messages: [...messages, userMessage],
                        conversation_id: conversationId
                    }),
                });

                console.log('Chatbot response status:', response.status);

                if (!response.ok) {
                    throw new Error(`Server error: ${response.status}`);
                }

                const data = await response.json();
                console.log('Chatbot response data:', data);

                if (!data.response) {
                    throw new Error('Invalid response format');
                }

                if (!conversationId && data.conversation_id) {
                    setConversationId(data.conversation_id);
                }

                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: data.response,
                }]);
            } catch (error) {
                console.error('Error communicating with chatbot:', error);
                if (retryCount < 2) {
                    console.log('Retrying request...');
                    sendMessage(retryCount + 1);
                } else {
                    setError('Sorry, I encountered an error. Please try again later.');
                    setMessages(prev => [...prev, {
                        role: 'assistant',
                        content: 'Sorry, I encountered an error. Please try again later.',
                    }]);
                }
            } finally {
                setIsLoading(false);
            }
        };

        sendMessage();
    }, [input, messages, conversationId]);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    useEffect(() => {
        const loadConversation = async (id) => {
            try {
                const response = await fetch(`https://wj8f4hnic4.execute-api.us-east-1.amazonaws.com/default/y_chatbot/conversation/${id}`);
                const data = await response.json();
                setMessages(data.messages);
            } catch (error) {
                console.error('Error loading conversation:', error);
            }
        };

        const urlParams = new URLSearchParams(window.location.search);
        const conversationIdFromUrl = urlParams.get('conversation_id');
        if (conversationIdFromUrl) {
            setConversationId(conversationIdFromUrl);
            loadConversation(conversationIdFromUrl);
        } else {
            setMessages([{
                role: 'assistant',
                content: 'Hello! How can I help you today?'
            }]);
        }
    }, []);

    return (
        <Box sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative'
        }}>
            {/* Chat Container */}
            <Box sx={{
                flexGrow: 1,
                p: 2,
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}>
                {messages.map((message, index) => (
                    <Paper
                        key={index}
                        sx={{
                            p: 2,
                            maxWidth: '80%',
                            alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                            bgcolor: message.role === 'user' ? 'primary.light' : 'background.paper',
                            color: message.role === 'user' ? 'white' : 'text.primary',
                        }}
                    >
                        <Typography>{message.content}</Typography>
                    </Paper>
                ))}
                {isLoading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress />
                    </Box>
                )}
                {error && (
                    <Typography color="error" sx={{ mt: 2 }}>
                        {error}
                    </Typography>
                )}
                <div ref={messagesEndRef} />
            </Box>

            {/* Input Area */}
            <Paper
                sx={{
                    p: 2,
                    borderTop: 1,
                    borderColor: 'divider',
                }}
                elevation={3}
            >
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                        fullWidth
                        multiline
                        maxRows={4}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        variant="outlined"
                        size="small"
                    />
                    <IconButton
                        color="primary"
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                    >
                        <SendIcon />
                    </IconButton>
                </Box>
            </Paper>
        </Box>
    );
}

export default Chatbot;

