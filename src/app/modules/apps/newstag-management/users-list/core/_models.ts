import {Response} from '../../../../../../_metronic/helpers'

export type User = {
  id?: string
  title?: string
  createdAt?: Date
}

export type UsersQueryResponse = Response<Array<User>>

export const initialUser: User = {
  title: 'Administrator',
}
