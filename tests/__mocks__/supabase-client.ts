export const client = {
  from: jest.fn((table: string) => {
    return {
      select: jest.fn().mockResolvedValue({
        data: table === 'foods' ? [{ id: 1, food_type: 'plant', count: 1 }] : [],
        error: null,
      }),
      insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      delete: jest.fn().mockResolvedValue({ data: null, error: null }),
      update: jest.fn().mockResolvedValue({ data: null, error: null }),
      eq: jest.fn().mockReturnThis(), // チェーン可能にするため
    }
  }),
  auth: {
    getSession: jest.fn().mockResolvedValue({
      data: {
        session: {
          user: { id: 'mock-user-id' }
        }
      },
      error: null
    })
  }
}