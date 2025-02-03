const Newsletter = () => (
    <div className="bg-blue-600 text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">订阅我们的新闻通讯</h2>
        <p className="mb-8">获取最新的旅游优惠和新加坡旅游资讯</p>
        <form className="max-w-md mx-auto">
          <div className="flex">
            <input
              type="email"
              placeholder="输入您的邮箱地址"
              className="flex-grow px-4 py-2 rounded-l-full focus:outline-none text-gray-900"
            />
            <button
              type="submit"
              className="bg-yellow-500 text-blue-900 px-6 py-2 rounded-r-full font-semibold hover:bg-yellow-400 transition duration-300"
            >
              订阅
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  
  export default Newsletter;
  