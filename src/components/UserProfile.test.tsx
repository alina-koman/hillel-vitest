import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import UserProfile from './UserProfile'

const user = { id: 1, name: 'Leanne Graham', email: 'Sincere@april.biz' }

const createUserResponse = (status = 200) =>
  new Response(JSON.stringify(user), {
    status,
    headers: { 'Content-Type': 'application/json' }
  })

describe('UserProfile', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('shows loading indicator while request is in progress', async () => {
    let finishRequest = () => {}

    vi.spyOn(globalThis, 'fetch').mockImplementation(
      () =>
        new Promise<Response>((resolve) => {
          finishRequest = () => resolve(createUserResponse())
        })
    )

    render(<UserProfile />)

    expect(screen.getByText('Loading...')).toBeInTheDocument()

    finishRequest()

    expect(await screen.findByRole('heading', { name: 'Leanne Graham' })).toBeInTheDocument()
    expect(screen.getByText('Sincere@april.biz')).toBeInTheDocument()
  })

  it('renders the user data after a successful request', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(createUserResponse())

    render(<UserProfile />)

    expect(await screen.findByRole('heading', { name: 'Leanne Graham' })).toBeInTheDocument()
    expect(screen.getByText('Sincere@april.biz')).toBeInTheDocument()
  })

  it('renders an error message when the API returns an unsuccessful response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(createUserResponse(500))

    render(<UserProfile />)

    expect(await screen.findByText('Error: Request failed with status 500')).toBeInTheDocument()
  })

  it('renders an error message when the request fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network error'))

    render(<UserProfile />)

    expect(await screen.findByText('Error: Network error')).toBeInTheDocument()
  })
})
