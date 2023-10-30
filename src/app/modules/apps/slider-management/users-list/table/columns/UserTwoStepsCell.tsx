import {FC} from 'react'

type Props = {
  isActive?: boolean
}

const UserTwoStepsCell: FC<Props> = ({isActive}) => (
  <>
    {' '}
    <div className='fw-bolder badge badge-light-success  '>{isActive ? 'active' : ''}</div>
  </>
)

export {UserTwoStepsCell}
