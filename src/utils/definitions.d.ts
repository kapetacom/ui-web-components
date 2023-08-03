declare interface KapetaDesktop {
    version: string;
}

declare global {
    interface Window {
        KapetaDesktop?: KapetaDesktop;
    }
}

export {};
