// @ts-nocheck
import {Column} from 'react-table'
import {UserInfoCell} from './UserInfoCell'
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
      <UserCustomHeader tableProps={props} title='QUESTIONS.TABLE.TITLE' className='min-w-125px' />
    ),
    id: 'title',
    Cell: ({...props}) => <UserInfoCell user={props.data[props.row.index]} />,
  },

  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title='QUESTIONS.TABLE.UPDATEDAT'
        className='min-w-125px'
      />
    ),
    id: 'updatedAt',
    Cell: ({...props}) => <UserCreatedAt created_at={props.data[props.row.index].updatedAt} />,
  },

  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title='QUESTIONS.TABLE.CREATEDAT'
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
