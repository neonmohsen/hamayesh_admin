// @ts-nocheck
import {Column} from 'react-table'
import {UserInfoCell} from './UserInfoCell'
import {UserLastLoginCell} from './UserLastLoginCell'
import {UserTwoStepsCell} from './UserTwoStepsCell'
import {UserActionsCell} from './UserActionsCell'
import {UserSelectionCell} from './UserSelectionCell'
import {UserCustomHeader} from './UserCustomHeader'
import {UserSelectionHeader} from './UserSelectionHeader'
import {User} from '../../core/_models'
import {UserCreatedAt} from './UserCreatedAt'
import {UserStatus} from './UserStatus'

const usersColumns: ReadonlyArray<Column<User>> = [
  {
    Header: (props) => <UserSelectionHeader tableProps={props} />,
    id: 'selection',
    Cell: ({...props}) => <UserSelectionCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='COMMENT.TABLE.FULLNAME' className='min-w-125px' />
    ),
    id: 'userFirstName',
    Cell: ({...props}) => <UserInfoCell user={props.data[props.row.index]} />,
  },

  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='COMMENT.TABLE.COMMENT' className='min-w-125px' />
    ),
    id: 'comment',
    Cell: ({...props}) => <UserTwoStepsCell comment={props.data[props.row.index].comment} />,
  },

  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='COMMENT.TABLE.STATUS' className='min-w-125px' />
    ),
    id: 'status',
    Cell: ({...props}) => <UserStatus national_id={props.data[props.row.index].status} />,
  },

  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='COMMENT.TABLE.IP' className='min-w-125px' />
    ),
    id: 'userIp',
    Cell: ({...props}) => <UserLastLoginCell national_id={props.data[props.row.index].userIp} />,
  },

  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title='COMMENT.TABLE.CREATEDAT'
        className='min-w-125px'
      />
    ),
    id: 'createdAt',
    Cell: ({...props}) => <UserCreatedAt created_at={props.data[props.row.index].createdAt} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title='USER.TABLE.ACTIONS'
        className='text-end min-w-100px'
      />
    ),
    id: 'actions',
    Cell: ({...props}) => <UserActionsCell id={props.data[props.row.index].id} />,
  },
]

export {usersColumns}
