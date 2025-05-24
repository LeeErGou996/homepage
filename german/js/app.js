// 应用初始化
async function initApp() {
    try {
        UIManager.showLoading();
        const success = await WordManager.loadWords();
        if (success) {
            EventHandler.init();
            console.log('应用初始化完成');
        } else {
            console.error('应用初始化失败');
        }
    } catch (error) {
        console.error('应用初始化错误:', error);
    } finally {
        UIManager.hideLoading();
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', initApp); 