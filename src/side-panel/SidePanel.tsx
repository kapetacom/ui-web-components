import React from 'react';
import { toClass } from '@kapeta/ui-web-utils';
import { PanelStructure } from '../helpers/PanelStructure';
import {
    OverlayComponent,
    OverlayContextType,
} from '../overlay/OverlayContext';
import { OverlayContext } from '../overlay/OverlayContext';

import './SidePanel.less';
import { RenderInBody } from '../overlay/RenderInBody';

interface SidePanelProps {
    size?: PanelSize;
    side?: PanelAlignment;
    closable?: boolean;
    children: any;
    title?: string;

    //Controlled properties
    open?: boolean;
    onClose?: () => void;
    onOpen?: () => void;

    //Uncontrolled properties
    openInitially?: boolean;

    index?: number;
    modal?: boolean;
    className?: string;
    header?: JSX.Element;
}

interface SidePanelState {
    open: boolean;
}

export enum PanelAlignment {
    left = 'left',
    right = 'right',
}

export enum PanelSize {
    small = 'small',
    medium = 'medium',
    large = 'large',
    full = 'all',
}

export class SidePanel
    extends React.Component<SidePanelProps, SidePanelState>
    implements OverlayComponent
{
    static contextType = OverlayContext;
    context!: React.ContextType<OverlayContextType>;

    constructor(props: SidePanelProps) {
        super(props);

        this.state = {
            open: !!props.openInitially,
        };
    }

    private isControlled(): boolean {
        return 'open' in this.props;
    }

    public isClosable() {
        return this.props.closable !== undefined ? this.props.closable : true;
    }

    public isOpen(): boolean {
        return this.isControlled() ? this.props.open : this.state.open;
    }

    public isModal(): boolean {
        return !!this.props.modal;
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
        if (this.isClosable()) {
            this.context.onAdded(this);
        }
    }

    componentWillUnmount() {
        if (this.isClosable()) {
            this.context.onRemoved(this);
        }
    }

    private onTransitionEnd = (evt: React.TransitionEvent) => {
        if (evt.propertyName !== 'transform') {
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

        if (this.isClosable()) {
            this.context.onChanged(this);
        }
    };

    public render() {
        const size = this.props.size ? this.props.size : PanelSize.small;
        const side = this.props.side ? this.props.side : PanelAlignment.right;

        let classNames = {
            'side-panel-container': true,
            [size]: true,
            [side]: true,
            open: this.isControlled() ? this.props.open : this.state.open,
            current: this.isClosable() ? this.context.isCurrent(this) : true,
        };

        const zIndex = this.isClosable() ? this.context.getIndex(this) : 5;

        return (
            <RenderInBody className={this.props.className}>
                <div
                    onTransitionEndCapture={this.onTransitionEnd}
                    style={{ zIndex }}
                    className={toClass(classNames)}
                >
                    <PanelStructure
                        title={this.props.title || ''}
                        closable={this.props.closable}
                        header={this.props.header}
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
