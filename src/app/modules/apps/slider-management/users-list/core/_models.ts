import {Response} from '../../../../../../_metronic/helpers'

export type User = {
  id?: string
  title?: string
  image?: string
  isActive?: boolean
  order?: string
  link?: string
  createdAt?: Date
}

export type UsersQueryResponse = Response<Array<User>>

export const initialUser: User = {
  image: 'avatars/300-6.jpg',
  title: 'Administrator',
  order: '',
  link: '',
}
