import React from 'react';
import { toClass } from '@kapeta/ui-web-utils';

import { PanelStructure } from '../helpers/PanelStructure';

import './Modal.less';

import {
    OverlayContext,
    OverlayComponent,
    OverlayContextType,
} from '../overlay/OverlayContext';
import { Draggable } from '../dnd/Draggable';
import { RenderInBody } from '../overlay/RenderInBody';

interface ModalProps {
    title: string;
    size: ModalSize;
    closable?: boolean;

    //Controlled properties
    open?: boolean;
    onClose?: () => void;
    onOpen?: () => void;

    //Uncontrolled properties
    openInitially?: boolean;

    className?: string;
    children: any;
}

interface ModalState {
    open: boolean;
}

export enum ModalSize {
    small = 'small',
    medium = 'medium',
    large = 'large',
}

export class Modal
    extends React.Component<ModalProps, ModalState>
    implements OverlayComponent
{
    static contextType = OverlayContext;
    context!: React.ContextType<OverlayContextType>;

    container: HTMLDivElement | null = null;

    private draggable?: Draggable<any>;

    constructor(props: ModalProps) {
        super(props);

        this.state = {
            open: !!props.openInitially,
        };
    }

    private isControlled(): boolean {
        return 'open' in this.props;
    }

    public isOpen(): boolean {
        return this.isControlled() ? this.props.open : this.state.open;
    }

    public isModal(): boolean {
        return true;
    }

    public isClosable(): boolean {
        return this.props.closable !== false;
    }

    public close() {
        if (this.isControlled()) {
            this.context.onClosing(this);
            this.props.onClose && this.props.onClose();
            return;
        }

        this.setState({
            open: false,
        });

        this.context.onClosing(this);
    }

    public open() {
        if (this.isControlled()) {
            this.props.onOpen && this.props.onOpen();
            if (this.isClosable()) {
                this.context.onChanged(this);
            }
            return;
        }

        this.setState(
            {
                open: true,
            },
            () => {
                if (this.isClosable()) {
                    this.context.onChanged(this);
                }
            }
        );
    }

    componentDidMount() {
        this.context.onAdded(this);

        if (!this.container) {
            return;
        }

        this.draggable = new Draggable<any>(this, {
            elm: this.container,
            handle: '.panel-header > .text',
        });

        this.draggable.start();
    }

    componentWillUnmount() {
        this.context.onRemoved(this);
    }

    private onTransitionEnd = (evt: React.TransitionEvent) => {
        if (evt.propertyName !== 'opacity') {
            return;
        }

        if (this.isOpen()) {
            if (this.props.onOpen) {
                this.props.onOpen();
            }
        } else {
            if (this.props.onClose) {
                this.props.onClose();
            }
        }

        this.context.onChanged(this);
    };

    public render() {
        let classNames = {
            'modal-container': true,
            [this.props.size]: true,
            open: this.isControlled() ? this.props.open : this.state.open,
        };

        const zIndex = this.context.getIndex(this);

        return (
            <RenderInBody className={this.props.className}>
                <div
                    className={toClass(classNames)}
                    style={{ zIndex }}
                    ref={(ref) => (this.container = ref)}
                    onTransitionEndCapture={this.onTransitionEnd}
                >
                    <PanelStructure
                        title={this.props.title}
                        closable={this.props.closable}
                        onClose={() => {
                            this.close();
                        }}
                    >
                        {this.props.children}
                    </PanelStructure>
                </div>
            </RenderInBody>
        );
    }
}
