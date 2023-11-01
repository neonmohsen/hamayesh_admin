import {FC} from 'react'

type Props = {
  comment?: string
}

const UserTwoStepsCell: FC<Props> = ({comment}) => (
  <> {comment && <div className='fw-normal'>{comment}</div>}</>
)

export {UserTwoStepsCell}
