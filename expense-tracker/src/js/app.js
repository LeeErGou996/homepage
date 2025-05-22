// 创建Vue应用
const { createApp, ref, computed, onMounted, watch } = Vue;

const app = createApp({
    setup() {
        // 状态管理
        const currentView = ref('record');
        const transactions = ref([]);
        const categories = ref([
            '餐饮', '交通', '购物', '娱乐', '居住', '医疗', '教育', '其他',
            '工资', '奖金', '投资', '兼职'
        ]);
        const newCategory = ref('');
        const filters = ref({
            startDate: '',
            endDate: '',
            category: ''
        });

        // 新交易表单数据
        const newTransaction = ref({
            type: 'expense',
            amount: '',
            category: '',
            date: new Date().toISOString().split('T')[0],
            note: ''
        });

        // 添加新的状态变量
        const budgets = ref({});
        const currencies = ref([
            { code: 'CNY', symbol: '¥', rate: 1 },
            { code: 'USD', symbol: '$', rate: 0.14 },
            { code: 'EUR', symbol: '€', rate: 0.13 },
            { code: 'JPY', symbol: '¥', rate: 21.5 },
            { code: 'GBP', symbol: '£', rate: 0.11 }
        ]);
        const defaultCurrency = ref('CNY');
        const lastExchangeUpdate = ref('');

        // 从localStorage加载数据
        const loadData = () => {
            const savedTransactions = localStorage.getItem('transactions');
            const savedCategories = localStorage.getItem('categories');
            const savedBudgets = localStorage.getItem('budgets');
            const savedCurrencies = localStorage.getItem('currencies');
            const savedDefaultCurrency = localStorage.getItem('defaultCurrency');
            const savedLastExchangeUpdate = localStorage.getItem('lastExchangeUpdate');
            
            if (savedTransactions) {
                transactions.value = JSON.parse(savedTransactions);
            }
            if (savedCategories) {
                categories.value = JSON.parse(savedCategories);
            }
            if (savedBudgets) {
                budgets.value = JSON.parse(savedBudgets);
            }
            if (savedCurrencies) {
                currencies.value = JSON.parse(savedCurrencies);
            }
            if (savedDefaultCurrency) {
                defaultCurrency.value = savedDefaultCurrency;
            }
            if (savedLastExchangeUpdate) {
                lastExchangeUpdate.value = savedLastExchangeUpdate;
            }
        };

        // 保存数据到localStorage
        const saveData = () => {
            localStorage.setItem('transactions', JSON.stringify(transactions.value));
            localStorage.setItem('categories', JSON.stringify(categories.value));
            localStorage.setItem('budgets', JSON.stringify(budgets.value));
            localStorage.setItem('currencies', JSON.stringify(currencies.value));
            localStorage.setItem('defaultCurrency', defaultCurrency.value);
            localStorage.setItem('lastExchangeUpdate', lastExchangeUpdate.value);
        };

        // 添加新交易
        const addTransaction = () => {
            const transaction = {
                id: Date.now(),
                ...newTransaction.value,
                amount: parseFloat(newTransaction.value.amount)
            };
            
            transactions.value.push(transaction);
            saveData();
            
            // 重置表单
            newTransaction.value = {
                type: 'expense',
                amount: '',
                category: '',
                date: new Date().toISOString().split('T')[0],
                note: ''
            };

            // 更新预算统计
            if (transaction.type === 'expense' && budgets.value[transaction.category]) {
                const budget = budgets.value[transaction.category];
                const convertedAmount = convertCurrency(
                    transaction.amount,
                    transaction.currency || defaultCurrency.value,
                    budget.currency
                );
                budget.spent = (budget.spent || 0) + convertedAmount;
            }
        };

        // 编辑交易
        const editTransaction = (transaction) => {
            const index = transactions.value.findIndex(t => t.id === transaction.id);
            if (index !== -1) {
                transactions.value[index] = { ...transaction };
                saveData();
            }
        };

        // 删除交易
        const deleteTransaction = (id) => {
            const transaction = transactions.value.find(t => t.id === id);
            if (transaction && transaction.type === 'expense' && budgets.value[transaction.category]) {
                const budget = budgets.value[transaction.category];
                const convertedAmount = convertCurrency(
                    transaction.amount,
                    transaction.currency || defaultCurrency.value,
                    budget.currency
                );
                budget.spent = Math.max(0, (budget.spent || 0) - convertedAmount);
            }
            transactions.value = transactions.value.filter(t => t.id !== id);
            saveData();
        };

        // 添加新类别
        const addCategory = () => {
            if (newCategory.value && !categories.value.includes(newCategory.value)) {
                categories.value.push(newCategory.value);
                saveData();
                newCategory.value = '';
            }
        };

        // 删除类别
        const deleteCategory = (category) => {
            if (confirm(`确定要删除类别"${category}"吗？这将同时删除所有使用该类别的记录。`)) {
                categories.value = categories.value.filter(c => c !== category);
                transactions.value = transactions.value.filter(t => t.category !== category);
                saveData();
            }
        };

        // 导出数据
        const exportData = () => {
            const data = {
                transactions: transactions.value,
                categories: categories.value
            };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `expense-tracker-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        };

        // 导入数据
        const importData = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        if (data.transactions && data.categories) {
                            if (confirm('导入将覆盖当前所有数据，确定要继续吗？')) {
                                transactions.value = data.transactions;
                                categories.value = data.categories;
                                saveData();
                            }
                        }
                    } catch (error) {
                        alert('导入失败：无效的数据格式');
                    }
                };
                reader.readAsText(file);
            }
        };

        // 过滤交易记录
        const filteredTransactions = computed(() => {
            return transactions.value.filter(transaction => {
                const date = new Date(transaction.date);
                const startDate = filters.value.startDate ? new Date(filters.value.startDate) : null;
                const endDate = filters.value.endDate ? new Date(filters.value.endDate) : null;
                
                const matchesDate = (!startDate || date >= startDate) && 
                                  (!endDate || date <= endDate);
                const matchesCategory = !filters.value.category || 
                                      transaction.category === filters.value.category;
                
                return matchesDate && matchesCategory;
            });
        });

        // 初始化图表
        const initCharts = () => {
            // 月度收支趋势图
            const monthlyData = {};
            transactions.value.forEach(transaction => {
                const month = transaction.date.substring(0, 7);
                if (!monthlyData[month]) {
                    monthlyData[month] = { income: 0, expense: 0 };
                }
                if (transaction.type === 'income') {
                    monthlyData[month].income += transaction.amount;
                } else {
                    monthlyData[month].expense += transaction.amount;
                }
            });

            const months = Object.keys(monthlyData).sort();
            const incomeData = months.map(month => monthlyData[month].income);
            const expenseData = months.map(month => monthlyData[month].expense);

            new Chart(document.getElementById('monthlyChart'), {
                type: 'line',
                data: {
                    labels: months,
                    datasets: [
                        {
                            label: '收入',
                            data: incomeData,
                            borderColor: '#4CAF50',
                            fill: false
                        },
                        {
                            label: '支出',
                            data: expenseData,
                            borderColor: '#f44336',
                            fill: false
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: '月度收支趋势'
                        }
                    }
                }
            });

            // 支出分类占比图
            const categoryData = {};
            transactions.value
                .filter(t => t.type === 'expense')
                .forEach(transaction => {
                    categoryData[transaction.category] = 
                        (categoryData[transaction.category] || 0) + transaction.amount;
                });

            new Chart(document.getElementById('categoryChart'), {
                type: 'pie',
                data: {
                    labels: Object.keys(categoryData),
                    datasets: [{
                        data: Object.values(categoryData),
                        backgroundColor: [
                            '#4CAF50', '#2196F3', '#FFC107', '#9C27B0',
                            '#FF5722', '#795548', '#607D8B', '#E91E63'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: '支出分类占比'
                        }
                    }
                }
            });
        };

        // 监听视图变化，更新图表
        watch(currentView, (newView) => {
            if (newView === 'statistics') {
                setTimeout(initCharts, 0);
            }
        });

        // 添加预算管理相关函数
        const saveBudget = (category) => {
            if (!budgets.value[category]) {
                budgets.value[category] = {
                    amount: 0,
                    spent: 0,
                    currency: defaultCurrency.value
                };
            }
            saveData();
        };

        // 添加货币转换函数
        const convertCurrency = (amount, fromCurrency, toCurrency) => {
            const fromRate = currencies.value.find(c => c.code === fromCurrency)?.rate || 1;
            const toRate = currencies.value.find(c => c.code === toCurrency)?.rate || 1;
            return (amount * toRate) / fromRate;
        };

        // 添加汇率更新函数
        const updateExchangeRates = async () => {
            try {
                // 这里使用免费的汇率API，实际使用时需要替换为有效的API
                const response = await axios.get('https://api.exchangerate-api.com/v4/latest/CNY');
                const rates = response.data.rates;
                
                currencies.value = currencies.value.map(currency => ({
                    ...currency,
                    rate: rates[currency.code] || currency.rate
                }));
                
                lastExchangeUpdate.value = new Date().toLocaleString();
                saveData();
            } catch (error) {
                console.error('Failed to update exchange rates:', error);
                alert('更新汇率失败，请稍后重试');
            }
        };

        // 组件挂载时加载数据
        onMounted(() => {
            loadData();
        });

        return {
            currentView,
            transactions,
            categories,
            newCategory,
            filters,
            newTransaction,
            filteredTransactions,
            addTransaction,
            editTransaction,
            deleteTransaction,
            addCategory,
            deleteCategory,
            exportData,
            importData,
            budgets,
            currencies,
            defaultCurrency,
            lastExchangeUpdate,
            saveBudget,
            updateExchangeRates
        };
    }
});

// 挂载应用
app.mount('#app');

// 将app对象导出以支持测试
export const app = {
  transactions: [],
  budgets: {},
  currency: 'CNY',
  currencyRates: {
    CNY: 1,
    USD: 0.14,
    EUR: 0.13,
    JPY: 20.0,
    GBP: 0.11,
  },
  loadData,
  saveData,
  addTransaction,
  deleteTransaction,
  saveBudget,
  getBudgetStats,
  convertCurrency,
  updateExchangeRates,
};

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
  app.loadData();
  app.updateExchangeRates();
  // ... 其他初始化代码 ...
}); 