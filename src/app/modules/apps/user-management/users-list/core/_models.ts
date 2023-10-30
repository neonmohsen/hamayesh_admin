import {ID, Response} from '../../../../../../_metronic/helpers'
import {
  AuthModel,
  UserAddressModel,
  UserEmailSettingsModel,
  UserSocialNetworksModel,
} from '../../../../auth'
export type User = {
  id?: string
  password?: string | undefined
  email?: string
  firstName?: string
  lastName?: string
  job?: string
  phoneNumber?: string
  role?: string
  emailSettings?: UserEmailSettingsModel
  auth?: AuthModel
  address?: UserAddressModel
  state?: string
  city?: string
  socialNetworks?: UserSocialNetworksModel
  profileImage?: string
  institute?: string
  study_field?: string
  gender?: string
  national_id?: string
  degree?: string
  emailVerifiedAt?: Date
  passwordConfirmation?: string
}

export type UsersQueryResponse = Response<Array<User>>

export const initialUser: User = {
  profileImage: 'avatars/300-6.jpg',
  role: 'Administrator',
  firstName: '',
  email: '',
}
