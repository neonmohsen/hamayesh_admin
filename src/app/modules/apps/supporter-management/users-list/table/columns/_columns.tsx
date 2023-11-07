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
      <UserCustomHeader tableProps={props} title='SUPPORTER.TABLE.NAME' className='min-w-125px' />
    ),
    id: 'name',
    Cell: ({...props}) => <UserInfoCell user={props.data[props.row.index]} />,
  },

  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='SUPPORTER.TABLE.LINK' className='min-w-125px' />
    ),
    id: 'link',
    Cell: ({...props}) => <UserLastLoginCell national_id={props.data[props.row.index].link} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='SUPPORTER.TABLE.TYPE' className='min-w-125px' />
    ),
    id: 'supportType',
    Cell: ({...props}) => <UserTwoStepsCell phoneNumber={props.data[props.row.index].faType} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title='SUPPORTER.TABLE.CREATEDAT'
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
