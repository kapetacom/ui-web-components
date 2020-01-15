import React from 'react';
import { storiesOf } from '@storybook/react';
import {FilePicker, SchemaKindImporter, FileBrowser, FileBrowserDialog} from "../src";
import {FileSystemStore} from '@blockware/ui-web-context';

function createFolderList(path:string) {
    return [
        {
            path: path + '/first-folder',
            folder: true
        },
        {
            path: path + '/second-folder',
            folder: true
        },
        {
            path: path + '/a-yml-file.yml',
            folder: false
        },
        {
            path: path + '/a-json-file.json',
            folder: false
        },
        {
            path: path + '/my-image.png',
            folder: false
        },
        {
            path: path + '/my-document.doc',
            folder: false
        }
    ];
}

const mockFileStore:FileSystemStore = {
    createFolder: (path, folderName) => Promise.resolve(true),
    getHomeFolder: () => { return Promise.resolve('/home') },
    listFilesInFolder: (path:string) => {
        return Promise.resolve(createFolderList(path))
    }
};


storiesOf('File UI', module)
    .add("File Picker - Plain files", () => (
        <div style={{ 'padding': '25px', 'width': '350px', height: '350px' }}>
            <FilePicker maxByteSize={35000} extensions={".yml,.yaml,.json"} multiple={true}
                onChange={(files) => console.log('selection', files)} />
        </div>
    ))
    .add("File Picker - Schema Kind Importer", () => (
        <div style={{ 'padding': '25px', 'width': '350px', height: '350px' }}>
            <SchemaKindImporter onChange={(schemas) => console.log('selection', schemas)} />
        </div>
    ))
    .add("File Browser", () => (
        <div style={{ 'padding': '25px', 'width': '350px', height: '350px' }}>
            <FileBrowser
                service={mockFileStore}
                skipFiles={[]}
                selectable={(file) => file.folder || file.path.endsWith('.yml')}
                onSelect={(file) => console.log('file selection changed', file)} />
        </div>
    ))
    .add("File Browser Modal", () => (
        <div style={{ 'padding': '25px', 'width': '350px', height: '350px' }}>
            <FileBrowserDialog
                ref={(dialog) => dialog && dialog.open ? dialog.open() : null}
                skipFiles={[]}
                service={mockFileStore}
                onClose={() => { }}
                onSelect={(file) => console.log('file selection changed', file)} />
        </div>
    ));




