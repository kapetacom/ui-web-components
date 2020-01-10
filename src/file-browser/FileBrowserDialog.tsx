import React, { createRef } from "react";
import {FileInfo} from "@blockware/ui-web-types";
import {FileBrowser} from "./FileBrowser";
import {Modal, ModalSize} from "../modal/Modal";
import {FileSystemStore} from "@blockware/ui-web-context";

import './FileBrowserDialog.less';

interface FileBrowserDialogProps {
    service: FileSystemStore
    onSelect: (file:FileInfo) => void
    onClose: () => void
    selectable: (file:FileInfo) => boolean
    open?: boolean
    skipFiles:string[] //files that already are imported
}

interface FileBrowserDialogState {
    selection?:FileInfo
}

export class FileBrowserDialog extends React.Component<FileBrowserDialogProps, FileBrowserDialogState> {

    private modal = createRef<Modal>();

    constructor(props: FileBrowserDialogProps) {
        super(props);
        this.state = {};
    }

    private onSelect(selection?:FileInfo) {
        this.setState({
            selection
        });
    }

    private selectFile() {
        if (!this.state.selection) {
            return;
        }

        this.props.onSelect(this.state.selection);

        this.setState({
            selection: undefined
        });
    }

    public open() {
        this.modal.current && this.modal.current.open();
    }

    public close() {
        this.modal.current && this.modal.current.close();
    }

    render() {

        return (

            <Modal ref={this.modal}
                size={ModalSize.medium}
                title={'Choose file'}
                className={'file-browser-dialog'}
            >

                <FileBrowser
                    skipFiles={this.props.skipFiles}
                    service={this.props.service}
                    selectable={this.props.selectable}
                    selection={this.state.selection}
                    onSelect={(file) => this.onSelect(file)} />

                <div className={'file-browser-actions'}>
                    <button type={'button'}
                        disabled={!this.state.selection}
                        onClick={() => this.selectFile()}>
                        Select
                        </button>
                </div>
            </Modal>

        );
    }
}