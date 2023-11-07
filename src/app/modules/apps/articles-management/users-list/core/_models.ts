import {Response} from '../../../../../../_metronic/helpers'

export type speakerUser = {
  id: string
  password?: string | undefined
  email?: string
  firstName?: string
  lastName?: string
  job?: string
  phoneNumber?: string
  role?: string
  state?: string
  city?: string
  profileImage?: string
  institute?: string
  study_field?: string
  gender?: string
  national_id?: string
  degree?: string
  emailVerifiedAt?: Date
  passwordConfirmation?: string
}

export type User = {
  id?: string
  title?: string
  description?: string
  category?: any
  userId?: any
  articleFiles?: [
    {
      title: string
      mimetype: string
      size: number
    }
  ]
  presentationFiles?: [
    {
      title: string
      mimetype: string
      size: number
    }
  ]
  status?: string
  arbitration?: {
    refereeId: string
    message: string
  }
}

export type UsersQueryResponse = Response<Array<User>>

export const initialUser = {}
