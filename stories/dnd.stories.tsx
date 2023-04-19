import React from 'react';
import { storiesOf } from '@storybook/react';
import { DnDContainer, DnDDrag, DnDDrop } from '../src';

import './styles.less';

const dropHandler = (string, value, dimensions) => {
    console.log('DROPPED', string, value, dimensions);
};

storiesOf('Drag and Drop', module)
    .add('HTML: Can drag and drop into different zones', () => (
        <div className={'container'}>
            <div className={'dnd-container'}>
                <DnDContainer overflowX={true} overflowY={true}>
                    <div>
                        <DnDDrag type={'test'} value={true}>
                            <div className={'draggable test'} style={{ left: 20, top: 10 }}>
                                Drag TEST
                            </div>
                        </DnDDrag>

                        <DnDDrag type={'other'} value={true}>
                            <div className={'draggable other'} style={{ left: 20, top: 100 }}>
                                Drag OTHER
                            </div>
                        </DnDDrag>

                        <div className={'dnd-scrolling'}>
                            <DnDDrop type={'test'} onDrop={dropHandler}>
                                <div className={'droppable'} style={{ left: 200, top: 10 }}>
                                    Drop TEST here
                                </div>
                            </DnDDrop>

                            <DnDDrop type={'other'} onDrop={dropHandler}>
                                <div className={'droppable'} style={{ left: 200, top: 200 }}>
                                    Drop OTHER here
                                </div>
                            </DnDDrop>

                            <DnDDrop type={'test'} onDrop={dropHandler}>
                                <div className={'droppable'} style={{ left: 500, top: 310 }}>
                                    Drop TEST here
                                </div>
                            </DnDDrop>

                            <DnDDrop type={'other'} onDrop={dropHandler}>
                                <div className={'droppable'} style={{ left: 500, top: 500 }}>
                                    Drop OTHER here
                                </div>
                            </DnDDrop>
                        </div>
                    </div>
                </DnDContainer>
            </div>
        </div>
    ))
    .add('HTML: Can drag and drop into scrollable big zone', () => (
        <div className={'container'}>
            <div className={'dnd-container'}>
                <DnDContainer overflowX={true} overflowY={true}>
                    <div>
                        <DnDDrag type={'test'} value={true}>
                            <div className={'draggable test'} style={{ left: 20, top: 10 }}>
                                Drag TEST
                            </div>
                        </DnDDrag>

                        <DnDDrag type={'other'} value={true}>
                            <div className={'draggable other'} style={{ left: 20, top: 100 }}>
                                Drag OTHER
                            </div>
                        </DnDDrag>

                        <DnDDrop type={'test'} onDrop={dropHandler}>
                            <div className={'dnd-scrolling'}>
                                <div className={'droppable big'} style={{ left: 100, top: 10 }}>
                                    Drop TEST here
                                </div>
                            </div>
                        </DnDDrop>
                    </div>
                </DnDContainer>
            </div>
        </div>
    ))
    .add('HTML: Can move draggable within droppable zone', () => {
        return (
            <div className={'container'}>
                <div className={'dnd-container'}>
                    <DnDContainer overflowX={true} overflowY={true}>
                        <div>
                            <DnDDrop type={'test'} onDrop={dropHandler}>
                                <div className={'drag-container dnd-scrolling droppable big'}>
                                    <DnDDrag type={'test'} value={true} dragCopy={false} container={'.drag-container'}>
                                        <div className={'draggable test'} style={{ left: 20, top: 10 }}>
                                            Drag TEST
                                        </div>
                                    </DnDDrag>

                                    <DnDDrag type={'other'} value={true} dragCopy={false} container={'.drag-container'}>
                                        <div className={'draggable other'} style={{ left: 20, top: 100 }}>
                                            Drag OTHER
                                        </div>
                                    </DnDDrag>
                                </div>
                            </DnDDrop>
                        </div>
                    </DnDContainer>
                </div>
            </div>
        );
    })
    .add('SVG: Can drag and drop into different zones', () => (
        <div className={'container'}>
            <div className={'dnd-container'}>
                <DnDContainer overflowX={true} overflowY={true}>
                    <div>
                        <DnDDrag type={'test'} value={true}>
                            <svg className={'draggable test'} style={{ top: 10, left: 20 }} width={50} height={50}>
                                <rect width={50} height={50} />
                                <text y={25} x={0}>
                                    TEST
                                </text>
                            </svg>
                        </DnDDrag>

                        <DnDDrag type={'other'} value={true}>
                            <svg className={'draggable other'} style={{ top: 100, left: 20 }} width={50} height={50}>
                                <rect width={50} height={50} />
                                <text y={25} x={0}>
                                    OTHER
                                </text>
                            </svg>
                        </DnDDrag>

                        <div className={'dnd-scrolling'}>
                            <svg width={600} height={600}>
                                <DnDDrop type={'test'} onDrop={dropHandler}>
                                    <svg className={'droppable'} x={20} y={10} width={100} height={100}>
                                        <rect width={100} height={100} />
                                        <text y={50} x={0}>
                                            Drag TEST here
                                        </text>
                                    </svg>
                                </DnDDrop>

                                <DnDDrop type={'other'} onDrop={dropHandler}>
                                    <svg className={'droppable'} x={20} y={200} width={100} height={100}>
                                        <rect width={100} height={100} />
                                        <text y={50} x={0}>
                                            Drag OTHER here
                                        </text>
                                    </svg>
                                </DnDDrop>

                                <DnDDrop type={'test'} onDrop={dropHandler}>
                                    <svg className={'droppable'} x={500} y={310} width={100} height={100}>
                                        <rect width={100} height={100} />
                                        <text y={50} x={0}>
                                            Drag TEST here
                                        </text>
                                    </svg>
                                </DnDDrop>

                                <DnDDrop type={'other'} onDrop={dropHandler}>
                                    <svg className={'droppable'} x={500} y={500} width={100} height={100}>
                                        <rect width={100} height={100} />
                                        <text y={50} x={0}>
                                            Drag OTHER here
                                        </text>
                                    </svg>
                                </DnDDrop>
                            </svg>
                        </div>
                    </div>
                </DnDContainer>
            </div>
        </div>
    ))
    .add('SVG: Can move draggable within droppable zone (Zoom 0.5)', () => (
        <div className={'container'}>
            <div className={'dnd-container'}>
                <DnDContainer overflowX={true} overflowY={true} zoom={0.5}>
                    <div
                        className={'dnd-container-inner'}
                        style={{
                            transform: 'scale(.5)',
                            transformOrigin: '0 0',
                        }}
                    >
                        <DnDDrop type={'test'} onDrop={dropHandler}>
                            <div className={'dnd-scrolling droppable big'}>
                                <svg width={750} height={600} className={'drag-container'}>
                                    <DnDDrag type={'test'} value={true} dragCopy={false} container={'.drag-container'}>
                                        <svg className={'draggable test'} x={20} y={10}>
                                            <rect width={50} height={50} />
                                            <text y={25} x={0}>
                                                TEST
                                            </text>
                                        </svg>
                                    </DnDDrag>

                                    <DnDDrag type={'other'} value={true} dragCopy={false} container={'.drag-container'}>
                                        <svg className={'draggable other'} x={20} y={100}>
                                            <rect width={50} height={50} />
                                            <text y={25} x={0}>
                                                OTHER
                                            </text>
                                        </svg>
                                    </DnDDrag>
                                </svg>
                            </div>
                        </DnDDrop>
                    </div>
                </DnDContainer>
            </div>
        </div>
    ))
    .add('SVG: Can move draggable SVG group (Zoom 2)', () => (
        <div className={'container'}>
            <div className={'dnd-container'}>
                <DnDContainer overflowX={true} overflowY={true} zoom={2}>
                    <div className={'dnd-container-inner'} style={{ zoom: 2 }}>
                        <DnDDrop type={'test'} onDrop={dropHandler}>
                            <div className={'dnd-scrolling droppable big'}>
                                <svg width={750} height={600} className={'drag-container'}>
                                    <DnDDrag type={'test'} value={true} dragCopy={false} container={'.drag-container'}>
                                        <g className={'draggable test'} transform="translate(20,10)">
                                            <rect width={50} height={50} />
                                            <text y={25} x={0}>
                                                TEST
                                            </text>
                                        </g>
                                    </DnDDrag>

                                    <DnDDrag type={'other'} value={true} dragCopy={false} container={'.drag-container'}>
                                        <g className={'draggable other'} transform="translate(20,100)">
                                            <rect width={50} height={50} />
                                            <text y={25} x={0}>
                                                OTHER
                                            </text>
                                        </g>
                                    </DnDDrag>
                                </svg>
                            </div>
                        </DnDDrop>
                    </div>
                </DnDContainer>
            </div>
        </div>
    ));
