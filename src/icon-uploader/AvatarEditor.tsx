import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Avatar, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Fab, Paper, Zoom} from "@mui/material";

interface Props {
    url: string;
    onSave: (file: FileInfo) => Promise<void> | void;
    fallbackIcon?: string;
    size?: number
}

enum UploadStatus {
    IDLE,
    PREPARING,
    UPLOADING,
    DONE,
    ERROR
}

export interface FileInfo {
    name: string;
    url: string;
    size: number;
    mimeType: string;
    data: string | ArrayBuffer;
}

async function readFile(file: File): Promise<FileInfo> {
    const url = getUrl(file);
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const fileInfo: FileInfo = {
                name: file.name,
                size: file.size,
                mimeType: file.type,
                url,
                data: e.target.result
            }
            resolve(fileInfo);
        };
        reader.readAsArrayBuffer(file);
    });
}

function getUrl(file: File): string {
    return URL.createObjectURL(file);
}

export const AvatarEditor = (props: Props) => {
    const [state, setState] = useState<UploadStatus>(UploadStatus.IDLE);
    const [currentUrl, setCurrentUrl] = useState(props.url);
    const [filePickerKey, setFilePickerKey] = useState(1);
    const [selectedValue, setSelectedValue] = useState<FileInfo>();

    const inputRef = useRef<HTMLInputElement>()

    const size = props.size ?? 100;

    const onFileChange = useCallback(async (evt) => {
        const files = evt.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            setState(UploadStatus.PREPARING);

            const fileInfo = await readFile(file);
            setSelectedValue(fileInfo);
            setFilePickerKey(filePickerKey + 1);
            setCurrentUrl(fileInfo.url);
        } else {
            setCurrentUrl(props.url);
            setState(UploadStatus.IDLE);
        }
    }, [inputRef.current]);

    const showButtons = state !== UploadStatus.IDLE;

    const buttonSx = {
        ...(state === UploadStatus.DONE && {
            bgcolor: 'success.light',
            '&:hover': {
                bgcolor: 'success.light',
            },
        }),
        ...(state === UploadStatus.ERROR && {
            bgcolor: 'error.light',
            '&:hover': {
                bgcolor: 'error.light',
            },
        })
    };

    return (
        <Box sx={{
            width: size,
            height: size,
            position: 'relative',
            display: 'inline-block',
            input: {
                opacity: 0,
                display: 'block',
                width: '100%',
                height: '100%',
                cursor: 'pointer',
                position: 'absolute',
                zIndex: 1,
                top: 0,
                left: 0
            }
        }}>
            <input type={'file'}
                   key={'file_' + filePickerKey}
                   ref={inputRef}
                   accept={'image/*'}
                   onChange={onFileChange}/>


            <Avatar
                variant='rounded'
                sx={{
                    width: size,
                    height: size,
                    fontSize: size / 2,
                    backgroundColor: currentUrl ? 'transparent' : 'text.secondary',
                }} src={currentUrl} >
                <i className={props.fallbackIcon ?? 'fa fa-image'}/>
            </Avatar>
            {showButtons && <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                position: 'absolute',
                paddingTop: '5px',
                top: size,
                left: 0,
                width: size

            }}>
                <Zoom in={true}>
                    <Box sx={{ m: 0, position: 'relative' }}>
                        {state === UploadStatus.UPLOADING && (
                            <CircularProgress
                                size={46}
                                sx={{
                                    position: 'absolute',
                                    top: -3,
                                    left: -3,
                                    zIndex: 1,
                                }}
                            />
                        )}
                        <Fab size='small'
                             color="primary"
                             sx={buttonSx}
                             disabled={state === UploadStatus.UPLOADING}
                             aria-label="save"
                             onClick={async () => {
                            if (!selectedValue) {
                                setState(UploadStatus.IDLE);
                                return;
                            }
                            setState(UploadStatus.UPLOADING);
                            try {
                                await props.onSave(selectedValue);
                                setState(UploadStatus.DONE);
                            } catch (e) {
                                setSelectedValue(undefined);
                                setCurrentUrl(props.url);
                                setState(UploadStatus.ERROR);
                            } finally {
                                setTimeout(() => {
                                    setState(UploadStatus.IDLE);
                                }, 1000);
                            }
                        }}>
                            {state === UploadStatus.DONE && <i className={'fas fa-check'} />}
                            {state === UploadStatus.ERROR && <i className="fas fa-exclamation"></i>}
                            {state === UploadStatus.PREPARING && <i className="fa fa-save"></i>}
                            {state === UploadStatus.UPLOADING && <i className="fa fa-save"></i>}
                        </Fab>
                    </Box>
                </Zoom>
                <Zoom in={true}>
                    <Fab size='small'
                         disabled={state !== UploadStatus.PREPARING}
                         color="warning"
                         aria-label="cancel" onClick={() => {
                        setCurrentUrl(props.url);
                        setSelectedValue(undefined);
                        setState(UploadStatus.IDLE);
                    }}>
                        <i className={'fa fa-times'}/>
                    </Fab>
                </Zoom>
            </Box>}

        </Box>
    )
}
