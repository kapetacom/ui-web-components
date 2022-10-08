import * as React from 'react';
import { toast } from 'react-toastify';
import { ToastContainer as Container } from 'react-toastify';

import "react-toastify/dist/ReactToastify.css";
import "./ToastComponent.less";

interface ToastProps {
  title: string
  message: string
  type: ToastType
}

export enum ToastType {
  ALERT = "alert",
  SUCCESS = "success",
  DANGER = "danger"
}

export const ToastContainer = () => {

    return (
        <>
            <Container className="toast-container" />
        </>
    )
};

const CloseButton = (props: any) => {
  return (    
    <div onClick={props.closeToast} className="close-button">
      <svg width="10" height="10" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 6.00005L1 1.00005" stroke="white" strokeLinecap="round" />
        <path d="M1 6.00005L6 1.00005" stroke="white" strokeLinecap="round" />
      </svg>
    </div>
  )
};

const DangerIcon: React.FC = ()=> (<svg width="42" height="42" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="16" cy="16" r="16" fill="white" fillOpacity="0.4" />
  <path d="M21.5146 10L9.99989 21.5148" stroke="white" strokeWidth="2" strokeLinecap="round" />
  <path d="M10 10L21.5148 21.5148" stroke="white" strokeWidth="2" strokeLinecap="round" />
</svg>);

const AlertIcon: React.FC = ()=> (
  <svg width="42" height="42" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="16" fill="white" fillOpacity="0.4" />
    <circle cx="16" cy="22" r="2" fill="white" />
    <path d="M14.0312 8.03029C14.0141 7.4664 14.4666 7 15.0308 7H16.9692C17.5334 7 17.9859 7.4664 17.9688 8.03029L17.6961 17.0303C17.6797 17.5705 17.237 18 16.6965 18H15.3035C14.763 18 14.3203 17.5705 14.3039 17.0303L14.0312 8.03029Z" fill="white" />
  </svg>);

const SuccessIcon: React.FC = ()=> (
  <svg width="42" height="42" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="16" fill="white" fillOpacity="0.4" />
    <path d="M9.77783 16L14.2223 20.4444L23.1112 11.5556" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>);

function ToastComp(props: ToastProps) {

  const toastType = props.type;
  let IconToast: React.FC | null = null;

  switch (toastType) {
    case 'danger':
      IconToast = DangerIcon;
      break;
    case 'alert':
      IconToast = AlertIcon;
      break;
    default:
      IconToast = SuccessIcon;
  }

  return (
    <div className={"toast " + toastType}>
      <div className="icon">
        <IconToast/>
      </div>
      <div className="title">{props.title}</div>
      <div className="close-btn" >
      </div>
      <div className="message">{props.message}</div>
      <div className="progress-bar-background"/>
    </div>
  );
}

export const Toast = (props: ToastProps) => {

    if (props.title && props.message) {
        showToasty(props);
    }

    return (
        <></>
    );
};

export const showToasty = (props: ToastProps) => {
  toast(<ToastComp title={props.title} message={props.message} type={props.type} />, { closeButton: <CloseButton />, progressClassName: "progress-bar", progressStyle: {}, closeOnClick: false });
};