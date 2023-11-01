import {Response} from '../../../../../../_metronic/helpers'

export type User = {
  id?: string
  comment?: String
  likeNumber?: Number
  userFirstName?: String
  userLastName?: String
  userEmail?: String
  userIp?: String
  status?: Boolean
  createdAt?: Date
}

export type UsersQueryResponse = Response<Array<User>>

export const initialUser: User = {}
