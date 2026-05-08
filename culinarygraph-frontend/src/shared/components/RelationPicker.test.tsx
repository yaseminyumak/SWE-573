import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RelationPicker from './RelationPicker'

const noop = () => {}

describe('RelationPicker', () => {
  it('renders the label', () => {
    render(
      <RelationPicker label="Related Techniques" available={[]} selected={[]} onAdd={noop} onRemove={noop} />
    )
    expect(screen.getByText('Related Techniques')).toBeInTheDocument()
  })

  it('shows available items in dropdown', () => {
    render(
      <RelationPicker
        label="Related Techniques"
        available={['Blanching', 'Roasting']}
        selected={[]}
        onAdd={noop}
        onRemove={noop}
      />
    )
    expect(screen.getByRole('option', { name: 'Blanching' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Roasting' })).toBeInTheDocument()
  })

  it('does not show already-selected items in dropdown', () => {
    render(
      <RelationPicker
        label="Related Techniques"
        available={['Blanching', 'Roasting']}
        selected={['Blanching']}
        onAdd={noop}
        onRemove={noop}
      />
    )
    expect(screen.queryByRole('option', { name: 'Blanching' })).not.toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Roasting' })).toBeInTheDocument()
  })

  it('renders selected items as chips', () => {
    render(
      <RelationPicker
        label="Related Techniques"
        available={['Roasting']}
        selected={['Blanching']}
        onAdd={noop}
        onRemove={noop}
      />
    )
    expect(screen.getByText('Blanching')).toBeInTheDocument()
  })

  it('calls onRemove when chip × button is clicked', async () => {
    const onRemove = vi.fn()
    render(
      <RelationPicker
        label="Related Techniques"
        available={[]}
        selected={['Blanching']}
        onAdd={noop}
        onRemove={onRemove}
      />
    )
    await userEvent.click(screen.getByRole('button', { name: /remove blanching/i }))
    expect(onRemove).toHaveBeenCalledWith('Blanching')
  })

  it('calls onAdd when an item is selected from dropdown', async () => {
    const onAdd = vi.fn()
    render(
      <RelationPicker
        label="Related Techniques"
        available={['Blanching', 'Roasting']}
        selected={[]}
        onAdd={onAdd}
        onRemove={noop}
      />
    )
    await userEvent.selectOptions(screen.getByRole('combobox'), 'Blanching')
    expect(onAdd).toHaveBeenCalledWith('Blanching')
  })

  it('shows "No items in catalog yet" when available is empty and nothing selected', () => {
    render(
      <RelationPicker label="Related Techniques" available={[]} selected={[]} onAdd={noop} onRemove={noop} />
    )
    expect(screen.getByText(/no items in catalog yet/i)).toBeInTheDocument()
  })

  it('shows "All available items selected" when all items are selected', () => {
    render(
      <RelationPicker
        label="Related Techniques"
        available={['Blanching']}
        selected={['Blanching']}
        onAdd={noop}
        onRemove={noop}
      />
    )
    expect(screen.getByText(/all available items selected/i)).toBeInTheDocument()
  })
})
