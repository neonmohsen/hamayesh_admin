export interface AuthModel {
  api_token: string
}

export interface UserAddressModel {
  addressLine: string
  city: string
  state: string
  postCode: string
}

export interface UserCommunicationModel {
  email: boolean
  sms: boolean
  phone: boolean
}

export interface UserEmailSettingsModel {
  emailNotification?: boolean
  sendCopyToPersonalEmail?: boolean
  activityRelatesEmail?: {
    youHaveNewNotifications?: boolean
    youAreSentADirectMessage?: boolean
    someoneAddsYouAsAsAConnection?: boolean
    uponNewOrder?: boolean
    newMembershipApproval?: boolean
    memberRegistration?: boolean
  }
  updatesFromKeenthemes?: {
    newsAboutKeenthemesProductsAndFeatureUpdates?: boolean
    tipsOnGettingMoreOutOfKeen?: boolean
    thingsYouMissedSindeYouLastLoggedIntoKeen?: boolean
    newsAboutStartOnPartnerProductsAndOtherServices?: boolean
    tipsOnStartBusinessProducts?: boolean
  }
}

export interface UserSocialNetworksModel {
  linkedIn: string
  facebook: string
  twitter: string
  instagram: string
}

export interface UserModel {
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
// This should reflect the structure of your state/city data
export interface ILocation {
  _id: string // or number, if the ID is a numeric value
  state?: string
  city?: string
  // ... any other properties that might exist on your state/city objects
}
