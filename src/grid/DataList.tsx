/**
 * Copyright 2023 Kapeta Inc.
 * SPDX-License-Identifier: MIT
 */

import React, { useState } from 'react';

import './DataGrid.less';
import { DataGrid, DataGridProps } from './DataGrid';

interface Props<T> extends DataGridProps<T> {
    onDataRowSelected?: (data: T) => any;
    onDataRowDeselected?: () => any;
}

export function DataList<T = any>(props: Props<T>) {
    const defaultProps: Props<T> = {};

    let [selectedRow, setSelectedRow] = useState<number>(-1);

    const innerProps: Props<T> = {
        rowSelection: 'single',
        suppressRowClickSelection: false,
        enableCellTextSelection: true,
        suppressCellFocus: true,
        className: 'data-list',
        onRowClicked(evt) {
            if (evt.node.__objectId === selectedRow) {
                evt.node.setSelected(false, true);
                props.onDataRowDeselected && props.onDataRowDeselected();
            }
        },
        onRowSelected(evt) {
            if (!evt.node.isSelected() || !evt.data || !props.onDataRowSelected) {
                if (evt.node.__objectId === selectedRow) {
                    setSelectedRow(-1);
                }

                return;
            }

            setSelectedRow(evt.node.__objectId);
            selectedRow = evt.node.__objectId;

            props.onDataRowSelected(evt.data);
        },
        ...defaultProps,
        ...props,
    };

    return <DataGrid {...innerProps} />;
}
