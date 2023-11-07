// @ts-nocheck
import {Column} from 'react-table'
import {UserInfoCell} from './UserInfoCell'
import {UserTwoStepsCell} from './UserTwoStepsCell'
import {UserActionsCell} from './UserActionsCell'
import {UserSelectionCell} from './UserSelectionCell'
import {UserCustomHeader} from './UserCustomHeader'
import {UserSelectionHeader} from './UserSelectionHeader'
import {User} from '../../core/_models'
import {UserCreatedAt} from './UserCreatedAt'
import {UserInfoCell1} from './UserInfoCell1'

const usersColumns: ReadonlyArray<Column<User>> = [
  {
    Header: (props) => <UserSelectionHeader tableProps={props} />,
    id: 'selection',
    Cell: ({...props}) => <UserSelectionCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='NEWS.TABLE.TITLE' className='min-w-125px' />
    ),
    id: 'title',
    Cell: ({...props}) => <UserInfoCell user={props.data[props.row.index]} />,
  },

  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='NEWS.TABLE.WRITER' className='min-w-125px' />
    ),
    id: 'writer',
    Cell: ({...props}) => <UserInfoCell1 user={props.data[props.row.index]} />,
  },

  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='NEWS.TABLE.PUBLISHDATE' className='min-w-125px' />
    ),
    id: 'publishDate',
    Cell: ({...props}) => <UserCreatedAt created_at={props.data[props.row.index].publishDate} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='NEWS.TABLE.CREATEDAT' className='min-w-125px' />
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
