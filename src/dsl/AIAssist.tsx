import React, { useCallback, useState } from 'react';
import { Button, TextareaAutosize } from '@mui/material';
import { DSLResult } from '@kapeta/kaplang-core';

interface AIAssistProps {
    value?: DSLResult | string;
    onGenerate: (content: string) => void;
}

const AIAssist = (props: AIAssistProps) => {
    const [prompt, setPrompt] = useState('');
    const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleGenerate = useCallback(async () => {
        try {
            setSubmitState('loading');
            await props.onGenerate(prompt);
            setSubmitState('success');
            setPrompt('');
        } catch (e) {
            console.log(e);
            setSubmitState('error');
        }
    }, [prompt]);

    return (
        <div>
            <TextareaAutosize
                disabled={submitState === 'loading'}
                placeholder="Enter text here"
                value={prompt}
                onChange={(e) => console.log(e) || setPrompt(e.target.value)}
            />
            <Button variant="contained" onClick={handleGenerate} disabled={submitState === 'loading'}>
                Generate
            </Button>
        </div>
    );
};

export default AIAssist;
