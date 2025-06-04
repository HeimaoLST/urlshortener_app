import React, { useState, useEffect } from 'react';
// 在实际项目中，你需要使用路由库 (如 react-router-dom) 来获取 URL 参数
// 例如: import { useLocation } from 'react-router-dom';

function WaitingPage() {
  const [countdown, setCountdown] = useState(3); // 3 秒倒计时
  const [targetUrl, setTargetUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // 模拟从 URL 获取 shortcode
  // 在实际项目中，你需要使用 React Router 的 useLocation 和 URLSearchParams
  // const location = useLocation();
  // const queryParams = new URLSearchParams(location.search);
  // const shortcode = queryParams.get('shortcode');

  // 为了演示，我们硬编码一个 shortcode，或者你可以通过 props 传递
  const getShortcodeFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('shortcode');
  };

  useEffect(() => {
    const shortcode = getShortcodeFromUrl();

    if (!shortcode) {
      setError('无效的短链接代码。');
      setIsLoading(false);
      return;
    }

    // 模拟 API 调用以根据 shortcode 获取原始 URL
    const fetchOriginalUrl = async () => {
      try {
        // 假设你的后端 API 端点是 /api/resolve?shortcode=xxx
        // 这个API应该返回包含原始URL的JSON，例如 { originalUrl: "..." }
        // 注意：浏览器通常会直接处理 /api/jump?shortcode=xxx 的重定向，
        // 如果你希望前端处理并显示等待页面，后端 /api/jump 应该返回原始URL的JSON数据，
        // 而不是直接30x重定向。或者，你有一个专门的API端点如 /api/resolve-shortcode
        // 来获取原始URL。

        // 暂时模拟一个API调用
        console.log(`正在为 shortcode "${shortcode}" 解析目标 URL...`);
        // 假设后端 /api/jump 返回的是 JSON 数据，包含了要跳转的 URL
        // 而不是直接进行302重定向。如果后端直接重定向，这个前端等待页面将不会被渲染。
        // 因此，你需要一个API端点，比如 /api/get-target-url?shortcode=xxx
        // 它返回 { "targetUrl": "https://original-url.com" }

        // **重要**: 这里的 fetch 是一个示例。
        // 实际中，如果 /api/jump?shortcode=xxx 是后端直接处理重定向的，
        // 那么这个 WaitingPage 组件可能永远不会被前端路由匹配到。
        // 你需要后端配合：
        // 1. /api/jump?shortcode=xxx 不直接302重定向，而是返回一个HTML页面，该页面加载下面的React组件。
        // 2. 或者，有一个单独的API接口，例如 /api/resolve-url?shortcode=xxx，前端通过它获取目标URL。

        // 示例: 假设有一个API `/api/getTargetUrl`
        const response = await fetch(`/api/getTargetUrl?shortcode=${shortcode}`);
        if (!response.ok) {
          throw new Error('无法解析短链接或链接已失效。');
        }
        const data = await response.json();
        if (data.originalUrl) {
          setTargetUrl(data.originalUrl);
        } else {
          throw new Error('未找到对应的原始链接。');
        }
      } catch (err) {
        setError(err.message || '获取目标链接失败。');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOriginalUrl();
  }, []); // 空依赖数组，仅在组件挂载时运行

  useEffect(() => {
    if (isLoading || error || !targetUrl) return; // 如果还在加载、有错误或没有目标URL，则不开始倒计时

    if (countdown <= 0) {
      // 执行重定向
      window.location.href = targetUrl;
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer); // 清除定时器以防止内存泄漏
  }, [countdown, isLoading, error, targetUrl]);

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '20px' }}>
        <p>🚀 正在准备跳转，请稍候...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '20px', color: 'red' }}>
        <p>错误：{error}</p>
        <p>无法完成跳转。</p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center'
    }}>
      <h1>即将跳转...</h1>
      <p style={{ fontSize: '18px', margin: '20px 0' }}>
        您将在 <strong style={{ fontSize: '24px', color: '#007bff' }}>{countdown}</strong> 秒后被重定向到目标页面。
      </p>
      <div style={{ margin: '20px 0', padding: '15px', border: '1px solid #eee', borderRadius: '5px', backgroundColor: '#f9f9f9', minWidth: '300px', maxWidth: '80%' }}>
        {/* 这里可以是你想要展示的广告内容 */}
        <p style={{ fontWeight: 'bold' }}>广告位</p>
        <p>感谢您的耐心等待！</p>
        {/* <img src="your-ad-image.jpg" alt="Advertisement" style={{ maxWidth: '100%', marginTop: '10px' }} /> */}
      </div>
      <p style={{ fontSize: '14px', color: '#777' }}>
        如果页面没有自动跳转，请 <a href={targetUrl}>点击这里</a>。
      </p>
    </div>
  );
}

export default WaitingPage;