import React, { useState } from 'react';
import {
    Modal,
    Button,
    ModalSize,
    OverlayContainer,
    PanelAlignment,
    PanelSize,
    SidePanel,
} from '../src';

export default {
    title: 'Modal and Panels',
};

export const ModalBig = () => {
    const [open, setOpen] = useState(true);

    return (
        <OverlayContainer>
            <Button text={'Toggle'} onClick={() => setOpen(true)}></Button>
            <div>Content of the body</div>
            <div>Content of the body</div>
            <div>Content of the body</div>
            <div>Content of the body</div>
            <div>Content of the body</div>
            <div>Content of the body</div>
            <div>Content of the body</div>
            <div>Content of the body</div>
            <div>Content of the body</div>
            <div>Content of the body</div>

            <Modal
                size={ModalSize.large}
                open={open}
                onClose={() => setOpen(false)}
                title={'Big panel'}
            >
                <div>Content of a big panel</div>
            </Modal>
        </OverlayContainer>
    );
};

export const ModalMedium = () => {
    const [open, setOpen] = useState(true);
    return (
        <OverlayContainer>
            <div>Content of the body</div>
            <div>Content of the body</div>
            <div>Content of the body</div>
            <div>Content of the body</div>
            <div>Content of the body</div>
            <div>Content of the body</div>
            <div>Content of the body</div>
            <div>Content of the body</div>
            <div>Content of the body</div>
            <div>Content of the body</div>
            <Modal
                size={ModalSize.medium}
                open={open}
                onClose={() => setOpen(false)}
                title={'Big panel'}
            >
                <div>Content of a medium panel</div>

                <button onClick={() => setOpen(false)}>Close</button>
            </Modal>
        </OverlayContainer>
    );
};

export const ModalSmall = () => (
    <OverlayContainer>
        <div>Content of the body</div>
        <div>Content of the body</div>
        <div>Content of the body</div>
        <div>Content of the body</div>
        <div>Content of the body</div>
        <div>Content of the body</div>
        <div>Content of the body</div>
        <div>Content of the body</div>
        <div>Content of the body</div>
        <div>Content of the body</div>
        <Modal size={ModalSize.small} openInitially={true} title={'Big panel'}>
            <div>Content of a small panel</div>
        </Modal>
    </OverlayContainer>
);

export const ModalStacked = () => (
    <OverlayContainer>
        <div>Content of the body</div>
        <div>Content of the body</div>
        <div>Content of the body</div>
        <div>Content of the body</div>
        <div>Content of the body</div>
        <div>Content of the body</div>
        <div>Content of the body</div>
        <div>Content of the body</div>
        <div>Content of the body</div>
        <div>Content of the body</div>
        <Modal size={ModalSize.small} openInitially={true} title={'Panel 1'}>
            <div>Content of a small panel</div>
        </Modal>
        <Modal size={ModalSize.small} openInitially={true} title={'Panel 2'}>
            <div>Content of a small panel</div>
        </Modal>
        <Modal size={ModalSize.small} openInitially={true} title={'Panel 3'}>
            <div>Content of a small panel</div>
        </Modal>
        <Modal size={ModalSize.small} openInitially={true} title={'Panel 4'}>
            <div>Content of a small panel</div>
        </Modal>
    </OverlayContainer>
);

export const PanelSmall = () => (
    <OverlayContainer>
        <div>Content of the body</div>
        <div>Content of the body</div>
        <div>Content of the body</div>
        <div>Content of the body</div>
        <div>Content of the body</div>
        <div>Content of the body</div>
        <div>Content of the body</div>
        <div>Content of the body</div>
        <div>Content of the body</div>
        <div>Content of the body</div>
        <SidePanel
            size={PanelSize.small}
            openInitially={true}
            side={PanelAlignment.right}
            title={'Small panel'}
        >
            <div>Content of a small panel</div>
        </SidePanel>
    </OverlayContainer>
);

export const PanelMedium = () => (
    <OverlayContainer>
        <div>Content of the body</div>
        <div>Content of the body</div>
        <div>Content of the body</div>
        <div>Content of the body</div>
        <div>Content of the body</div>
        <div>Content of the body</div>
        <div>Content of the body</div>
        <div>Content of the body</div>
        <div>Content of the body</div>
        <div>Content of the body</div>
        <SidePanel
            size={PanelSize.medium}
            openInitially={true}
            side={PanelAlignment.right}
            title={'Medium panel'}
        >
            <div>Content of a medium panel</div>
        </SidePanel>
    </OverlayContainer>
);
export const PanelBig = () => {
    const [open, setOpen] = useState(true);
    return (
        <OverlayContainer>
            <Button text={'Toggle'} onClick={() => setOpen(!open)}></Button>
            <div>Content of the body</div>
            <div>Content of the body</div>
            <div>Content of the body</div>
            <div>Content of the body</div>
            <div>Content of the body</div>
            <div>Content of the body</div>
            <div>Content of the body</div>
            <div>Content of the body</div>
            <div>Content of the body</div>
            <div>Content of the body</div>
            <SidePanel
                size={PanelSize.large}
                open={open}
                onClose={() => setOpen(false)}
                side={PanelAlignment.right}
                title={'Big panel'}
            >
                <div>Content of a big panel</div>
            </SidePanel>
        </OverlayContainer>
    );
};
export const PanelSmallLeft = () => {
    return (
        <OverlayContainer>
            <div>Content of the body</div>
            <div>Content of the body</div>
            <div>Content of the body</div>
            <div>Content of the body</div>
            <div>Content of the body</div>
            <div>Content of the body</div>
            <div>Content of the body</div>
            <div>Content of the body</div>
            <div>Content of the body</div>
            <div>Content of the body</div>
            <SidePanel
                size={PanelSize.small}
                openInitially={true}
                side={PanelAlignment.left}
                title={'Small panel'}
            >
                <div>Content of a small panel - LEFT</div>
            </SidePanel>
        </OverlayContainer>
    );
};
export const ModalsAndPanelsStacked = () => (
    <OverlayContainer>
        <div>Content of the body</div>
        <div>Content of the body</div>
        <div>Content of the body</div>
        <div>Content of the body</div>
        <div>Content of the body</div>
        <div>Content of the body</div>
        <div>Content of the body</div>
        <div>Content of the body</div>
        <div>Content of the body</div>
        <div>Content of the body</div>
        <SidePanel
            size={PanelSize.small}
            openInitially={true}
            side={PanelAlignment.right}
            title={'Not Closable'}
            closable={false}
        >
            <div>Can't close this one!</div>
        </SidePanel>
        <SidePanel
            size={PanelSize.small}
            openInitially={true}
            side={PanelAlignment.right}
            title={'Panel 1'}
        >
            <div>Content of a small panel</div>
        </SidePanel>
        <Modal size={ModalSize.small} openInitially={true} title={'Panel 1'}>
            <div>Content of a small panel</div>
        </Modal>
        <SidePanel
            size={PanelSize.small}
            openInitially={true}
            side={PanelAlignment.right}
            title={'Panel 2'}
        >
            <div>Content of a small panel</div>
        </SidePanel>
        <Modal size={ModalSize.small} openInitially={true} title={'Panel 2'}>
            <div>Content of a small panel</div>
        </Modal>
        <SidePanel
            modal={true}
            size={PanelSize.small}
            openInitially={true}
            side={PanelAlignment.right}
            title={'Panel 3'}
        >
            <div>Content of a small panel</div>
        </SidePanel>
        <Modal size={ModalSize.small} openInitially={true} title={'Panel 3'}>
            <div>Content of a small panel</div>
        </Modal>
        <Modal size={ModalSize.small} openInitially={true} title={'Panel 4'}>
            <div>Content of a small panel</div>
        </Modal>
    </OverlayContainer>
);
