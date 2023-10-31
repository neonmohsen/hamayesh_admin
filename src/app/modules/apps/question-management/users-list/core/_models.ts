import {Response} from '../../../../../../_metronic/helpers'

export type speakerUser = {
  id?: string
  question?: string
  response?: string
}

export type User = {
  id?: string
  title?: string
  description?: string
  items?: speakerUser[]
  createdAt?: Date
}

export type UsersQueryResponse = Response<Array<User>>

export const initialUser: User = {
  description: 'avatars/300-6.jpg',
  title: 'Administrator',
}
