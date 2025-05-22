import { mount } from '@vue/test-utils';
import { app } from '../src/js/app';

describe('Expense Tracker App', () => {
  let wrapper;

  beforeEach(() => {
    // 在每个测试前重置localStorage
    localStorage.clear();
    // 模拟localStorage
    global.localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      clear: jest.fn(),
    };
  });

  describe('数据加载和保存', () => {
    it('loadData 应正确从localStorage加载数据', () => {
      const mockData = {
        transactions: [ { id: 1, amount: 100, category: '食品', date: '2023-01-01' } ],
        budgets: { '食品': 500 },
        currency: 'CNY',
      };
      localStorage.getItem.mockReturnValue(JSON.stringify(mockData));
      app.loadData();
      expect(app.transactions).toEqual(mockData.transactions);
      expect(app.budgets).toEqual(mockData.budgets);
      expect(app.currency).toBe(mockData.currency);
    });

    it('saveData 应正确将数据保存到localStorage', () => {
      const mockTransaction = { id: 1, amount: 100, category: '食品', date: '2023-01-01' };
      app.transactions = [mockTransaction];
      app.budgets = { '食品': 500 };
      app.currency = 'CNY';
      app.saveData();
      expect(localStorage.setItem).toHaveBeenCalledWith('expenseTrackerData', JSON.stringify({
        transactions: [mockTransaction],
        budgets: { '食品': 500 },
        currency: 'CNY',
      }));
    });
  });

  describe('交易管理', () => {
    it('addTransaction 应正确添加新交易', () => {
      const newTransaction = { amount: 100, category: '食品', date: '2023-01-01' };
      app.addTransaction(newTransaction);
      expect(app.transactions).toHaveLength(1);
      expect(app.transactions[0]).toHaveProperty('id');
      expect(app.transactions[0].amount).toBe(100);
    });

    it('deleteTransaction 应正确删除交易', () => {
      const mockTransaction = { id: 1, amount: 100, category: '食品', date: '2023-01-01' };
      app.transactions = [mockTransaction];
      app.deleteTransaction(1);
      expect(app.transactions).toHaveLength(0);
    });
  });

  describe('预算管理', () => {
    it('saveBudget 应正确保存预算', () => {
      const category = '食品';
      const amount = 500;
      app.saveBudget(category, amount);
      expect(app.budgets[category]).toBe(amount);
    });

    it('getBudgetStats 应正确计算预算统计', () => {
      app.budgets = { '食品': 500 };
      app.transactions = [
        { amount: 100, category: '食品', date: '2023-01-01' },
        { amount: 200, category: '食品', date: '2023-01-02' },
      ];
      const stats = app.getBudgetStats();
      expect(stats['食品'].total).toBe(300);
      expect(stats['食品'].budget).toBe(500);
      expect(stats['食品'].remaining).toBe(200);
    });
  });

  describe('货币转换', () => {
    it('convertCurrency 应正确转换货币', () => {
      app.currencyRates = { CNY: 1, USD: 0.14, EUR: 0.13 };
      const amount = 100;
      const result = app.convertCurrency(amount, 'CNY', 'USD');
      expect(result).toBe(14); // 100 * 0.14
    });

    it('updateExchangeRates 应正确更新汇率', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ rates: { USD: 0.14, EUR: 0.13 } }),
      });
      await app.updateExchangeRates();
      expect(app.currencyRates.USD).toBe(0.14);
      expect(app.currencyRates.EUR).toBe(0.13);
    });
  });
}); 