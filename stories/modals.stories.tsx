import React from 'react';
import {storiesOf} from '@storybook/react';
import {Modal, ModalSize, OverlayContainer, PanelAlignment, PanelSize, SidePanel} from '../src';

storiesOf('Modal and Panels', module)

    .add("Modal big", () => (
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
            <Modal size={ModalSize.large} open={true} title={"Big panel"} >
                <div>Content of a big panel</div>
            </Modal>

        </OverlayContainer>))
    .add("Modal medium", () => (
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
            <Modal size={ModalSize.medium} open={true} title={"Medium panel"} >
                <div>Content of a medium panel</div>
            </Modal>
        </OverlayContainer>))
    .add("Modal small", () => (
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
            <Modal size={ModalSize.small} open={true} title={"Small panel"} >
                <div>Content of a small  panel</div>
            </Modal>
        </OverlayContainer>))

    .add("Modal stacked", () => (
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
            <Modal size={ModalSize.small} open={true} title={"Panel 1"} >
                <div>Content of a small  panel</div>
            </Modal>
            <Modal size={ModalSize.small} open={true} title={"Panel 2"} >
                <div>Content of a small  panel</div>
            </Modal>
            <Modal size={ModalSize.small} open={true} title={"Panel 3"} >
                <div>Content of a small  panel</div>
            </Modal>
            <Modal size={ModalSize.small} open={true} title={"Panel 4"}>
                <div>Content of a small  panel</div>
            </Modal>
        </OverlayContainer>
        )
    )
    .add("Panel small", () => (
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
            <SidePanel size={PanelSize.small} open={true} side={PanelAlignment.right} title={"Small panel"} >
                <div>Content of a small panel</div>
            </SidePanel>
        </OverlayContainer>
    ))
    .add("Panel medium", () => (
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
            <SidePanel size={PanelSize.medium} open={true} side={PanelAlignment.right} title={"Medium panel"} >
                <div>Content of a medium panel</div>
            </SidePanel>
        </OverlayContainer>
    ))
    .add("Panel big", () => (
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
            <SidePanel size={PanelSize.large} open={true} side={PanelAlignment.right} title={"Big panel"} >
                <div>Content of a big panel</div>
            </SidePanel>
        </OverlayContainer>

        ))
    .add("Panel small - left", () => {

        return <OverlayContainer>
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
            <SidePanel size={PanelSize.small} open={true} side={PanelAlignment.left} title={"Small panel"} >
                <div>Content of a small panel - LEFT</div>
            </SidePanel>
        </OverlayContainer>
    })
    .add("Modal and Panels stacked", () => (
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
                <SidePanel size={PanelSize.small} open={true} side={PanelAlignment.right} title={"Not Closable"} closable={false} >
                    <div>Can't close this one!</div>
                </SidePanel>
                <SidePanel size={PanelSize.small} open={true} side={PanelAlignment.right} title={"Panel 1"} >
                    <div>Content of a small panel</div>
                </SidePanel>
                <Modal size={ModalSize.small} open={true} title={"Panel 1"} >
                    <div>Content of a small  panel</div>
                </Modal>
                <SidePanel size={PanelSize.small} open={true} side={PanelAlignment.right} title={"Panel 2"} >
                    <div>Content of a small panel</div>
                </SidePanel>
                <Modal size={ModalSize.small} open={true} title={"Panel 2"} >
                    <div>Content of a small  panel</div>
                </Modal>
                <SidePanel modal={true} size={PanelSize.small} open={true} side={PanelAlignment.right} title={"Panel 3"} >
                    <div>Content of a small panel</div>
                </SidePanel>
                <Modal size={ModalSize.small} open={true} title={"Panel 3"} >
                    <div>Content of a small  panel</div>
                </Modal>
                <Modal size={ModalSize.small} open={true} title={"Panel 4"}>
                    <div>Content of a small  panel</div>
                </Modal>
            </OverlayContainer>
        )
    );



