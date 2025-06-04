import axios from 'axios';
import React, { useState } from 'react';

function ShortenerForm() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');


  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    setShortUrl('');

    if (!longUrl.trim()) {
      setError('请输入有效的 URL。');
      setIsLoading(false);
      return;
    }

    try {
        const requestData = {
      original_url: longUrl, 

};
      const response = await axios.post("http://localhost:8080/api/create", requestData)
      
      if (!response.data.success) {
        const errorData = await response.json();
        throw new Error(errorData.message || `请求失败，状态码：${response.status}`);
      }

      const data = await response.data;
      // 假设后端返回的数据中包含 shortCode 字段
      // 你需要根据你的 API 响应格式调整这里
      // 例如： { success: true, shortCode: "abcdef" }
      if (data.short_code) {
        // 构建完整的短链接用于显示和跳转
        const fullShortUrl = `${window.location.origin}/api/jump?shortcode=${data.short_code}`;
        setShortUrl(fullShortUrl);
      } else {
        throw new Error('后端未返回有效的 shortCode。');
      }

    } catch (err) {
      setError(err.message || '生成短链接时发生错误。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center' }}>
      <h2>短链接生成器 🔗</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="url"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="请输入您的长链接 (例如: https://www.example.com)"
            required
            style={{ width: 'calc(100% - 22px)', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: '10px 20px',
            backgroundColor: isLoading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {isLoading ? '生成中...' : '生成短链接'}
        </button>
      </form>

      {error && (
        <p style={{ color: 'red', marginTop: '15px' }}>错误：{error}</p>
      )}

      {shortUrl && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
          <p>🎉 生成成功！您的短链接是：</p>
          <a href={shortUrl} target="_blank" rel="noopener noreferrer" style={{ wordBreak: 'break-all' }}>
            {shortUrl}
          </a>
          <p style={{ marginTop: '10px' }}>
            <button
              onClick={() => navigator.clipboard.writeText(shortUrl)}
              style={{ padding: '8px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              复制链接
            </button>
          </p>
        </div>
      )}
    </div>
  );
}

export default ShortenerForm;