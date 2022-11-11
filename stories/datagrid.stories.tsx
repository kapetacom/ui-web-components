import React from 'react';

import './styles.less';
import {DataGrid, DataGridTheme, DataList, DataListDetails, OverlayContainer} from "../src";

const RAW_DATA = [
    {
        ownerId: '1234-124-124123',
        asset: {
            kind: 'blocks.blockware.com/v1/frontend',
            metadata: {
                name: 'Service Block Type',
                id: 'blocks.blockware.com/v1/Service',
                version: '1.2.3'
            },
            spec: {}
        }
    },
    {
        ownerId: '1234-124-124123',
        asset: {
            kind: 'blocks.blockware.com/v1/frontend',
            metadata: {
                name: 'Core Block Type',
                id: 'core.blockware.com/v1/BlockType',
                version: '1.2.2'
            },
            spec: {}
        }
    },
    {
        ownerId: '1234-124-124123',
        asset: {
            kind: 'blocks.blockware.com/v1/frontend',
            metadata: {
                name: 'Java8 Target',
                id: 'targets.blockware.com/v1/Java8-SpringBoot2',
                version: '1.2.1'
            },
            spec: {}
        }
    }
];

export default {
    title: 'DataGrid'
};

export const SimpleDataGrid = () => {

    return (
        <DataGrid
            theme={DataGridTheme.MATERIAL}
            rowData={RAW_DATA.map(row => {
                return {
                    id: row.asset.metadata.id,
                    kind: row.asset.kind,
                    version: row.asset.metadata.version,
                    ownerName: 'Blockware'
                }
            })}
            columnDefs={[
                {
                    field: 'id',
                    headerName: 'ID'
                },
                {
                    field: 'kind',
                    headerName: 'Kind',
                    filter: true,
                    width: 280
                },
                {
                    field: 'version',
                    headerName: 'Version',
                    filter: true
                },
                {
                    field: 'ownerName',
                    headerName: 'Owner',
                    filter: true
                }
            ]}
        />
    );

};

export const SimpleDataList = () => {

    return (
        <DataList
            theme={DataGridTheme.MATERIAL}
            onDataRowSelected={(data) => {
                console.log('selected row', data);
            }}
            rowData={RAW_DATA.map(row => {
                return {
                    id: row.asset.metadata.id,
                    kind: row.asset.kind,
                    version: row.asset.metadata.version,
                    ownerName: 'Blockware'
                }
            })}
            columnDefs={[
                {
                    field: 'id',
                    headerName: 'ID'
                },
                {
                    field: 'kind',
                    headerName: 'Kind',
                    filter: true,
                    width: 280
                },
                {
                    field: 'version',
                    headerName: 'Version',
                    filter: true
                },
                {
                    field: 'ownerName',
                    headerName: 'Owner',
                    filter: true
                }
            ]}
        />
    );
};


export const DataListWithDetails = () => {

    return (
        <OverlayContainer>
            <DataListDetails
                theme={DataGridTheme.MATERIAL}
                rowData={RAW_DATA.map(row => {
                    return {
                        id: row.asset.metadata.id,
                        kind: row.asset.kind,
                        version: row.asset.metadata.version,
                        ownerName: 'Blockware'
                    }
                })}
                columnDefs={[
                    {
                        field: 'id',
                        headerName: 'ID'
                    },
                    {
                        field: 'kind',
                        headerName: 'Kind',
                        filter: true,
                        width: 280
                    },
                    {
                        field: 'version',
                        headerName: 'Version',
                        filter: true
                    },
                    {
                        field: 'ownerName',
                        headerName: 'Owner',
                        showInTable: false,
                        filter: true
                    }
                ]}
            />

        </OverlayContainer>
    );

};


export const AsyncDataGrid = () => {

    const loader = (): Promise<any[]> => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(RAW_DATA.map(row => {
                    return {
                        id: row.asset.metadata.id,
                        kind: row.asset.kind,
                        version: row.asset.metadata.version,
                        ownerName: 'Blockware'
                    }
                }))
            }, 5000);
        })
    }

    return (
        <DataGrid
            theme={DataGridTheme.MATERIAL}
            dataLoader={loader}
            columnDefs={[
                {
                    field: 'id',
                    headerName: 'ID'
                },
                {
                    field: 'kind',
                    headerName: 'Kind',
                    filter: true,
                    width: 280
                },
                {
                    field: 'version',
                    headerName: 'Version',
                    filter: true
                },
                {
                    field: 'ownerName',
                    headerName: 'Owner',
                    filter: true
                }
            ]}
        />
    );

};
