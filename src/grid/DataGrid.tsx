import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';

import './DataGrid.less';
import { AgGridReactProps, AgReactUiProps } from 'ag-grid-react/lib/shared/interfaces';
import { SimpleLoader } from '../helpers/SimpleLoader';

export enum DataGridTheme {
    ALPINE = 'alpine',
    ALPINE_DARK = 'alpine-dark',
    BALHAM = 'balham',
    BALHAM_DARK = 'balham-dark',
    MATERIAL = 'material',
}

export interface DataGridProps<T> extends AgGridReactProps<T>, AgReactUiProps<T> {
    theme?: DataGridTheme;
    dataLoader?: () => Promise<any[]>;
}

const DefaultGridLoader = (props: {}) => {
    return (
        <div className={'data-grid-loader'}>
            <SimpleLoader loading={true} />
        </div>
    );
};

const DefaultGridEmpty = (props: {}) => {
    return <div className={'data-grid-empty'}>No rows found.</div>;
};

export function DataGrid<TData = any>(props: DataGridProps<TData>) {
    const gridRef = useRef(null);

    const defaultColDef = useMemo(
        () => ({
            resizable: true,
            sortable: true,
        }),
        []
    );

    const overrideProps: DataGridProps<TData> = {};

    if (props.dataLoader) {
        overrideProps.onGridReady = async (evt) => {
            if (props.onGridReady) {
                props.onGridReady(evt);
            }

            const api = evt.api;
            api.showLoadingOverlay();
            const rows = props.dataLoader ? await props.dataLoader() : [];

            if (!gridRef.current) {
                return;
            }

            api.setRowData(rows);

            if (rows.length > 0) {
                api.hideOverlay();
            } else {
                api.showNoRowsOverlay();
            }
        };
    }

    const innerProps: DataGridProps<TData> = {
        animateRows: true,
        pagination: true,
        paginationAutoPageSize: true,
        defaultColDef,
        rowSelection: 'multiple',
        suppressRowClickSelection: true,
        enableCellTextSelection: false,
        suppressCellFocus: false,
        theme: DataGridTheme.MATERIAL,
        loadingOverlayComponent: DefaultGridLoader,
        noRowsOverlayComponent: DefaultGridEmpty,
        onGridSizeChanged: (evt) => {
            evt.api.sizeColumnsToFit();
        },
        ...props,
        ...overrideProps,
    };

    return (
        <div className={`data-grid ag-theme-${innerProps.theme}`}>
            <AgGridReact ref={gridRef} {...innerProps} />
        </div>
    );
}
