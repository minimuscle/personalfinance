import Sidebar from '~/components/Sidebar'
import useCash from '~/utils/hooks/useCash'

const SidebarContainer = () => {
  const { cash, cashTotal } = useCash()
  return (
    <Sidebar
      data={cash}
      title='Bank Accounts'
      totalBalance={cashTotal as number}
      type='income'
    />
  )
}

export default SidebarContainer
