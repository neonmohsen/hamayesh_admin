import {Response} from '../../../../../../_metronic/helpers'

export type User = {
  id?: string
  name?: string
  logo?: string
  supportType?: string
  link?: string
  createdAt?: Date
}

export type UsersQueryResponse = Response<Array<User>>

export const initialUser: User = {
  logo: 'avatars/300-6.jpg',
  name: 'Administrator',
  supportType: '',
  link: '',
}
