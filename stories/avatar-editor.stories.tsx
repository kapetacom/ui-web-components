import React, {useState} from 'react';

import './styles.less';
import {AvatarEditor, AvatarResultType} from "../src/avatars/AvatarEditor";
import {ToastContainer} from "../src";

export default {
    title: 'Avatar Editor',
};


export const AvatarEditorFilled = () => {

    const [url, setUrl] = useState('https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png');

    return (
        <div>
            <AvatarEditor url={url} onSave={(file) => {
                return new Promise<void>((resolve) => {
                    setTimeout(() => {
                        console.log('Saved', file);
                        setUrl(file.url);
                        resolve();
                    }, 5000);
                });
            }}/>
        </div>
    );
};


export const AvatarEditorEmpty = () => {

    const [url, setUrl] = useState('');

    return (
        <div>
            <AvatarEditor url={url} onSave={(file) => {
                return new Promise<void>((resolve) => {
                    setTimeout(() => {
                        console.log('OK', file);
                        setUrl(file.url);
                        resolve();
                    }, 5000);
                });
            }}/>
        </div>
    );
};


export const AvatarEditorSync = () => {

    const [url, setUrl] = useState('');

    return (
        <div>
            <ToastContainer />
            <AvatarEditor url={url}
                          resultType={AvatarResultType.DATA_URL}
                          sync={true}
                          maxFileSize={1024 * 50}
                          onSave={(file) => {
                              return new Promise<void>((resolve) => {
                                  setTimeout(() => {
                                      console.log('OK', file);
                                      setUrl(file.url);
                                      resolve();
                                  }, 1000);
                              });
                          }}/>
        </div>
    );
};


export const AvatarEditorFail = () => {

    const [url, setUrl] = useState('');

    return (
        <div>
            <ToastContainer />
            <AvatarEditor url={url} onSave={(file) => {
                return new Promise<void>((resolve, reject) => {
                    setTimeout(() => {
                        console.log('Fail', file);
                        reject(new Error('Failed to save'));
                    }, 5000);
                });
            }}/>
        </div>
    );
};
