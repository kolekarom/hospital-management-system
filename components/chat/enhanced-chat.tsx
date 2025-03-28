'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Send, Upload, Download, Bot, User, Paperclip, File } from "lucide-react";
import { pinFileToIPFS, pinJSONToIPFS, getFromIPFS } from "@/utils/ipfs-pinata";
import IPFSViewer from '../ipfs/ipfs-viewer';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: Array<{
    name: string;
    cid: string;
    url: string;
    type: string;
  }>;
}

interface EnhancedChatProps {
  aiModel?: string;
  initialContext?: string;
  onSendMessage?: (message: string, attachments?: any[]) => Promise<string>;
}

export default function EnhancedChat({ 
  aiModel = 'GPT-4',
  initialContext = 'You are a helpful medical assistant.',
  onSendMessage 
}: EnhancedChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<Array<{
    file: File;
    preview?: string;
  }>>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    const newAttachments = files.map(file => ({
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }));
    
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const uploadAttachments = async () => {
    const uploadedFiles = await Promise.all(
      attachments.map(async ({ file }) => {
        const result = await pinFileToIPFS(file);
        return {
          name: file.name,
          cid: result.IpfsHash,
          url: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
          type: file.type
        };
      })
    );
    return uploadedFiles;
  };

  const handleSend = async () => {
    if (!input.trim() && attachments.length === 0) return;

    try {
      setLoading(true);
      setError(null);

      let uploadedAttachments: any[] = [];
      if (attachments.length > 0) {
        uploadedAttachments = await uploadAttachments();
      }

      const newMessage: Message = {
        id: Math.random().toString(36).substring(7),
        role: 'user',
        content: input,
        timestamp: new Date(),
        attachments: uploadedAttachments
      };

      setMessages(prev => [...prev, newMessage]);
      setInput('');
      setAttachments([]);

      if (onSendMessage) {
        const response = await onSendMessage(input, uploadedAttachments);
        
        const assistantMessage: Message = {
          id: Math.random().toString(36).substring(7),
          role: 'assistant',
          content: response,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          AI Medical Assistant ({aiModel})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-[500px] overflow-y-auto p-4 space-y-4 border rounded-lg">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'
              }`}
            >
              <Avatar>
                {message.role === 'assistant' ? (
                  <Bot className="h-5 w-5" />
                ) : (
                  <User className="h-5 w-5" />
                )}
                <AvatarFallback>
                  {message.role === 'assistant' ? 'AI' : 'You'}
                </AvatarFallback>
              </Avatar>

              <div className={`flex flex-col gap-2 max-w-[80%] ${
                message.role === 'assistant' ? 'items-start' : 'items-end'
              }`}>
                <div className={`rounded-lg p-3 ${
                  message.role === 'assistant' 
                    ? 'bg-secondary text-secondary-foreground' 
                    : 'bg-primary text-primary-foreground'
                }`}>
                  {message.content}
                </div>

                {message.attachments && message.attachments.length > 0 && (
                  <div className="space-y-2">
                    {message.attachments.map((attachment, index) => (
                      <div key={index}>
                        {attachment.type.startsWith('image/') ? (
                          <IPFSViewer initialCID={attachment.cid} showInput={false} />
                        ) : (
                          <a
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
                          >
                            <Paperclip className="h-4 w-4" />
                            {attachment.name}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <span className="text-xs text-gray-500">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="relative group"
                >
                  {attachment.preview ? (
                    <img
                      src={attachment.preview}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded">
                      <File className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <button
                    onClick={() => setAttachments(prev => prev.filter((_, i) => i !== index))}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              ref={fileInputRef}
              className="hidden"
            />
            
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1"
              rows={1}
              disabled={loading}
            />
            
            <Button
              onClick={handleSend}
              disabled={loading || (!input.trim() && attachments.length === 0)}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
