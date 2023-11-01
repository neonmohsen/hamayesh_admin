import {FC} from 'react'

type Props = {
  national_id?: string
}

const UserStatus: FC<Props> = ({national_id}) => (
  <div className='badge badge-light-success fw-bolder'>{national_id ? 'تایید شده' : ''}</div>
)

export {UserStatus}
