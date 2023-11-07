import {useIntl} from 'react-intl'
import {KTIcon} from '../../../../../../_metronic/helpers'
import {useListView} from '../core/ListViewProvider'

const UserEditModalHeader = () => {
  const {setItemIdForUpdate} = useListView()

  const intl = useIntl()
  return (
    <div className='modal-header'>
      {/* begin::Modal title */}
      <h2 className='fw-bolder'> {intl.formatMessage({id: 'MODAL.ADD.ORGANIZER'})}</h2>
      {/* end::Modal title */}

      {/* begin::Close */}
      <div
        className='btn btn-icon btn-sm btn-active-icon-primary'
        data-kt-users-modal-action='close'
        onClick={() => setItemIdForUpdate(undefined)}
        style={{cursor: 'pointer'}}
      >
        <KTIcon iconName='cross' className='fs-1' />
      </div>
      {/* end::Close */}
    </div>
  )
}

export {UserEditModalHeader}
