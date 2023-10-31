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

const usersColumns: ReadonlyArray<Column<User>> = [
  {
    Header: (props) => <UserSelectionHeader tableProps={props} />,
    id: 'selection',
    Cell: ({...props}) => <UserSelectionCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='USER.TABLE.FULLNAME' className='min-w-125px' />
    ),
    id: 'boss',
    Cell: ({...props}) => <UserInfoCell user={props.data[props.row.index]} />,
  },

  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='USER.TABLE.NATIONALID' className='min-w-125px' />
    ),
    id: 'title',
    Cell: ({...props}) => <UserLastLoginCell national_id={props.data[props.row.index].title} />,
  },

  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='USER.TABLE.NATIONALID' className='min-w-125px' />
    ),
    id: 'type',
    Cell: ({...props}) => <UserTwoStepsCell phoneNumber={props.data[props.row.index].type} />,
  },

  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='USER.TABLE.CREATEDAT' className='min-w-125px' />
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
