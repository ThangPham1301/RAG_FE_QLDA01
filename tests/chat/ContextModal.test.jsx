import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithChatContext } from './testUtils'
import ContextModal from '../../src/components/chat/ContextModal'

function renderModal(props = {}) {
  const defaults = {
    open: true,
    documents: [
      { id: 100, title: 'Policy 2026', file_type: 'pdf', index_status: 'indexed' },
      { id: 200, title: 'Policy 2027', file_type: 'docx', index_status: 'pending' },
    ],
    selectedDocumentIds: [100],
    onToggle: jest.fn(),
    onClose: jest.fn(),
    onClear: jest.fn(),
  }

  const merged = { ...defaults, ...props }
  const utils = renderWithChatContext(<ContextModal {...merged} />)

  return { ...utils, props: merged }
}

describe('ContextModal integration', () => {
  it('renders modal and document list with checkbox state', () => {
    renderModal()

    expect(screen.getByText('Context Files')).toBeInTheDocument()
    expect(screen.getByText('Policy 2026')).toBeInTheDocument()
    expect(screen.getByText('Policy 2027')).toBeInTheDocument()

    const selectedRow = screen.getByText('Policy 2026').closest('label')
    const selectedCheckbox = within(selectedRow).getByRole('checkbox')
    expect(selectedCheckbox).toBeChecked()

    const unselectedRow = screen.getByText('Policy 2027').closest('label')
    const unselectedCheckbox = within(unselectedRow).getByRole('checkbox')
    expect(unselectedCheckbox).not.toBeChecked()
  })

  it('toggles document selection through checkbox click', async () => {
    const user = userEvent.setup()
    const { props } = renderModal()

    const row = screen.getByText('Policy 2027').closest('label')
    const checkbox = within(row).getByRole('checkbox')
    await user.click(checkbox)

    expect(props.onToggle).toHaveBeenCalledWith(200)
  })

  it('handles Clear and Close actions', async () => {
    const user = userEvent.setup()
    const { props } = renderModal()

    await user.click(screen.getByRole('button', { name: /clear/i }))
    await user.click(screen.getByRole('button', { name: /close/i }))

    expect(props.onClear).toHaveBeenCalledTimes(1)
    expect(props.onClose).toHaveBeenCalledTimes(1)
  })

  it('does not render when modal is closed', () => {
    renderModal({ open: false })
    expect(screen.queryByText('Context Files')).not.toBeInTheDocument()
  })
})
