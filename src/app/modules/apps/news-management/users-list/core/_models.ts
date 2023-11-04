import {ID, Response} from '../../../../../../_metronic/helpers'
import {
  AuthModel,
  UserAddressModel,
  UserEmailSettingsModel,
  UserSocialNetworksModel,
} from '../../../../auth'

// NewsTag Model
export type NewsTag = {
  id: ID
  title: string
  slug: string
  createdAt: Date
  updatedAt: Date
}

// NewsComment Model
export type NewsComment = {
  id: ID
  likeNumber: number
  status: boolean
  comment: string
  userFirstName: string
  userLastName: string
  userEmail: string
  userIp: string
  createdAt: Date
  updatedAt: Date
}
export type User = {
  id?: string
  title?: string
  description?: string
  visitNumber?: number
  slug?: string
  writer?: {
    firstName: string
    lastName: string
    email: string
  }
  image?: string
  category?: {
    title: string
    id: string
  } // Assuming category will have a similar structure to NewsTag
  tags?: NewsTag[]
  comments?: NewsComment[]
  publishDate?: Date
  specialDate?: Date
  createdAt?: Date
  updatedAt?: Date
}

export type UsersQueryResponse = Response<Array<User>>

export const initialUser: User = {
  image: 'avatars/300-6.jpg',
  title: 'Administrator',
}
