// navigator.ts
type NavigateFunction = (to: string, options?: {state?: any; replace?: boolean}) => void

let navigate: NavigateFunction | null = null

export const setNavigator = (navCallback: NavigateFunction) => {
  navigate = navCallback
}

export const navigateTo = (path: string, state?: any) => {
  if (navigate) {
    navigate(path, {state})
  } else {
    console.error(
      'Navigator has not been set. Please set navigator with setNavigator function before using navigateTo.'
    )
  }
}
