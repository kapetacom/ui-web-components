import React, { useCallback, useState } from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    CircularProgress,
    FormGroup,
    InputAdornment,
    TextField,
} from '@mui/material';
import { DSLResult } from '@kapeta/kaplang-core';
import AssistantIcon from '@mui/icons-material/Assistant';

interface AIAssistProps {
    value?: DSLResult | string;
    placeholder?: string;
    handleGenerate: (prompt: string) => void;
    onSubmit: (content: string) => void;
}

const AIAssist = (props: AIAssistProps) => {
    const [prompt, setPrompt] = useState('');
    const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleGenerate = useCallback(async () => {
        try {
            setSubmitState('loading');
            await props.onSubmit(prompt);
            setSubmitState('success');
            setPrompt('');
        } catch (e) {
            console.log(e);
            setSubmitState('error');
        }
    }, [prompt]);

    return (
        <Accordion defaultExpanded>
            <AccordionSummary aria-controls="panel-content">
                <AssistantIcon /> AI Assistant
            </AccordionSummary>
            <AccordionDetails>
                <FormGroup row>
                    <TextField
                        multiline
                        disabled={submitState === 'loading'}
                        placeholder={props.placeholder || 'Enter text here'}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        InputProps={{
                            onKeyDown: (e) => {
                                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                                    handleGenerate();
                                }
                            },
                        }}
                    />
                    <Button
                        variant="contained"
                        disableElevation
                        onClick={handleGenerate}
                        disabled={submitState === 'loading'}
                        sx={{ position: 'relative' }}
                    >
                        <Box
                            component="span"
                            sx={{ transition: 'opacity 0.2s', opacity: submitState === 'loading' ? 0 : 1 }}
                        >
                            Generate
                        </Box>
                        {submitState === 'loading' ? (
                            <CircularProgress
                                size={24}
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    marginTop: '-12px',
                                    marginLeft: '-12px',
                                }}
                            />
                        ) : null}
                    </Button>
                </FormGroup>
            </AccordionDetails>
        </Accordion>
    );
};

export default AIAssist;
