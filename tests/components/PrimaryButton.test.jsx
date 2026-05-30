import { fireEvent, render, screen } from '@testing-library/react'
import PrimaryButton from '../../src/components/ui/PrimaryButton'

describe('PrimaryButton', () => {
  test('renders children and handles clicks', () => {
    const onClick = jest.fn()

    render(<PrimaryButton onClick={onClick}>Save</PrimaryButton>)
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  test('shows loading state and disables button', () => {
    render(<PrimaryButton loading>Save</PrimaryButton>)

    const button = screen.getByRole('button', { name: /loading/i })
    expect(button).toBeDisabled()
  })
})
