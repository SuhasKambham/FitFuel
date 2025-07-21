import './style.css';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
    <div class="text-center text-white">
      <h1 class="text-4xl font-bold mb-4 animate-bounce">Welcome to FitFuel</h1>
      <p class="text-lg mb-8">Your animated, modern fitness tracker app is coming soon!</p>
      <div class="animate-pulse">
        <span class="inline-block w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></span>
      </div>
    </div>
  </div>
`;
