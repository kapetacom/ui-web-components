import Path from "path";
import React from "react";
import { action } from "mobx";

import { EntityConfigProps, SchemaKind, FileInfo } from "@blockware/ui-web-types";

import { AssetStore, FileSystemService } from "@blockware/ui-web-context";

import { SidePanel, PanelAlignment, PanelSize } from "../side-panel/SidePanel";
import {FileBrowserDialog} from "../file-browser/FileBrowserDialog";

import {FormContainer} from "../form/FormContainer";
import {FormButtons} from "../form/FormButtons";

import "./EntityImport.less";


interface EntityImportProps {
    assetService: AssetStore
    onDone: () => void
    skipFiles: string[]//A collection of files to prevent importing as they are already loaded
    title: string
    introduction: string
    fileName: string
    createNewKind: () => SchemaKind
    formRenderer: React.ComponentType<EntityConfigProps>
    fileSelectableHandler: (file: FileInfo) => boolean
}


interface EntityImportState {
    importing: boolean
    newEntity: SchemaKind
}

export class EntityImport extends React.Component<EntityImportProps, EntityImportState> {
    private createPanel: SidePanel | null = null;

    private filePanel: FileBrowserDialog | null = null;

    constructor(props: any) {
        super(props);

        this.state = {
            newEntity: this.createNewEntity(),
            importing: false
        };
    }

    private openImportPanel = () => {

        this.setState({
            importing: true
        }, () => {
            this.openFilePanel();
        });
    };

    private openCreatePanel = () => {
        this.resetNewEntity();

        this.setState({
            importing: false
        }, () => {
            this.createPanel && this.createPanel.open();
        });
    };


    private closeCreatePanel = () => {
        this.createPanel && this.createPanel.close();
        this.resetNewEntity();
    };

    private closeImportPanel = () => {
        this.setState({
            importing: false
        }, () => {
            this.closeFilePanel();
        });

        this.resetNewEntity();
    };

    private saveNewEntity = () => {
        this.openFilePanel();
    };

    private openFilePanel = () => {
        console.log("Opening the FilePanel");
        
        this.filePanel && this.filePanel.open();

    };

    private closeFilePanel = () => {
        this.filePanel && this.filePanel.close();
    };

    private onFileSelection = async (file: FileInfo) => {
        try {
            if (this.state.importing) {
                await this.props.assetService.import('file://' + file.path);
                this.closeImportPanel();
            } else {
                await this.props.assetService.create(Path.join(file.path, this.props.fileName), this.state.newEntity);
                this.closeCreatePanel();
            }

            this.markAsDone();
        } catch (err) {
            console.error('Failed on file selection', err.stack);
        }
    };

    private markAsDone() {
        if (!this.props.onDone) {
            return;
        }

        this.props.onDone();
    }

    private createNewEntity() {
        return this.props.createNewKind()
    }

    @action
    private resetNewEntity() {
        this.setState({
            newEntity: this.createNewEntity()
        });
    }

    @action
    private onNewEntityUpdate = (metadata: any, spec: any) => {
        this.setState({
            newEntity: {
                kind: this.props.createNewKind().kind,
                metadata,
                spec
            }
        });
    };

    private selectableHandler = (file: FileInfo) => {
        if (this.state.importing) {
            //Filter the selectable files / folders in the import
            return this.props.fileSelectableHandler(file);
        }

        //When creating we want only folders
        return !!file.folder;
    };

    render() {


        return (
            <div className={'entity-import'}>

                <p className={'intro'}>
                    {this.props.introduction}
                </p>

                <div className={'actions'}>
                    <button type={'button'} className={'friendly'} onClick={this.openCreatePanel}>
                        <i className="fad fa-plus-hexagon" />
                        <span>Create</span>
                    </button>

                    <button type={'button'} className={'friendly'} onClick={this.openImportPanel}>
                        <i className="fad fa-file-import" />
                        <span>Import</span>
                    </button>
                </div>


                <SidePanel
                    ref={(ref) => this.createPanel = ref}
                    size={PanelSize.medium}
                    side={PanelAlignment.right}
                    onClose={this.closeCreatePanel}
                    title={this.props.title} >

                    <div className={'entity-form'}>
                        <FormContainer onSubmit={this.saveNewEntity}>
                            <this.props.formRenderer
                                {...this.state.newEntity}
                                creating={true}
                                onDataChanged={(metadata, spec) => this.onNewEntityUpdate(metadata, spec)}
                            />

                            <FormButtons>
                                <button type={'button'} onClick={this.closeCreatePanel}>Cancel</button>
                                <button type={'submit'}>Create</button>
                            </FormButtons>
                        </FormContainer>
                    </div>
                </SidePanel>

                <FileBrowserDialog
                    ref={(ref) => { this.filePanel = ref }}
                    skipFiles={this.props.skipFiles}
                    service={FileSystemService}
                    onSelect={this.onFileSelection}
                    onClose={this.closeFilePanel}
                    selectable={this.selectableHandler} />

            </div>
        );
    }


}