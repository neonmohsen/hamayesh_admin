import {FC} from 'react'

type Props = {
  national_id?: string
}

const UserLastLoginCell: FC<Props> = ({national_id}) => (
  <div className='badge badge-light fw-bolder'>{national_id ? 'برگذار کننده اصلی' : ''}</div>
)

export {UserLastLoginCell}
