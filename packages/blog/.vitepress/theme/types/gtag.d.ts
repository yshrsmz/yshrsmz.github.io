interface Window {
  gtag: (type: string, id: string, config: { page_path: string }) => void
}

declare let window: Window
