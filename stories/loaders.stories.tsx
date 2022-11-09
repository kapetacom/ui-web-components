import React from 'react';
import {Loader, LoaderType, SimpleLoader} from '../src';

export default {
    title: 'Loaders'
}

export const ShowSimpleLoader = () => {
    return (
        <div style={{padding: '20px'}}>
            <SimpleLoader type={LoaderType.CIRCLE} loader={() => new Promise(() => {})}>
                Shows when loaded
            </SimpleLoader>

            <SimpleLoader type={LoaderType.GRID} loader={() => new Promise(() => {})}>
                Shows when loaded
            </SimpleLoader>

            <SimpleLoader type={LoaderType.DEFAULT} loader={() => new Promise(() => {})}>
                Shows when loaded
            </SimpleLoader>

            <SimpleLoader type={LoaderType.DUAL_RING} loader={() => new Promise(() => {})}>
                Shows when loaded
            </SimpleLoader>

            <SimpleLoader type={LoaderType.ELLIPSIS} loader={() => new Promise(() => {})}>
                Shows when loaded
            </SimpleLoader>

            <SimpleLoader type={LoaderType.FACEBOOK} loader={() => new Promise(() => {})}>
                Shows when loaded
            </SimpleLoader>

            <SimpleLoader type={LoaderType.RING} loader={() => new Promise(() => {})}>
                Shows when loaded
            </SimpleLoader>

            <SimpleLoader type={LoaderType.HEART} loader={() => new Promise(() => {})}>
                Shows when loaded
            </SimpleLoader>

            <SimpleLoader type={LoaderType.HOURGLASS} loader={() => new Promise(() => {})}>
                Shows when loaded
            </SimpleLoader>

            <SimpleLoader type={LoaderType.RIPPLE} loader={() => new Promise(() => {})}>
                Shows when loaded
            </SimpleLoader>

            <SimpleLoader type={LoaderType.ROLLER} loader={() => new Promise(() => {})}>
                Shows when loaded
            </SimpleLoader>

            <SimpleLoader type={LoaderType.SPINNER} loader={() => new Promise(() => {})}>
                Shows when loaded
            </SimpleLoader>
        </div>
    )
}

export const ShowLoader = () => {
    return (
        <div style={{padding: '20px'}}>
            <Loader load={() => new Promise<JSX.Element>(() => {})}/>
        </div>
    )
}


