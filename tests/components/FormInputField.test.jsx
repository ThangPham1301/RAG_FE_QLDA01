import { fireEvent, render, screen } from '@testing-library/react'
import FormInputField from '../../src/components/ui/FormInputField'

describe('FormInputField', () => {
  test('binds label, value and change handler', () => {
    const onChange = jest.fn()

    render(<FormInputField label="Email" value="old@example.com" onChange={onChange} />)
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'new@example.com' } })

    expect(onChange).toHaveBeenCalledWith('new@example.com')
  })

  test('renders validation error', () => {
    render(<FormInputField label="Password" error="Password is required" />)

    expect(screen.getByText('Password is required')).toBeInTheDocument()
  })
})
