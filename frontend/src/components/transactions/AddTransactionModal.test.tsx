import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import AddTransactionModal from './AddTransactionModal';

// Mock dependencies
const mockCreateTransaction = vi.fn();
vi.mock('../../hooks/useTransactions', () => ({
  useTransactions: () => ({
    createTransaction: mockCreateTransaction,
  }),
}));

vi.mock('../../hooks/useCategories', () => ({
  useCategories: () => ({
    categories: [{ id: 'cat-1', name: 'Food' }],
  }),
}));

const mockPodMembers = [
  { userId: 'u1', firstName: 'Alice', email: 'alice@test.com' },
  { userId: 'u2', firstName: 'Bob', email: 'bob@test.com' },
];

vi.mock('../../hooks/usePods', () => ({
  usePods: () => ({
    pods: [{ id: 'pod-1', name: 'Ski Trip', members: mockPodMembers }],
  }),
}));

describe('AddTransactionModal Split Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders and allows normal transaction creation', async () => {
    render(<AddTransactionModal isOpen={true} onClose={() => {}} />);
    
    // Fill required fields
    await userEvent.type(screen.getByPlaceholderText('0.00'), '100');
    await userEvent.type(screen.getByPlaceholderText('What was this for?'), 'Dinner');
    await userEvent.selectOptions(screen.getByRole('combobox', { name: /Category/i }), 'cat-1');

    fireEvent.submit(screen.getByRole('button', { name: /Save Transaction/i }));

    await waitFor(() => {
      expect(mockCreateTransaction).toHaveBeenCalledWith(expect.objectContaining({
        amount: 100,
        description: 'Dinner',
        categoryId: 'cat-1',
      }));
      // Should not have podId if split is not enabled
      expect(mockCreateTransaction).not.toHaveBeenCalledWith(expect.objectContaining({
        podId: expect.anything()
      }));
    });
  });

  it('handles EVEN split calculation correctly', async () => {
    render(<AddTransactionModal isOpen={true} onClose={() => {}} />);
    
    await userEvent.type(screen.getByPlaceholderText('0.00'), '100');
    await userEvent.type(screen.getByPlaceholderText('What was this for?'), 'Dinner');
    await userEvent.selectOptions(screen.getByRole('combobox', { name: /Category/i }), 'cat-1');

    // Enable Split
    const splitCheckbox = screen.getByLabelText(/Split with a Pod/i);
    await userEvent.click(splitCheckbox);

    // Select Pod
    await userEvent.selectOptions(screen.getByRole('combobox', { name: /Select Pod/i }), 'pod-1');
    
    // EVEN split is default. 100 / 2 members = 50 each
    fireEvent.submit(screen.getByRole('button', { name: /Save Transaction/i }));

    await waitFor(() => {
      expect(mockCreateTransaction).toHaveBeenCalledWith(expect.objectContaining({
        amount: 100,
        podId: 'pod-1',
        splitType: 'EVEN',
        splits: {
          'u1': 50,
          'u2': 50
        }
      }));
    });
  });

  it('validates CUSTOM split total', async () => {
    render(<AddTransactionModal isOpen={true} onClose={() => {}} />);
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    await userEvent.type(screen.getByPlaceholderText('0.00'), '100');
    await userEvent.type(screen.getByPlaceholderText('What was this for?'), 'Dinner');
    await userEvent.selectOptions(screen.getByRole('combobox', { name: /Category/i }), 'cat-1');

    // Enable Split
    await userEvent.click(screen.getByLabelText(/Split with a Pod/i));
    await userEvent.selectOptions(screen.getByRole('combobox', { name: /Select Pod/i }), 'pod-1');

    // Switch to Custom Split
    await userEvent.click(screen.getByLabelText(/Custom Amounts/i));

    // Fill incorrect custom split amounts (total != 100)
    const inputs = screen.getAllByPlaceholderText('0.00');
    // The first one is the main amount input. The custom split inputs are the next ones.
    const customInputs = inputs.slice(1);
    
    await userEvent.type(customInputs[0], '40');
    await userEvent.type(customInputs[1], '50'); // total = 90

    fireEvent.submit(screen.getByRole('button', { name: /Save Transaction/i }));

    expect(alertMock).toHaveBeenCalledWith(expect.stringContaining('Custom split total (90) must equal transaction amount (100)'));
    expect(mockCreateTransaction).not.toHaveBeenCalled();
    
    alertMock.mockRestore();
  });
});
