interface Window {
  twttr: {
    widgets: {
      load: (el?: HTMLElement) => void
    }
  }
}

declare let window: Window
