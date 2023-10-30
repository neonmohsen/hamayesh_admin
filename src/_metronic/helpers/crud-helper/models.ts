import {Dispatch, SetStateAction} from 'react'

export type ID = undefined | null | string

export type PaginationState = {
  page: number
  items_per_page: 10 | 30 | 50 | 100
  links?: Array<{label: string; active: boolean; url: string | null; page: number | null}>
}

export type SortState = {
  sort?: string
  order?: 'asc' | 'desc'
}

export type FilterState = {
  filter?: unknown
}

export type SearchState = {
  search?: string
}

export type Response<T> = {
  data?: T
  payload?: {
    message?: string
    errors?: {
      [key: string]: Array<string>
    }
    pagination?: PaginationState
  }
}

export type QueryState = PaginationState & SortState & FilterState & SearchState

export type QueryRequestContextProps = {
  state: QueryState
  updateState: (updates: Partial<QueryState>) => void
}

export const initialQueryState: QueryState = {
  page: 1,
  items_per_page: 10,
}

export const initialQueryRequest: QueryRequestContextProps = {
  state: initialQueryState,
  updateState: () => {},
}

export type QueryResponseContextProps<T> = {
  response?: Response<Array<T>> | undefined
  refetch: () => void
  isLoading: boolean
  query: string
}

export const initialQueryResponse = {refetch: () => {}, isLoading: false, query: ''}

export type ListViewContextProps = {
  selected: Array<ID>
  onSelect: (selectedId: ID) => void
  onSelectAll: () => void
  clearSelected: () => void
  // NULL => (CREATION MODE) | MODAL IS OPENED
  // NUMBER => (EDIT MODE) | MODAL IS OPENED
  // UNDEFINED => MODAL IS CLOSED
  itemIdForUpdate?: ID
  setItemIdForUpdate: Dispatch<SetStateAction<ID>>
  isAllSelected: boolean
  disabled: boolean
}

export const initialListView: ListViewContextProps = {
  selected: [],
  onSelect: () => {},
  onSelectAll: () => {},
  clearSelected: () => {},
  setItemIdForUpdate: () => {},
  isAllSelected: false,
  disabled: false,
}

interface ServerFieldError {
  email?: string[]
  password?: string[]
  // ... other fields ...
}

export interface CustomError {
  code: number
  message: string
  errors: ServerFieldError
}

export interface ErrorResponse {
  response: {
    data: CustomError
  }
}

export function isCustomError(error: unknown): error is ErrorResponse {
  // We assert 'error' is an object with a 'response' key, giving TypeScript the context it needs.
  const errorAsObject = error as {response?: unknown}

  return (
    typeof errorAsObject === 'object' &&
    errorAsObject !== null && // because 'typeof null' also returns 'object'
    typeof errorAsObject.response === 'object' &&
    errorAsObject.response !== null &&
    typeof (errorAsObject.response as {data?: unknown}).data === 'object' &&
    (errorAsObject.response as {data?: unknown}).data !== null &&
    // Now, we perform our specific checks to ensure it matches the CustomError structure
    typeof ((errorAsObject.response as {data?: unknown}).data as CustomError).code === 'number' &&
    typeof ((errorAsObject.response as {data?: unknown}).data as CustomError).message ===
      'string' &&
    typeof ((errorAsObject.response as {data?: unknown}).data as CustomError).errors === 'object'
  )
}
