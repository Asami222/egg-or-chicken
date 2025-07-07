import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import FoodCheckbox from '../src/components/FoodCheckbox' // パスはあなたの構成に合わせて調整

describe('FoodCheckbox', () => {
  const mockOnDelete = jest.fn()
  const mockOnClose = jest.fn()

  const today = new Date()
  const plus2 = new Date(today)
  plus2.setDate(today.getDate() + 2)
  const plus3 = new Date(today)
  plus3.setDate(today.getDate() + 3)

  const formatDate = (date: Date) =>
    date.toISOString().split('T')[0] // 'YYYY-MM-DD'

  const usedDates = new Set([formatDate(plus2), formatDate(plus3)])

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('チェックボックスを選択してsubmitできる', () => {
    render(
      <FoodCheckbox
        imgexchange="/food/fruit.webp"
        imgdescription="果実"
        maxCount={5}
        onDelete={mockOnDelete}
        onClose={mockOnClose}
        usedDates={usedDates}
      />
    )

    // ラベル確認
    expect(screen.getByText('設定する日付をチェックしてください')).toBeInTheDocument()

    // チェックボックスが2つ（2日分）あることを確認
    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes).toHaveLength(2)

    // チェックボックスを選択して「設定する」ボタンを押す
    fireEvent.click(checkboxes[1])
    fireEvent.click(screen.getByText('設定する'))

    expect(mockOnDelete).toHaveBeenCalled()
  })

  it('閉じるボタンを押すと onClose が呼ばれる', () => {
    render(
      <FoodCheckbox
        imgexchange="/food/fruit.webp"
        imgdescription="果実"
        maxCount={5}
        onDelete={mockOnDelete}
        onClose={mockOnClose}
        usedDates={usedDates}
      />
    )

    fireEvent.click(screen.getByText('閉じる'))
    expect(mockOnClose).toHaveBeenCalled()
  })
})