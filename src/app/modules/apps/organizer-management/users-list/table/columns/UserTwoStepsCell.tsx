import {FC} from 'react'

type Props = {
  phoneNumber?: string[]
}

const UserTwoStepsCell: FC<Props> = ({phoneNumber}) => (
  <> {phoneNumber && <div className='fw-bolder'>{phoneNumber[0]}</div>}</>
)

export {UserTwoStepsCell}
