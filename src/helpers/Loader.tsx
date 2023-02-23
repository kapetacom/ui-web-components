import React, { useEffect, useState } from 'react';
import { toClass } from '@blockware/ui-web-utils';

interface LoaderProps {
    load: () => Promise<JSX.Element>;
}

interface LoaderState {
    loading: boolean;
    error: boolean;
    content?: JSX.Element;
}

export const Loader = (props: LoaderProps) => {
    const initialState: LoaderState = {
        loading: true,
        error: false,
    };

    const [state, setState] = useState(initialState);

    useEffect(() => {
        if (!state.loading) {
            return;
        }

        props
            .load()
            .then((content) => {
                setState({
                    loading: false,
                    content: content,
                    error: false,
                });
            })
            .catch((err) => {
                setState({ loading: false, error: true });
            });
    });

    const className = toClass({
        'box-loader': true,
        loader: state.loading,
    });

    return (
        <div className={className}>
            {!state.loading && state.content && state.content}

            {!state.loading && state.error && <>FAILED TO LOAD</>}
        </div>
    );
};
