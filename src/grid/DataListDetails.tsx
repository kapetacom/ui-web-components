import React, { useState } from 'react';

import './DataGrid.less';
import { DataGridTheme } from './DataGrid';
import { DataList } from './DataList';

import { ColDef } from 'ag-grid-community';
import { GridApi } from 'ag-grid-community';
import { PanelAlignment, PanelSize, SidePanel } from '../side-panel/SidePanel';
import { Detail, DetailRowValue } from '../detail/Detail';

interface ExtendedColDef<T extends any> extends ColDef<T> {
    showInTable?: boolean;
    headerName: string;
    field: string;
}

interface Props<T> {
    theme?: DataGridTheme;
    rowData?: T[];
    dataLoader?: () => Promise<any[]>;
    columnDefs: ExtendedColDef<T>[];
}

export function DataListDetails<T = any>(props: Props<T>) {
    const [details, setDetails] = useState<T>();
    const [gridApi, setGridAPI] = useState<GridApi>();

    const [showDetails, setShowDetails] = useState(false);

    return (
        <>
            <DataList
                theme={props.theme || DataGridTheme.MATERIAL}
                onDataRowSelected={(data) => {
                    setDetails(data);
                    setShowDetails(true);
                }}
                onGridReady={(event) => {
                    setGridAPI(event.api);
                }}
                onDataRowDeselected={() => {
                    setDetails(undefined);
                    setShowDetails(false);
                }}
                dataLoader={props.dataLoader}
                rowData={props.rowData}
                columnDefs={props.columnDefs.filter((colDef) => colDef.showInTable !== false)}
            />

            <SidePanel
                open={showDetails}
                title={'Details'}
                onClose={() => {
                    setShowDetails(false);
                    gridApi?.deselectAll();
                }}
                side={PanelAlignment.right}
                size={PanelSize.medium}
            >
                {details && (
                    <Detail data={details}>
                        {props.columnDefs.map((colDef, ix) => {
                            return <DetailRowValue key={`row_${ix}`} label={colDef.headerName} name={colDef.field} />;
                        })}
                    </Detail>
                )}
            </SidePanel>
        </>
    );
}
