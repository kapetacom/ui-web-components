import * as React from "react";
import ReactDOM from 'react-dom';
import {OverlayContext, OverlayContextType} from "./OverlayContext";

interface RenderInBodyProps {
    children:any
    className?:string
}

export class RenderInBody extends React.Component<RenderInBodyProps> {

    static contextType = OverlayContext;
    context!: React.ContextType<OverlayContextType>;

    render() {
        const destinationContainer = this.context.container?this.context.container:document.body

        return ReactDOM.createPortal((
            <div className={this.props.className}>
                {this.props.children}
            </div>
        ), destinationContainer);
    }
}